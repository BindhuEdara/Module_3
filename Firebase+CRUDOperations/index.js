/* ====== CONFIG: replace with your RTDB base URL (no trailing slash) ====== */
const BASE_URL =
  "https://bookmanagement-353d9-default-rtdb.asia-southeast1.firebasedatabase.app/";

// DOM
const titleEl = document.getElementById("title");
const authorEl = document.getElementById("author");
const priceEl = document.getElementById("price");
const imageEl = document.getElementById("imageUrl");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const seedBtn = document.getElementById("seedBtn");
const refreshBtn = document.getElementById("refreshBtn");
const grid = document.getElementById("grid");
const status = document.getElementById("status");
const empty = document.getElementById("empty");

// state
let books = [];
let editId = null;

// helpers
function setStatus(txt, isError = false) {
  status.textContent = txt || "";
  status.style.color = isError ? "crimson" : "inherit";
}

function clearForm() {
  editId = null;
  titleEl.value = "";
  authorEl.value = "";
  priceEl.value = "";
  imageEl.value = "";
  saveBtn.textContent = "Add Book";
}

// --- CRUD calls using native fetch for RTDB ---

async function getBooks() {
  setStatus("Loading...");
  try {
    const res = await fetch(`${BASE_URL}/books.json`);
    if (!res.ok) throw new Error("Network response not ok: " + res.status);
    const data = await res.json();
    // convert object -> array safely
    books = data ? Object.entries(data).map(([id, b]) => ({ id, ...b })) : [];
    renderBooks();
    setStatus(`Loaded ${books.length} book(s)`);
  } catch (err) {
    console.error("getBooks error:", err);
    setStatus("Failed to load books (check console)", true);
    books = [];
    renderBooks();
  }
}

async function addBook(payload) {
  try {
    const res = await fetch(`${BASE_URL}/books.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Add failed: " + res.status);
    const resp = await res.json(); // returns { name: "<new-key>" }
    console.log("Added book key:", resp.name);
    return resp.name;
  } catch (err) {
    console.error("addBook error:", err);
    throw err;
  }
}

async function updateBook(id, payload) {
  try {
    const res = await fetch(`${BASE_URL}/books/${id}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Update failed: " + res.status);
    return true;
  } catch (err) {
    console.error("updateBook error:", err);
    throw err;
  }
}

async function deleteBook(id) {
  try {
    const res = await fetch(`${BASE_URL}/books/${id}.json`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Delete failed: " + res.status);
    return true;
  } catch (err) {
    console.error("deleteBook error:", err);
    throw err;
  }
}

// Render
function renderBooks() {
  grid.innerHTML = "";
  if (!books || books.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = book.imageUrl || placeholderFor(book.title);
    img.alt = book.title || "Book";

    const h = document.createElement("h3");
    h.textContent = book.title || "(No title)";

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = "By " + (book.author || "Unknown");

    const price = document.createElement("div");
    price.className = "price";
    price.textContent =
      book.price !== undefined && book.price !== null ? `₹ ${book.price}` : "";

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => {
      editId = book.id;
      titleEl.value = book.title || "";
      authorEl.value = book.author || "";
      priceEl.value = book.price || "";
      imageEl.value = book.imageUrl || "";
      saveBtn.textContent = "Update Book";
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "del";
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      if (!confirm("Delete this book?")) return;
      try {
        delBtn.disabled = true;
        await deleteBook(book.id);
        setStatus("Deleted");
        await getBooks();
      } catch (err) {
        setStatus("Delete failed (see console)", true);
      } finally {
        delBtn.disabled = false;
      }
    };

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    card.appendChild(img);
    card.appendChild(h);
    card.appendChild(meta);
    card.appendChild(price);
    card.appendChild(actions);

    grid.appendChild(card);
  });
}

// placeholder image if none provided
function placeholderFor(title) {
  const text = encodeURIComponent(title || "Book");
  return `https://via.placeholder.com/640x400.png?text=${text}`;
}

// Form submit
saveBtn.addEventListener("click", async () => {
  const t = titleEl.value.trim();
  const a = authorEl.value.trim();
  const pRaw = priceEl.value.trim();
  const img = imageEl.value.trim();

  if (!t || !a || !pRaw) {
    alert("Please provide Title, Author and Price.");
    return;
  }

  // coerce price to number when possible
  const p = isNaN(Number(pRaw)) ? pRaw : Number(pRaw);

  const payload = { title: t, author: a, price: p, imageUrl: img };

  saveBtn.disabled = true;
  saveBtn.textContent = editId ? "Updating..." : "Adding...";

  try {
    if (editId) {
      await updateBook(editId, payload);
      setStatus("Updated book");
    } else {
      await addBook(payload);
      setStatus("Added book");
    }
    clearForm();
    await getBooks();
  } catch (err) {
    setStatus("Operation failed (see console)", true);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Add Book";
  }
});

clearBtn.addEventListener("click", clearForm);
refreshBtn &&
  refreshBtn.addEventListener("click", () => {
    getBooks();
    setStatus("Refreshed");
  });

// Seed sample data (5 books)
seedBtn &&
  seedBtn.addEventListener("click", async () => {
    const sample = [
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        price: 499,
        imageUrl: "",
      },
      {
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        price: 299,
        imageUrl: "",
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 399,
        imageUrl: "",
      },
      {
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        price: 249,
        imageUrl: "",
      },
      {
        title: "Design Patterns",
        author: "Gamma et al.",
        price: 599,
        imageUrl: "",
      },
    ];

    if (!confirm("Seed sample books (this will add 5 books)?")) return;
    setStatus("Seeding sample data...");
    try {
      seedBtn.disabled = true;
      for (const b of sample) {
        await addBook(b);
      }
      setStatus("Seed complete");
      await getBooks();
    } catch (err) {
      console.error("seed failed", err);
      setStatus("Seed failed (see console)", true);
    } finally {
      seedBtn.disabled = false;
    }
  });

// Init
getBooks();
clearForm();
