FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies first for better layer caching.
COPY app/package*.json ./
RUN npm ci

# Copy application source.
COPY app/ ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
