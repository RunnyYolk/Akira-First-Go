window.addEventListener("scroll", function(){
  var st = window.pageYOffset || document.documentElement.scrollTop;
  if (next > 0 && next < images.length && st > lastScrollTop) {
    console.log("scroll up!");
  } else (next > 1 && next <= images.length && st < lastScrollTop) {
    console.log("scroll down!");
});
