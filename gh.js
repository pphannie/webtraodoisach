let cart = JSON.parse(localStorage.getItem('gioHang')) || [];

const cartContainer = document.getElementById('cart-container');
const totalPriceEl = document.getElementById('total-price');
const selectAll = document.getElementById('select-all');

function renderCart() {
cartContainer.innerHTML = '';
let total = 0;

if (cart.length === 0) {
    cartContainer.innerHTML = `<p>Giỏ hàng của bạn đang trống.</p>`;
    totalPriceEl.textContent = `Tổng tiền: 0 đ`;
    return;
}

cart.forEach((item, index) => {
    const thanhTien = item.soLuongbatdau * item.gia;
    total += thanhTien;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
        <div class="checkbox">
            <input type="checkbox" class="item-checkbox" data-index="${index}" onchange="updateSelectedTotal()">
        </div>
        <div class="image">
            <img src="${item.anh || 'https://via.placeholder.com/60x80?text=No+Image'}" alt="Ảnh sách">
        </div>
        <div class="info">
            <div class="name"><strong>${item.tenSach}</strong></div>
            <div class="author">Tác giả: ${item.tacGia}</div>
            <div class="price">Đơn giá: ${item.gia.toLocaleString()} đ</div>
            <div class="quantity">
            Số lượng:
            <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
            ${item.soLuongbatdau}
            <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
            </div>
            <div class="total">Thành tiền: ${(item.soLuongbatdau * item.gia).toLocaleString()} đ</div>
        </div>
        <div class="remove">
            <span class="remove-btn" onclick="removeItem(${index})">🗑️</span>
        </div>
    `;
    cartContainer.appendChild(itemDiv);
});
}

//Nút tăng giảm lượng sách
function changeQty(index, delta) {
    const item = cart[index];
    const newQty = item.soLuongbatdau + delta;

    if (delta === -1 && newQty >= 1) {
        item.soLuongbatdau = newQty;
        updateCart();
        return;
    }

    const maxQty = Number(item.soLuong) || Infinity;
    if (delta === 1 && newQty <= maxQty) {
        item.soLuongbatdau = newQty;
        updateCart();
        updateSelectedTotal();
    } else if (delta === 1 && newQty > maxQty) {
        alert(`⚠️ Bạn chỉ có thể chọn tối đa ${maxQty} sản phẩm.`);
    }
}

//xóa từng sách
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

//cập nhật lại giỏ hàng
function updateCart() {
    localStorage.setItem('gioHang', JSON.stringify(cart));
    renderCart();
}

//nút xóa tất cả sản phẩm
function clearSelected() {
    const selected = document.querySelectorAll('.item-checkbox:checked');
    if (selected.length === 0) return;

    const indexes = [...selected].map(cb => parseInt(cb.dataset.index));
    cart = cart.filter((_, i) => !indexes.includes(i));
    updateCart();
}

//chỉ thanh toán sản phẩm đã chọn
selectAll.addEventListener('change', function () {
    document.querySelectorAll('.item-checkbox').forEach(cb => cb.checked = this.checked);
    updateSelectedTotal();
});

//Tổng tiền
function updateSelectedTotal() {
    let total = 0;
    const checkboxes = document.querySelectorAll('.item-checkbox:checked');

    checkboxes.forEach(cb => {
        const index = parseInt(cb.dataset.index);
        const item = cart[index];
        total += item.soLuongbatdau * item.gia;
    });

    totalPriceEl.textContent = `Tổng tiền: ${total.toLocaleString()} đ`;
}

//Thanh toán//
function confirmExchange() {
    const user = JSON.parse(localStorage.getItem('nguoiDungDangNhap'));

    // ❌ Chưa đăng nhập
    if (!user) {
        const hasAccount = confirm("⚠️ Bạn cần đăng nhập để thanh toán.\nBạn đã có tài khoản chưa?");
        if (hasAccount) {
            window.location.href = "dangnhap.html";
        } else {
            window.location.href = "dangky.html";
        }
        return;
    }

    // 🔍 Kiểm tra có chọn sách nào chưa
    const selected = document.querySelectorAll('.item-checkbox:checked');
    if (selected.length === 0) {
        alert("⚠️ Vui lòng chọn ít nhất một sách để thanh toán.");
        return;
    }
    
    // Lưu danh sách các sách được chọn
    const selectedIndexes = [...selected].map(cb => parseInt(cb.dataset.index));
    const selectedBooks = selectedIndexes.map(i => cart[i]);

    localStorage.setItem('sachThanhToan', JSON.stringify(selectedBooks));

    // ✅ Đã đăng nhập + đã chọn sách
    window.location.href = "thanhtoan.html";
}

renderCart();
updateSelectedTotal();