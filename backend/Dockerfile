FROM alpine:3.19 as downloader

ARG TARGETOS=linux
ARG TARGETARCH=amd64
ARG PB_VERSION=0.22.0

ENV BUILDX_ARCH="${TARGETOS}_${TARGETARCH}"

RUN apk add --no-cache     ca-certificates     unzip     wget

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${VERSION}_${BUILDX_ARCH}.zip     && unzip pocketbase_${VERSION}_${BUILDX_ARCH}.zip     && chmod +x /pocketbase

FROM alpine:3.19

RUN apk add --no-cache ca-certificates

COPY --from=downloader /pocketbase /usr/local/bin/pocketbase

# Create directories for data and public files
RUN mkdir -p /pb/pb_data /pb/pb_public /pb/pb_migrations /pb/pb_hooks

EXPOSE 8090

# Use Railway's PORT env var, default to 8090
CMD ["sh", "-c", "/usr/local/bin/pocketbase serve --http=0.0.0.0:${PORT:-8090} --dir=/pb/pb_data --publicDir=/pb/pb_public --migrationsDir=/pb/pb_migrations --hooksDir=/pb/pb_hooks"]
