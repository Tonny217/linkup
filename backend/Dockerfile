FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY src/ ./src/
RUN mkdir -p /pb/pb_data
EXPOSE 3002
CMD ["node", "src/server.js"]
