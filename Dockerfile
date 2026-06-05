# Multi-stage build for production
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY package*.json ./

# Install dependencies
RUN cd backend && npm ci --only=production && cd ..
RUN npm ci --only=production

# Copy source code
COPY backend/src ./backend/src
COPY backend/package.json ./backend/
COPY src ./src
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY package.json ./

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install security updates
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy backend dependencies and source
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/src ./backend/src
COPY --from=builder /app/backend/package.json ./backend/

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Expose port (Railway provides PORT env var)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start command
CMD ["node", "backend/src/server.js"]
