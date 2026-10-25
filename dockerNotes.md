## One important production improvement(Why docker build is important)
Our first Dockerfile installs development dependencies and then compiles TypeScript in the same image. That is perfectly useful for learning, but a production image can be smaller and safer.

Later, we can use a multi-stage Docker build:
`
Build stage
  ├── TypeScript source
  ├── Development dependencies
  └── Compile into JavaScript
             |
             v
Production stage
  ├── Compiled JavaScript
  ├── Production dependencies
  └── Run the API
`

That way, the final image doesn't need the TypeScript compiler or development dependencies.

We'll improve the image when we cover production Docker practices.


## Protect your secrets with .dockerignore
You already have a .gitignore, but Docker needs its own ignore file.

Create .dockerignore in the project root:

`
node_modules
dist
.env
.git
.gitignore
Dockerfile
.dockerignore
npm-debug.log
coverage
`

#### Why is this important?
- node_modules: prevents your Windows-installed dependencies from being copied into the Linux image.
- dist: prevents old compiled output from being copied into the image.
- .env: keeps your local environment file and secrets out of the image build context.
- .git: avoids sending your Git history into the build context.

The Dockerfile installs dependencies and compiles the source inside the image, so it doesn't need your host's node_modules or dist.

`Security note: .dockerignore prevents these files from being sent as part of the build context. It does not protect secrets that you explicitly pass into a Docker build or bake into an image through other instructions.`


Copy everything below and paste it directly into your `README.md` file.

Copy and paste this directly into your `README.md` file.

Copy everything below and paste it directly into your `README.md` file.


# Lesson 19 — Docker Fundamentals 🐳

## 1. What Is Docker?

Docker helps package an application and its required runtime environment into a consistent, portable format.

It reduces environment-related problems such as different Node.js versions or missing dependencies.

**Without Docker:**

```text
Computer → Node.js + Express → MongoDB
```

**With Docker:**

```text
Docker Container → Node.js + Express → MongoDB
```

## 2. Five Important Docker Concepts

1. **Docker Image:** A template used to create containers.
2. **Container:** An isolated environment in which an application runs.
3. **Docker Engine:** The software responsible for building and running containers.
4. **Port Mapping:** Connects a host port to a container port.
5. **Dockerfile:** A text file containing instructions to build a Docker image.

## 3. Install and Verify Docker

Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) and start it.

Run these commands in PowerShell.

### Step 1: Check Docker Version

```powershell
docker --version
```

### Step 2: Check Docker Engine

```powershell
docker info
```

This displays information about the Docker client, server, containers, and images.

### Step 3: Run Your First Container

```powershell
docker run hello-world
```

Docker downloads the image if necessary, creates a container, and displays a confirmation message.

## 4. Understand Images and Containers

List downloaded images:

```powershell
docker images
```

List running containers:

```powershell
docker ps
```

List all containers, including stopped ones:

```powershell
docker ps -a
```

Another way to list all containers:

```powershell
docker container ls -a
```

**Remember:** An image is a template. A container is an instance created from that image.

## 5. Run a Real Server Inside Docker

Run the official Nginx web server:

```powershell
docker run --rm -p 8080:80 nginx
```

Keep this PowerShell window open.

Open another PowerShell window and run:

```powershell
curl.exe http://localhost:8080
```

You should receive HTML for the Nginx welcome page.

### Understanding the Command

| Part | Meaning |
|---|---|
| `docker run` | Creates and starts a container |
| `--rm` | Removes the container after it stops |
| `-p 8080:80` | Maps host port 8080 to container port 80 |
| `nginx` | Image used to run the web server |

**Important:** The host and container ports do not need to match.

- Host port: `8080`
- Container port: `80`

Stop the server with `Ctrl + C` in the first PowerShell window.

Because `--rm` was used, Docker removes the container after it stops.

## 6. How Docker Applies to TaskFlow

Our future setup will contain separate containers for application services.

```text
TaskFlow API Container
          |
          v
     Docker Network
       /       \
      v         v
  MongoDB      Redis
  Container   Container
```

Each service can run independently and communicate over a Docker network.

MongoDB will also need persistent storage, which we'll learn about in Lesson 21.

## 7. Lesson Checklist ✅

- [ ] Installed and started Docker Desktop.
- [ ] Verified `docker --version`.
- [ ] Verified `docker info`.
- [ ] Successfully ran `docker run hello-world`.
- [ ] Tested Nginx using `curl.exe http://localhost:8080`.

## Key Takeaway

**An image is a template, a container runs the image, and port mapping allows access to a container's services from your host machine.**

### Next Lesson — 20: Create a Dockerfile for TaskFlow 🐳

Learn how to build a Docker image for your TypeScript + Express backend and run your API inside a container.

# Lesson 20 — Create a Dockerfile for Your TaskFlow Backend 🐳

## 1. What Are We Building?

We will run the TaskFlow TypeScript + Express backend inside a Docker container instead of running it directly with `npm run dev`.

**Before Docker:** Windows → Node.js + Express → API

**After Docker:** Windows → Docker container → Node.js + Express → API

MongoDB will remain in its current environment for now.

## 2. What Is a Dockerfile?

A **Dockerfile** contains instructions Docker uses to build an image.

It defines:
- The base image and runtime.
- The application working directory.
- Dependency installation.
- TypeScript compilation.
- The command used to start the application.

## 3. Prepare the Project

Open PowerShell in your `taskflow-backend` directory.

Build the TypeScript project:

```powershell
npm run build
```

Make sure your `package.json` contains these scripts:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

Keep your existing dependencies and other configuration.

## 4. Create the Dockerfile

Create a file named `Dockerfile` in the project root, without a file extension.

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
```

### Understanding the Instructions

| Instruction | Purpose |
|---|---|
| `FROM` | Selects the Node.js base image. |
| `WORKDIR` | Sets the working directory. |
| `COPY` | Copies project files into the image. |
| `RUN npm ci` | Installs dependencies from the lockfile. |
| `RUN npm run build` | Compiles TypeScript into JavaScript. |
| `ENV` | Sets an environment variable. |
| `EXPOSE 5000` | Documents the application port. |
| `CMD` | Defines the default startup command. |

**Remember:** `EXPOSE` does not publish the port on your Windows machine. Use `-p` when running the container.

## 5. Create a `.dockerignore` File

Create `.dockerignore` in the project root:

```text
node_modules
dist
.env
.git
.gitignore
Dockerfile
.dockerignore
npm-debug.log
coverage
```

Why?

- Excludes local dependencies and old build output.
- Prevents `.env` from being included in the build context.
- Keeps unnecessary Git files out of the build context.

**Security note:** Never hardcode secrets into your Docker image.

## 6. Build the Docker Image

Make sure Docker Desktop is running.

```powershell
docker build -t taskflow-api:1.0 .
```

Explanation:

- `docker build` — Builds the image.
- `-t taskflow-api:1.0` — Assigns an image name and tag.
- `.` — Uses the current directory as the build context.

Verify the image:

```powershell
docker images
```

You should see `taskflow-api` with the tag `1.0`.

## 7. Run the Container

If MongoDB is running directly on Windows, use `host.docker.internal` to connect to it from the container.

```powershell
docker run --name taskflow-api-container -p 5000:5000 --env-file .env -e MONGODB_URI=mongodb://host.docker.internal:27017/taskflow taskflow-api:1.0
```

This command:

- Creates a container named `taskflow-api-container`.
- Maps Windows port `5000` to container port `5000`.
- Loads environment variables from `.env`.
- Overrides `MONGODB_URI` for the Windows-hosted MongoDB setup.
- Starts the API using `npm start`.

**Important:** Your `.env` file must contain the other required configuration variables. The MongoDB server must be running and accessible.

### Why Not `localhost`?

Inside a container, `127.0.0.1` refers to that container itself, not your Windows machine.

For Docker Desktop:

- MongoDB on Windows: `host.docker.internal`
- MongoDB in another container on the same user-defined network: use its container name.

## 8. Test the API

Open another PowerShell window:

```powershell
curl.exe http://localhost:5000/health
```

Expected response, assuming your health endpoint returns this JSON:

```json
{
  "status": "ok"
}
```

Inspect the running container:

```powershell
docker ps
```

View logs:

```powershell
docker logs taskflow-api-container
```

Stop the container:

```powershell
docker stop taskflow-api-container
```

Remove the stopped container:

```powershell
docker rm taskflow-api-container
```

**Remember:** Removing a container does not automatically remove its image.

## 9. Production Improvement

This learning Dockerfile installs development dependencies and compiles TypeScript in the same image.

A production-ready improvement is a **multi-stage Docker build**:

- **Build stage:** Installs dependencies and compiles TypeScript.
- **Production stage:** Contains compiled JavaScript and production dependencies.

This can reduce image size and keep development tools out of the final image.

## 10. Lesson Checklist ✅

- [ ] `npm run build` succeeds.
- [ ] Created the `Dockerfile`.
- [ ] Created `.dockerignore` and excluded `.env`.
- [ ] Built `taskflow-api:1.0`.
- [ ] Started the container and tested `/health`.

## Key Takeaway

**A Dockerfile defines how to build an image, and a container runs that image.**

### Next Lesson — 21: Docker Volumes 💾

Learn how to preserve MongoDB data when containers are removed and recreated.

# Lesson 21 — Docker Volumes: Persisting Database Data 💾

## 1. Why Do We Need Docker Volumes?

When a Docker container is deleted, its writable layer is removed, and data stored only there is lost.

**Solution:** Docker volumes store data separately from containers, allowing it to survive container removal.

## 2. Key Concepts

- **Image:** A template used to create containers.
- **Container:** A running instance of an image.
- **Volume:** Persistent storage managed by Docker.

## 3. Named Volumes vs Bind Mounts

| Feature | Named Volume | Bind Mount |
|---|---|---|
| Storage | Managed by Docker | Specific host path |
| Common use | Database data | Development files |
| Example | `taskflow-data:/data/db` | `./src:/app/src` |

## 4. Hands-on Practice

### Step 1: Create a Volume

```powershell
docker volume create taskflow-demo-data
```

### Step 2: List and Inspect Volumes

```powershell
docker volume ls
docker volume inspect taskflow-demo-data
```

### Step 3: Write Data into the Volume

```powershell
docker run --rm -it -v taskflow-demo-data:/data alpine sh
```

Inside the container:

```sh
echo "TaskFlow data survives container removal" > /data/message.txt
cat /data/message.txt
exit
```

### Step 4: Read Data from Another Container

Run the same command again:

```powershell
docker run --rm -it -v taskflow-demo-data:/data alpine sh
```

Inside the new container:

```sh
cat /data/message.txt
exit
```

**Expected output:**

```text
TaskFlow data survives container removal
```

**Result:** The first container was removed, but the data remained in the volume.

## 5. Using Volumes with MongoDB

MongoDB stores its database files in `/data/db` in the official container image.

Create a volume:

```powershell
docker volume create taskflow-mongo-data
```

Run MongoDB with the volume attached:

```powershell
docker run -d `
  --name taskflow-mongo `
  -v taskflow-mongo-data:/data/db `
  mongo:8.0
```

- `-d` — Runs the container in the background.
- `--name` — Assigns a name to the container.
- `-v` — Mounts the named volume.
- `/data/db` — MongoDB's data directory.

**Note:** This is a learning example, not a production-ready database setup. Consider authentication, networking, existing MongoDB instances, and port requirements before running it.

## 6. Important Things to Remember

- Volumes survive container removal unless they are deleted separately.
- Reusing the same volume allows a replacement container to access existing data.
- Removing a container does not automatically remove a named volume.
- **Volumes are not backups.** Important databases still need a backup and recovery plan.
- Keep API and database containers separate.

To delete the demo volume when finished:

```powershell
docker volume rm taskflow-demo-data
```

**Warning:** Deleting the volume removes its stored contents.

## 7. Lesson Checklist ✅

- [ ] Created `taskflow-demo-data`
- [ ] Inspected the volume
- [ ] Wrote `message.txt` into the volume
- [ ] Read the file from another container

## Key Takeaway

**Containers can be replaced; volumes preserve data.**

### Next Lesson — 22: Docker Networks 🌐

Learn how containers communicate and how to connect the TaskFlow API to MongoDB.

Copy and paste this directly into your `README.md` file for Lesson 22.


# Lesson 22 — Docker Networks: How Containers Communicate 🌐

## 1. What Is a Docker Network?

A Docker network allows containers to communicate with each other.

For TaskFlow, the API runs in one container and MongoDB runs in another. A shared network allows the API to connect to MongoDB.

## 2. Types of Bridge Networks

- **Default bridge:** Docker's built-in bridge network; automatic container-name resolution is not provided by default.
- **User-defined bridge:** A custom network that supports communication using container names.

We will use a user-defined bridge network.

## 3. Create a Docker Network

List existing networks:

```powershell
docker network ls
```

Create a network:

```powershell
docker network create taskflow-lab-net
```

Verify it:

```powershell
docker network ls
```

## 4. Connect Two Containers

### Step 1: Start the First Container

```powershell
docker run -dit --name taskflow-box1 --network taskflow-lab-net alpine sh
```

### Step 2: Start the Second Container

```powershell
docker run -dit --name taskflow-box2 --network taskflow-lab-net alpine sh
```

Check running containers:

```powershell
docker ps
```

### Step 3: Test Communication

```powershell
docker exec taskflow-box1 ping -c 3 taskflow-box2
```

**Result:** The first container can reach the second container using its name.

Docker's embedded DNS resolves the container name to its IP address on the shared network.

## 5. Inspect the Network

```powershell
docker network inspect taskflow-lab-net
```

Check the `Containers` section to see the connected containers and their IP addresses.

**Remember:** Container IP addresses can change when containers are recreated. Using container names is more reliable.

## 6. The Most Important Concept: `localhost`

`localhost` always refers to the machine or network environment in which the process is running.

- **API running on Windows:** `127.0.0.1` refers to your Windows machine.
- **API running in Docker:** `127.0.0.1` refers to the API container itself.

If MongoDB runs in a separate container named `taskflow-mongo`, both containers must share a suitable network.

Use this MongoDB connection string:

```env
MONGODB_URI=mongodb://taskflow-mongo:27017/taskflow
```

Explanation:

- `taskflow-mongo` — MongoDB container's name.
- `27017` — MongoDB's internal listening port.
- `taskflow` — Database name.

If MongoDB runs directly on Windows instead, Docker Desktop containers can generally reach it using `host.docker.internal`, provided MongoDB is configured to accept the connection.

## 7. Port Mapping vs Container Networking

### Host-to-container communication

```powershell
-p 5000:5000
```

Allows your Windows machine to access the API through port `5000`.

### Container-to-container communication

A shared Docker network allows the API to reach MongoDB using:

```text
taskflow-mongo:27017
```

MongoDB's port does not need to be published to Windows for containers on the shared network to communicate.

## 8. Clean Up

Remove the practice containers:

```powershell
docker rm -f taskflow-box1 taskflow-box2
```

Remove the practice network:

```powershell
docker network rm taskflow-lab-net
```

This does not delete the volume created in Lesson 21.

## 9. Lesson Checklist ✅

- [ ] Created `taskflow-lab-net`
- [ ] Started two containers on the network
- [ ] Pinged one container by its name
- [ ] Inspected the network
- [ ] Understood `localhost` and port mapping

## Key Takeaway

**Containers on the same user-defined bridge network can communicate using container names instead of hardcoded IP addresses.**

### Next Lesson — 23: Environment Variables in Docker 🔐

Learn how to configure `PORT`, `MONGODB_URI`, and JWT secrets without hardcoding configuration in your Docker image.

Here is the complete Markdown content for `Lesson-23-Environment-Variables-in-Docker.md`.


# Lesson 23 — Environment Variables in Docker 🔐

Today, we'll learn how to configure your TaskFlow backend from outside the Docker image. This is essential when deploying the same application to development, testing, and production environments.

## 1. Understand the Problem

Your TaskFlow backend uses configuration such as:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_ACCESS_SECRET=your-secret-value
JWT_ACCESS_EXPIRES_IN=15m
```

These values shouldn't all be hardcoded into your application or Docker image.

For example, development might use a MongoDB instance on your computer, while production uses a secured database service.

The application code can remain the same; you change its configuration.

### How It Works

**TaskFlow Docker image**
- Application code and runtime
- Runtime environment variables:
  - Port
  - Database URI
  - JWT secret
  - Environment mode

**Running TaskFlow container**
- Reads its configuration through `process.env`

The important distinction is that the image can be reused while the configuration supplied to each container changes.

## 2. How Node.js Reads Environment Variables

In your TypeScript application, you already use code like:

```typescript
const port = Number(process.env.PORT) || 5000;

const mongoUri = process.env.MONGODB_URI;

const jwtSecret = process.env.JWT_ACCESS_SECRET;
```

`process.env` is how Node.js accesses environment variables.

The values are strings, so you convert them where necessary. For example, `process.env.PORT` is a string, even when its value is `"5000"`.

Your local `.env` file is loaded by `dotenv` when you run the server directly. But a Docker container has its own environment, so you must provide the relevant variables when starting it.

## 3. Three Ways to Provide Environment Variables

### Method A — Set a Default in the Dockerfile

Your current `Dockerfile` includes:

```dockerfile
ENV NODE_ENV=production
```

This sets the default `NODE_ENV` value in the image. A container inherits it unless another value overrides it at runtime.

This is suitable for non-secret defaults. Never put JWT secrets or database passwords directly in a Dockerfile.

### Method B — Supply One Variable with `-e`

Try this PowerShell command:

```powershell
docker run --rm -e APP_MODE=learning alpine sh -c 'echo $APP_MODE'
```

**Expected output:**

```text
learning
```

Here, `-e` sets an environment variable inside the container. The `--rm` option removes the container when it finishes.

You can provide multiple variables by using `-e` multiple times.

### Method C — Supply Variables Using `--env-file`

Docker supports loading multiple variables from a file:

```powershell
docker run --rm --env-file .env alpine sh -c 'echo $PORT'
```

Run this from the directory containing your `.env` file. If the file contains `PORT=5000`, the expected output is:

```text
5000
```

The file is read when the container starts. Its contents are passed as container environment variables; the file itself does not need to be copied into the image.

Because your `.dockerignore` excludes `.env`, this works without adding `.env` to the Docker image.

## 4. Apply This to Your TaskFlow Backend

Let's use the image you built in Lesson 20.

Your local `.env` currently contains a MongoDB URI similar to:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
```

That URI is appropriate when the API runs directly on your computer and MongoDB listens on your computer's loopback interface.

When the API runs in Docker but MongoDB still runs on your Windows host, use `host.docker.internal` instead.

Run this from the TaskFlow project root:

```powershell
docker run --name taskflow-api-container -p 5000:5000 --env-file .env -e NODE_ENV=production -e MONGODB_URI=mongodb://host.docker.internal:27017/taskflow taskflow-api:1.0
```

### Understanding the Command

| Argument | Purpose |
|---|---|
| `--env-file .env` | Passes the variables from your local environment file into the container. |
| `-e NODE_ENV=production` | Overrides the development mode that may be supplied by `.env`. |
| `-e MONGODB_URI=...` | Overrides the local MongoDB URI for this Docker-based setup. |
| `-p 5000:5000` | Publishes host port 5000 to container port 5000. |

### Environment Variable Precedence

When the same variable is present in the image configuration, the env file, and explicit `-e` arguments, the runtime value supplied through `-e` takes precedence over the env-file value, which takes precedence over the image default.

**Precedence from highest to lowest:**

1. Explicit runtime `-e` arguments
2. Values from `--env-file`
3. Defaults configured through Dockerfile `ENV`

This is a learning setup. It assumes MongoDB is running and reachable from Docker Desktop. If MongoDB is in another container, we'll use a Docker network and a service/container name in the URI instead.

### If the Container Name Already Exists

If you previously created a container with the name `taskflow-api-container`, remove that old container before using the same name again:

```powershell
docker rm -f taskflow-api-container
```

Only run that cleanup command when you're comfortable removing that specific container.

## 5. Verify the Configuration Without Revealing Secrets

While the container is running, open a second PowerShell window.

### Check the Environment Mode

```powershell
docker exec taskflow-api-container printenv NODE_ENV
```

Expected output:

```text
production
```

### Check the Port

```powershell
docker exec taskflow-api-container printenv PORT
```

Expected output:

```text
5000
```

### Check Whether the JWT Secret Is Present

Run the following command without printing the secret's actual value:

```powershell
docker exec taskflow-api-container sh -c 'test -n "$JWT_ACCESS_SECRET" && echo "JWT secret is configured" || echo "JWT secret is missing"'
```

Expected output when configured:

```text
JWT secret is configured
```

### Test Your API

```powershell
curl.exe http://localhost:5000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

The health check may succeed even if MongoDB is unavailable, depending on how your `/health` endpoint is implemented.

### Check Container Logs

If startup fails, inspect the container logs:

```powershell
docker logs taskflow-api-container
```

Look for configuration errors, database connection failures, or missing environment variables. Avoid sharing logs containing credentials or other sensitive information.

## 6. Important Security Lesson: Environment Variables Are Not a Secret Vault

Avoid placing real credentials in your Dockerfile, source code, Git repository, or image build instructions.

Also remember that runtime environment variables can be visible to users with sufficient access to the Docker daemon or container inspection tools.

Passing a secret through `--env-file` avoids baking it into the image, but it does not make the value invisible to privileged users.

### Production Security Best Practices

- Keep `.env` out of Git and Docker build contexts.
- Use strong, unique JWT secrets and database credentials.
- Restrict who can access the host, Docker daemon, and deployment configuration.
- Consider an appropriate secret manager for production credentials.
- Never print actual secrets in logs or share them when asking for troubleshooting help.

## 7. Your Lesson 23 Checklist

**Progress: 0 / 5**

- [ ] Understood how Node.js reads `process.env`.
- [ ] Tested `docker run -e`.
- [ ] Tested `docker run --env-file`.
- [ ] Understood runtime variable precedence.
- [ ] Verified TaskFlow's configuration without exposing secrets.

## Next Lesson — 24: Docker Compose

We'll define the TaskFlow API, MongoDB, environment variables, persistent database volume, and networking in one `compose.yaml` file, so you can manage the entire local backend stack with a single command.


# Lesson 24 — Docker Compose: Run Your Entire Backend with One Command 🐳

Until now, you've learned how to run containers individually:

```text
TaskFlow API → docker run
MongoDB      → docker run
Network      → docker network create
Volume       → docker volume create
```

Managing everything manually becomes inconvenient as your application grows.

Docker Compose lets you define and manage multiple containers together using one YAML file. It can configure the services, networking, ports, environment variables, and persistent volumes for your application.

**Official documentation:** [Docker Compose](https://docs.docker.com/compose/)

## 1. The Architecture We're Building

Your Windows computer:

```text
Postman / cURL
      |
      v
localhost:5000
      |
      v
TaskFlow API
Express · TypeScript · Port 5000
      |
      v
Compose-managed network
      |
      v
MongoDB container
Port 27017 (internal to the Docker network)
      |
      v
Named volume
Persistent database storage
```

Notice that MongoDB does not need a published host port. TaskFlow can reach it through the Compose network using the service name `mongo`.

Compose automatically creates a default network and registers services for name-based discovery.

## 2. Create `compose.yaml`

Open your existing `taskflow-backend/` directory.

Create a new file named `compose.yaml` in the project root, alongside your `Dockerfile`, `.env`, and `package.json`.

Paste this configuration:

```yaml
services:
  api:
    build:
      context: .
    ports:
      - "5000:5000"
    env_file:
      - .env
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongo:27017/taskflow
    depends_on:
      mongo:
        condition: service_healthy
    restart: unless-stopped

  mongo:
    image: mongo:8.0
    volumes:
      - taskflow-mongo-data:/data/db
    healthcheck:
      test:
        - CMD
        - mongosh
        - --quiet
        - --eval
        - "db.adminCommand('ping').ok"
      interval: 5s
      timeout: 5s
      retries: 12
      start_period: 10s

volumes:
  taskflow-mongo-data:
```

This uses the official MongoDB image with the `8.0` tag.

**Official image:** [MongoDB on Docker Hub](https://hub.docker.com/_/mongo)

Let's understand each section before running it.

## 3. Understand the Compose File

### A. The `api` Service

```yaml
api:
  build:
    context: .
  ports:
    - "5000:5000"
```

- `build: context: .` tells Compose to build your API image using the Dockerfile in the project directory.
- `ports: "5000:5000"` maps port 5000 on Windows to port 5000 inside the API container.

This means your API remains accessible at:

```text
http://localhost:5000
```

### B. Environment Variables

```yaml
env_file:
  - .env
environment:
  NODE_ENV: production
  MONGODB_URI: mongodb://mongo:27017/taskflow
```

Compose reads your local `.env` file and passes its values into the API container.

We then override two values:

- `NODE_ENV` becomes `production`.
- `MONGODB_URI` points to the MongoDB service named `mongo`.

The `environment` settings take precedence over the corresponding `env_file` settings. That allows you to retain your local `.env` file without using its host-based MongoDB URI inside the container.

Your `.env` should still contain the necessary API configuration, including a valid `JWT_ACCESS_SECRET`. Keep it out of Git.

### C. Connecting to MongoDB

```yaml
MONGODB_URI: mongodb://mongo:27017/taskflow
```

This is one of today's most important lines.

The hostname `mongo` refers to the Compose service name, not an IP address or your Windows computer.

Compare the three configurations:

| Running environment | Example MongoDB URI |
|---|---|
| API running directly on Windows, local MongoDB | `mongodb://127.0.0.1:27017/taskflow` |
| API container, MongoDB on Windows host | `mongodb://host.docker.internal:27017/taskflow` |
| API container, MongoDB in the same Compose project | `mongodb://mongo:27017/taskflow` |

The correct hostname depends on where MongoDB is actually running.

### D. Waiting for MongoDB to Become Healthy

```yaml
depends_on:
  mongo:
    condition: service_healthy
```

Starting a MongoDB container doesn't necessarily mean the database is ready to accept connections.

The `healthcheck` tests whether MongoDB can respond to a ping. Compose waits for MongoDB's health status to become healthy before starting the API, reducing startup race conditions.

This is a startup safeguard, not a guarantee that the database will remain available forever. Your API should still handle database disconnections properly.

### E. Persistent Database Storage

```yaml
volumes:
  - taskflow-mongo-data:/data/db
```

MongoDB stores its data at `/data/db` in this image. The named volume keeps the data separate from the container's writable layer.

The declaration at the bottom:

```yaml
volumes:
  taskflow-mongo-data:
```

tells Compose to manage that volume for this project.

The database files remain available when you remove and recreate containers, provided you preserve the volume.

### F. Why Is There No `ports` Entry for MongoDB?

We intentionally haven't published MongoDB's port to Windows.

The API can communicate with MongoDB through their shared Docker network. Not publishing the database port reduces unnecessary exposure.

For this local learning setup, the MongoDB service has no authentication configured, so don't expose it to an untrusted network or treat this setup as production-ready.

Production deployments need appropriate database authentication, access controls, secrets management, backups, and network security.

## 4. Start the Entire Application

First, check these prerequisites:

- Docker Desktop is running.
- Your `Dockerfile` and `compose.yaml` are in the project root.
- Your `.env` contains the required JWT secret.
- Your `npm run build` works.
- Your host port `5000` is available.

If `npm run dev` is still running, stop it using `Ctrl + C`. Also stop or remove any manually running API container that is already publishing host port 5000.

You can inspect existing containers with:

```powershell
docker ps -a
```

From the project root, run:

```powershell
docker compose up --build -d
```

Here's what the command does:

- `docker compose`: invokes Docker Compose.
- `up`: creates and starts the services.
- `--build`: builds the API image before starting.
- `-d`: runs the containers in the background.

On the first run, Docker may need to download the MongoDB image and build the API image.

### Check the Services

```powershell
docker compose ps
```

You should see both `api` and `mongo` running. MongoDB should become healthy before the API starts.

## 5. Test the Running Services

### Test A — Check Your API

```powershell
curl.exe http://localhost:5000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

### Test B — Check MongoDB

```powershell
docker compose exec mongo mongosh --quiet --eval "db.adminCommand('ping')"
```

A successful response should include an `ok` value of `1`.

For example:

```json
{ ok: 1 }
```

### Test C — Read the API Logs

```powershell
docker compose logs api
```

Follow the logs as they arrive:

```powershell
docker compose logs -f api
```

Press `Ctrl + C` to stop following the logs; this does not normally stop the services.

For logs from both services:

```powershell
docker compose logs
```

If a service isn't running, inspect its logs and `docker compose ps` to find the error.

## 6. Prove That MongoDB Data Persists

Let's connect Lesson 21's volume concept to Compose.

### Step A — Insert a Test Record

```powershell
docker compose exec mongo mongosh --quiet taskflow --eval "db.compose_lesson.insertOne({ marker: 'lesson-24', at: new Date() })"
```

This inserts a test document into the `compose_lesson` collection in the `taskflow` database.

### Step B — Remove the Containers

```powershell
docker compose down
```

Do not add `-v`. Without that option, Compose preserves the named volume.

### Step C — Start the Project Again

```powershell
docker compose up --build -d
```

Wait until MongoDB becomes healthy.

### Step D — Query the Test Record

```powershell
docker compose exec mongo mongosh --quiet taskflow --eval "db.compose_lesson.findOne({ marker: 'lesson-24' })"
```

You should see the record you inserted before removing the containers.

This demonstrates that Compose can replace containers while reusing the named database volume.

**Important:** `docker compose down -v` removes project-managed named volumes and can permanently delete the database data stored in them.

## 7. Essential Compose Commands

| Command | Purpose |
|---|---|
| `docker compose up --build -d` | Build and start services in the background |
| `docker compose ps` | Show service/container status |
| `docker compose logs -f api` | Follow API logs |
| `docker compose exec mongo mongosh` | Open the MongoDB shell inside the container |
| `docker compose stop` | Stop services without removing them |
| `docker compose start` | Start stopped services |
| `docker compose down` | Stop and remove project containers and network |
| `docker compose down -v` | Also remove project-managed named volumes; database data can be lost |

Use `docker compose down -v` only when you deliberately want to remove the associated persistent data.

## Lesson 24 Checklist

**Progress: 0 of 5**

- [ ] Created `compose.yaml` in the TaskFlow project root.
- [ ] Started the API and MongoDB with `docker compose up --build -d`.
- [ ] Verified `/health` responds successfully.
- [ ] Verified MongoDB responds to a ping.
- [ ] Verified the test record survives `docker compose down` and restart.

## Next Lesson — 25: Container-to-Container Communication

We'll inspect Docker DNS, test how the API resolves MongoDB's service name, and troubleshoot connection failures between containers.
