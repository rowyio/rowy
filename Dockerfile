FROM node:10.15.1
WORKDIR cloud_functions/functions
COPY package.json ./
RUN npm install
COPY . .