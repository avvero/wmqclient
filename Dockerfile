FROM golang:latest
LABEL maintainer avvero

WORKDIR /app
RUN go build -o main .
CMD ["/app/main"]