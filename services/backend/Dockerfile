FROM node:16-alpine

RUN npm install lerna --global

WORKDIR /app

COPY . .

RUN npm run bootstrap
RUN lerna run --scope @images.hasanjoldic.com/backend build

CMD ["lerna", "run", "--scope", "@images.hasanjoldic.com/backend", "build"]