FROM node:18-alpine
WORKDIR /app
# Install required build tools and dependencies
RUN apk update && apk add --no-cache \
    g++ \
    openjdk11-jdk \
    python3 \
    python3-dev
    
COPY package.json . 
RUN npm i
COPY . .
# first dot is local and second is our work directory
EXPOSE 8080
CMD ["node", "index.js"]
