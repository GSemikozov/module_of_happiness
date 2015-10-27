FROM node:4.1.2
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "zip", "-y"]
ADD package.json /app/package.json
WORKDIR /app
RUN ["npm", "install"]
ADD bower.json /app/bower.json
RUN ["./node_modules/.bin/bower", "--allow-root", "install"]
ADD . /app
RUN ["./node_modules/.bin/gulp", "demo"]
WORKDIR /app/demo
CMD ["../node_modules/.bin/http-server"]