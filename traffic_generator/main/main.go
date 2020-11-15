package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"sync"
	"time"
)

var wg sync.WaitGroup

type Case_ struct {
	Name         string `json:"name"`
	Location     string `json:"location"`
	Age          string `json:"age"`
	Infectedtype string `json:"infectedtype"`
	State        string `json:"state"`
}

func loadData(balancer string, cantRutines string, cantRequests string, file string) {
	goRutines, err := strconv.Atoi(cantRutines)
	wg.Add(goRutines) //cantidad de gorutinas que debe esperar

	content, err := ioutil.ReadFile(file)
	if err != nil {
		fmt.Println(err.Error())
	}
	var cases_ []Case_

	err2 := json.Unmarshal(content, &cases_)
	if err2 != nil {
		//fmt.Println("error json unmarshalling")
		//fmt.Println(err2.Error())
	}
	contador := 0
	cantidad, err := strconv.Atoi(cantRequests)
	for _, x := range cases_ {
		//enviar las peticiones a la url del balanceador
		if contador < cantidad {
			//peticion post
			go sendData(x, balancer, contador)
			contador++
		}
	}

	wg.Wait() //espera las rutinas
}

func sendData(x Case_, balanceador string, contador int) {
	//IPS: http://35.239.22.19
	//IPS: http://34.68.4.19
	defer wg.Done() //indica que la gorutina finaliza

	clienteHttp := &http.Client{}
	url := balanceador
	usuarioComoJson, err := json.Marshal(x)
	peticion, err := http.NewRequest("POST", url, bytes.NewBuffer(usuarioComoJson))
	peticion.Header.Add("Content-Type", "application/json")
	respuesta, err := clienteHttp.Do(peticion)
	if err != nil {
		log.Fatalf("Error haciendo petición: %v", err)
	}
	fmt.Printf("Usuario %s insertado, Rutina actual: %d\n", x.Name, contador)
	defer respuesta.Body.Close()

	sleep := rand.Int63n(100)
	time.Sleep(time.Duration(sleep) * time.Millisecond)
}

func main() {
	urlShow := "[1] Ingrese URL del Balanceador: "
	fmt.Println(urlShow)
	var URL string
	fmt.Scanln(&URL)
	goRutShow := "[2] Cantidad de GoRutinas deseadas: "
	fmt.Println(goRutShow)
	var goRutinas string
	fmt.Scanln(&goRutinas)
	casesShow := "[3] Cantidad de casos deseadas: "
	fmt.Println(casesShow)
	var casesCant string
	fmt.Scanln(&casesCant)
	fileShow := "[3] Ruta del archivo a cargar: "
	fmt.Println(fileShow)
	var file string
	fmt.Scanln(&file)

	loadData(URL, goRutinas, casesCant, file)
}
