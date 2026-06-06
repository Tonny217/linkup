FROM alpine:3.19 as downloader

ARG TARGETOS=linux
ARG TARGETARCH=amd64

RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget \
    curl \
    jq

# Fetch the latest PocketBase version from GitHub API
RUN LATEST_VERSION=$(curl -s https://api.github.com/repos/pocketbase/pocketbase/releases/latest | jq -r .tag_name | sed 's/^v//') \
    && echo "Latest PocketBase version: $LATEST_VERSION" \
    && wget https://github.com/pocketbase/pocketbase/releases/download/v${LATEST_VERSION}/pocketbase_${LATEST_VERSION}_${TARGETOS}_${TARGETARCH}.zip \
    && unzip pocketbase_${LATEST_VERSION}_${TARGETOS}_${TARGETARCH}.zip \
    && chmod +x /pocketbase

FROM alpine:3.19

RUN apk add --no-cache ca-certificates

COPY --from=downloader /pocketbase /usr/local/bin/pocketbase

RUN mkdir -p /pb/pb_data /pb/pb_public /pb/pb_migrations /pb/pb_hooks

EXPOSE 8090

CMD ["sh", "-c", "/usr/local/bin/pocketbase serve --http=0.0.0.0:${PORT:-8090} --dir=/pb/pb_data --publicDir=/pb/pb_public --migrationsDir=/pb/pb_migrations --hooksDir=/pb/pb_hooks"]
