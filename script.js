// đăng ký
function signin(e){
    e.preventDefault();
    const user_name = document.querySelector("#user_name").value;
    const gender = document.querySelector("#gender").value;
    const birthday =  document.querySelector("#birthday").value;
    const tel = document.querySelector("#tel").value;
    const address = document.querySelector("#address").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const password_again = document.querySelector("#password_again").value;
    if(gender == sample){
        alert("Vui lòng chọn giới tính!");
        return;
    }
    const passRegex = /(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}/;
    if(!passRegex.test(password)){
        alert("Vui lòng nhập đúng định dạng. Mật khẩu buộc phải có ít nhất 8 ký tự, một chữ cái in hoa và 1 số.")
        return;
    }
    else if(password != password_again){
        alert("Mật khẩu không khớp nhau. Vui lòng nhập lại thật chính xác!")
        return;
    }
    else {
        const user = {
            user_name : user_name,
            gender : gender,
            birthday : birthday,
            tel : tel,
            address : address,
            email : email,
            password : password,
        }
        // obj -> chuỗi
        const  data = JSON.stringify(user);
        localStorage.setItem(email, data);
        alert("Đăng ký thành công.");
        alert("Bây giờ hãy đăng nhập vào Sách Ơi! nhé!");
        window.location.href = "dangnhap.html";
    }
}
// end đăng ký

// đăng nhập
function login(e){
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const user = localStorage.getItem(email);
    // kiểm tra trước vì nếu người dùng chưa đăng ký thì email sẽ null, null thì data bị lỗi
    if(user == null){
        alert("Vui lòng nhập thông tin đăng nhập");
        return;
    }
    const data = JSON.parse(user);
    if(email == data.email && password != data.password){
        alert("Mật khẩu không đúng. Vui lòng nhập lại!")
        return;
    }
    else{
        window.location.href= "nguoidung.html";
    }
}
// end đăng nhập

// đăng bán

//kiểm tra đúng định dạng ảnh
document.addEventListener('DOMContentLoaded', function(){
    var img_book = document.querySelector("#img_book");
    img_book.addEventListener('change', function(){
        const files = this.files;
        for(const i = 0; i < files.length; i++){
            const fileName = files[i].name.toLowerCase();
            if(!(fileName.endsWith('.png') && !(fileName.endsWith('.jpg')))){
                alert("Vui lòng chỉ nhập file ảnh đúng định dạng!")
                img_book.value = ""; //reset toàn bộ value trong img_book
                return;
            }
        }
    })      
})

//kiểm tra nhập form đăng bán
function sold(e){
    e.preventDefault();
    
    const book_name = document.querySelector("#book_name");
    const author = document.querySelector("#author");
    const genre = document.querySelector("#genre");
    const cost = document.querySelector("#cost");
    const status = document.querySelector("#status");
    const describe = document.querySelector("#describe");
    
    if(img_book.value == ""){
        alert("Vui lòng chọn ảnh minh họa sách!");
        return;
    }
    else if(book_name.value == ""){
        alert("Vui lòng nhập tên sách!");
        return;
    }
    else if(author.value == ""){
        alert("Vui lòng nhập tên tác giả!");
        return;
    }
    else if(genre.value == "sample"){
        alert("Vui lòng chọn thể loại sách!");
        return;
    }
    else if(cost.value < 1000){
        alert("Vui lòng nhập giá tiền sách! Số tiền phải lớn hơn 1000vnđ");
        return;
    }
    else if(status.value == "sample"){
        alert("Vui lòng tình trạng sách!");
        return;
    }
    else if(describe.value == ""){
        alert("Vui lòng nhập thông tin mô tả sách!");
        return;
    }
    const product = {
        img_book : img_book,
        book_name : book_name,
        author : author,
        genre : genre,
        cost : cost,
        status : status,
        describe : describe
    }
    const data = JSON.stringify(product);
    localStorage.setItem(product, data);
    window.location.href = "nguoidung.html"
}

// end đăng bán

