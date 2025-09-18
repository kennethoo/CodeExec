let options = {
  root: document.querySelector(".feeed"),
  rootMargin: "0px",
  threshold: 1.0,
};

let target = document.querySelectorAll(".post-box");
let observer = new IntersectionObserver(callback, options);
function callback(entries) {
  entries.forEach((entry) => {});
}
observer.observe(target);
