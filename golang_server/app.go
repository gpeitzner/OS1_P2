package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/streadway/amqp"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func sendInfection(infection Infection) {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"hello", // name
		false,   // durable
		false,   // delete when unused
		false,   // exclusive
		false,   // no-wait
		nil,     // arguments
	)
	failOnError(err, "Failed to declare a queue")

	body := "{\"name\":\"" + infection.Name +
		"\", \"location\":\"" + infection.Location +
		"\", \"age\":\"" + infection.Age +
		"\", \"infectedtype\":\"" + infection.InfectedType +
		"\", \"state\":\"" + infection.State + "\"}"
	err = ch.Publish(
		"",     // exchange
		q.Name, // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(body),
		})
	log.Printf(" [x] Sent %s", body)
	failOnError(err, "Failed to publish a message")
}

type Infection struct {
	Name         string `json:"name"`
	Location     string `json:"location"`
	Age          string `json:"age"`
	InfectedType string `json:"infectedtype"`
	State        string `json:"state"`
}

func createCase(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var infection Infection
	_ = json.NewDecoder(r.Body).Decode(&infection)
	sendInfection(infection)
	json.NewEncoder(w).Encode(infection)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", createCase).Methods("POST")
	log.Fatal(http.ListenAndServe(":3000", r))
}
