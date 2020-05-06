FROM node:12.16.3-alpine3.9 as builder

WORKDIR '/app'

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm run build
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ user/share/nginx/html