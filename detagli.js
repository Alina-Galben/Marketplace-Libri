// 1. Ottiene il parametro id dal URL
const params = new URLSearchParams(window.location.search);

// 2. Estrae l'ASIN del libro della URL
const id = params.get("id");

// 3. Costruisce l'URL per ottenere i detagli del libro
const apiUrl = `https://striveschool-api.herokuapp.com/books/${id}`;

// 4. Recupera i dati del libro dall'API. E chiama .then(response => response.json()) per convertire la risposta in JASON
fetch(apiUrl)
    .then(response => response.json())
    
    // 5. Visualizza i detagli del libro sulla pagina
    .then(book => {
        document.getElementById("bookDetails").innerHTML = `
                    <div class="card mx-auto" style="max-width: 500px;">
                        <img src="${book.img}" class="card-img-top h-200" alt="${book.title}">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text">Autore: ${book.author || "Sconosciuto"}</p>
                            <p class="card-text">Categoria: ${book.category}</p>
                            <p class="card-text">Prezzo: ${book.price}€</p>
                            <p class="card-text">${book.description || "Nessuna descrizione disponibile."}</p>
                            <a href="index.html" class="btn btn-primary">Torna alla home</a>
                        </div>
                    </div>
                `;
    })
    // 6. Gestisce eventuali errori nel recupero dei dati
    .catch(error => console.error("Errore nel recupero dei dettagli:", error));