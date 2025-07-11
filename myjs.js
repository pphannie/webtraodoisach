const track = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const itemsPerPage = 3;             // Hiển thị 3 mục mỗi lần
const itemWidth = 115;              // Chiều rộng mỗi mục (100px + 2x5px margin)
const totalItems = track.children.length;

// Tính số lần cuộn tối đa
const maxIndex = Math.ceil(totalItems / itemsPerPage) - 1;

let currentPage = 0;

function updateCarousel() {
  const offset = currentPage * itemsPerPage * itemWidth;
  track.style.transform = `translateX(-${offset}px)`;
}

prevBtn.addEventListener("click", () => {
  currentPage--;
  if (currentPage < 0) {
    currentPage = maxIndex; // Quay về trang cuối
  }
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  if (currentPage > maxIndex) {
    currentPage = 0; // Quay về đầu
  }
  updateCarousel();
});


window.onscroll = function () {
    const btn = document.getElementById("btn-top");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  };

  // Cuộn mượt lên đầu khi bấm nút
  document.getElementById("btn-top").addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });