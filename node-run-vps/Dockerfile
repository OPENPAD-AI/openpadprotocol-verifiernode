# Base image for building the application
FROM node:21.7.2-alpine as builder

# Set working directory
WORKDIR /app

# Copy only package files for dependency installation
COPY package*.json ./

# Install all dependencies (for build)
RUN npm install --legacy-peer-deps

# Copy source files and configuration needed for the build
COPY tsconfig.json ./
COPY src ./src

# Build the application (output goes to `dist/`)
RUN npm run build

# Production stage with a smaller base image
FROM node:21.7.2-alpine as production

# Set working directory
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy the compiled application and configuration files from the builder stage
COPY --from=builder /app/dist ./dist
COPY src/config ./src/config  

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "dist/main.js"]
