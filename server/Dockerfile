FROM node:18.18.2

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

CMD ["npm", "run", "dev"]

EXPOSE 5000
