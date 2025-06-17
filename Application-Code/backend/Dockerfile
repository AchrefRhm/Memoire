# Backend Dockerfile
FROM node:16

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files into the container
COPY . .

# Expose the port the backend will run on
EXPOSE 5000

# Run the backend server
CMD ["npm", "start"]
