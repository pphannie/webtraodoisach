const bookList = document.getElementById("bookList");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentIndex = 0;

function getBookWidth() {
  const book = bookList.querySelector(".book");
  const style = window.getComputedStyle(book);
  const marginLeft = parseInt(style.marginLeft) || 0;
  const marginRight = parseInt(style.marginRight) || 0;
  return book.offsetWidth + marginLeft + marginRight;
}

function getMaxIndex() {
  const books = bookList.children.length;
  const itemsPerView = getItemsPerView();
  return books - itemsPerView;
}

function getItemsPerView() {
  const width = window.innerWidth;
  if (width >= 1024) return 5;
  if (width >= 768) return 3;
  return 1;
}

function updateCarousel() {
  const bookWidth = getBookWidth();
  const offset = currentIndex * bookWidth;
  bookList.style.transform = `translateX(-${offset}px)`;
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
  currentIndex = 0; // Reset về đầu khi resize để tránh lỗi lệch
  updateCarousel();
});
