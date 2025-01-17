FROM node:20 AS build 
WORKDIR /app
COPY . /app
RUN npm install -g @angular/cli
RUN npm install --force
RUN ng build 

FROM nginx:alpine 
COPY --from=build /app/dist/front-end /usr/share/nginx/html
EXPOSE 80
