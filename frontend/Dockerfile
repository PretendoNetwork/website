FROM node:18-alpine
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci

# build source
COPY . ./
RUN npm run build

# configure ports
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8080
EXPOSE 8080 

# start server
CMD ["npm", "run", "start"]
