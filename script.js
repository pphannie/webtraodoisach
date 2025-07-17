// đăng ký
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

  localStorage.setItem(email, JSON.stringify(user));
  alert("Đăng ký thành công. Bây giờ hãy đăng nhập vào Sách Ơi! nhé!");
  window.location.href = "dangnhap.html";
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
  if (email == data.email && password != data.password) {
    alert("Mật khẩu không đúng. Vui lòng nhập lại!");
    return;
  }

  // Lưu lại email của người đã đăng nhập để qua trang khác còn dùng
  localStorage.setItem("currentUserEmail", email);

  //
  window.location.href = "user.html";
}

// end đăng nhập

// đăng bán
//in thông tin user
document.addEventListener("DOMContentLoaded", function () {
  let currentUserEmail = localStorage.getItem("currentUserEmail");
  const userData = localStorage.getItem(currentUserEmail);

  if (!userData) {
    alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(userData);

  document.getElementById("td-name").innerHTML = `<i class="fa-solid fa-user"></i> ${user.user_name}`;
  document.getElementById("td-email").innerHTML = `<i class="fa-solid fa-envelope"></i> ${user.email}`;
  document.getElementById("td-tel").innerHTML = `<i class="fa-solid fa-square-phone"></i> ${user.tel}`;
  document.getElementById("td-address").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${user.address}`;
  document.getElementById("td-gender").innerHTML = `<i class="fa-solid fa-venus-mars"></i> ${user.gender}`;
  document.getElementById("td-birthday").innerHTML = `<i class="fa-solid fa-cake-candles"></i> ${user.birthday}`;
});


//kiểm tra đúng định dạng ảnh
document.addEventListener("DOMContentLoaded", function () {
  var img_book = document.querySelector("#img_book");
  img_book.addEventListener("change", function () {
    const files = this.files;
    for (const i = 0; i < files.length; i++) {
      const fileName = files[i].name.toLowerCase();
      if (!(fileName.endsWith(".png") && !fileName.endsWith(".jpg"))) {
        alert("Vui lòng chỉ nhập file ảnh đúng định dạng!");
        img_book.value = ""; //reset toàn bộ value trong img_book
        return;
      }
    }
  });
});

//kiểm tra nhập form đăng bán
function sold(e) {
  e.preventDefault();

  const book_name = document.querySelector("#book_name");
  const author = document.querySelector("#author");
  const genre = document.querySelector("#genre");
  const cost = document.querySelector("#cost");
  const status = document.querySelector("#status");
  const describe = document.querySelector("#describe");

  if (img_book.value == "") {
    alert("Vui lòng chọn ảnh minh họa sách!");
    return;
  } else if (book_name.value == "") {
    alert("Vui lòng nhập tên sách!");
    return;
  } else if (author.value == "") {
    alert("Vui lòng nhập tên tác giả!");
    return;
  } else if (genre.value == "sample") {
    alert("Vui lòng chọn thể loại sách!");
    return;
  } else if (cost.value < 1000) {
    alert("Vui lòng nhập giá tiền sách! Số tiền phải lớn hơn 1000vnđ");
    return;
  } else if (status.value == "sample") {
    alert("Vui lòng tình trạng sách!");
    return;
  } else if (describe.value == "") {
    alert("Vui lòng nhập thông tin mô tả sách!");
    return;
  }
  const product = {
    img_book: img_book,
    book_name: book_name,
    author: author,
    genre: genre,
    cost: cost,
    status: status,
    describe: describe,
  };
  const data = JSON.stringify(product);
  localStorage.setItem(product, data);
  window.location.href = "nguoidung.html";
}

// end đăng bán
