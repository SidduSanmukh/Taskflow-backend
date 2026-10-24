FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY /src ./src
RUN npm run build
ENV NODE_ENV=production
EXPOSE 1826
CMD ["npm","start"]



# FROM node:22-alpine       -	Starts from a Node.js 22 image based on Alpine Linux.
# WORKDIR /app              -	Sets /app as the working directory inside the image.
# COPY package*.json ./ 	-   Copies the package manifest and lockfile into /app.
# RUN npm ci                -	Installs the exact dependency versions recorded in the lockfile.
# COPY tsconfig.json ./     -	Copies TypeScript compiler configuration.
# COPY src ./src            -	Copies your TypeScript source code.
# RUN npm run build         -   Compiles TypeScript into JavaScript in dist/.
# ENV NODE_ENV=production   -   Sets the environment variable inside the container.
# EXPOSE 5000               -	Documents the port the application is expected to listen on.
# CMD ["npm", "start"]      -   Specifies the default command used to start the application.