import express from 'express';
import axios from 'axios';

const router = express.Router();

// M-Pesa STK Push simulation (replace with real Daraja API in production)
router.post('/mpesa/stkpush', async (req, res) => {
  try {
    const { phone, amount, accountReference } = req.body;

    // In production, this would call Safaricom Daraja API
    // For now, simulate successful payment
    console.log(`M-Pesa STK Push: ${amount} TZS to ${phone}`);

    res.json({
      success: true,
      checkoutRequestId: `ws_${Date.now()}`,
      responseCode: '0',
      responseDescription: 'Success. Request accepted for processing',
      customerMessage: 'Enter your M-Pesa PIN to complete'
    });
  } catch (error) {
    console.error('M-Pesa error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Check payment status
router.get('/mpesa/status/:checkoutRequestId', async (req, res) => {
  // In production, query Daraja API for status
  res.json({
    status: 'success',
    resultCode: '0',
    resultDesc: 'The service request is processed successfully.'
  });
});

// Premium plans
router.get('/plans', (req, res) => {
  res.json({
    plans: [
      { id: 'weekly', name: 'Weekly', price: 5000, period: 'week', popular: false },
      { id: 'monthly', name: 'Monthly', price: 15000, period: 'month', popular: true },
      { id: 'yearly', name: 'Yearly', price: 120000, period: 'year', popular: false, savings: '33% off' }
    ]
  });
});

export default router;
