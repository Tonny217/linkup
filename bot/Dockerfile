FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY bot.js ./
EXPOSE 3000
CMD ["node", "bot.js"]
