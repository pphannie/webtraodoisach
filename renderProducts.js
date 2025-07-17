document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("list-product");
  const filterGenre = document.getElementById("filter-genre");
  let allBooks = [];

  // Lấy sách từ localStorage
  function getLocalProducts() {
    const products = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("product_")) {
        try {
          const product = JSON.parse(localStorage.getItem(key));
          products.push(product);
        } catch (e) {
          console.error("Lỗi khi đọc sản phẩm từ localStorage:", e);
        }
      }
    }
    return products;
  }

  // Load sách từ JSON và localStorage
  fetch("books.json")
    .then((res) => res.json())
    .then((data) => {
      const localProducts = getLocalProducts();
      allBooks = [...data, ...localProducts];
      renderBooks(allBooks);
    })
    .catch((err) => {
      console.error("Không thể load books.json:", err);
      allBooks = getLocalProducts();
      renderBooks(allBooks);
    });

  // Hàm hiển thị sách
  function renderBooks(books) {
    productList.innerHTML = "";
    if (books.length === 0) {
      productList.innerHTML = "<p>Không có sản phẩm nào.</p>";
      return;
    }

    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="info-img">
          <img src="${book.image || book.img_book}" alt="Ảnh sản phẩm" />
          <div class="overlay">
            <figcaption>
              <p><strong>Tác Giả:</strong> ${book.author}</p>
              <p><strong>Năm:</strong> ${book.year || "N/A"}</p>
              <p><strong>Tóm tắt:</strong> ${
                book.description || book.describe || "Không có mô tả"
              }</p>
            </figcaption>
          </div>
        </div>
        <h3>${book.name || book.book_name}</h3>
        <p>${book.description || book.describe || "Không có mô tả"}</p>
        <div class="bottom">
          <span class="price">${Number(
            book.price || book.cost || 0
          ).toLocaleString()}đ</span>
          <button class="button-buy">Mua ngay</button>
        </div>
      `;
      productList.appendChild(card);

      // Gắn sự kiện click cho nút "Mua ngay"
      const button = card.querySelector(".button-buy");
      button.addEventListener("click", function () {
        buy(book);
      });
    });
  }

  // Lọc thể loại
  filterGenre.addEventListener("change", function () {
    const selected = this.value;
    const filtered =
      selected === "all"
        ? allBooks
        : allBooks.filter(
            (book) => book.category === selected || book.genre === selected
          );
    renderBooks(filtered);
  });
});

// Hàm xử lý mua sách

function buy(book) {
  const currentUserEmail = localStorage.getItem("currentUserEmail"); 
  if (!currentUserEmail) {
    alert("Vui lòng đăng ký");
    return;
  }

  // Lấy thông tin người dùng
  const userJSON = localStorage.getItem(currentUserEmail);
  if (!userJSON) {
    alert("Người dùng không tồn tại.");
    return;
  }

  const user = JSON.parse(userJSON);

  // Cập nhật danh sách sách đã mua
  if (!user.purchased_books) {
    user.purchased_books = [];
  }

  user.purchased_books.push(book);

  // Lưu lại vào localStorage
  localStorage.setItem(currentUserEmail, JSON.stringify(user));

  // Hiển thị thông báo
  alert(`Bạn đã mua sách: ${book.name || book.book_name}`);
}
