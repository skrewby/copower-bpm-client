# Solar BPM Client

## Updating Docker Image

```
docker build -t itspacesolar/copower-bpm-client:latest .
docker push itspacesolar/copower-bpm-client:latest
```

## Running Docker Image

Create a file to hold environment variables in the format NAME=VALUE

```
docker run --env-file ./clientEnv.list -d --name bpm-client -p 80:3000 itspacesolar/copower-bpm:latest
```

Then just run `docker start bpm-server` and `docker stop bpm-server` to start and stop the docker image
