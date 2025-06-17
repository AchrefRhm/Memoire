# Frontend Dockerfile (Next.js)
FROM node:18.17.0

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files into the container
COPY . .

# Expose the port the frontend will run on (usually 4000 for Next.js)
EXPOSE 3000

# Run the frontend server (Next.js)
CMD ["npx", "next", "dev"]
