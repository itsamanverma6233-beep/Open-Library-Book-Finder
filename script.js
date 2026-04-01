let searchBtn = document.getElementById("searchBtn");
let searchInput = document.getElementById("searchInput");
let booksContainer = document.getElementById("booksContainer");
let loading = document.getElementById("loading");

searchBtn.addEventListener("click", searchBooks);

function searchBooks(){

let text = searchInput.value.trim();

if(text === ""){
booksContainer.innerHTML = "Enter a book name";
return;
}

loading.innerHTML = "Loading...";
booksContainer.innerHTML = "";

fetch("https://openlibrary.org/search.json?q=" + encodeURIComponent(text))
.then(function(response){
return response.json();
})
.then(function(data){

loading.innerHTML = "";

let books = data.docs.slice(0,10);

if(books.length === 0){
booksContainer.innerHTML = "No books found";
return;
}

for(let i = 0; i < books.length; i++){

let title = books[i].title;

let author = "Unknown";
if(books[i].author_name){
author = books[i].author_name[0];
}

let year = books[i].first_publish_year || "N/A";

let cover = "https://via.placeholder.com/150";

if(books[i].cover_i){
cover = "https://covers.openlibrary.org/b/id/" + books[i].cover_i + "-M.jpg";
}

let div = document.createElement("div");

div.innerHTML =
"<img src='"+cover+"'>" +
"<h3>"+title+"</h3>" +
"<p>"+author+"</p>" +
"<p>Year: "+year+"</p>";

booksContainer.appendChild(div);

}

})
.catch(function(){

loading.innerHTML = "";
booksContainer.innerHTML = "Error loading books";

});
}