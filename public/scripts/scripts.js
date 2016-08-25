// Select the div containing all the images
// var div = document.getElementById("images");
// Add all the image containers to var images
var images = [].slice.call(document.getElementsByClassName("imageContainer"));
var prev = -1
var active = 0
var next = 1

// Listen for keypress
document.addEventListener("keydown", function (e) {
  var key = e.which || e.keyCode;
  if (next > 0 && next < images.length && (key === 38 || key === 32)) { //up arrow
    //move active image up
    images[active].className = "imageContainer above";
    // move next image up
    images[next].className = "imageContainer active";
    // change next image to active image
    active++;
    // line-up the next immage
    next++;
    // pile-up the last image
    prev++;
  } else if (next > 1 && next <= images.length && key===40) { //down arrow
    //move active image down
    images[active].className = "imageContainer below";
    //move prev image down
    images[prev].className = "imageContainer active";
    //change prev image to active
    active--;
    //line up next image
    next--;
    //pile-up the last image
    prev--;
  }
  if (active == 0) {
    document.getElementById("titleBar").className = "titleBar-main";
  } else {
    document.getElementById("titleBar").className = "titleBar-up"
  }
  console.log(prev);
  console.log(active);
  console.log(next);
});


//   Change class to inactive and active
//   Move the pagination indicators
// At the end of the array, render index.ejs
