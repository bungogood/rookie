FROM node:lts-alpine AS development
 
WORKDIR /usr/src/app
 
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
 
RUN npm ci
 
COPY . .
 
EXPOSE 80

CMD ["npm", "start"]
