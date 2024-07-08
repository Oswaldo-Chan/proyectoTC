let time = new Date();
let deltaTime = 0;

document.addEventListener("DOMContentLoaded", init);

let currentState = 'q0';

function init() {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(setup, 1);
  } else {
    document.addEventListener("DOMContentLoaded", setup); 
  }
}

function setup() {
  time = new Date();
  start();
  loop();
}

function loop() {
  deltaTime = (new Date() - time) / 1000;
  time = new Date();
  update();
  requestAnimationFrame(loop);
}

let groundY = 22;
let velY = 0;
const impulse = 800;
const gravity = 2500;

let boyPosX = 42;
let boyPosY = groundY;

let groundX = 0;
const velBackground = 1280 / 3;
let levelVel = 1;

let isJumping = false;
let isFlying = false;

let timeUntilObject = 2;
const minObjectTime = 0.7;
const maxObjectTime = 1.8;
let objects = [];

const maxCloudY = 270;
const minCloudY = 100;
const velCloud = 0.5;

let container, boy, ground, walkingInterval, runningInterval, flyingInterval, stateDisplay;

function start() {
  ground = document.querySelector(".ground");
  container = document.querySelector(".container");
  boy = document.querySelector(".boy");
  stateDisplay = document.querySelector(".state");
  stateDisplay.textContent = currentState;

  boyWalking(); 
}

function update() {
  boyAnimation();
  animateGround();
  decideCreateObjects();
  animateObjects();
  velY -= gravity * deltaTime;
}

function animateGround() {
  groundX += calculateMovement();
  ground.style.left = `-${groundX % container.clientWidth}px`;
}

function calculateMovement() {
  return velBackground * deltaTime * levelVel;
}

function decideCreateObjects() {
  timeUntilObject -= deltaTime;
  if (timeUntilObject <= 0.5) {
    createObject();
  }
}

function createObject() {
  const object = document.createElement("div");
  container.appendChild(object);
  if (Math.random() > 0.5) {
    object.classList.add("cactus");
    if (Math.random() > 0.5) object.classList.add("tree");
    object.posX = container.clientWidth;
    object.style.left = `${container.clientWidth}px`;
  } else {
    object.classList.add("cloud");
    object.posX = container.clientWidth;
    object.style.left = `${container.clientWidth}px`;
    object.style.bottom = `${minCloudY + Math.random() * (maxCloudY - minCloudY)}px`;
  }

  objects.push(object);
  timeUntilObject = minObjectTime + Math.random() * (maxObjectTime - minObjectTime) / levelVel;
}

function animateObjects() {
  objects.forEach((object, index) => {
    if (object.posX < -object.clientWidth) {
      object.parentNode.removeChild(object);
      objects.splice(index, 1);
    } else {
      const velocidad = object.classList.contains("cloud") ? calculateMovement() * velCloud : calculateMovement();
      object.posX -= velocidad;
      object.style.left = `${object.posX}px`;
    }
  });
}

function startAnimation(frames, interval, type) {
  let currentFrame = 0;

  const animationInterval = setInterval(() => {
    boy.classList.remove(frames[currentFrame]);
    currentFrame = (currentFrame + 1) % frames.length;
    boy.classList.add(frames[currentFrame]);
  }, interval);

  if (type === 'walking') walkingInterval = animationInterval;
  if (type === 'running') runningInterval = animationInterval;
  if (type === 'flying') flyingInterval = animationInterval;
}

function boyJump() {
  if (boyPosY === groundY) {
    isJumping = true;
    velY = impulse;
  }
}

function boyAnimation() {
  boyPosY += velY * deltaTime;
  if (boyPosY < groundY) {
    touchGround();
  }

  boy.style.bottom = `${boyPosY}px`;
}

function touchGround() {
  boyPosY = groundY;
  velY = 0;
  isJumping = false;
  isFlying = false;
}

function boyWalking() {
  currentState = 'q0';
  levelVel = 1;
  groundY = 22;
  clearInterval(runningInterval);
  clearInterval(flyingInterval);
  startAnimation(['walking-1', 'walking-2'], 200, 'walking');
}

function boyRunning() {    
  currentState = 'q1';
  levelVel = 2;
  groundY = 22;
  clearInterval(walkingInterval);
  clearInterval(flyingInterval);
  startAnimation(['running-1', 'running-2', 'running-3', 'running-4'], 100, 'running');
}

function boyFlying() {
  currentState = 'q2';
  isFlying = true;
  groundY = 100;
  clearInterval(walkingInterval);
  clearInterval(runningInterval);

  boy.classList.remove('walking-1', 'walking-2', 'running-1', 'running-2', 'running-3', 'running-4');
  boy.classList.add('flying-1');

  let flyingFrame = 1;

  flyingInterval = setInterval(() => {
    boy.classList.remove(`flying-${flyingFrame - 1}`);
    boy.classList.add(`flying-${flyingFrame}`);
    flyingFrame = flyingFrame < 5 ? flyingFrame + 1 : 1;
  }, 100); 
}

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyS':
        if (currentState === 'q0') {
            changeState('q0');
        } else if (currentState === 'q1') {
            changeState('q0');
        } else if (currentState === 'q2') {
            changeState('q0');
        }

      break;
    case 'KeyD':
        if (currentState === 'q0') {
            changeState('q1');
        } else if (currentState === 'q1') {
            changeState('q2');
        } else if (currentState === 'q2') {
            changeState('q1');
        }

      break;
    case 'KeyW':
        if (currentState === 'q0') {
            changeState('q2');
        } else if (currentState === 'q1') {
            changeState('q2');
        } else if (currentState === 'q2') {
            changeState('q2');
        }

      break;
    case 'Space':
      boyJump();
      break;
  }
}); 

function changeState(newState) {
  if (currentState !== newState) {
    clearInterval(walkingInterval);
    clearInterval(runningInterval);
    clearInterval(flyingInterval);
    boy.className = 'boy';
  
    currentState = newState;
    stateDisplay.textContent = currentState;

    switch (currentState) {
      case 'q0':
        boyWalking();
        break;
      case 'q1':
        boyRunning();
        break;
      case 'q2':
        boyFlying();
        break;
    }
  }
}
