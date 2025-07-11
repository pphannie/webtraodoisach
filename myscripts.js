
function calculateTotal() {
var prices=document.querySelectorAll('.item-price');
var total=0;
for(var i=0;i<prices.length;i++){
      var priceText = prices[i].textContent.trim();
      priceText = priceText.replace(/[^\d]/g, ''); // bỏ ký tự không phải số
      total += parseInt(priceText);
}
document.getElementById('total-price').innerHTML=total.toLocaleString('vi-VN') + 'đ';
}
document.addEventListener('DOMContentLoaded', function() {
  calculateTotal();
});