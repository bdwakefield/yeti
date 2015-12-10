FROM node:5.2.0
RUN mkdir /usr/src/app
COPY package.json /usr/src/app/package.json
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
RUN apt-get install -y mongodb-org
EXPOSE 3000
CMD ["node", "/usr/src/app/app.js"]