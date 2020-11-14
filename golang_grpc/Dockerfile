FROM golang:latest 

RUN mkdir /app

ADD . /app

WORKDIR /app

RUN go get google.golang.org/grpc

RUN go get google.golang.org/grpc/cmd/protoc-gen-go-grpc

RUN go get -u github.com/gorilla/mux

RUN go build -o main .

EXPOSE 3000

#EXPOSE 50051

CMD ["/app/main"]