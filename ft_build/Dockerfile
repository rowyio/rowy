
# Use the official lightweight Node.js image.
# https://hub.docker.com/_/node
FROM node:14-slim

# Create and change to the app directory.
WORKDIR /workdir

# Copy local code to the container image.
# If you've done yarn install locally, node_modules will be copied to 
# docker work directory to save time to perform the same actions again.
COPY . ./

# Install production missing dependencies from above copy command.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
RUN yarn

# Run the web service on container startup.
CMD [ "yarn", "start" ]