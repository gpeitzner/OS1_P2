package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"google.golang.org/grpc"

	pb "google.golang.org/grpc/examples/helloworld/helloworld"
)

type case_ struct {
	Name         string `json:"name"`
	Location     string `json:"location"`
	Age          string `json:"age"`
	Infectedtype string `json:"infectedtype"`
	State        string `json:"state"`
}

const (
	address = "localhost:50051"
)

func testRoute(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "prueba puertos")
}

func indexRoute(w http.ResponseWriter, r *http.Request) {
	//lectura del body del case

	log.Printf("enviando peticion")
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "no se pudo leer el body.")
	}
	body := string(reqBody)

	//conexion
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("no conecto: %v", err)
	}
	defer conn.Close()
	c := pb.NewGreeterClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	//peticion al servidor
	r1, err1 := c.SayHello(ctx, &pb.HelloRequest{Name: body})
	if err1 != nil {
		log.Fatalf("no conecto:  %V", err1)
	}
	log.Printf("respuesta %s ", r1.GetMessage())
	fmt.Fprintf(w, "respuesta %s ", r1.GetMessage())

}

func main() {
	//enrutador
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", indexRoute).Methods("POST")
	router.HandleFunc("/test", testRoute).Methods("GET")

	log.Fatal(http.ListenAndServe(":3000", router))

}
