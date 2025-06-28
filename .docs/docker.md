# Build

docker build -f apps/messenger/backend/Dockerfile -t messenger-backend .

# Run

docker run -p 5001:5001 messenger-backend
docker run -p 5001:5001 --env-file .env messenger-backend

# Upload to Docker Hub

docker tag messenger-backend prenticez/messenger-backend:latest
docker push prenticez/messenger-backend:latest

# Need to figure out how to only take the node/modules from the app not the root

We can list our images with - use CMD not bash

```sh
  docker images
```

And look inside them with

```sh
docker run -it <image_id> /bin/bash
```

# Then you use docker hub to deploy to Azure

When setting it up yo add the docker container

but how do you update it afterwards?

```bash
docker build -f apps/messenger/backend/Dockerfile -t messenger-backend .
docker push prenticez/messenger-backend:latest
```

then go to azure portal and restart
