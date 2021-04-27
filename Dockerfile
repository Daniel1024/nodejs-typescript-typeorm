FROM node:14

# Create app directory, this is in our container/in our image
WORKDIR /src/app

# Bundle app source
COPY . .

RUN npm install && npm run tsc

EXPOSE 3000

CMD [ "node", "dist/index" ]
