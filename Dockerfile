# 1. Use the official Node.js image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your application code
COPY . .

# 5. Expose the port the app runs on
EXPOSE 8000

# 6. Start the application
CMD ["npm", "start"]
