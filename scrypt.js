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

        document.addEventListener("DOMContentLoaded", fetchBooks);
        searchInput.addEventListener("input", filterBooks);
        clearCartBtn.addEventListener("click", clearCart);

        function fetchBooks() {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    books = data;
                    renderBooks(books);
                    renderCategories();
                });
        }

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
                                <button class="btn btn-primary" onclick="addToCart('${book.asin}', '${book.title}', ${book.price})">Aggiungi al carrello</button>
                                <button class="btn btn-secondary ms-2" onclick="showDetails('${book.asin}')">Dettagli</button>
                            </div>
                        </div>
                    </div>
                `;
                booksContainer.appendChild(bookCard);
            });
        }


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

        function filterByCategory(category) {
            const filteredBooks = books.filter(book => book.category === category);
            renderBooks(filteredBooks);
        }

        function addToCart(asin, title, price) {
            cart.push({ asin, title, price });
            document.getElementById(asin).classList.add("selected-card");
            updateCart();
        }

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

        function removeFromCart(index, asin) {
            cart.splice(index, 1);
            document.getElementById(asin).classList.remove("selected-card");
            updateCart();
        }

        function clearCart() {
            cart.forEach(item => document.getElementById(item.asin).classList.remove("selected-card"));
            cart = [];
            updateCart();

            // Svuota anche la visualisazione del carello
            cartList.innerHTML = "";
            cartCount.textContent = "0";
            totalPriceElement.textContent ="0.00";
        }

        function filterBooks(event) {
            const query = event.target.value.toLowerCase();
            const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
            renderBooks(filteredBooks);
        }