FROM nginx:latest
COPY html /etc/nginx/html
COPY conf /etc/nginx/
WORKDIR /etc/nginx/html
