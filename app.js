const canvas = document.querySelector('canvas')
ctx = canvas.getContext('2d')

canvas.width = innerWidth*.8
canvas.height = innerHeight*.8
const screenWidth = canvas.width
const screenHeight = canvas.height

ctx.clearRect(0,0,screenWidth,screenHeight)


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
        ctx.fillStyle = '#F46036'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime){
        if(!deltaTime) return;
        // moves 5 pixels per second
        this.position.x += 5/deltaTime

        // update for moveLeft
        this.position.x += this.speed;
    }

    moveLeft(){
        this.speed = -this.maxSpeed
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
            switch(event.keyCode){
                case 37:
                    player.moveLeft();
                    break;
                case 39:
                    alert('move right');
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


