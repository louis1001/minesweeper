let theGame
let sprites = {}

function preload(){
  loadImage('./resources/sprites.png', x => {
    sprites['hidden'] = x.get(0, 0, 70, 70)
    sprites['empty'] = x.get(70, 0, 70, 70)
    sprites['bomb'] = x.get(140, 0, 70, 70)
    sprites['explosion'] = x.get(210, 0, 70, 70)
    sprites['flag'] = x.get(280, 0, 70, 70)
  })

  loadFont('./resources/arial-rounded.ttf', fo => {
    roundFont = fo
  })
}

function setup(){
  createCanvas(600, 600)
  textFont(roundFont)

  theGame = new Game(createVector(15, 15), 30)
  noLoop()
  draw()
}

function draw(){
  background(100)

  theGame.render()
}

function mouseClicked(){
  if (keyIsDown(SHIFT)){
    theGame.flagCell(mouseX, mouseY, true)
  } else {
    theGame.clickCell(mouseX, mouseY, true)
  }

  draw()
}