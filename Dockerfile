# syntax=docker/dockerfile:1

FROM node:18.17.0-alpine3.17
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm i
COPY . /app/
RUN npx zenstack generate
CMD ["npm", "run", "dev"]
EXPOSE 3000