// nút cuộn lên
document.addEventListener("DOMContentLoaded", function () {
  const scrollTopBtn = document.getElementById("vb_dau");
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});

// trang chủ
function initCarousel(container) {
  const bookList = container.querySelector(".tcbook-list");
  const nextBtn = container.querySelector(".tcnextBtn");
  const prevBtn = container.querySelector(".tcprevBtn");

  let currentIndex = 0;

  function getBooks() {
    return Array.from(bookList.querySelectorAll(".tcbook, #tcdot"));
  }

  function getItemsPerView() {
    const width = window.innerWidth;
    if (width >= 1024) return 5;
    if (width >= 768) return 3;
    return 1;
  }

  function getBookFullWidth() {
    const item = bookList.querySelector(".tcbook, #tcdot");
    if (!item) return 0;
    const style = window.getComputedStyle(item);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    return item.offsetWidth + marginLeft + marginRight;
  }

  function updateCarousel() {
    const bookWidth = getBookFullWidth();
    const offset = currentIndex * bookWidth;
    bookList.style.transform = `translateX(-${offset}px)`;
  }

  function getMaxIndex() {
    const totalBooks = getBooks().length;
    const itemsPerView = getItemsPerView();
    return Math.max(totalBooks - itemsPerView, 0);
  }

  nextBtn.addEventListener("click", () => {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  });

  prevBtn.addEventListener("click", () => {
    const maxIndex = getMaxIndex();
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex;
    }
    updateCarousel();
  });

  window.addEventListener("resize", () => {
    currentIndex = 0;
    updateCarousel();
  });

  updateCarousel();
}

document.querySelectorAll(".tcmycarousel-container").forEach(initCarousel);

document.querySelectorAll(".tcmota").forEach(function (button) {
  button.addEventListener("click", function () {
    const book = this.closest(".tcbook");
    book.classList.toggle("show-overlay");
  });
});

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    function addBookToPurchased(book) {
      const currentUserEmail = localStorage.getItem("currentUserEmail");
      if (!currentUserEmail) {
        alert("Vui lòng đăng nhập để mua sách");
        window.location.href = "dangnhap.html";
        return;
      }

      const userData = localStorage.getItem(currentUserEmail);
      if (!userData) {
        alert("Không tìm thấy thông tin người dùng.");
        return;
      }

      const user = JSON.parse(userData);
      if (!Array.isArray(user.purchased_books)) {
        user.purchased_books = [];
      }

      user.purchased_books.push(book);
      localStorage.setItem(currentUserEmail, JSON.stringify(user));
      alert(`Đã thêm sách \"${book.book_name || book.name}\" vào giỏ hàng.`);
    }

    function getBookDataFromDOM(bookElement) {
      const name = bookElement.querySelector("h3")?.textContent?.trim();
      const priceText = bookElement.querySelector("p")?.textContent?.trim();
      const img = bookElement.querySelector("img")?.getAttribute("src");
      const describe =
        bookElement.querySelector(".tcbook-overlay p")?.textContent?.trim() ||
        "Không có mô tả";
      const author = getAuthorFromOverlay(bookElement) || "Không rõ";

      const price = Number(priceText.replace(/[^\d]/g, ""));
      return {
        book_name: name,
        cost: price,
        img_book: img,
        describe: describe,
        author: author,
        genre: "chua-ro",
        status: "Còn hàng",
      };
    }

    function getAuthorFromOverlay(bookElement) {
      const overlay = bookElement.querySelector(".tcbook-overlay");
      if (!overlay) return null;
      const match = overlay.innerText.match(/Tác giả\s*:\s*(.+)/i);
      return match ? match[1].trim() : null;
    }

    document.querySelectorAll(".tcbook").forEach(function (bookElement) {
      const addBtn = bookElement.querySelector(".tcaddCart");
      if (!addBtn) return;

      addBtn.addEventListener("click", function () {
        const book = getBookDataFromDOM(bookElement);
        addBookToPurchased(book);
      });
    });

    window.addBookToPurchased = addBookToPurchased;
  });
})();
// end trang chủ

// ô tìm kiếm
document
  .querySelector("#search_form")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const keyWord = document.querySelector("#search_input")?.value.trim();
    if (!keyWord) {
      return;
    }
    localStorage.setItem("searchKey", keyWord);
    window.location.href = "sanpham.html";
  });

window.addEventListener("DOMContentLoaded", function () {
  const isSanPham = window.location.pathname.endsWith("sanpham.html");
  if (!isSanPham) {
    return;
  }
  const searchKey = localStorage.getItem("searchKey");
  if (!searchKey) {
    return;
  }
  localStorage.removeItem("searchKey");
  const keyWord = searchKey
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  // lấy dữ liệu từ file JSON
  fetch("books.json")
    .then((response) => response.json())
    .then((books) => {
      let result = books.filter((book) => {
        const bookName = book.book_name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        return bookName.includes(keyWord);
      });

      // Nếu không tìm thấy trong books.json thì tìm trong localStorage

      if (result.length === 0) {
        const currentUserEmail = localStorage.getItem("currentUserEmail"); // Lấy email đang đăng nhập
        if (currentUserEmail) {
          const userData = localStorage.getItem(currentUserEmail); // Lấy dữ liệu theo email
          if (userData) {
            const userObj = JSON.parse(userData);
            const books = userObj.sold_books || [];

            result = books.filter((book) => {
              const bookName = book.book_name
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
              return bookName.includes(keyWord);
            });
          }
        }
      }
      showBooks(result);
    });

  // hàm hiển thị sách
  function showBooks(list) {
    const listProduct = document.querySelector(".list-product");
    if (!listProduct) {
      return;
    }
    listProduct.innerHTML = "";
    if (list.length === 0) {
      listProduct.innerHTML =
        "<p>Thật tiếc quá! Sách bạn vừa nhập vẫn chưa có ở Sách Ơi. Hãy thử tìm một quyển sách khác nhé!</p>";
      return;
    }

    list.forEach((product) => {
      listProduct.innerHTML += `
        <div class="product-card">
            <div class="info-img">
              <img src="${product.img_book}" alt="${product.book_name}" />
              <div class="overlay">
                <figcaption>
                  <p><strong>Tác Giả:</strong> ${product.author}</p>
                  <p><strong>Năm:</strong> ${product.publication_year}</p>
                  <p><strong>Tóm tắt:</strong> ${product.summary}</p>
                </figcaption>
              </div>
            </div>
            <h3>${product.book_name}</h3>
            <p>${product.describe}</p>
            <div class="bottom">
              <span class="price">${product.cost}<b>đ</b></span>
              <button class="button-buy">Mua ngay</button>
            </div>
          </div>
      `;
    });
  }
});
// end ô tìm kiếm


//giỏ hàng 
let cart = [];
let currentUserEmail = "";
let user = {};

document.addEventListener("DOMContentLoaded", function () {
  currentUserEmail = localStorage.getItem("currentUserEmail");
  if (!currentUserEmail) {
    console.warn("Chưa đăng nhập.");
    return;
  }

  user = JSON.parse(localStorage.getItem(currentUserEmail));
  cart = user.purchased_books || [];

  renderCart();
});

function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  const totalPriceEl = document.getElementById("total-price");

  cartContainer.innerHTML = " ";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p>Giỏ hàng của bạn đang trống.</p>`;
    totalPriceEl.textContent = `Tổng tiền: 0 đ`;
    return;
  }
  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <div class="checkbox">
        <input type="checkbox" class="item-checkbox" data-index="${index}" onchange="updateSelected(${index})">
      </div>
      <div class="image">
        <img src="${
          item.img_book || "https://via.placeholder.com/60x80?text=No+Image"
        }" alt="Ảnh sách">
      </div>
      <div class="info">
        <div class="name"><strong>${item.book_name}</strong></div>
        <div class="author">Tác giả: ${item.author}</div>
        <div class="price">Đơn giá: ${item.cost} đ</div>
        <div class="total">Thành tiền: ${item.cost} đ</div>
      </div>
      <div class="remove">
        <span class="remove-btn" onclick="removeItem(${index})">🗑️</span>
      </div>
    `;
    cartContainer.appendChild(itemDiv);
  });
}
function removeItem(index) {
  user.select.splice(index, 1);
  cart.splice(index, 1);
  updateCart();
}
// xóa all
function removeALL() {
  const bookCheckboxes = document.querySelectorAll(".item-checkbox");

  if (!Array.isArray(user.select) || user.select.length === 0) {
    alert("Không có sách nào được chọn để xóa.");
    return;
  }

  // Lọc ra những sách KHÔNG được chọn để giữ lại
  user.purchased_books = user.purchased_books.filter(
    (book) =>
      !user.select.some((selected) => selected.book_name === book.book_name)
  );

  // Cập nhật lại
  user.select = [];
  cart = user.purchased_books;

  // Lưu
  localStorage.setItem(currentUserEmail, JSON.stringify(user));

  // Render lại giao diện và cập nhật tổng
  renderCart();
  total();

  alert("Đã xóa tất cả sách đã chọn.");
}

function updateCart() {
  user.purchased_books = cart;
  localStorage.setItem(currentUserEmail, JSON.stringify(user));
  renderCart();
}

function updateSelected(index) {
  const checkbox = document.querySelector(
    `.item-checkbox[data-index="${index}"]`
  );
  const selectedBook = cart[index];

  // Nếu user.select chưa có thì khởi tạo
  if (!Array.isArray(user.select)) {
    user.select = [];
  }

  const existingIndex = user.select.findIndex(
    (book) => book.book_name === selectedBook.book_name
  );

  if (checkbox.checked && existingIndex === -1) {
    //Nếu đang check và sách chưa có → thêm vào
    user.select.push(selectedBook);
  } else if (!checkbox.checked && existingIndex !== -1) {
    //Nếu bỏ check và sách đang có → xóa đi
    user.select.splice(existingIndex, 1);
  }
  total();
  // Lưu lại
  localStorage.setItem(currentUserEmail, JSON.stringify(user));
}

function total() {
  let totalPriceEl = document.getElementById("total-price");
  let totalPrice = 0;

  if (Array.isArray(user.select)) {
    user.select.forEach(function (book) {
      totalPrice += book.cost;
    });
  }

  // Hiển thị tổng giá tiền lên giao diện
  totalPriceEl.textContent = "Tổng tiền:" + totalPrice.toLocaleString("vi-VN");
}
// select all
function selectALL() {
  const checkAllBox = document.getElementById("select-all");
  const bookCheckboxes = document.querySelectorAll(".item-checkbox");

  if (!Array.isArray(user.select)) user.select = [];

  user.select = [];

  bookCheckboxes.forEach((cb, i) => {
    cb.checked = checkAllBox.checked;
    if (checkAllBox.checked) {
      user.select.push(cart[i]);
    }
  });
  // Lưu lại và cập nhật tổng tiền
  localStorage.setItem(currentUserEmail, JSON.stringify(user));
  total();
}
function checkgh() {
  const currentEmail = localStorage.getItem("currentUserEmail");
  if (!currentEmail) {
    alert("Vui lòng lòng đăng nhập để tiếp tục");
    window.location.href = "dangnhap.html";
  }
}

//Thanh toán//
function confirmExchange() {
  //  Chưa đăng nhập
  if (!user) {
    const hasAccount = confirm(
      "⚠️ Bạn cần đăng nhập để thanh toán.\nBạn đã có tài khoản chưa?"
    );
    if (hasAccount) {
      window.location.href = "dangnhap.html";
    } else {
      window.location.href = "dangky.html";
    }
    return;
  }

  //  Kiểm tra có chọn sách nào chưa
  const selected = document.querySelectorAll(".item-checkbox:checked");
  if (selected.length === 0) {
    alert(" Vui lòng chọn ít nhất một sách để thanh toán.");
    return;
  }

  //  Đã đăng nhập + đã chọn sách
  window.location.href = "thanhtoan.html";
}

//hàm in thanh toán
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".store")) {
    currentUserEmail = localStorage.getItem("currentUserEmail");
    user = JSON.parse(localStorage.getItem(currentUserEmail)) || {};
    renderPayment();
  }
});
function renderPayment() {
  const store = document.querySelector(".store");
  store.innerHTML = "";

  let pay = user.select || [];

  if (pay.length === 0) {
    store.innerHTML = "<p>Không có sách nào để thanh toán.</p>";
    return;
  }

  pay.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.className = "item";
    bookDiv.innerHTML = `
        <img class="item-img" src="${
          book.img_book || "https://via.placeholder.com/60x80?text=No+Image"
        }" alt="ảnh sách" />
        <div class="item-info">
          <p class="item-name">${book.book_name}</p>
        </div>
        <p class="item-price">${book.cost.toLocaleString("vi-VN")} đ</p>
        <button class="button-clear" onclick="removeBookFromPayment('${
          book.book_name
        }')">Xóa</button>
      `;
    store.appendChild(bookDiv);
  });
  const info = document.createElement("div");
  info.className = "info";
  info.innerHTML = `
          <h3><i class="fa-solid fa-book-open-reader"></i>${user.user_name}</h3>
          <h3><i class="fa-solid fa-square-phone"></i>${user.tel}</h3>
          <h3>
            <i class="fa-solid fa-location-dot"></i> Địa chỉ: ${user.address}
            </h3>
        </div>`;
  store.appendChild(info);
  const payment = document.createElement("div");
  payment.className = "payment";
  payment.innerHTML = `
          <h3><span id="total-price" ></span></h3>
          <form onclick="confirmExchangeSuccess()">
            <button type="submit">Trao đổi</button>
          </form>
    `;
  store.appendChild(payment);
  total();
}
function removeBookFromPayment(bookName) {
  if (!Array.isArray(user.select)) user.select = [];
  if (!Array.isArray(user.purchased_books)) user.purchased_books = [];

  user.select = user.select.filter((b) => b.book_name !== bookName);

  user.purchased_books = user.purchased_books.filter(
    (b) => b.book_name !== bookName
  );

  localStorage.setItem(currentUserEmail, JSON.stringify(user));

  renderPayment();
}

function confirmExchangeSuccess() {
  alert("Thao tác thành công");
  user.select = [];
  user.purchased_books = [];
  localStorage.setItem(currentUserEmail, JSON.stringify(user));
  renderPayment();
}
// end giỏ hàng

// sản phẩm
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
      <button class="description1" title="Xem mô tả">
        <i class="fa-solid fa-ellipsis"></i>
      </button>
      <div class="info-img">
        <img src="${book.image || book.img_book}" alt="Ảnh sản phẩm" />
      </div>
      <div class="description">
        <h3>${book.name || book.book_name}</h3>
        <p>${book.description || book.describe || "Không có mô tả"}</p>
      </div>
      <div class="bottom">
        <span class="price">${Number(
          book.price || book.cost || 0
        ).toLocaleString()}đ</span>
        <button class="button-buy">Mua ngay</button>
      </div>
      <div class="overlay description-overlay ">
        <button class="close-overlay"><i class="fa-solid fa-xmark"></i></button>
        <figcaption>
          <p><strong>Tác Giả:</strong> ${book.author}</p>
          <p><strong>Năm:</strong> ${
            book.year || book.publication_year || "N/A"
          }</p>
         <p><strong>Thể Loại :</strong> ${book.genre || "N/A"}</p>
          <p><strong>Tóm tắt:</strong> ${
            book.description || book.describe || "Không có mô tả"
          }</p>
        </figcaption>
      </div>
    `;
      productList.appendChild(card);

      // Gắn sự kiện nút "Mua ngay"
      const buttonBuy = card.querySelector(".button-buy");
      buttonBuy.addEventListener("click", function () {
        buy(book);
      });
      const buttonShow = card.querySelector(".description1");
      const overlay = card.querySelector(".overlay");
      const closeBtn = card.querySelector(".close-overlay");

      buttonShow.addEventListener("click", () => {
        overlay.classList.add("show");
      });

      closeBtn.addEventListener("click", () => {
        overlay.classList.remove("show");
      });
    });
  }

  // Lọc thể loại
  filterGenre.addEventListener("change", function () {
    const selected = this.value.toLowerCase();
    const filtered =
      selected === "tất cả"
        ? allBooks
        : allBooks.filter((book) => {
            const genre = (book.genre || "").toLowerCase();
            const category = (book.category || "").toLowerCase();
            return genre === selected || category === selected;
          });
    renderBooks(filtered);
  });
});
  const button = card.querySelector(".description1");
  const overlay = card.querySelector(".overlay");
  const closeBtn = card.querySelector(".close-overlay");

  button.addEventListener("click", () => {
    overlay.classList.add("show");
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
  });

  // Hàm xử lý mua sách

  function buy(book) {
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    if (!currentUserEmail) {
      alert(" Vui lòng đăng ký hoặc đăng nhập.");
      return;
    }

  // Lấy thông tin người dùng
  const userJSON = localStorage.getItem(currentUserEmail);
  if (!userJSON) {
    alert(" Người dùng không tồn tại.");
    return;
  }

  const user = JSON.parse(userJSON);

  // Khởi tạo danh sách sách đã mua nếu chưa có
  if (!Array.isArray(user.purchased_books)) {
    user.purchased_books = [];
  }

  // Kiểm tra sách đã tồn tại chưa
  const exists = user.purchased_books.some(
    (b) => b.book_name === book.book_name
  );

  if (exists) {
    alert(" Bạn đã mua sách này rồi!");
    return;
  }
  user.purchased_books.push(book);

  // Lưu lại vào localStorage
  localStorage.setItem(currentUserEmail, JSON.stringify(user));

  // Thông báo
  alert(
    ` Bạn vừa chọn mua  "${
      book.name || book.book_name
    }". \n Đến trang giỏ hàng để thanh toán ngay`
  );
}
// end sản phẩm

// đăng ký

function check() {
  const currentEmail = localStorage.getItem("currentUserEmail");
  if (currentEmail) {
    alert("Bạn đã đăng nhập. Vui lòng đăng xuất trước.");
    window.location.href = "nguoidung.html";
  }
}
function signin(e) {
  e.preventDefault();
  const user_name = document.querySelector("#user_name").value;
  const gender = document.querySelector("#gender").value;
  const birthday = document.querySelector("#birthday").value;
  const tel = document.querySelector("#tel").value;
  const address = document.querySelector("#address").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const password_again = document.querySelector("#password_again").value;

  if (gender === "sample") {
    alert("Vui lòng chọn giới tính!");
    return;
  }

  const passRegex = /(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}/;
  if (!passRegex.test(password)) {
    alert(
      "Vui lòng nhập đúng định dạng. Mật khẩu buộc phải có ít nhất 8 ký tự, một chữ cái in hoa và 1 số."
    );
    return;
  }

  if (password !== password_again) {
    alert("Mật khẩu không khớp nhau. Vui lòng nhập lại thật chính xác!");
    return;
  }

  if (localStorage.getItem(email)) {
    alert("Email này đã được sử dụng. Vui lòng dùng email khác.");
    return;
  }
  //ojb->chuỗi
  const user = {
    user_name,
    gender,
    birthday,
    tel,
    address,
    email,
    password,
  };

  localStorage.setItem(email, JSON.stringify(user)); //lưu thông tin người dùng
  localStorage.setItem("currentUserEmail", email); //ghi nhớ thông tin người dùng
  alert("Đăng ký thành công. Chào mừng bạn đến với Sách Ơi! nhé!");
  window.location.href = "nguoidung.html";
}
// end đăng ký

// đăng nhập
function login(e) {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const user = localStorage.getItem(email);

  if (user == null) {
    alert("Email chưa được đăng ký!");
    return;
  }

  const data = JSON.parse(user);
  if (email != data.email || password != data.password) {
    alert("Mật khẩu không đúng. Vui lòng nhập lại!");
    return;
  }

  // Lưu lại email của người đã đăng nhập để qua trang khác còn dùng
  localStorage.setItem("currentUserEmail", email);
  localStorage.setItem("logged", "true");
  window.location.href = "nguoidung.html";
  alert("Đăng nhập thành công");

  window.location.href = "nguoidung.html";
}
// end đăng nhập

// đăng bán
function sold(e) {
  e.preventDefault();
  const img_book = document.querySelector("#img_book");
  const book_name = document.querySelector("#book_name");
  const author = document.querySelector("#author");
  const genre = document.querySelector("#genre");
  const cost = document.querySelector("#cost");
  const status = document.querySelector("#status");
  const describe = document.querySelector("#describe");
  const publication_year = document.querySelector("#publication_year");
  const publisher = document.querySelector("#publisher");
  const summary = document.querySelector("#summary");

  if (img_book.value == "") {
    alert("Vui lòng chọn ảnh minh họa sách!");
    return;
  } else if (book_name.value == "") {
    alert("Vui lòng nhập tên sách!");
    return;
  } else if (author.value == "") {
    alert("Vui lòng nhập tên tác giả/ dịch giả!");
    return;
  } else if (publication_year.value == "") {
    alert("Vui lòng nhập năm xuất bản!");
    return;
  } else if (publisher.value == "") {
    alert("Vui lòng nhập tên nhà xuất bản!");
    return;
  } else if (genre.value == "sample") {
    alert("Vui lòng chọn thể loại sách!");
    return;
  } else if (cost.value < 1000) {
    alert("Vui lòng nhập giá tiền sách! Số tiền phải lớn hơn 1000vnđ");
    return;
  } else if (status.value == "sample") {
    alert("Vui lòng chọn tình trạng sách!");
    return;
  } else if (describe.value == "") {
    alert("Vui lòng nhập thông tin mô tả sách!");
    return;
  } else if (summary.value == "") {
    alert("Vui lòng nhập tóm tắt nội dung sách!");
    return;
  }

  const currentUserEmail = localStorage.getItem("currentUserEmail");
  if (!currentUserEmail) {
    alert("Bạn chưa đăng nhập. Không thể đăng bán sách.");
    return;
  }

  const file = img_book.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const imgbase64 = e.target.result;

    const product = {
      img_book: imgbase64,
      book_name: book_name.value,
      author: author.value,
      genre: genre.value,
      cost: parseInt(cost.value),
      status: status.value,
      describe: describe.value,
      publication_year: publication_year.value,
      publisher: publisher.value,
      summary: summary.value,
      posted_by: currentUserEmail,
      created_at: new Date().toISOString(),
    };

    // Lưu sản phẩm vào localStorage
    localStorage.setItem("product_" + book_name.value, JSON.stringify(product));
    if (!user.sold_books) {
      user.sold_books = [];
    }
    user.sold_books.push("product_" + book_name.value);

    localStorage.setItem(currentUserEmail, JSON.stringify(user));
    alert("Sách đã được đăng bán!");
    window.location.href = "nguoidung.html";
  };

  reader.readAsDataURL(file);
}

// end đăng bán

// liên hệ
function formtest_lienhe(a) {
  var email = document.getElementById("vb_Email");
  var user = document.getElementById("vb_ten");
  var nd = document.getElementById("vb_ykien");
  var reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (user.value.length <= 4) {
    alert("Tên phải lớn hơn 4 ký tự");
    return false;
  }
  if (reg.test(email.value) == false) {
    alert("Vui lòng nhập email hợp lệ!");
    return false;
  }
  if (nd.value.length <= 10) {
    alert("Nội dung lớn hơn 10 ký tự");
    return false;
  }
  return true;
}
// end liên hệ

//đăng xuất

function logout(e) {
  e.preventDefault();
  localStorage.removeItem("currentUserEmail");
  localStorage.removeItem("logged");
  alert("Đã đăng xuất.");
  window.location.href = "dangnhap.html";
}
// end đăng xuất

//người dùng
function information(e) {
  const currentEmail = localStorage.getItem("currentUserEmail");

  if (!currentEmail) {
    alert("Bạn chưa đăng nhập. Quay lại đăng nhập.");
    window.location.href = "dangnhap.html";
    return;
  }

  const userData = JSON.parse(localStorage.getItem(currentEmail));

  if (!userData) {
    alert("Không tìm thấy thông tin người dùng.");
    return;
  }

  document.getElementById("user_name").innerText = userData.user_name;
  document.getElementById("gender").innerText = userData.gender;
  document.getElementById("birthday").innerText = userData.birthday;
  document.getElementById("tel").innerText = userData.tel;
  document.getElementById("address").innerText = userData.address;
  document.getElementById("email").innerText = userData.email;
}
// end người dùng