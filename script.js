// // đăng ký
// function signin(e){
//     e.preventDefault();
//     const user_name = document.querySelector("#user_name").value;
//     const gender = document.querySelector("#gender").value;
//     const birthday =  document.querySelector("#birthday").value;
//     const tel = document.querySelector("#tel").value;
//     const address = document.querySelector("#address").value;
//     const email = document.querySelector("#email").value;
//     const password = document.querySelector("#password").value;
//     const password_again = document.querySelector("#password_again").value;
//     if(user_name = ''){
//         alert("Vui lòng nhập họ tên!");
//         return;
//     }
//     if(gender == 'sample'){
//         alert("Vui lòng chọn giới tính!");
//         return;
//     }
//     if(tel = '' || tel.length < 10){
//         alert("Vui lòng nhập đúng định dạng số điện thoại!");
//         return;
//     }
//     if(address = ''){
//         alert("Vui lòng nhập địa chỉ chính xác!");
//         return;
//     }
//     const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//     if(!emailRegex.test(email)){
//         alert("Vui lòng nhập đúng định dạng email!");
//         return;
//     }
//     const passRegex = /(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}/;
//     if(!passRegex.test(password)){
//         alert("Vui lòng nhập đúng định dạng. Mật khẩu buộc phải có ít nhất 8 ký tự, một chữ cái in hoa và 1 số.")
//         return;
//     }
//     else if(password != password_again){
//         alert("Mật khẩu không khớp nhau. Vui lòng nhập lại thật chính xác!")
//         return;
//     }
//     else {
//         const user = {
//             user_name : user_name,
//             gender : gender,
//             birthday : birthday,
//             tel : tel,
//             address : address,
//             email : email,
//             password : password,
//         }
//         // obj -> chuỗi
//         const  data = JSON.stringify(user);
//         localStorage.setItem(email, data);
//         alert("Đăng ký thành công. Bây giờ hãy đăng nhập vào Sách Ơi! nhé!");
//         window.location.href = "dangnhap.html";
//     }
// }
// // end đăng ký

// // đăng nhập
// function login(e){
//     e.preventDefault();
//     const email = document.querySelector("#email").value;
//     const password = document.querySelector("#password").value;
//     const user = localStorage.getItem(email);
//     // kiểm tra trước vì nếu người dùng chưa đăng ký thì email sẽ null, null thì data bị lỗi
//     if(user == null){
//         alert("Vui lòng nhập thông tin đăng nhập");
//         return;
//     }
//     const data = JSON.parse(user);
//     if(email == data.email && password != data.password){
//         alert("Mật khẩu không đúng. Vui lòng nhập lại!")
//         return;
//     }
//     else{
//         window.location.href= "nguoidung.html";
//     }
// }
// // end đăng nhập

// // đăng bán

// //kiểm tra đúng định dạng ảnh
// document.addEventListener('DOMContentLoaded', function(){
//     var img_book = document.querySelector("#img_book");
//     img_book.addEventListener('change', function(){
//         const files = this.files;
//         for(const i = 0; i < files.length; i++){
//             const fileName = files[i].name.toLowerCase();
//             if(!(fileName.endsWith('.png') && !(fileName.endsWith('.jpg')))){
//                 alert("Vui lòng chỉ nhập file ảnh đúng định dạng!")
//                 img_book.value = ""; //reset toàn bộ value trong img_book
//                 return;
//             }
//         }
//     })      
// })

// //kiểm tra nhập form đăng bán
// function sold(e){
//     e.preventDefault();
    
//     const book_name = document.querySelector("#book_name");
//     const author = document.querySelector("#author");
//     const genre = document.querySelector("#genre");
//     const cost = document.querySelector("#cost");
//     const status = document.querySelector("#status");
//     const describe = document.querySelector("#describe");
    
//     if(img_book.value == ""){
//         alert("Vui lòng chọn ảnh minh họa sách!");
//         return;
//     }
//     else if(book_name.value == ""){
//         alert("Vui lòng nhập tên sách!");
//         return;
//     }
//     else if(author.value == ""){
//         alert("Vui lòng nhập tên tác giả!");
//         return;
//     }
//     else if(genre.value == "sample"){
//         alert("Vui lòng chọn thể loại sách!");
//         return;
//     }
//     else if(cost.value < 1000){
//         alert("Vui lòng nhập giá tiền sách! Số tiền phải lớn hơn 1000vnđ");
//         return;
//     }
//     else if(status.value == "sample"){
//         alert("Vui lòng tình trạng sách!");
//         return;
//     }
//     else if(describe.value == ""){
//         alert("Vui lòng nhập thông tin mô tả sách!");
//         return;
//     }
//     const product = {
//         img_book : img_book,
//         book_name : book_name,
//         author : author,
//         genre : genre,
//         cost : cost,
//         status : status,
//         describe : describe
//     }
//     const data = JSON.stringify(product);
//     localStorage.setItem(product, data);
//     window.location.href = "nguoidung.html"
// }

// // end đăng bán



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

  localStorage.setItem(email, JSON.stringify(user)); //lưu thông tin người dùng
  localStorage.setItem("currentEmail", email); //ghi nhớ thông tin người dùng
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
  if (email != data.email || password != data.password) {
    alert("Mật khẩu không đúng. Vui lòng nhập lại!");
    return;
  }

  // Lưu lại email của người đã đăng nhập để qua trang khác còn dùng
  localStorage.setItem("currentUserEmail", email);
  localStorage.setItem("logged", "true");
  window.location.href = "nguoidung.html";
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
  const img_book = document.querySelector("#img_book");
  img_book.addEventListener("change", function () {
    const file = this.files[0]; 
    if (!file) return; 
    const fileName = file.name.toLowerCase(); //viết thường hết tên file
    if (!(fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg"))) {
      alert("Vui lòng chỉ chọn ảnh định dạng .png, .jpg hoặc .jpeg!");
      img_book.value = ""; 
    }
  });
});

//kiểm tra nhập form đăng bán
function sold(e) {
  e.preventDefault();
  const img_book = document.querySelector("#img_book");
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
    img_book: img_book.value,
    book_name: book_name.value,
    author: author.value,
    genre: genre.value,
    cost: cost.value,
    status: status.value,
    describe: describe.value,
  };
  const data = JSON.stringify(product);
  localStorage.setItem("product_" + book_name.value, data);
  window.location.href = "nguoidung.html";
}

// end đăng bán

// liên hệ
function formtest_lienhe(a)
    {
        var email=document.getElementById("vb_Email");
        var user=document.getElementById("vb_ten");
        var nd=document.getElementById("vb_ykien");
        var reg=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (user.value.length <= 4)
        {
            alert("Tên phải lớn hơn 4 ký tự");
            return false;
        }
        if(reg.test(email.value)==false)
        {
            alert("Vui lòng nhập email hợp lệ!");
            return false;
        }
        if (nd.value.length <= 10)
        {
            alert("Nội dung lớn hơn 10 ký tự");
            return false;
        }    
        return true;   
    }
// end liên hệ
