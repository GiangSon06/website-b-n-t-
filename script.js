// Bạn có thể thêm các hiệu ứng sau này
console.log("Website demo bán ô tô đã load xong!");
// Demo JS cho hiệu ứng nhỏ
document.addEventListener("DOMContentLoaded", () => {
  console.log("Website đã load xong!");
});
// 1. Tìm kiếm sản phẩm
const searchInput = document.querySelector("header .search input");
const products = document.querySelectorAll(".product");

searchInput.addEventListener("keyup", function () {
  const keyword = this.value.toLowerCase();
  products.forEach((product) => {
    const name = product.querySelector(".name").textContent.toLowerCase();
    if (name.includes(keyword)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
});

// 2. Xem chi tiết sản phẩm (modal popup)
document.querySelectorAll(".product").forEach((product) => {
  product.addEventListener("click", () => {
    const name = product.querySelector(".name").textContent;
    const price = product.querySelector(".price").textContent;
    const imgSrc = product.querySelector("img").src;

    showModal(name, price, imgSrc);
  });
});

function showModal(name, price, imgSrc) {
  // Tạo modal
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <img src="${imgSrc}" alt="${name}" style="max-width:100%; border-radius:8px;" />
      <h2>${name}</h2>
      <p><strong>Giá:</strong> ${price}</p>
      <p>Chi tiết đang cập nhật...</p>
    </div>
  `;

  document.body.appendChild(modal);

  // Đóng modal
  modal.querySelector(".close").addEventListener("click", () => {
    modal.remove();
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}

// 3. Sticky header
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});

// 4. Nút cuộn lên đầu trang
const scrollBtn = document.createElement("button");
scrollBtn.textContent = "⬆ Lên đầu";
scrollBtn.classList.add("scroll-top");
document.body.appendChild(scrollBtn);

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});
// Gắn sự kiện cho tất cả checkbox
document.querySelectorAll(".filter-options input").forEach((input) => {
  input.addEventListener("change", filterCars);
});

// Hàm lấy giá trị các checkbox theo tên nhóm
function getCheckedValues(groupName) {
  const group = Array.from(document.querySelectorAll(".filter-group"));
  let values = [];
  group.forEach((g) => {
    if (g.querySelector("h4").textContent.includes(groupName)) {
      values = Array.from(g.querySelectorAll("input:checked")).map(
        (cb) => cb.value
      );
    }
  });
  return values;
}

function filterCars() {
  const products = document.querySelectorAll(".product");

  // Lấy các giá trị filter đã chọn
  const selectedBrands = getCheckedValues("Thương Hiệu");
  const selectedPrices = getCheckedValues("Mức Giá");
  const selectedColors = getCheckedValues("Màu Xe").map((c) => c.toLowerCase());
  const selectedYears = getCheckedValues("Năm Sản Xuất");
  const showSoldOnly = document.querySelector('input[value="sold"]')?.checked;

  // Giá trị từ range
  const priceRangeInput = document.querySelector(".range-container input");
  const maxRange = priceRangeInput ? parseInt(priceRangeInput.value) : Infinity;

  products.forEach((product) => {
    const brand = product.dataset.brand;
    const price = parseInt(product.dataset.price); // giá theo triệu
    const color = product.dataset.color.toLowerCase();
    const year = product.dataset.year;
    const sold = product.dataset.sold === "true";

    let visible = true;

    // Thương hiệu
    if (selectedBrands.length > 0 && !selectedBrands.includes(brand)) {
      visible = false;
    }

    // Mức giá (checkbox)
    if (visible && selectedPrices.length > 0) {
      let inRange = false;
      for (let p of selectedPrices) {
        if (p === "500" && price < 500) inRange = true;
        if (p === "1000" && price >= 500 && price <= 1000) inRange = true;
        if (p === "2000" && price > 1000 && price <= 2000) inRange = true;
        if (p === "2001" && price > 2000) inRange = true;
      }
      if (!inRange) visible = false;
    }

    // Màu xe
    if (
      visible &&
      selectedColors.length > 0 &&
      !selectedColors.includes(color)
    ) {
      visible = false;
    }

    // Năm sản xuất
    if (visible && selectedYears.length > 0 && !selectedYears.includes(year)) {
      visible = false;
    }

    // Xe đã bán
    if (visible && showSoldOnly && !sold) {
      visible = false;
    }

    // Range giá
    if (visible && price > maxRange) {
      visible = false;
    }

    // Hiện/ẩn
    product.style.display = visible ? "block" : "none";
  });
}

// Lấy danh sách checkbox đã tick trong 1 nhóm
function getCheckedValues(groupName) {
  let group = Array.from(document.querySelectorAll(".filter-block h4")).find(
    (h4) => h4.textContent.trim().startsWith(groupName)
  );
  if (!group) return [];
  let inputs = group.nextElementSibling.querySelectorAll("input:checked");
  return Array.from(inputs).map((i) => i.value);
}

// Mở/đóng filter
function toggleFilter(header) {
  const options = header.nextElementSibling;
  const arrow = header.querySelector(".arrow");

  if (options.style.display === "block") {
    options.style.display = "none";
    arrow.classList.remove("rotate");
  } else {
    options.style.display = "block";
    arrow.classList.add("rotate");
  }
}

// Gắn sự kiện onchange
document.querySelectorAll(".filter-options input").forEach((cb) => {
  cb.addEventListener("change", filterCars);
});

// Range giá
const rangeInput = document.querySelector(".range-container input");
if (rangeInput) {
  rangeInput.addEventListener("input", (e) => {
    const label = e.target.nextElementSibling;
    label.textContent = `0 ₫ – ${e.target.value * 1_000_000} ₫`;
    filterCars();
  });
}

// Chạy lần đầu
window.addEventListener("DOMContentLoaded", filterCars);
