const quoteContainer = document.querySelector("#quote-list");
const quotesForm = document.querySelector("form");
const quotesList = document.querySelector(".quote-card");

document.addEventListener("DOMContentLoaded", () => {
  startupQuotes();
  quotesForm.addEventListener("submit", handleSubmit);
});

function handleSubmit(event) {
  event.preventDefault();

  const quote = event.target[0].value;
  const author = event.target[1].value;
  const newQuote = { quote, author };

  quotesForm.reset();

  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newQuote),
  })
    .then((response) => response.json())
    .then((quote) => quoteCard(quote))
    .catch((error) => alert(error));
}

function startupQuotes() {
  fetch("http://localhost:3000/quotes?_embed=likes")
    .then((response) => response.json())
    .then((quoteData) => quoteData.forEach((quote) => quoteCard(quote)))
    .catch((error) => console.log(error));
}

function quoteCard(quotes) {
  const list = document.createElement("li");
  list.className = "quote-card";

  const blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote";

  const p = document.createElement("p");
  p.className = "mb-0";
  p.textContent = quotes.quote;

  const footer = document.createElement("footer");
  footer.className = "blockquote-footer";
  footer.textContent = quotes.author;

  const br = document.createElement("br");

  const likeBtn = document.createElement("button");
  likeBtn.className = "btn-success";
  likeBtn.textContent = "Likes: ";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-danger";
  deleteBtn.textContent = "Delete";

  const likeCounter = document.createElement("span");
  let numLikes = 0;
  likeCounter.textContent = `${numLikes}`;

  list.append(blockquote);
  blockquote.append(p, footer, br, likeBtn, deleteBtn);
  likeBtn.appendChild(likeCounter);
  quoteContainer.appendChild(list);

  // DELETE QUOTE
  list.querySelector(".btn-danger").addEventListener("click", () => {
    fetch(`http://localhost:3000/quotes/${quotes.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => list.remove())
      .catch((error) => alert(error));
  });

  // LIKE BTN
  list.querySelector(".btn-success").addEventListener("click", () => {
    const quoteId = quotes.id;
    const createdAt = Date.now();
    const newLike = { quoteId, createdAt };

    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLike),
    })
      .then((response) => response.json())
      .then(() => {
        numLikes += 1;
        list.querySelector("span").textContent = numLikes;
      })
      .catch((error) => alert(error));
  });
}
