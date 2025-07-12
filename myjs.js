const bookList = document.getElementById("tcbookList");
const nextBtn = document.getElementById("tcnextBtn");
const prevBtn = document.getElementById("tcprevBtn");

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

// Move forward by 1 book
nextBtn.addEventListener("click", () => {
  const maxIndex = getMaxIndex();
  if (currentIndex < maxIndex) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarousel();
});

// Move backward by 1 book
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

window.addEventListener("load", () => {
  updateCarousel();
});
