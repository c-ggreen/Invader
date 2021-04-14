// selecting the canvas element and container in html
const canvas = document.querySelector('canvas')
const container = document.querySelector('.container')

// makes the canvas dimensions(height,width) relative to the container dimensions
canvas.width = container.clientWidth
canvas.height = container.clientHeight

// selecting canvas context will give the ability to draw on the canvas/put artwork on it
const context = canvas.getContext('2d')
console.log(context);



// creating a class for the player
class Player{
    // constructor allows for custom player creation
    constructor(xpos, ypos, radius, color){
        this.xpos = xpos
        this.ypos = ypos
        this.radius = radius
        this.color = color
    }

    // drawPlayer function draws the player onto the screen
    drawPlayer(){
        // .beginPath specifies I want to draw on screen
        context.beginPath()
        // .arc allows us to draw a circle, canvas doesn't have a circle method
        context.arc(this.xpos, this.ypos, this.radius, 0, Math.PI *2, false)
        // .fillStyle passes this.color through the function, allowing the color to appear
        context.fillStyle = this.color
        // .fill allows the player to appear on screen
        context.fill()
    }
}

// x and y coordinates so the player is bottom center in the canvas 
const xcord = canvas.width/2
const ycord = canvas.height/1.125

// creating a new Player from the class already created, then calling the associated function
const player = new Player (xcord, ycord, 20, 'red')
player.drawPlayer()

console.log(player);



