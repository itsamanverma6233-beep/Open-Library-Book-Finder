let searchBtn = document.getElementById("searchBtn");
let searchInput = document.getElementById("searchInput");
let filterYear = document.getElementById("filterYear");
let sortSelect = document.getElementById("sortSelect");
let booksContainer = document.getElementById("booksContainer");
let message = document.getElementById("message");
let readingGoalText = document.getElementById("readingGoal");

let allBooks = [];
let readingGoalCount = 0;
let debounceTimer;

searchBtn.addEventListener("click", function() {
    clearTimeout(debounceTimer);
    searchBooks();
});
searchInput.addEventListener("keypress", function(event) {
    if(event.key === "Enter") {
        clearTimeout(debounceTimer);
        searchBooks();
    }
});

searchInput.addEventListener("input", function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
        searchBooks();
    }, 500);
});

filterYear.addEventListener("change", updateUI);
sortSelect.addEventListener("change", updateUI);

function searchBooks() {
    let text = searchInput.value.trim();

    if(text === "") {
        message.innerHTML = "Enter a book name to search.";
        booksContainer.innerHTML = "";
        allBooks = [];
        return;
    }

    message.innerHTML = "Loading...";
    booksContainer.innerHTML = "";

    fetch("https://openlibrary.org/search.json?q=" + encodeURIComponent(text))
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        message.innerHTML = "";
        
        allBooks = data.docs.slice(0, 10);
        
        if(allBooks.length === 0) {
            message.innerHTML = "No books found. Try a different search.";
            return;
        }

        updateUI();
    })
    .catch(function() {
        message.innerHTML = "Error loading books. Please try again.";
        booksContainer.innerHTML = "";
    });
}

function updateUI() {
    if(allBooks.length === 0) return;

    let processedBooks = filterBooks(allBooks);
    processedBooks = sortBooks(processedBooks);
    displayBooks(processedBooks);
}

function filterBooks(books) {
    let checked = filterYear.checked;
    
    return books.filter(function(book) {
        if(checked) {
            if(book.first_publish_year) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    });
}

function sortBooks(books) {
    let sortValue = sortSelect.value;
    
    let sortedArray = books.slice();

    return sortedArray.sort(function(a, b) {
        let yearA = a.first_publish_year || 0;
        let yearB = b.first_publish_year || 0;
        
        if (sortValue === "oldest") {
            return yearA - yearB;
        } else if (sortValue === "newest") {
            return yearB - yearA;
        } else {
            return 0;
        }
    });
}

function displayBooks(books) {
    if(books.length === 0) {
        booksContainer.innerHTML = "";
        message.innerHTML = "No books match your current filter.";
        return;
    } else {
        message.innerHTML = "";
    }

    let htmlArray = books.map(function(book) {
        let title = book.title;
        
        let author = "Unknown";
        if(book.author_name) {
            author = book.author_name[0];
        }
        
        let year = book.first_publish_year || "N/A";
        
        let cover = "https://via.placeholder.com/150";
        if(book.cover_i) {
            cover = "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg";
        }

        return "<div class='book-card'>" +
               "<div>" +
               "<img src='" + cover + "'>" +
               "<h3>" + title + "</h3>" +
               "<p>Author: " + author + "</p>" +
               "<p>Year: " + year + "</p>" +
               "</div>" +
               "<button class='read-btn' onclick='updateReadingGoal()'>I've Read This</button>" +
               "</div>";
    });

    booksContainer.innerHTML = htmlArray.join("");
}

function updateReadingGoal() {
    readingGoalCount = readingGoalCount + 1;
    readingGoalText.innerHTML = "Reading Goal: " + readingGoalCount + " Books";
}