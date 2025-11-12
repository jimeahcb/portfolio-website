// footer copyright year update
document.getElementById("year").textContent = new Date().getFullYear();

// mobile menu toggle 
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => navMenu.classList.toggle("show"));

// carousel handling
const track = document.querySelector(".carousel-track");
if (track) {
  let slides = Array.from(track.children);
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  // clone first and last slides for seamless looping
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  slides = Array.from(track.children);
  let currentIndex = 1; // start at first real slide
  let slideWidth = slides[0].getBoundingClientRect().width;

  // position track initially
  track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  function updateCarousel(animate = true) {
    track.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }

  nextBtn.addEventListener("click", () => {
    if (currentIndex >= slides.length - 1) return;
    currentIndex++;
    updateCarousel();
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex <= 0) return;
    currentIndex--;
    updateCarousel();
  });

  // handle looping at edges
  track.addEventListener("transitionend", () => {
    if (slides[currentIndex].isSameNode(firstClone)) {
      currentIndex = 1;
      updateCarousel(false);
    } else if (slides[currentIndex].isSameNode(lastClone)) {
      currentIndex = slides.length - 2;
      updateCarousel(false);
    }
  });

  // handle window resizing
  window.addEventListener("resize", () => {
    // get new slide width after resize
    slideWidth = slides[0].getBoundingClientRect().width;
    // reposition correctly to keep the current slide centered
    updateCarousel(false);
  });

  // swipe support for mobile
  let startX = 0;
  track.addEventListener("touchstart", e => (startX = e.touches[0].clientX));
  track.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) prevBtn.click();   // swipe right
    if (startX - endX > 50) nextBtn.click();   // swipe left
  });
}

// accordion functionality
const acc = document.querySelectorAll(".accordion");
acc.forEach(btn => {
  btn.addEventListener("click", () => {
    const panel = btn.nextElementSibling;
    const isOpen = panel.classList.contains("open");

    if (isOpen) {
      // collapse
      panel.style.maxHeight = panel.scrollHeight + "px"; 
      requestAnimationFrame(() => {
        panel.style.maxHeight = "0px";
      });
      panel.classList.remove("open");
    } else {
      // expand
      panel.classList.add("open");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

// fix for navbar anchors with expanding accordion sections 
const navLinksFixed = document.querySelectorAll('.nav-links a[href^="#"]');
navLinksFixed.forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();

      // smooth scroll with recalculation after a short delay
      window.scrollTo({
        top: target.offsetTop - 80, // adjust offset for sticky header
        behavior: 'smooth'
      });

      // after accordion transitions finish, adjust position again
      setTimeout(() => {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }, 600);
    }
  });
});

// active nav bar highlights
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function updateActiveLink() {
  const scrollPos = window.scrollY + window.innerHeight * 0.45; 
  let currentSection = sections[0].getAttribute("id");

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => link.classList.remove("active"));
  const activeLink = document.querySelector(`.nav-links a[href="#${currentSection}"]`);
  if (activeLink) activeLink.classList.add("active");
}

// run once on load
updateActiveLink();

// update on scroll
window.addEventListener("scroll", updateActiveLink);

// re-check after smooth scroll finishes
let scrollTimeout;
window.addEventListener("scroll", () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(updateActiveLink, 200);
});

// make sure clicking a link triggers a recheck after scroll animation
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    setTimeout(updateActiveLink, 600);
  });
});
