/* Nuove funzionalita */
// Agiungo il pulsante "salta" su tutte le card. Al click dovrebbe far scomparire la card
// Cliccando sul pulsante detagli l'utente deve essere portato a una pagina html separata dove vedere i detagli del libro

const booksContainer = document.getElementById("booksContainer");
const searchInput = document.getElementById("searchInput");
const cartList = document.getElementById("cart");
const cartCount = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clearCart");
const totalPriceElement = document.getElementById("totalPrice");
const categoryList = document.getElementById("categoryList");
const apiUrl = "https://striveschool-api.herokuapp.com/books";

let books = [];
let cart = [];

// 1. Questa funzione viene eseguita automaticamente quando la pafina viene caricata. Chiama fetchBooks per ottenere i dati dei libri dall'API
document.addEventListener("DOMContentLoaded", fetchBooks);

// 6. Attiva la funzione filterBooks() ogmi volta che l'utente digita qualcosa nella bara di ricerca
searchInput.addEventListener("input", filterBooks);

clearCartBtn.addEventListener("click", clearCart);

// 2. La funzione fetch per ottenere i dati dei libri
function fetchBooks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            books = data;
            renderBooks(books);
            renderCategories();
        });
}

// 3- Ricevere l'elenco dei libri e gli visualizza in formato card. Ogni card include i pulsanti "Carello" "Detagli" "Salta". Collegare i pulsanti alle funzioni addToCart(), showDetails(), hidenCard
function renderBooks(bookList) {
    booksContainer.innerHTML = "";
    bookList.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.className = "col-md-4 mb-3";
        bookCard.innerHTML = `
                    <div class="card" style="height: 100%;" id="${book.asin}">
                        <img src="${book.img}" class="card-img-top" alt="${book.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text">${book.price}€</p>
                            <div class="mt-auto">
                                <button class="btn btn-primary ms-4" onclick="addToCart('${book.asin}', '${book.title}', ${book.price})">Carrello</button>
                                <button class="btn btn-secondary ms-3" onclick="showDetails('${book.asin}')">Dettagli</button>
                                <button class="btn btn-danger ms-3" onclick="hidenCard('${book.asin}')">Salta</button>
                            </div>
                        </div>
                    </div>
                `;
        booksContainer.appendChild(bookCard);
    });
}

// Funzione salta la card
function hidenCard(asin) {
    document.getElementById(asin).remove();
}

// Funzione clicc sul pulsante detagli
function showDetails(asin) {
    window.location.href = `detagli.html?id=${asin}`;
}


// 4. Creare elenco delle categorie disponibili. Collegare ogni categoria a filterByCategory per filtrare i libri
function renderCategories() {
    const categories = [...new Set(books.map(book => book.category))];
    if (categories.length === 0) {
        categoryList.innerHTML = "<li class='list-group-item'>Nessuna categoria disponibile</li>";
    } else {
        categoryList.innerHTML = categories.map(category =>
            `<li class="list-group-item category-item" onclick="filterByCategory('${category}')">${category}</li>`
        ).join('');
    }
}

// 5. Filtra i libri in base alla categoria selezionata dal utente. Chiama renderBooks(filteredBooks) per aggiornare la visualisazione
function filterByCategory(category) {
    const filteredBooks = books.filter(book => book.category === category);
    renderBooks(filteredBooks);
}

// 8. Aggiunge un libro al carello e aggiorna il conteggio. Evidenzia la card del libro selezionato. Chiama updateCart() per aggiornare la lista del carello.
function addToCart(asin, title, price) {
    cart.push({ asin, title, price });
    document.getElementById(asin).classList.add("selected-card");
    updateCart();
}

// 9. Agiorna la lista del carello. Calcola il prezzo totale
function updateCart() {
    cartList.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const cartItem = document.createElement("li");
        cartItem.className = "list-group-item d-flex justify-content-between align-items-center";
        cartItem.innerHTML = `
                    ${item.title} - ${item.price}€
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index}, '${item.asin}')">Rimuovi</button>
                `;
        cartList.appendChild(cartItem);
    });
    cartCount.textContent = cart.length;
    totalPriceElement.textContent = total.toFixed(2);
}

// 10. Rimuove un libro dal carello e aggiorna la lista. Chiama updateCart() per aggiornare il conteggio
function removeFromCart(index, asin) {
    cart.splice(index, 1);
    document.getElementById(asin).classList.remove("selected-card");
    updateCart();
}

// 11. Svuota il carello e aggiorna la visualisazione. Chiama updateCart() per resettare il totale e il conteggio
function clearCart() {
    cart.forEach(item => document.getElementById(item.asin).classList.remove("selected-card"));
    cart = [];
    updateCart();

    // Svuota anche la visualisazione del carello
    cartList.innerHTML = "";
    cartCount.textContent = "0";
    totalPriceElement.textContent = "0.00";
}

// 7. Filtra i libri in base alla ricerca dell'utente. Chiama renderBooks(filteredBooks) per aggiornare la visualisazione
function filterBooks(event) {
    const query = event.target.value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
    renderBooks(filteredBooks);
}