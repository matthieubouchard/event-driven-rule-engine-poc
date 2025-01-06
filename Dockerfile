FROM node:20-alpine3.20

# Install required dependencies (including build tools)
RUN apk add --no-cache \
  openssl \
  openssl-dev \
  libc6-compat \
  ca-certificates \
  gcc \
  make

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

EXPOSE 3000