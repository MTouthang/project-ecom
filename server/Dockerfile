FROM node:lts-alpine 
LABEL maintainer="huebart16@gmail.com" 

WORKDIR /app 

COPY package*.json .

RUN npm install 

COPY . . 

RUN npm run build 

EXPOSE 5000

CMD ["node", "dist/server.js"]

