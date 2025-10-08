# Production stage - ultra minimal
FROM node:18-alpine AS production

# Install build dependencies and dumb-init
RUN apk add --no-cache \
    dumb-init \
    python3 \
    make \
    g++ \
    && ln -sf python3 /usr/bin/python

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies (bcrypt needs compilation)
RUN npm install --only=production --no-audit --no-fund && \
    npm cache clean --force && \
    rm -rf /tmp/* && \
    apk del python3 make g++

# Copy application code and set ownership
COPY --chown=nextjs:nodejs src/ ./src/

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "src/server.js"]
