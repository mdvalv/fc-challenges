FROM golang:alpine3.16 AS builder

WORKDIR /app

COPY main.go main.go

RUN go build -o hello main.go

FROM scratch

WORKDIR /app

COPY --from=builder /app/hello /app/hello

ENTRYPOINT [ "./hello" ]
