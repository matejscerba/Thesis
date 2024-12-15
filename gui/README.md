# GUI

## Development

The GUI is a [React](https://react.dev) app written in [TypeScript](https://www.typescriptlang.org), it is documented
using [JSDoc](https://jsdoc.app) format.

Dependencies and local serving is managed by [npm](https://www.npmjs.com), which you need to have installed.

Run

```shell
npm install
```

to install the dependencies.

To run the application locally, you can run

```shell
npm start
```

The code is statically checked using [Eslint and Prettier with support for TypeScript](https://typescript-eslint.io),
both of these tools can be run locally with the following commands:

```shell
npm run eslint
npm run prettier:check
```

## Configuration

There is only a `PORT` environment variable that can be edited and affects the location of the GUI on your local
machine.

The url of the server is hardcoded in the source code (file `src/utils/api.ts`, line 6 - variable `SERVER_URL`).
If you want to run the server and gui on separate urls, you need to modify this variable accordingly and build the
Docker image afterwards.

## Deployment

Building the image to be deployed uses different version of Dockerfile than the default `gui/Dockerfile` and
`server/Dockerfile`. There is a second version of both of those files with filename `deploy.Dockerfile`, which should be
used when building Docker images to be deployed. The GUI image to be deployed uses [nginx engine](https://nginx.org) to
serve the application, and both of the images to be deployed are prepared to be built for `linux/amd64` architecture.
After these images are built, tagged and pushed to Docker repository, they can be deployed on cloud.
