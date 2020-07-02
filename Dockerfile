FROM node:10.15.1
WORKDIR cloud_functions/function
COPY package*.json ./
RUN npm install
COPY . .