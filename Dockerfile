FROM node:18.17.0 AS frontend

WORKDIR /var/tmp

ADD package.json .
ADD package-lock.json .

RUN npm install


# RUN ngx ngcc --properties es2015 browser module main --first-only --create-ivy-entry-points

ADD . .

RUN npm run build -- -c production

FROM nginx:stable

COPY --from=frontend /var/tmp/dist/repair-app-new /usr/share/nginx/html

EXPOSE 80