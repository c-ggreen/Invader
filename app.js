// Calling the canvas in HTML and setting the context
const canvas = document.querySelector('canvas')
ctx = canvas.getContext('2d')

// Determining the canvas width and height; creating the screenWidth/Height variables
canvas.width = innerWidth*.8
canvas.height = innerHeight*.8
const screenWidth = canvas.width
const screenHeight = canvas.height

// Selecting the score number from HTML
const scoreNumber = document.getElementById('scoreNumber')

// Sounds-----
const gameAudio = document.getElementById('gameAudio')
function playAudio() { 
  gameAudio.play(); 
} 
function pauseAudio() { 
  gameAudio.pause(); 
}

// Images/Icons-----
let playerIcon = document.getElementById('playerIcon');
let alienIcon = document.getElementById('alienIcon');
let earthPlanet = document.getElementById('earthPlanet')
let ringPlanet = document.getElementById('ringPlanet')
let moonPlanet = document.getElementById('moonPlanet')
const spaceBackground = document.getElementById('spaceBackground')

// BACKGROUND IMAGE START---------------------------------------
// These are the background images for the game. Each image has a draw function, but only the Sprites (Planets) have an update function so they cycle through each image/section of the SpriteSheet so they appear animated. The Space Background is the only one with a class.
// -----Space Background
class SpaceBackground {
    constructor(){
        this.height = screenHeight
        this.width = screenWidth
        this.position = {
            x:0,
            y:0
        }
    }
    drawSpaceBackground(ctx){
        ctx.drawImage(spaceBackground, this.position.x, this.position.y, this.width, this.height)
    }}
let background = new SpaceBackground


// -----EARTH PLANET
let earthX = Math.random() * (screenWidth*.8 - screenWidth*.2) + screenWidth*.2;
let earthY = Math.random() * (screenHeight*.4 - screenHeight*.2) + screenHeight*.2

let earthSx;
let earthSy;

let earthSheetWidth = 5000
let earthSheetHeight = 100

let earthColumns = 50
let earthRows = 1

let earthWidth = earthSheetWidth/earthColumns
let earthHeight = earthSheetHeight/earthRows

let earthCurrentFrame = 0

function updateEarthFrame(){
    earthCurrentFrame = ++earthCurrentFrame % earthColumns;
    earthSx = earthCurrentFrame * earthWidth;
    earthSy = 0
}
function drawEarthBackground(){
    updateEarthFrame();
    ctx.drawImage(earthPlanet, earthSx, earthSy, earthWidth, earthHeight, earthX, earthY, 100, 100 )
}


// -----RING PLANET
let ringX = Math.random() * (screenWidth*.8 - screenWidth*.2) + screenWidth*.2;
let ringY = Math.random() * (screenHeight*.4 - screenHeight*.2) + screenHeight*.2

let ringSx;
let ringSy;

let ringSheetWidth = 15000
let ringSheetHeight = 300

let ringColumns = 50
let ringRows = 1

let ringWidth = ringSheetWidth/ringColumns
let ringHeight = ringSheetHeight/ringRows

let ringCurrentFrame = 0

function updateRingFrame(){
    ringCurrentFrame = ++ringCurrentFrame % ringColumns;
    ringSx = ringCurrentFrame * ringWidth;
    ringSy = 0
}
function drawRingBackground(){
    updateRingFrame();
    ctx.drawImage(ringPlanet, ringSx, ringSy, ringWidth, ringHeight, ringX, ringY, 300, 300 )
}

// -----MOON PLANET
let moonX = Math.random() * (screenWidth*.8 - screenWidth*.2) + screenWidth*.2;
let moonY = Math.random() * (screenHeight*.4 - screenHeight*.2) + screenHeight*.2

let moonSx;
let moonSy;

let moonSheetWidth = 5000
let moonSheetHeight = 100

let moonColumns = 50
let moonRows = 1

let moonWidth = moonSheetWidth/moonColumns
let moonHeight = moonSheetHeight/moonRows

let moonCurrentFrame = 0

function updateMoonFrame(){
    moonCurrentFrame = ++moonCurrentFrame % moonColumns;
    moonSx = moonCurrentFrame * moonWidth;
    moonSy = 0
}
function drawMoonBackground(){
    updateMoonFrame();
    ctx.drawImage(moonPlanet, moonSx, moonSy, moonWidth, moonHeight, moonX, moonY, 100, 100 )
}
// BACKGROUND IMAGE END---------------------------------------

// The following are the individual classes that were created for the Player, Missiles, Aliens, and the Win/Loss Screen. Each class has a constructor, and methods associated with drawing objects of each class onto the screen. These methods are ran through the gameLoop function towards the end of the code
// CLASSES
    // PLAYER CREATION START----------------------------------------
    class Player {
        constructor(screenWidth, screenHeight){
            this.width = 48;
            this.height = 48;

            this.maxSpeed = 10;
            this.speed = 0;

            // Centers the Player to the middle of the screen on initial window load.
            this.position = {
                x: screenWidth/2 - this.width/2,
                y: screenHeight - this.height - 10,
            }}
        
        // Draws the Player
        drawPlayer(ctx){
            ctx.drawImage(playerIcon,this.position.x, this.position.y, this.width, this.height);
        }

        // Updates the Player position
        update(deltaTime){
            // deltaTime is 0 at first so this is needed to end the gameLoop the first time so deltaTime can count up and the code can run. 
            if(!deltaTime){
                return
            }

            // This is for general movement of the player utilizing the .moveRight(), .moveLeft(), and .stop() methods in this class. Each method sets "this.speed" equal to +/- "this.maxSpeed", or 0 respectively and manipulates the x-coordinate of the Player. Depending on whether or not "this.maxSpeed" is +/- dictates the direction the player goes.
            this.position.x += this.speed;
            
            // Stops player from moving offscreen to the left
            if(this.position.x < 0){
                this.position.x = 0
            }
            // Stops player from moving offscreen to the right
            if(this.position.x + this.width > screenWidth){
                this.position.x = screenWidth - this.width
            }}

        // Player moves left
        moveLeft(){
            this.speed = -this.maxSpeed
        }
        // Player moves right
        moveRight(){
            this.speed = this.maxSpeed
        }
        // Player stop
        stop(){
            this.speed = 0
        }
    }

    let player = new Player(screenWidth,screenHeight)
    // PLAYER CREATION END------------------------------------------

    // MISSILE CREATION START--------------------------------------
    // This is the missiles array, it's an empty array that is used to push new instances of Missile objects into it so that multiple Missile's may be drawn each frame. Each SpaceBar keydown event pushes a new missile into the array
    const missiles = []

    // Missile class
    class Missile {
        constructor(){
            this.width = 5;
            this.height = 20;
            // Setting the missile to always be at the players position, adjustments of +30 and -20 were needed to center missile object for aesthetic purposes.
            // NOTE: Whenever resizing Player icon, Missile position must be adjusted as well.*****
            this.position = {
                x: player.position.x + 22.5,
                y: player.position.y - 20,
            }

            // How fast the missile moves on the screen and the direction. "this.speed" is used in the .update() method for this class.
            this.speed = 20
        }

        // Draws the Missile
        drawMissile(ctx){
            ctx.fillStyle = '#F46036'
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        }

        // Updates the Missile position
        update(){
            // Putting the drawMissile method in the update method allows the missile to be drawn every time the update method runs.
            this.drawMissile(ctx)

            // Sets the direction of the missile on the y-axis so that it goes up by whatever this.speed is. The -= is so that it decreases as it goes along the y-axis (It goes up the screen).
            this.position.y -= this.speed;

        }
    }
    let missile = new Missile()
    // MISSILE CREATION END-----------------------------------------

    // ALIEN CREATION START-----------------------------------------
    // This is the aliens array, similar to the missile array it's an empty array that is used to push new instances of Alien objects into it so that multiple Aliens may be drawn each frame.
    const aliens = []

    // Alien class
    class Alien{
        constructor(){
            this.width = 64;
            this.height = 64;

            // allows the aliens to spawn anywhere within the height and width of the screen; makes spawning relative to screen size and not static.
            this.position = {
                x:Math.random() * (screenWidth - 0)+0,
                // IMPORTANT: Aliens can only spawn towards the top of the y-axis, in this case I'm making them spawn in the top 10% of the y axis.
                y:Math.random() * (screenHeight*.1 - 0)+0,
            }

            // randomizes the speed at which the aliens move between 2 and 4 pixels. "this.speed" is used in the .update() method for this class.
            this.speed = Math.random() * (4-2)+2
        }
        
        // Draws the aliens
        drawAlien(ctx){
            ctx.drawImage(alienIcon, this.position.x, this.position.y, this.width, this.height)
        }

        // Updates the Alien position
        update(){
            // Putting the .drawAlien(ctx) method inside the .update() method gives me the ability to only put the .update() method into the gameLoop function and the .drawAlien(ctx) method is still called because it's inside the .update() method.
            this.drawAlien(ctx)

            // For the speed and direction of the Alien, in this instance it's moving down the screen (increasing on the y-axis).
            this.position.y += this.speed

            // Stops alien from moving offscreen to the left/spawning offscreen on the left
            if(this.position.x < 0){
                this.position.x = 0
            }
            // Stops alien from moving offscreen to the right/spawning offscreen on the right
            if(this.position.x + this.width > screenWidth){
                this.position.x = screenWidth - this.width
            }
        }}
    let alien = new Alien()

    // This function spawns aliens every second(s) (1s = 1000ms) by pushing a new alien into the "aliens" array, which allows the alien.update() method in the gameLoop to draw another Alien object. Utilizing this function outside of the gameLoop function allows the developer to control the rate at which the Aliens spawn.
    function spawnAliens(){
        setInterval(()=>{
            aliens.push(new Alien())
        }, 300)
    }
    spawnAliens() //remember to call function so it actually works
    // ALIEN CREATION END-------------------------------------------


    // WIN/LOSS SCREEN START----------------------------------------
    // This is the class that houses the Win and Loss Screen functions that will be called when the conditionals they are housed in inside of the gameLoop are met.
        class EndGameScreen {
            constructor() {
                this.width = screenWidth;
                this.height= screenHeight;
                this.x = 0;
                this.y = 0;
            }
                // This is the Loss Screen function, it is responsible for drawing a black screen that is the width and height of the game screen, and text in the center of the screen. 
                drawDefeat(){
                    ctx.fillStyle = 'black'
                    ctx.fillRect(this.x, this.y, this.width, this.height)
                    ctx.fill()

                    ctx.font = "4em Monospace"
                    ctx.fillStyle = "red"
                    ctx.textAlign = "center"
                    ctx.fillText("DEFEATED!, Press [ENTER] to Try Again.", screenWidth/2, screenHeight/2)
                }
                // This is the Win Screen function, it is responsible for drawing a red screen that is the width and height of the game screen, and text in the center of the screen. 
                drawWinner(){
                    ctx.fillStyle = 'red'
                    ctx.fillRect(this.x, this.y, this.width, this.height)
                    ctx.fill()

                    ctx.font = "4em Monospace"
                    ctx.fillStyle = "white"
                    ctx.textAlign = "center"
                    ctx.fillText("WINNER!, Press [ENTER] to Play Again.", screenWidth/2, screenHeight/2)
                }
        }
        let defeatScreen = new EndGameScreen()
        let winnerScreen = new EndGameScreen()
    // WIN/LOSS SCREEN END------------------------------------------


// INPUT HANDLERS START-----------------------------------------
// This is the event listener class created to handle the keyboard inputs for the player.
    class InputHandler{
        constructor(player){
        
            // The first event listener features switch cases that activate whenever there is a keydown event for the values of "ArrowLeft" and "ArrowRight", resulting in the execution of the .moveLeft() and .moveRight() methods found in the above Player class.
            document.addEventListener('keydown', event =>{
                switch(event.key){
                    case 'ArrowLeft': player.moveLeft();
                        break;
                    case 'ArrowRight': player.moveRight();
                        break;
                }})
            // The second event listener activates whenever there is a keyup event for the values of "ArrowLeft" and "ArrowRight" which executes the .stop() method. This was added to not only make the player icon stop moving after either arrow key was released. But to also resolve a delay that would occur when switching from moving from either direction to the other, this is represented by the IF statements.
            document.addEventListener('keyup', event =>{
                switch(event.key){
                    case 'ArrowLeft': if(player.speed < 0){
                            player.stop()
                            };
                        break;
                    case 'ArrowRight': if(player.speed > 0){
                            player.stop()
                            };
                        break;
                }})}}
    new InputHandler(player)

// -----Missile Inputs
// This is the event listener class created to handle the keyboard inputs for the missiles.
    class MissileInput {
        constructor(missile){
            // This event listener is activated whenever there is a 'keydown' event for the SpaceBar, which is represented by the case ' '. Each time the SpaceBar is used, a new missile from the Missile class is pushed, or added, into the "missiles" array, resulting in a missile being drawn onto the screen.
            document.addEventListener('keydown', event =>{
                switch(event.key){
                    case ' ': missiles.push(new Missile);
                        break;
                }})}}
    new MissileInput(missile)
// INPUT HANDLERS END-------------------------------------------


// GAME LOOP START----------------------------------------------
// This is the gameLoop function that is responsible for drawing, and updating each objects position after each frame. The methods created in each class, as well as the .forEach methods/conditionals that are used for Collision Detection, off-screen deletion, and game win/loss situations are stored inside this gameLoop function so that each method may be called continuously as the gameLoop function refreshes itself each frame.

    // variables
    let lastTime = 0
    let animationId; 
    let score = 0

    function gameLoop(timestamp){
        // calls the gameLoop again with the next frames timestamp
        animationId = requestAnimationFrame(gameLoop)

        // calculates time passed
        let deltaTime = timestamp - lastTime;
        lastTime = timestamp

        // this clears the screen each frame
        ctx.clearRect(0,0,screenWidth,screenHeight)
        
        // background images
        background.drawSpaceBackground(ctx)
        drawEarthBackground()
        drawRingBackground()
        drawMoonBackground()

        // this updates the player position
        player.update(deltaTime)
        // this redraws the player
        player.drawPlayer(ctx)


        // Every time the missile event listener is triggered this forEach runs the missile update class method, which draws the new missile onto the screen after it was pushed into the array.
        missiles.forEach((missile, index)=>{
            missile.update(deltaTime)

            // This conditional is here in order to delete any Missile objects that go off screen. This is to ensure that any computations on the Missile object cease after they leave the parameters of the screen, ensuring that a computer processing problem isn't created after lengthy game play.
            if(missile.position.y < 0){
                // The setTimeout method is used to ensure the program doesn't try to redraw the Alien which would cause a flash effect
                setTimeout(()=>{
                    missiles.splice(index,1)
                },0)}})

        // The forEach Loop for Aliens that houses the .update() method for drawing Aliens, the conditional that deletes off-screen Aliens, as well as the Collision Detection conditionals for what happens when an Alien comes into contact with a Missile or the Player.
        aliens.forEach((alien, index)=>{
            // Responsible for drawing each Alien onto the screen
            alien.update()

            // This conditional is here in order to delete any Alien objects that go off screen. This is to ensure that any computations on the Alien object cease after they leave the parameters of the screen, ensuring that a computer processing problem isn't created after lengthy game play.
            if(alien.position.y > screenHeight){
                // The setTimeout method is used to ensure the program doesn't try to redraw the Alien which would cause a flash effect
                setTimeout(()=>{
                    aliens.splice(index,1)
                },0)}

            // Collision Detection (Player and Aliens)
            // This is the Collision Detection conditional for the Player and an Alien. It states that if an Alien's coordinate position, and height and width are greater than a Players coordinate position, and vice-versa, then a collision was made. If this is true, then the conditional cancels the animation frame for the gameLoop, effectively stopping the game, and then draws the Loss Screen.
            if(
                player.position.x < alien.position.x + alien.width*.7 &&
                player.position.x + player.width > alien.position.x &&
                player.position.y < alien.position.y + alien.height*.7 &&
                player.position.y + player.height > alien.position.y
                )
                {
                    // These first cancel the animation, which stops the next frame from loading, and then draws the Loss Screen
                    cancelAnimationFrame(animationId)
                    defeatScreen.drawDefeat()
                    // An event listener for a 'keydown' on the 'Enter' key is added so the user can press 'Enter' to reload the page to play again. This event listener is only operable when the collision requirement is met.
                    addEventListener('keydown', event =>{
                        switch(event.key){
                            case 'Enter':
                                // location.reload() reloads the page/window/current URL
                                location.reload()
                        }})} 

            // Collision Detection (Aliens and Missiles)
            // This is the Collision Detection conditional for the Missile and an Alien. It states that if an Alien's coordinate position, and height and width are greater than a Missile's coordinate position, and vice-versa, then a collision was made. If this is true, then the conditional adds the predetermined amount to the score, sets the scoreNumber in the HTML document to the new score, and then splices out the Alien and the Missile from their respective arrays, resulting in their deletion from the screen.
            missiles.forEach((missile, missileIndex) =>{
                if( missile.position.x < alien.position.x + alien.width &&
                    missile.position.x + missile.width > alien.position.x &&
                    missile.position.y < alien.position.y + alien.height*.8 &&
                    missile.position.y + missile.height > alien.position.y
                    ) 
                    {   // score increase each time alien is hit
                        score+=25
                        // setting the innerHTML of the scoreNumber in html
                        scoreNumber.innerHTML = score

                        // setTimeout gets rid of alienIcon flash that occurs when they are deleted
                        setTimeout(()=>{
                            // deletes the missile and alien if they touch, add the 1 so that it only deletes the affected alien after each collision
                            aliens.splice(index,1)
                            missiles.splice(missileIndex,1)
                        },0)}})})
             // Collision Detection End

        // This IF statement is what tracks the score requirement for the game Win situation to be met. Upon meeting the requirement, the animation frame is cancelled, the game stops, and the Win screen is displayed. An event listener for a 'keydown' on the 'Enter' key is added so the user can press 'Enter' to reload the page to play again. This event listener is only operable when the score requirement is met.
        if(score >= 250){
            cancelAnimationFrame(animationId)
            winnerScreen.drawWinner()
            addEventListener('keydown', event =>{
                switch(event.key){
                    case 'Enter':
                        // location.reload() reloads the page/window/current URL
                        location.reload()
                }})}}
    gameLoop()

// GAME LOOP END------------------------------------------------


