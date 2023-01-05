FROM node:19.3-alpine

WORKDIR /app

COPY ./reactjs .

RUN npm install

# Expose the port mentioned in the vite.config file
#EXPOSE 5173

CMD ["npm", "run", "dev"]
