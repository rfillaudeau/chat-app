FROM node:19.3-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
