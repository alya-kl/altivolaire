const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    // Toggle mobile menu visibility
    document.body.classList.toggle("show-mobile-menu");
});

// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click());

// Close menu when the nav link is clicked
navLinks.forEach(link => {
    link.addEventListener("click", () => menuOpenButton.click());
});

/* Kind Words Script */

// Rating bintang
const kwStarElements = document.querySelectorAll("#star-rating span");
let kwCurrentRating = 0;

kwStarElements.forEach((star) => {
    star.addEventListener("click", () => {
        kwCurrentRating = parseInt(star.getAttribute("data-rating"));
        kwUpdateStars();
    });
});

function kwUpdateStars() {
    kwStarElements.forEach((star) => {
        if (parseInt(star.getAttribute("data-rating")) <= kwCurrentRating) {
            star.classList.add("active");
        } else {
        star.classList.remove("active");
        }
    });
}

// Elemen DOM
const kwNameInput = document.getElementById("name");
const kwCommentInput = document.getElementById("comment");
const kwSubmitBtn = document.getElementById("submit");
const kwContainer = document.getElementById("testimonial-container");
const kwDotsContainer = document.getElementById("dots-container");
const kwPrevBtn = document.getElementById("prev");
const kwNextBtn = document.getElementById("next");

// Ambil data komentar dari localStorage atau buat array kosong
let kwTestimonials = JSON.parse(localStorage.getItem("kindword_comments")) || [];


// Tentukan pageSize berdasarkan ukuran layar
function getPageSize() {
if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 900) return 2;
    return 4;
}

let kwPageSize = getPageSize();
let kwCurrentPage = 0;

function kwRenderTestimonials() {
    kwContainer.innerHTML = "";
    kwPageSize = getPageSize();
    const pages = Math.ceil(kwTestimonials.length / kwPageSize);

    for (let i = 0; i < pages; i++) {
        const pageDiv = document.createElement("div");
        pageDiv.classList.add("testimonial-page");

        const start = i * kwPageSize;
        const end = start + kwPageSize;
        const currentTestimonials = kwTestimonials.slice(start, end);

        // Tambahkan placeholder jika kurang dari pageSize
        while (currentTestimonials.length < kwPageSize) {
            currentTestimonials.push({ placeholder: true });
        }

        currentTestimonials.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("testimonial");

        if (item.placeholder) {
            div.classList.add("placeholder");
        } else {
            div.innerHTML = `
                <div class="name">${item.name}</div>
                <div class="rating-time">
                    <div class="stars">${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</div>
                    <div><span class="date">${item.date || ""}</span> <span class="time">${item.time || ""}</span></div>
                </div>
                <div class="comment">${item.comment}</div>
                `;
            }
            pageDiv.appendChild(div);
        });
        kwContainer.appendChild(pageDiv);
    }

    // Buat dot
    kwDotsContainer.innerHTML = "";
    for (let i = 0; i < pages; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === kwCurrentPage) dot.classList.add("active");
        dot.dataset.index = i;
        dot.addEventListener("click", () => {
        kwScrollToPage(i);
        });
        kwDotsContainer.appendChild(dot);
    }

    kwUpdateActiveDot(kwCurrentPage);
}

// Deteksi perubahan ukuran layar
window.addEventListener("resize", () => {
    kwRenderTestimonials();
});

// Update dot aktif
function kwUpdateActiveDot(index) {
    const dots = document.querySelectorAll(".kindword-section .dot");
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
}

// Scroll ke halaman tertentu
function kwScrollToPage(index) {
    kwContainer.scrollTo({ left: index * kwContainer.offsetWidth, behavior: "smooth" });
    kwCurrentPage = index;
    kwUpdateActiveDot(index);
}

// Submit komentar
kwSubmitBtn.addEventListener("click", () => {
    if (kwNameInput.value && kwCommentInput.value && kwCurrentRating > 0) {
        const now = new Date();
        const newComment = {
            name: kwNameInput.value,
            comment: kwCommentInput.value,
            rating: kwCurrentRating,
            date: now.toLocaleDateString('id-ID'),
            time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

    // Masukkan di awal agar muncul paling atas
    kwTestimonials.unshift(newComment);
    localStorage.setItem("kindword_comments", JSON.stringify(kwTestimonials));

    kwRenderTestimonials();
    kwNameInput.value = "";
    kwCommentInput.value = "";
    kwCurrentRating = 0;
    kwUpdateStars();
  }
});

// Navigasi panah
kwPrevBtn.addEventListener("click", () => {
    if (kwCurrentPage > 0) {
        kwCurrentPage--;
        kwScrollToPage(kwCurrentPage);
    }
});

kwNextBtn.addEventListener("click", () => {
    const pages = Math.ceil(kwTestimonials.length / kwPageSize);
    if (kwCurrentPage < pages - 1) {
        kwCurrentPage++;
        kwScrollToPage(kwCurrentPage);
    }
});

// Sinkronisasi dot saat scroll
kwContainer.addEventListener("scroll", () => {
    const index = Math.round(kwContainer.scrollLeft / kwContainer.offsetWidth);
    kwUpdateActiveDot(index);
    kwCurrentPage = index;
});

// Jalankan pertama kali
kwRenderTestimonials();

const instagramLink = document.getElementById("instagram-link");
const toast = document.getElementById("toast");
const igUsername = "@altivolaire";

instagramLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(igUsername)
        .then(() => {
            showToast(`${igUsername} disalin`);
            setTimeout(() => {
                window.open(`https://instagram.com/${igUsername.replace("@", "")}`, "_blank");
            }, 400);
        })
        .catch(() => {
            showToast("Gagal menyalin username");
            window.open(`https://instagram.com/${igUsername.replace("@", "")}`, "_blank");
        });
    });

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
