# Use Node.js LTS version
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Force a clean install of dependencies inside the container
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Expose Vite development port
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# pull repository // docker pull isherezahin/isherezahin_me:235
# run cmd // docker run -p 5173:5173 --name isherezahin_container --rm -v "$(Get-Location):/app" -v "/app/node_modules" isherezahin/isherezahin_me:235
