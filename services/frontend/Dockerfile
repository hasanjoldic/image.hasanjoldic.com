FROM node:16 AS builder

RUN npm install lerna --global

WORKDIR /app

COPY . .

RUN npm run bootstrap
RUN lerna run --scope @images.hasanjoldic.com/frontend build

FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=builder /app/services/frontend/dist/ ./

CMD ["nginx", "-g", "daemon off;"]