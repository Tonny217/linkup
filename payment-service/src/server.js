const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const PASSKEY = process.env.MPESA_PASSKEY;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;
const ENV = process.env.MPESA_ENV || 'sandbox';

const BASE_URL = ENV === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke';

// Store pending transactions
const pendingTransactions = new Map();

// Get OAuth token
async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const response = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  return response.data.access_token;
}

// STK Push endpoint
app.post('/api/payments/stk-push', async (req, res) => {
  try {
    const { phone, amount, accountReference, transactionDesc } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: 'Phone and amount required' });
    }

    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    const formattedPhone = phone.startsWith('255') ? phone : `255${phone.replace(/^0/, '')}`;

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: accountReference || 'LinkUp Premium',
      TransactionDesc: transactionDesc || 'LinkUp Subscription'
    };

    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Store pending transaction
    pendingTransactions.set(response.data.CheckoutRequestID, {
      phone,
      amount,
      status: 'pending',
      createdAt: new Date()
    });

    res.json({
      success: true,
      checkoutRequestId: response.data.CheckoutRequestID,
      responseCode: response.data.ResponseCode,
      message: response.data.CustomerMessage || 'STK Push sent successfully'
    });
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.errorMessage || 'Payment initiation failed'
    });
  }
});

// M-Pesa callback
app.post('/api/payments/callback', (req, res) => {
  const { Body } = req.body;

  if (Body.stkCallback) {
    const { CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;
    const transaction = pendingTransactions.get(CheckoutRequestID);

    if (transaction) {
      transaction.status = ResultCode === 0 ? 'completed' : 'failed';
      transaction.resultDesc = ResultDesc;
      transaction.completedAt = new Date();

      // TODO: Update user premium status in PocketBase
      console.log('Payment completed:', transaction);
    }
  }

  res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

// Check transaction status
app.get('/api/payments/status/:checkoutRequestId', async (req, res) => {
  const { checkoutRequestId } = req.params;
  const transaction = pendingTransactions.get(checkoutRequestId);

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json(transaction);
});

// Query transaction status from M-Pesa
app.post('/api/payments/query', async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;
    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'linkup-payments', env: ENV });
});

app.listen(PORT, () => {
  console.log(`LinkUp Payment Service running on port ${PORT}`);
  console.log(`Environment: ${ENV}`);
});
