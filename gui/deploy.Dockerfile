FROM --platform=linux/arm64 node:22 as build
# Platform used because of slow `npm run build` on arm mac chip, change platform if neccessary

WORKDIR /gui/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY README.md .
COPY ./public ./public
COPY ./src ./src

ENV NODE_ENV production

ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL

RUN npm install
RUN npm run build

FROM --platform=linux/amd64 nginx:alpine
COPY --from=build /gui/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]