let font1, font2,
  showGrid = false,
  slider,
  fontsize = 20,
  inputFile,
  imgNew1,
  img1x = 0, img1y = 0,
  img2x = 200, img2y = 50,
  imgNew2,
  alignment,
  spacing,
  rects = [], 
  images = [],
  fonts = [],
  draggingRects = [],
  dragRec,
  isDragging = false,
  clickOffset = [],
  bg = "#4d4dff";
  

class Rectangle {
  constructor (x, y, image) {
    if (image.width < 500) {
      this.width = image.width
    } else { this.width = 500}
    if (image.height < 375) {
      this.height = image.height
    } else { this.height = 375}
    // this.width = 500;
    // this.height = 375;
    this.img = image;
    this.x = x;
    this.offsetX = 0;
    this.offsetY = 0;
    this.y = y;
  }
  
  show() {
    image(this.img, this.x, this.y);
    this.img.resize(this.width, this.height);
  }
  
  hits(hx,hy) {
    if(hx > this.x && 
       hx < this.x + this.width && 
       hy > this.y && 
       hy < this.y + this.height) {
      return true;
    }
    return false;
  }
}

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font1 = loadFont('Aileron-Black.otf');
  font2 = loadFont('Pilowlava-Regular.otf');
  
  for (var i = 0; i < 4; i++) {
    images[i] = loadImage(i + ".jpg");
    images[i].resize(50,100);
    // console.log(images[1]);
  }

  fonts.push("Aileron-Black.otf")
  fonts.push("Pilowlava-Regular.otf")
  fonts.push("YoungSerif-Regular.otf")
  fonts.push("WorkSans-Regular.ttf")
  fonts.push("WorkSans-Thin.ttf")
  console.log(fonts)
}

//////////////////////////// SETUP /////////////////////////////

function setup() {
  
  placeImages();
  isDragging = false;
  
  //slider setup
  headlineSlider = createSlider(20, 140, 40);
  headlineSlider.style('width', '200px');
  subtextSlider = createSlider(10, 160, 20);
  subtextSlider.style('width', '200px');
  headlineSlider.class('slider');
  subtextSlider.class('slider');
  gridSlider = createSlider(10, 155, 50);
  gridSlider.style('width', '200px');
  headlineSpacingSlider = createSlider(45, 140, 50);
  headlineSpacingSlider.style('width', '200px');

  //inputs setup
  inputFile1 = createFileInput(handleFile1);
  gallery1 = createButton('Choose from gallery');
  gallery1.mousePressed(function() {viewImages(1);});

  inputFile2 = createFileInput(handleFile2);
  gallery2 = createButton('Choose from gallery');
  gallery2.mousePressed(function() {viewImages(2);});

  fontButton = createButton('Choose a font');
  fontButton.mousePressed(function() {viewFonts();});

  headingTextInput = createInput();
  subTextInput = createInput();
  dateInput = createInput();
  headingTextInput.value('Artist')
  subTextInput.value('Venue Name')
  dateInput.value('Nov 22nd')
  
  bgColorPicker = createColorPicker("ffffff");
  HeadingColorPicker = createColorPicker("#4d4dff");
  SubtextColorPicker = createColorPicker("ffffff");

  gridButton = createButton("Toggle Grid");
  gridButton.mousePressed(function() {showGrid = !showGrid;});
  

  headingAlign = createRadio();
  headingAlign.option("left");
  headingAlign.option("centre");
  headingAlign.option("right");

  saveSketchButton = createButton("Save Poster");
  saveSketchButton.mousePressed(saveSketch);
  
  var cnv = createCanvas(550, 710);
  ctx = cnv.drawingContext;
  // var logo = createCanvas(200, 50);
  
  //add js elements to parent divs for styling

  cnv.parent("sketchdiv");

  headingContainer = createElement('div')
  headingContainer.addClass('container')
  headingContainer.parent("aside");
  headlineLabel = createElement('p', 'Heading Font Size')
  headlineLabel.parent(headingContainer);
  headlineSlider.parent(headingContainer);
  headlineSpacingLabel = createElement('p', 'Heading Spacing')
  headlineSpacingLabel.parent(headingContainer);
  headlineSpacingSlider.parent(headingContainer);
  headingTextInput.parent(headingContainer);
  HeadingColorPicker.parent(headingContainer);
  headingAlign.parent(headingContainer);

  subtextContainer = createElement('div')
  subtextContainer.addClass('container')
  subtextContainer.parent("aside");
  subtextLabel = createElement('p', 'Subtext Font Size')
  subtextLabel.parent(subtextContainer);
  subtextSlider.parent(subtextContainer);
  subTextInput.parent(subtextContainer);
  SubtextColorPicker.parent(subtextContainer);
  dateInput.parent(subtextContainer);

  img1Container = createElement('div')
  img1Container.addClass('container')
  img1Container.parent("aside");
  image1Label = createElement('p', 'Replace Image 1')
  image1Label.parent(img1Container);
  inputFile1.parent(img1Container);
  gallery1.parent(img1Container);
  
  img2Container = createElement('div')
  img2Container.addClass('container')
  img2Container.parent("aside");
  image2Label = createElement('p', 'Replace Image 2')
  image2Label.parent(img2Container);
  inputFile2.parent(img2Container);
  gallery2.parent(img2Container);
  
  bgContainer = createElement('div');
  bgContainer.addClass('container');
  bgContainer.parent("aside");
  bgLabel = createElement('p', 'Background');
  bgLabel.parent(bgContainer);
  bgColorPicker.parent(bgContainer);
  gridButton.parent(bgContainer);
  gridSlider.parent(bgContainer);

  fontContainer = createElement('div');
  fontContainer.addClass('container');
  fontContainer.parent('aside');
  fontButton.parent(fontContainer);

  
  saveSketchContainer = createElement('div');
  saveSketchContainer.addClass('container');
  saveSketchContainer.parent("aside");
  saveSketchButton.parent(saveSketchContainer);

  
  
  var logo = select('ul');
  logo.mouseOver(animateLogo);
  logo.mouseOut(revert);

  textSize(fontsize);
}

function changeBackground() {
  bg = random(255);
}

function drawGrid() {
  for (var i = 0; i < width; i += 10) {
    
  	line(i, 0, i, height);
  	line(width, i, 0, i);
  
  }
}

function handleFile1(file) {
  print(file);
  if (file.type == 'image') {
    imgNew1 = loadImage(file.data);
    rects[0].img = imgNew1;
    rects[0].img.width = imgNew1.width;
    rects[0].img.height = imgNew1.height;
    rects[0].img.resize(50,100);
  } else {
    imgNew1 = null;
  }
}

function handleFile2(file) {
  print(file);
  if (file.type == 'image') {
    imgNew2 = loadImage(file.data);
    rects[1].img = imgNew2;
    rects[1].img.width = imgNew2.width;
    rects[1].img.height = imgNew2.height;
    rects[1].img.resize(50,100);
  } else {
    imgNew2 = null;
  }
}

function saveSketch() {
  save('myPoster.jpg');
}

function placeImages() {
  for(var i = 0; i < 2; i++) {
    let x = random(width*2);
    let y = random(height*2);
    rects.push(new Rectangle(x, y, images[i]));
  }
}

function animateLogo() {
  var text = select(".text");
  text.removeClass("hidden");
}

function revert() {
  var text = select(".text");
  text.addClass("hidden");
}
//////////////////////////// DRAW /////////////////////////////

function draw() {
  select('canvas').elt.style.letterSpacing = "20px";
  clear();
  
  alignment = headingAlign.value();
  hfontval = headlineSlider.value();
  hSpaceVal = headlineSpacingSlider.value();
  sfontval = subtextSlider.value();
  gridval = gridSlider.value();
  background(bgColorPicker.color());

  if (showGrid == false) {  
    for (var i = 0; i < height; i += gridSlider.value()) {
      stroke(000)
      line(i, 0, i, height);
      line(width, i, 0, i);
    
    }
  }

  if (alignment) {
    if (alignment == "right") {
      textAlign(LEFT);
    }
    else if (alignment == "left") {
      textAlign(RIGHT);
    }
    else if (alignment == "centre") {
      textAlign(CENTER);
    }
  }
  
  rects.forEach(r => r.show());

  // select('canvas').elt.style.letterSpacing = "20px";
  let canv = select('canvas');
  canv.style('letterSpacing', '15px');
  textFont(font1);
  textSize(hfontval);
  textLeading(hSpaceVal);
  fill(HeadingColorPicker.color());
  noStroke();
  text(headingTextInput.value(), 10, 50, width - 10, height); 
  textAlign(LEFT);
  textSize(sfontval);
  fill(SubtextColorPicker.color());
  text(subTextInput.value(), 10, 590);
  text(dateInput.value(), 10, 630);
  
  
  
}

function mousePressed() {
  let index;
  rects.forEach((r, i) => {
    if(r.hits(mouseX, mouseY)) {
      clickOffset[0] = r.x - mouseX;
      clickOffset[1] = r.y - mouseY;
      isDragging = true;
      dragRec = r;
      index = i;
    }
  });
  if(isDragging) {
    putOnTop(index);
  }
}

function putOnTop(index) {
  rects.splice(index, 1);
  rects.push(dragRec); 
}

function mouseDragged() {
  if(isDragging) {
    dragRec.x = mouseX + clickOffset[0];
    dragRec.y = mouseY + clickOffset[1];
  } 
}

function mouseReleased() {
  isDragging = false;
}

function viewImages(buttonNum) {
let galleryDiv = document.getElementById("gallery");
if (galleryDiv.childNodes.length < 2) {
    let galleryLabel = createElement('h1', 'Images')
    galleryLabel.parent("gallery");
    for(var i = 0; i < 8; i++) {
      src = i + ".jpg"
      img = createImg(src, "idk")
      img.parent("gallery");
      if (buttonNum == 1) {
        img.attribute('onclick',"gallerySelectImg1(src)")
      } else if (buttonNum == 2) {
        img.attribute('onclick',"gallerySelectImg2(src)")
      }
      
      }
  } else {
    var child = galleryDiv.lastElementChild;
    while (child) {
      galleryDiv.removeChild(child);
      child = galleryDiv.lastElementChild;
    }
  }
}
function gallerySelectImg1(source) {
  let galleryDiv = document.getElementById("gallery");
  imgNew1 = loadImage(source);
  rects[0].img.width = imgNew1.width;
  rects[0].img.height = imgNew1.height;
  rects[0].img = imgNew1;
  rects[0].img.x = imgNew1.x;
  rects[0].img.y = imgNew1.y;
  rects[0].img.resize(50,100);
}

function gallerySelectImg2(source) {
  imgNew2 = loadImage(source);
  rects[1].img = imgNew2;
  rects[1].img.width = imgNew2.width;
  rects[1].img.height = imgNew2.height;
  rects[1].img.x = imgNew2.x;
  rects[1].img.y = imgNew2.y;
  rects[1].img.resize(50,100);
}

function viewFonts() {
  
  let galleryDiv = document.getElementById("gallery");
  if (galleryDiv.childNodes.length < 2) {
      let galleryLabel = createElement('h1', 'Fonts');
      galleryLabel.parent("gallery");
      for (let i = 0; i < 5; i++) (function(i){
        src = fonts[i];
        console.log(src);
        font = createElement('div', src);
        console.log(src);
        font.parent("gallery");
        if (true) {
          font.attribute('src', src)
          font.attribute('onclick',"gallerySelectFont(src)")
        };
        console.log(src);   
        }(i));
    } else {
      var child = galleryDiv.lastElementChild;
      while (child) {
        galleryDiv.removeChild(child);
        child = galleryDiv.lastElementChild;
      }
    }
  }

  function gallerySelectFont(source) {
    console.log(source);
    font1 = loadFont(source);
    //textFont(font1);
  }


