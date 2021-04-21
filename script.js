"use strict";
//All the Selected elements
// const modal = document.querySelector(".modal");
// const overlay = document.querySelector(".overlay");
// const btnOpenModal = document.querySelectorAll(".btn--show-modal");
// const btnCloseModal = document.querySelector(".btn--close-modal");
const btnLearnMore = document.querySelector(".btn--scroll-to");
const header = document.querySelector(".header");
const firstSection = document.getElementById("section--1");
const navLinks = document.querySelector(".nav__links");
const navBar = document.querySelector(".nav");
const tabContainer = document.querySelector(".operations__tab-container");
const btnTabs = document.querySelectorAll(".operations__tab");
const tabContents = document.querySelectorAll(".operations__content");
//Slider
const allSlide = document.querySelectorAll(".slide");
const btnSliderRight = document.querySelector(".slider__btn--right");
const btnSliderLeft = document.querySelector(".slider__btn--left");
const dotContainer = document.querySelector(".dots");

//----------------------------------Open And Close modal JS Starts
class Modal {
  constructor() {
    this.modal = document.querySelector(".modal");
    this.overlay = document.querySelector(".overlay");
    this.btnOpenModal = document.querySelectorAll(".btn--show-modal");
    this.btnCloseModal = document.querySelector(".btn--close-modal");
    this.events();
  }

  openModal(e) {
    e.preventDefault();
    this.modal.classList.remove("hidden");
    this.overlay.classList.remove("hidden");
    e.stopPropagation();
  }

  events() {
    this.btnOpenModal.forEach(btn => btn.addEventListener("click", this.openModal));
  }
}
const modal = new Modal();

// const openModal = function (e) {
//   e.preventDefault();
//   modal.classList.remove("hidden");
//   overlay.classList.remove("hidden");
//   e.stopPropagation();
// };

// const closeModal = function () {
//   modal.classList.add("hidden");
//   overlay.classList.add("hidden");
// };

// btnOpenModal.forEach(btn => btn.addEventListener("click", openModal));
// //Close Modal
// btnCloseModal.addEventListener("click", closeModal);
// overlay.addEventListener("click", closeModal);
// document.addEventListener("keydown", e => {
//   if (e.key === "Escape" && !modal.classList.contains("hidden")) {
//     closeModal();
//   }
// });

//----------------------------------Smooth Scrolling Effect on LearnMore Button Starts
//Modern Way : Doesn't support on old browsers
btnLearnMore.addEventListener("click", e => {
  firstSection.scrollIntoView({ behavior: "smooth" });
});

//----------------------------------Smooth Scrolling Effect on navigation :EventDelegation
//With Event Delegation
//Add evenListenter to common parent Element
//Determine what Element Originated the event

navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  //Matching strategy: only the elements we r interested in
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    if (id === "#") return; // Guard Clause
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//----------------------------------MouseOver hover Effect on Navigation
const mouseOverEffect = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach(curEl => {
      if (link !== curEl) curEl.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

navLinks.addEventListener("mouseover", mouseOverEffect.bind(0.5));
navLinks.addEventListener("mouseout", mouseOverEffect.bind(1));

//-----------------------Sticky Navigation: Intersection Observer API
const heightNav = navBar.getBoundingClientRect(); //Dynamically calculating the height of Nav
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navBar.classList.add("sticky");
  else navBar.classList.remove("sticky");
};
const stickyNavOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${heightNav.height}px`,
};
const headerObserver = new IntersectionObserver(stickyNav, stickyNavOption);
headerObserver.observe(header);

//--------------------------------------Tabbed Componenets
tabContainer.addEventListener("click", function (e) {
  const btn = e.target.closest(".operations__tab"); //Event delegation goes upward and find that element

  //Guard Clause
  if (!btn) return; //Will exit if click happens outside of btn

  //Active btnTab
  btnTabs.forEach(bTabs => bTabs.classList.remove("operations__tab--active")); //Removes the active class from all tab
  btn.classList.add("operations__tab--active"); //Adding active class on the clicked tab

  //Activate The btnTab content
  tabContents.forEach(tContent => tContent.classList.remove("operations__content--active"));
  document
    .querySelector(`.operations__content--${btn.getAttribute("data-tab")}`) //select the element according to btn click
    .classList.add("operations__content--active"); //Add the class to selected element
});

//---------------------------------------Reveal Sections On Scroll
const allSection = document.querySelectorAll(".section");

const revealSection = function (entries) {
  const [entry] = entries;

  //Gurad Clause
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");

  allSectionObserver.unobserve(entry.target); //Unobserving after observing increase Performance
};
const allSectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});
allSection.forEach(section => {
  allSectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

//--------------------------------------Lazy Loading Images ::Optimizing img >>Huge performanxe issue
const alllazyImages = document.querySelectorAll("img[data-src]");

const lazyLoadImg = function (entries) {
  const [entry] = entries;

  //Guard Clause
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.getAttribute("data-src"); //Replace the img> it emitts the load events behind the scene
  //After loading the new img do something
  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img"); //remove blur class
  });
  observeImgSection.unobserve(entry.target); //unobserve the images
};
const observeImgSection = new IntersectionObserver(lazyLoadImg, {
  root: null,
  threshold: 0.3,
});
alllazyImages.forEach(img => observeImgSection.observe(img));

//---------------------------------------Building Slider Component
let curSlide = 0;

//Create Dot Buttons
const createDots = function () {
  allSlide.forEach((_, i) => {
    const button = `<button class="dots__dot" data-slide="${i}"> </button>`;
    dotContainer.insertAdjacentHTML("beforeend", button);
  });
};

//----Clicking dot Button Functionality
//dot btnActiveClass
const dotBtnActive = function (cSlide) {
  dotContainer.querySelectorAll(".dots__dot").forEach(dot => {
    dot.classList.remove("dots__dot--active");
  });
  dotContainer
    .querySelector(`.dots__dot[data-slide="${cSlide}"]`)
    .classList.add("dots__dot--active");
};

const dotBtnFunction = function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const curSlide = e.target.getAttribute("data-slide");
    goToNextSlide(curSlide);
    dotBtnActive(curSlide);
  }
};

//Changing Slide Calculation
const goToNextSlide = function (slideNo) {
  allSlide.forEach((slide, i) => {
    slide.style.transform = `translate(${100 * (i - slideNo)}%)`;
  });
};

//Changing Slides Functionalities
const nextSlide = function () {
  if (allSlide.length - 1 === curSlide) curSlide = 0;
  else curSlide++;
  goToNextSlide(curSlide); //-100%,0%,100%,200%......
  dotBtnActive(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) curSlide = allSlide.length - 1;
  else curSlide--;
  goToNextSlide(curSlide);
  dotBtnActive(curSlide);
};

const sliderArrowKeyPress = function (e) {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
};

const init = function () {
  goToNextSlide(0); //0%,100%,200%,300%
  createDots();
  dotBtnActive(0);
};
init();

//Event Listeners
btnSliderRight.addEventListener("click", nextSlide);
btnSliderLeft.addEventListener("click", prevSlide);
document.addEventListener("keydown", sliderArrowKeyPress);
dotContainer.addEventListener("click", dotBtnFunction);
