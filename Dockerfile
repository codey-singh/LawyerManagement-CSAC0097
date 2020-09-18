FROM node:alpine3.10


EXPOSE 3000

RUN apk add --update tini


RUN mkdir -p /usr/src/app


WORKDIR /usr/src/app

COPY package.json package.json

RUN npx yarn

COPY . .

CMD ["tini", "--", "node", "./bin/www"]

