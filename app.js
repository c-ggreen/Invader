const canvas = document.querySelector('canvas')
ctx = canvas.getContext('2d')

canvas.width = innerWidth*.8
canvas.height = innerHeight*.8
const screenWidth = canvas.width
const screenHeight = canvas.height

ctx.clearRect(0,0,screenWidth,screenHeight)

// images-----
let playerIcon = document.getElementById('playerIcon');


// PLAYER CREATION START------------------------------
class Player {
    constructor(screenWidth, screenHeight){
        this.width = 50;
        this.height = 50;

        this.maxSpeed = 5;
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
        if(!deltaTime) return;
        // moves 5 pixels per second
        this.position.x += 1/deltaTime

        // update for moveLeft
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

    moveLeft(){
        this.speed = -this.maxSpeed
    }
    moveRight(){
        this.speed = this.maxSpeed
    }

    stop(){
        this.speed = 0
    }
}

let player = new Player(screenWidth,screenHeight)
player.drawPlayer(ctx)
// PLAYER CREATION END--------------------------------





// INPUT HANDLERS START-------------------------
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
                        player.stop
                    };
                    break;
                case 'ArrowRight':
                    // makes stopping seamless/removes stuttering
                    // if a player is moving right then stop
                    if(player.speed > 0){
                        player.stop
                    };
                    break;
                
            }

        })
    }
}
new InputHandler(player)
// INPUT HANDLERS END---------------------------


// GAME LOOP START------------------------------------
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

    // calls the gameloop again with the next frames timestamp
    requestAnimationFrame(gameLoop)
}
gameLoop()


// GAME LOOP END--------------------------------------


