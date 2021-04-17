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
        this.width = 64;
        this.height = 64;

        this.maxSpeed = 8;
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


// MISSILE CREATION START--------------------------------------
class Missile {
    constructor(){
        this.width = 5;
        this.height = 20;
        this.position = {
            x: player.position.x + 30,
            y: player.position.y -20,
        }
        this.speed = 10
    }
    drawMissile(ctx){
        ctx.fillStyle = '#F46036'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update(deltaTime){
        this.drawMissile(ctx)
        if(!deltaTime){
            return
        }
        // this.position.y -= this.speed/deltaTime
        this.position.y -= this.speed;
    }
}
let missile = new Missile()
missile.drawMissile(ctx)



// class Missile {
//     constructor(){
//         this.x = x;
//         this.y = y;
//         this.radius =radius;
//         this.color = color;
//         this.velocity = this.velocity;
//     }
//     drawMissile(ctx){
//         ctx.beginPath()
//         ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
//         ctx.fillStyle = this.color
//         ctx.fill()
//     }
//     update(){
//         this.x = this.x +this.velocity
//         this.y = this.y + this.velocity
//     }
// }
// let missile = new Missile()
// missile.drawMissile(ctx)

// MISSILE CREATION END--------------------------------------




// INPUT HANDLERS START-------------------------

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
            // alert(event.key)
            switch(event.key){
                case 'ArrowUp':
                    missile.update(deltaTime);
                    break;
            }
        })
    }
}
new MissileInput(missile)




// document.addEventListener('keydown', event =>{
//     const missile = new Missile(
//         player.position.x,
//         player.position.y,
//         5,
//         'red',
//         {
//             x:0,
//             y:-1,
//         }
//     )
//     missile.drawMissile()
//     missile.update()
//     })

// ***** input declarations have to be before gameLoop to work
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

    missile.update(deltaTime)
    // missile.drawMissile(ctx)

    // calls the gameloop again with the next frames timestamp
    requestAnimationFrame(gameLoop)
}
gameLoop()


// GAME LOOP END--------------------------------------


