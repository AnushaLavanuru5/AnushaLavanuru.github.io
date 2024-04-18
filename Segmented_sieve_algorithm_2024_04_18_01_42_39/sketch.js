let numPoints = 1;
let maxPoints;
let offset;
let hoveredNum = null;
let zoom = 1;
let visType = 0; 
let zoomEl, visTypeEl;
let primeNumbers = [];
const spacing = 50;
const size = 25;
let animationEnded = false;
let strokecheck = false;
const isPrime = (num) => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++)
    if (num % i === 0) return false;
  return num > 1;
};

function setup() {
  createCanvas(windowWidth, windowHeight - 100);
  textSize(40);
  textFont("monospace");
  textStyle("bold");
  textAlign(CENTER, CENTER);

  offset = createVector(0, 0);
  
  visTypeEl = createSelect()
  visTypeEl.option("HSB Colors", 0)
  visTypeEl.option("Change at every turn", 1)
  visTypeEl.option("Reset at every turn", 2)
  visTypeEl.option("White", 3)
  visTypeEl.position(20, 40)
  visTypeEl.changed(ev => {
    visType = ev.target.value;
    restartAnimation()
  })
  
  maxPoints = 1;
  const input = createInput('1');
  input.elt.placeholder = 'Enter a positive number';
  input.position(20, 70);
  input.input(() => {
    maxPoints = parseInt(input.value());
    restartAnimation();
  });

  strokeWeight(2);
  createTextFields();
}

function restartAnimation(){
  primeNumbers = [];
  for(let i=2; i<= maxPoints; i++){
    if(isPrime(i)){
      primeNumbers.push(i);
    }
  }
  updateTextFields();
  numPoints = 1;
  loop();
}

function updateTextFields(){
  select('#primeCount').html(primeNumbers.length);
  select('#primeList').html(primeNumbers.join(' , '));
  
}

function createTextFields(){
  createElement('h3', 'Number of prime numbers:').position(20,height+20);
  createP('').id('primeCount').position(20, height+40);
  
  
  createElement('h3', 'The prime numbers are:').position(20,height+70);
  createP('').id('primeList').position(20, height+90);
}

function draw() {
  
   if (numPoints > maxPoints)
   { 
    noLoop(); 
    return; 
   }
  hoveredNum = null;

  let pos = createVector(0, 0);
  let stepsTillTurn = 1;
  let state = 0;
  let numTurns = 0;
  let px = 0,py = 0;
  const transformedMouse = mouse();
  
  

  background(0);
  textSize(40);
  fill(255); // White color for the text
  textFont("monospace");
  textAlign(CENTER, CENTER);
  text("Segmented Sieve", width / 2, 50);
  translate(width / 2, height / 2);
  
  let zoomie = numPoints;
  let limitend = map(numPoints, 1, 1000, 1, 0.3)
  zoomie = zoomie-25;
  scaleFactor = map(zoomie, 1, numPoints, 1, limitend); 
    
  scale(scaleFactor);
  translate(offset);

  for (let i = 1; i <= numPoints; i++) {
    
    push();
    colorMode(HSB);
    let satVal = 100;
    let briVal = 100;
    let hueVal;
    // Different Visualisations
    if (visType == 0) hueVal = i;
    if (visType == 1) hueVal = numTurns*90;
    if (visType == 2) hueVal = 360* (i % stepsTillTurn)/stepsTillTurn;
    if (visType == 3) hueVal = 0, satVal = 0, briVal = 100;
    let col = color(hueVal % 360, satVal, briVal);
    pop();
    
    let screenPos = p5.Vector.mult(pos, spacing);
    
    if (isPrime(i)) {
      stroke(col);
      if(i == 3) {
        line(px * spacing, py * spacing-12, screenPos.x, screenPos.y);
      } else {
        line(px * spacing, py * spacing, screenPos.x, screenPos.y);
      }
      strokecheck= true;
       
    } else {
      if(strokecheck) {
        stroke(col);
        let ix = px * spacing;
        let iy = py * spacing;
        if(state === 0) ix = ix+12;
        else if(state === 1) iy = iy-12;
        else if(state === 2) ix = ix-12;
        else iy = iy+12;
        line(ix, iy, screenPos.x, screenPos.y);
        strokecheck = false;
      }else {
        stroke(col);
        line(px * spacing, py * spacing, screenPos.x, screenPos.y);
      }
    }

    if (isPrime(i)) {
      if (screenPos.dist(transformedMouse) < size/2) {
        push();
        fill(col);
        ellipse(screenPos.x, screenPos.y, size);
        hoveredNum = i;
        pop();
      }
      else{
        fill(255);
        stroke(col);
        ellipse(pos.x * spacing, pos.y * spacing, size);
        
        stroke(0);
        fill(col);
        textSize(16);
        textStyle("bold");
        text(i, screenPos.x, screenPos.y);
      }
      
    }
    
    
    px = pos.x;
    py = pos.y;

    if (state === 0) pos.x++;
    if (state === 1) pos.y--;
    if (state === 2) pos.x--;
    if (state === 3) pos.y++;

    if (i % stepsTillTurn == 0) {
      state = (state + 1) % 4;
      numTurns++;
      if (numTurns % 2 == 0) {
        stepsTillTurn++;
      }
    }
  }
  noFill();
  stroke(255);
  endShape();

  resetMatrix();
  fill(0, 150);
  stroke(127);
  numPoints++;
}



function mouse() {
  return createVector(
    (mouseX - width / 2  - offset.x) / zoom,
    (mouseY - height / 2  - offset.y) / zoom
  );
}

function updateNumPoints() {
    const inputVal = document.getElementById('numInput').value;
    numPoints = parseInt(inputVal);
    restartAnimation();  
}