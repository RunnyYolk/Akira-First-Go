// Select the div containing all the images
// var div = document.getElementById("images");
// Add all the image containers to var images
var images = [].slice.call(document.getElementsByClassName("imageContainer"));
var sliders = [].slice.call(document.getElementsByClassName('sliderControlLi'));
var infoBtn = false;
var prev = -1;
var active = 0;
var next = 1;

sliders[active].id = "focus";

function infoTog (){
  if (!infoBtn) {
    document.querySelector(".info-container").className = "info-container-open";
    document.querySelector(".pageFade").className = "pageFadeOn";
    document.querySelector(".infoTextContainer").className = "infoTextContainerOpen";
    infoBtn = true
  } else {
    document.querySelector(".info-container-open").className = "info-container";
    document.querySelector(".pageFadeOn").className = "pageFade";
    document.querySelector(".infoTextContainerOpen").className = "infoTextContainer";
    infoBtn = false
  }
};

function throttle (callback, limit) {
  var wait = false;
  return function () {
    if (!wait) {
      callback.call();
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  }
}

document.querySelector(".info-icon-container").addEventListener("click", infoTog);
document.querySelector(".pageFade").addEventListener("click", infoTog);
// Listen for keypress
// document.addEventListener("keydown", function (e) {
//   var key = e.which || e.keyCode;
//   if (next > 0 && next < images.length && (key === 40 || key === 32)) { //up arrow
//     //move active image up
//     images[active].className = "imageContainer above";
//     // move next image up
//     images[next].className = "imageContainer active";
//     sliders[active].id = "";
//     sliders[next].id = "focus";
//     // change next image to active image
//     active++;
//     // line-up the next immage
//     next++;
//     // pile-up the last image
//     prev++;
//   } else if (next > 1 && next <= images.length && key === 38) { //down arrow
//     //move active image down
//     images[active].className = "imageContainer below";
//     //move prev image down
//     images[prev].className = "imageContainer active";
//     sliders[active].id = "";
//     sliders[prev].id = "focus";
//     //change prev image to active
//     active--;
//     //line up next image
//     next--;
//     //pile-up the last image
//     prev--;
//   }
//   if (active == 0) {
//     document.getElementById("titleBar").className = "titleBar-main";
//   } else {
//     document.getElementById("titleBar").className = "titleBar-up"
//   }
// });

var lastScrollTop = pageYOffset;

function scrollFunc () {
  var st = window.scrollY;
  if (next > 0 && next < images.length && st > lastScrollTop) {
    console.log("scroll up!");
    console.log(st);
    // document.querySelector(".main-container").scrollIntoView();
    //move active image up
    images[active].className = "imageContainer above";
    // move next image up
    images[next].className = "imageContainer active";
    sliders[active].id = "";
    sliders[next].id = "focus";
    // change next image to active image
    active++;
    // line-up the next immage
    next++;
    // pile-up the last image
    prev++;
  } else if (next > 1 && next <= images.length && st < lastScrollTop) {
    console.log("scroll down!");
    console.log(st);
    // document.querySelector(".main-container").scrollIntoView();
    //move active image down
    images[active].className = "imageContainer below";
    //move prev image down
    images[prev].className = "imageContainer active";
    sliders[active].id = "";
    sliders[prev].id = "focus";
    //change prev image to active
    active--;
    //line up next image
    next--;
    //pile-up the last image
    prev--;
  }
  lastScrollTop = st;
  if (active == 0) {
    document.getElementById("titleBar").className = "titleBar-main";
  } else {
    document.getElementById("titleBar").className = "titleBar-main";
    document.getElementById("titleBar").className = "titleBar-up";
  }
};

window.addEventListener("scroll", throttle(scrollFunc, 1000));
