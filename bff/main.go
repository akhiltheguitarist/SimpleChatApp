package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type ChatMessage struct {
	Message string `json:"message"`
	Sender  string `json:"sender"`
}

func main() {

	router := mux.NewRouter()
	router.HandleFunc("/api/messages", handleMessage).Methods("POST")
	log.Println("Server started and listening...")

	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins: []string{"http://127.0.0.1:5173"},
		AllowedMethods: []string{"POST", "GET"},
		AllowedHeaders: []string{"Content-Type"},
	})
	handler := corsMiddleware.Handler(router)
	log.Fatal(http.ListenAndServe(":8000", handler))
}

func handleMessage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var message ChatMessage
	err := json.NewDecoder(r.Body).Decode(&message)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	log.Printf("Sender: %s, Message received: %s\n ", message.Sender, message.Message)

	var responseMessage ChatMessage
	responseMessage.Message = "The request is being processed..."
	responseMessage.Sender = "bot"
	response := struct {
		Status  string      `json:"status"`
		Message ChatMessage `json:"message"`
	}{
		Status:  "success",
		Message: responseMessage,
	}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Printf("Sender: %s, Message sent: %s\n ", responseMessage.Sender, responseMessage.Message)
	w.Header().Set("Content-Type", "application/json")

	w.Write(jsonResponse)

}
