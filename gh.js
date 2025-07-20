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
          <p class="item-type">Thể loại: ${book.genre || "Không rõ"}</p>
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
          <h3><span id="total-price" fun></span></h3>
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

  user.purchased_books = user.purchased_books.filter((b) => b.book_name !== bookName);

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
