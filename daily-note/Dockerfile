# Step 1: Build the React app
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --force

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Step 2: Serve the app using a simple HTTP server
FROM nginx:alpine

# Install npm and Node.js (needed to run tests)
RUN apk add --no-cache nodejs npm

# Copy custom nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy the build folder from the build image
COPY --from=build /app/build /usr/share/nginx/html

# Expose port for the app
EXPOSE 80

# Start NGINX to serve the React app
CMD ["nginx", "-g", "daemon off;"]
