package main

import (
	"fmt"
	"log"
	"net/http"
  "html/template"
)


func main() {
  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    templ := template.Must(template.ParseFiles("site/index.html"))

    templ.Execute(w, nil)
  })


  fmt.Println("Starting server on :8080")
  log.Fatal(http.ListenAndServe(":8080", nil))
}
