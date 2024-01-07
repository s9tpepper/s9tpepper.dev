FROM node:20.9.0

RUN mkdir /app
WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y build-essential python3.6 openssl

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm start"]
