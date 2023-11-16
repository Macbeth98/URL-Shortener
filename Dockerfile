FROM node:18-alpine


# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

RUN npm install

# Copy the remaining files to the container
COPY . .


ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start"]