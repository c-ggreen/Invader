// calling the canvas in HTML and setting the context
const canvas = document.querySelector('canvas')
ctx = canvas.getContext('2d')

// determining the canvas width and height; creating the screenWidth/Height variables
canvas.width = innerWidth*.8
canvas.height = innerHeight*.8
const screenWidth = canvas.width
const screenHeight = canvas.height

// console.log(canvas.width);

// images/icons-----
let playerIcon = document.getElementById('playerIcon');
let alienIcon = document.getElementById('alienIcon');

// PLAYER CREATION START----------------------------------------
class Player {
    constructor(screenWidth, screenHeight){
        this.width = 48;
        this.height = 48;

        this.maxSpeed = 10;
        this.speed = 0;

        this.position = {
            x: screenWidth/2 - this.width/2,
            y: screenHeight - this.height - 10,
        }
    }
    drawPlayer(ctx){
        ctx.drawImage(playerIcon,this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime){
        // deltaTime is 0 at first so this is needed to end the gameLoop the first time so deltaTime can count up and the code can run. 
        if(!deltaTime){
            return
        };

        // this is for general movement of the player utilizing the moveRight, moveLeft, and stop methods; it dictates the speed & direction.
        this.position.x += this.speed;
        
        // stops player from moving offscreen to the left
        if(this.position.x < 0){
            this.position.x = 0
        }
        // stops player from moving offscreen to the right
        if(this.position.x + this.width > screenWidth){
            this.position.x = screenWidth - this.width
        }
    }

    // Player move left
    moveLeft(){
        this.speed = -this.maxSpeed
    }
    // Player move right
    moveRight(){
        this.speed = this.maxSpeed
    }
    // Player stop
    stop(){
        this.speed = 0
    }
}

let player = new Player(screenWidth,screenHeight)
player.drawPlayer(ctx)
// PLAYER CREATION END------------------------------------------


// MISSILE CREATION START--------------------------------------

// missiles array is needed to draw multiple missiles on canvas; each spacebar keydown event pushes a new missile into the array
const missiles = []

// missile class
class Missile {
    constructor(){
        this.width = 5;
        this.height = 20;
        // setting the missile to always be at the players position, adjustments of +30 and -20 were needed to center missile object for aesthetic purposes.
        // NOTE: Whenever resizing Player icon, Missile position must be adjusted as well.*****
        this.position = {
            x: player.position.x + 22.5,
            y: player.position.y - 20,
        }

        // how fast the missile moves on the screen
        this.speed = 20
    }
    drawMissile(ctx){
        ctx.fillStyle = '#F46036'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update(deltaTime){
        // putting the drawMissile method in the update method allows the missile to be drawn everytime the update method runs.
        this.drawMissile(ctx)

        // code works without this but I'll keep it just in case
        // if(!deltaTime){
        //     return
        // }

        // sets the direction of the missile on the y-axis so that it goes up by whatever this.speed is. The -= is so that it decreases as it goes along the y-axis.
        this.position.y -= this.speed;

    }
}
let missile = new Missile()
missile.drawMissile(ctx)

// MISSILE CREATION END-----------------------------------------


// ALIEN CREATION START-----------------------------------------
// aliens array, similar to missile array it draws multiple aliens onto the screen
const aliens = []

// alien class
class Alien{
    constructor(){
        this.width = 64;
        this.height = 64;

        // allows the aliens to spawn anywhere within the height and width of the screen; makes spawning relative to screen size and not static.
        this.position = {
            x:Math.random() * (screenWidth - 0)+0,
            // IMPORTANT: Aliens can only spawn towards the top of the y-axis, hence the screenHeight*.1
            y:Math.random() * (screenHeight*.1 - 0)+0,
        }

        // randomizes the speed at which the aliens move between 1 and 2 pixels.
        this.speed = Math.random() * (2 -1)+1
    }
    drawAlien(ctx){
        ctx.drawImage(alienIcon, this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.drawAlien(ctx)

        // for the speed and direction of the alien
        this.position.y += this.speed

        // stops alien from moving offscreen to the left
        if(this.position.x < 0){
            this.position.x = 0
        }
        // stops alien from moving offscreen to the right
        if(this.position.x + this.width > screenWidth){
            this.position.x = screenWidth - this.width
        }
    }

}
let alien = new Alien()
alien.drawAlien(ctx)

// function that spawns aliens every second(s) (1s = 1000ms)
function spawnAliens(){
    setInterval(()=>{
        aliens.push(new Alien())
    }, 750)
}
spawnAliens() //remember to call function so it actually works


// ALIEN CREATION END-------------------------------------------



// INPUT HANDLERS START-----------------------------------------

// -----Player Inputs
class InputHandler{
    constructor(player){
        // event listener for keydown event
        document.addEventListener('keydown', event =>{
            switch(event.key){
                case 'ArrowLeft':
                    player.moveLeft();
                    break;
                case 'ArrowRight':
                    player.moveRight();
                    break;
                
            }

        })

        document.addEventListener('keyup', event =>{
            switch(event.key){
                case 'ArrowLeft':
                    // makes stopping seamless/removes stuttering
                    // if a player is moving left then stop
                    if(player.speed < 0){
                        player.stop()
                    };
                    break;
                case 'ArrowRight':
                    // makes stopping seamless/removes stuttering
                    // if a player is moving right then stop
                    if(player.speed > 0){
                        player.stop()
                    };
                    break;
                
            }

        })
    }
}
new InputHandler(player)

// -----Missile Inputs
class MissileInput {
    constructor(missile){
        document.addEventListener('keydown', event =>{
            switch(event.key){
                case ' ':
                    // this creates a new missile everytime space is pushed, making it so that the .forEach function in the gameLoop runs
                    missiles.push(new Missile)
                    break;
            }
        })
    }
}
new MissileInput(missile)

// INPUT HANDLERS END-------------------------------------------


// GAME LOOP START----------------------------------------------
// is needed to move the objects on the screen; refreshes and updates each frame/positioning

let lastTime = 0

function gameLoop(timestamp){
    // calculates time passed
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp

    // this clears the screen each frame
    ctx.clearRect(0,0,screenWidth,screenHeight)
    // this updates the player position
    player.update(deltaTime)
    // this redraws the player
    player.drawPlayer(ctx)

    // everytime the missile event listener is triggered the forEach runs the missile update class method
    missiles.forEach((missile, index)=>{
        missile.update(deltaTime)

        // deletes a missile after it goes off screen, allowing for better game processing/performance over time.
        if(missile.position.y < 0){
            setTimeout(()=>{
                missiles.splice(index,1)
            },0)
        }
        
    })

    // draws new aliens onto the screen in conjunction with the spawnAliens function
    aliens.forEach((alien, index)=>{
        alien.update()

        // Collision Detection Start
        missiles.forEach((missile, missileIndex) =>{
            if(
                missile.position.x < alien.position.x +     alien.width &&
                missile.position.x + missile.width > alien.position.x &&
                missile.position.y < alien.position.y + alien.height &&
                missile.position.y + missile.height > alien.position.y
            ) 
                { 
                    // setTimeout gets rid of alienIcon flash that occurs when they are deleted
                    setTimeout(()=>{
                        // deletes the missile and alien if they touch, add the 1 so that it only deletes 1 alien after each collision
                        aliens.splice(index,1)
                        missiles.splice(missileIndex,1)
                    },0)
                }
            }
        )
        // Collision Detection End

    })


    // calls the gameloop again with the next frames timestamp
    requestAnimationFrame(gameLoop)
}
gameLoop()


// GAME LOOP END------------------------------------------------



