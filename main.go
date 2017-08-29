package main

import (
	"flag"
	"log"
	"net/http"
)

var (
	httpPort = flag.String("httpPort", "8080", "http server port")
)

func main() {
	flag.Parse()
	http.Handle("/", http.FileServer(http.Dir("public")))
	// http.HandleFunc("/info", func(w http.ResponseWriter, r *http.Request) {
	// 	w.Header().Set("Content-Type", "application/json")
	// 	w.Write()
	// })
	log.Println("Http server started on port " + *httpPort)
	http.ListenAndServe(":"+*httpPort, nil)
}
