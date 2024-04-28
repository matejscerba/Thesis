FROM node:22 as gui

WORKDIR /gui/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY README.md .
COPY ./public ./public
COPY ./src ./src

ENV NODE_ENV production

RUN npm install -g npm@10.6.0 serve
RUN npm install
RUN npm run build

CMD ["serve", "-s", "build"]