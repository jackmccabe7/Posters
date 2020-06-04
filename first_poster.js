let font1, font2,
  slider,
  fontsize = 20,
  inputFile,
  imgNew1,
  img1x = 0, img1y = 0,
  img2x = 200, img2y = 50,
  imgNew2,
  alignment,
  rects = [], 
  images = [],
  draggingRects = [],
  dragRec,
  isDragging = false,
  clickOffset = [],
  bg = "#4d4dff";
  

class Rectangle {
  constructor (x, y, image) {
    this.width = image.width;
    this.height = image.height;
    this.img = image;
    this.x = x;
    this.offsetX = 0;
    this.offsetY = 0;
    this.y = y;
  }
  
  show() {
    image(this.img, this.x, this.y);
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
  //img1 = loadImage('sunflowers.jpg');
  //img2 = loadImage('hq.jpg');
  
  for (var i = 0; i < 4; i++) {
    images[i] = loadImage(i + ".jpg");
  }
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

  //inputs setup
  inputFile1 = createFileInput(handleFile1);
  gallery1 = createButton('Choose from gallery');
  gallery1.mousePressed(function() {viewImages(1);});

  inputFile2 = createFileInput(handleFile2);
  gallery2 = createButton('Choose from gallery');
  gallery2.mousePressed(function() {viewImages(2);});

  headingTextInput = createInput();
  subTextInput = createInput();
  dateInput = createInput();
  headingTextInput.value('Artist')
  subTextInput.value('Venue Name')
  dateInput.value('Nov 22nd')
  
  bgColorPicker = createColorPicker("ffffff");
  HeadingColorPicker = createColorPicker("#4d4dff");
  SubtextColorPicker = createColorPicker("ffffff");

  headingAlign = createRadio();
  headingAlign.option("left");
  headingAlign.option("centre");
  headingAlign.option("right");

  saveSketchButton = createButton("Save Poster");
  saveSketchButton.mousePressed(saveSketch);
  

  var cnv = createCanvas(550, 710);
  
  //add js elements to parent divs for styling
  cnv.parent("sketchdiv");

  headlineLabel = createElement('p', 'Heading Font Size')
  headlineLabel.parent("aside");
  headlineSlider.parent("aside");

  headingAlign.parent("aside");

  subtextLabel = createElement('p', 'Subtext Font Size')
  subtextLabel.parent("aside");
  subtextSlider.parent("aside");

  

  image1Label = createElement('p', 'Replace Image 1')
  image1Label.parent("aside");
  inputFile1.parent("aside");
  gallery1.parent("aside");
  

  image2Label = createElement('p', 'Replace Image 2')
  image2Label.parent("aside");
  inputFile2.parent("aside");
  gallery2.parent("aside");

  headingTextInput.parent("aside");
  HeadingColorPicker.parent("aside");
  subTextInput.parent("aside");
  SubtextColorPicker.parent("aside");
  dateInput.parent("aside");
  SubtextColorPicker.parent("aside");
  

  bgLabel = createElement('p', 'Background Colour');
  bgLabel.parent("aside");
  bgColorPicker.parent("aside");
  
  saveSketchButton.parent("aside");


  textFont(font1);
  textSize(fontsize);
}

function changeBackground() {
  bg = random(255);
}

function handleFile1(file) {
  print(file);
  if (file.type == 'image') {
    imgNew1 = loadImage(file.data);
    rects[0].img = imgNew1;
    rects[0].img.width = imgNew1.width;
    rects[0].img.height = imgNew1.height;
    //rects[0] = new Rectangle(rects[0].x, rects[0].y, imgNew1);
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
  } else {
    imgNew2 = null;
  }
}

function saveSketch() {
  save('myPoster.jpg');
}

function placeImages() {
  for(var i = 0; i < 2; i++) {
    let x = random(0,width);
    let y = random(0, height);
    rects.push(new Rectangle(x, y, images[i]));
  }
}

//////////////////////////// DRAW /////////////////////////////

function draw() {
  
  clear();
  alignment = headingAlign.value();
  hfontval = headlineSlider.value();
  sfontval = subtextSlider.value();
  background(bgColorPicker.color());
  
  if (alignment) {
    if (alignment == "left") {
      textAlign(LEFT);
    }
    else if (alignment == "right") {
      textAlign(RIGHT);
    }
    else if (alignment == "centre") {
      textAlign(CENTER);
    }
  }

  rects.forEach(r => r.show());

  textSize(hfontval);
  fill(HeadingColorPicker.color());
  noStroke();
  text(headingTextInput.value(), width/2, 150); 
  textAlign(LEFT);
  textSize(sfontval);
  fill(SubtextColorPicker.color());
  text(subTextInput.value(), 10, 590);
  text(dateInput.value(), 10, 630);
  
  
}

function mousePressed() {
  //let m = createVector(mouseX, mouseY);
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

function placeImages() {
  for(var i = 0; i < 2; i++) {
    let x = random(0,width);
    let y = random(0, height);
    rects.push(new Rectangle(x, y, images[i]));
  }
}

function viewImages(buttonNum) {
let galleryDiv = document.getElementById("gallery");
if (galleryDiv.childNodes.length < 2) {
    let galleryLabel = createElement('h1', 'Images')
    galleryLabel.parent("gallery");
    for(var i = 0; i < 6; i++) {
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
  imgNew1 = loadImage(source);
  rects[0].img.width = imgNew1.width;
  rects[0].img.height = imgNew1.height;
  rects[0].img = imgNew1;
  rects[0].img.x = imgNew1.x;
  rects[0].img.y = imgNew1.y;
}

function gallerySelectImg2(source) {
  imgNew2 = loadImage(source);
  rects[1].img = imgNew2;
  rects[1].img.width = imgNew2.width;
  rects[1].img.height = imgNew2.height;
  rects[1].img.x = imgNew2.x;
  rects[1].img.y = imgNew2.y;
}


