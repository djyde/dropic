FROM node:18-alpine

WORKDIR /app

COPY . /app

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.5/pocketbase_0.20.5_linux_amd64.zip \
  && unzip pocketbase_0.20.5_linux_amd64.zip \
  && rm pocketbase_0.20.5_linux_amd64.zip

RUN npm install
RUN npm run build

VOLUME /pb_data
EXPOSE 8090

ENTRYPOINT ["/app/pocketbase", "serve"]