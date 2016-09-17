
var images = [].slice.call(document.getElementsByClassName("imageContainer"));
var sliders = [].slice.call(document.getElementsByClassName("sliderControlLi"));
var infoBtn = false;
var prev = -1;
var active = 0;
var next = 1;
var scroller = document.getElementsByClassName("scroller");
var scrollOn = true;
var delta;

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

// Event listenere for click on info icon
document.querySelector(".info-icon-container").addEventListener("click", infoTog);
document.querySelector(".pageFade").addEventListener("click", infoTog);

//Event listener for slider controls click
sliders.forEach(function (sl, i){
  sl.addEventListener("click", function(){ // On click
    sliders.forEach(function (sldr, x){
      sldr.id = ""
    });
    console.log("you clicked slider controler " + i + "!");
    images.forEach(function (img, n){
      if(n<i){
        img.className = "imageContainer above" // change all imageContainer with data-image < this data-slider to class above
      } else if (n>i){
        img.className = "imageContainer below" // change all imageContainer with data-image > this data-slider to class below
      }
    });
    images[i].className = "imageContainer active"; // change the imageContainer with data-image === this data-slider to class active
    sl.id = "focus";
    prev = (i-1);
    active = i;
    next = (i+1);
    checkTitleBar()
  });
});

if (window.addEventListener) {
	window.addEventListener("mousewheel", MouseWheelHandler, false); // IE9, Chrome, Safari, Opera
	window.addEventListener("DOMMouseScroll", MouseWheelHandler, false); // Firefox
} else {
  window.attachEvent("onmousewheel", MouseWheelHandler, false); // IE 6/7/8
}

function MouseWheelHandler(e) {
  if(scrollOn){
    // cross-browser wheel delta
  	var e = window.event || e; // old IE support
  	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if(delta == -1){
      scrollUp();
      console.log(delta)
    } else if(delta == 1) {
      scrollDown();
      console.log(delta)
    }
  }
}

// Variablea for capturing swipe / scroll actions on touch devices
var startX,
    startY,
    dist,
    downThreshold = 150, //required min distance traveled to be considered swipe
    upThreshold = -150, //required min distance traveled to be considered swipe
    allowedTime = 250, // maximum time allowed to travel that distance
    elapsedTime,
    startTime;

window.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
    }, false)

window.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        dist = touchobj.pageY - startY // get total dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
        if(elapsedTime <= allowedTime && dist >= downThreshold && Math.abs(touchobj.pageX - startX) <= 100){
          scrollDown();
          console.log('scroll down')
        } else if(elapsedTime <= allowedTime && dist <= upThreshold && Math.abs(touchobj.pageX - startX) <= 100){
          scrollUp();
          console.log('scroll up')
        }
    }, false)

document.onkeydown = keydown

function keydown(k){
  if(k.keyCode === 38){
    scrollDown();
  } else if(k.keyCode === 40 || k.keyCode === 32){
    scrollUp();
  }
};

function scrollUp(){
    if (next > 0 && next < images.length) {
      images[active].className = "imageContainer above";
      images[next].className = "imageContainer active";
      sliders[active].id = "";
      sliders[next].id = "focus";
      active++;
      next++;
      prev++;
      scrollOn = false;
      setTimeout(function(){
        scrollOn = true;
      }, 1100);
      checkTitleBar();
    } else if(next === images.length){
      scrollOn = false;
      images[active].className = "imageContainer above";
      if(infoBtn){
        document.querySelector(".info-container-open").className = "info-container";
        document.querySelector(".pageFadeOn").className = "pageFade";
        document.querySelector(".infoTextContainerOpen").className = "infoTextContainer";
        infoBtn = false;
      }
      setTimeout(function(){
        document.querySelector(".info-icon-container").className = "info-icon-container-hidden";
        document.querySelector(".close-icon-container").className = "close-icon-container-hidden";
        document.querySelector(".sliderControls").className = "sliderControls-hidden";
        document.querySelector(".titleBar-up").className = "titleBar-up-hidden";
        document.querySelector(".index-container").className = "index-container show-no-scroll";
      }, 500);
      setTimeout(function(){
        document.querySelector(".show-no-scroll").className = "index-container show"
      }, 1000);
    }
  }

function scrollDown(){
  if (next > 1 && next <= images.length) {
      images[active].className = "imageContainer below";
      images[prev].className = "imageContainer active";
      sliders[active].id = "";
      sliders[prev].id = "focus";
      active--;
      next--;
      prev--;
      scrollOn = false;
      setTimeout(function(){
        scrollOn = true;
      }, 1100);
    }
    checkTitleBar();
  }

function checkTitleBar(){
  if (active == 0) {
    document.getElementById("titleBar").className = "titleBar-main";
  } else {
    document.getElementById("titleBar").className = "titleBar-up";
  }
}
