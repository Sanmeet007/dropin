FROM node

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 80

CMD ["npm" , "run" , "start"]