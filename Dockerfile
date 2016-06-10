FROM node:latest

RUN ls

ADD . /app

WORKDIR /app

RUN ls
RUN npm install

EXPOSE 3000

CMD node app.js
