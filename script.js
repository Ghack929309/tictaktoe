const canvas = document.querySelector('.canvasEl')
const ctx = canvas.getContext('2d')
const turn = document.querySelector('.turn')
canvas.width = innerWidth
canvas.height= innerHeight
const width = 60
const height = 60
const playerTurn = ['Your', 'Robot']
turn.innerHTML = playerTurn[Math.floor(Math.random()* playerTurn.length)]
/*TODO GRID 3X3 DONE
  the grid should be clickable TODO DONE
  the grid cells should have the correct player sign displayed an information display//TODO DONE
  should display a message informing the current player it’s their turn//TODO DONE
  should show us who won the game
  should show us if the game ended in a draw
  restart button
    will restart the entire game
 */

/* TODO BREACK DOWN
needs to track any clicks that happen on our cells//TODO DONE
needs to check if a valid move has been made//TODO DONE
needs to make sure nothing happens if an already played cell has been clicked//TODO DONE
we should update our game state
we should validate the game state
check if a player has won
check if the game ended in a draw
either stop the game or change the active player, depending on the above checks
reflect the updates made on the UI
rinse and repeat
 */
class Grid{
    constructor({position,name,pressed}) {
        this.position=position
        this.width=width
        this.height=height
        this.name = name
        this.pressed = pressed
    }

    draw(){
        ctx.fillStyle = 'orange'
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    drawX({coordinate,color}){
        ctx.save()
        ctx.fillStyle=color
        ctx.fillRect(coordinate.x,coordinate.y,10,10)
        ctx.restore()
    }
    drawO({coordinate,color}){
        ctx.save()
        ctx.fillStyle=color
        ctx.fillRect(coordinate.x,coordinate.y,10,10)
        ctx.restore()
    }

}
const map = [
    ['-','-','-',],
    ['-','-','-',],
    ['-','-','-',],
]
const boundaries = []
 map.forEach((row,rowIndex)=>{
    row.forEach((column,columnIndex)=>{
        switch (column){
            case '-':
        boundaries.push(
            new Grid({
                position:{
                    x: columnIndex ===0?(innerWidth/2)-50:(innerWidth/2)-50+(62*columnIndex) ,
                    y: 62 * rowIndex===0?(innerWidth/2)-50:(innerWidth/2)-50+(62*rowIndex)
                },name:`${rowIndex}-${columnIndex}`,
                pressed:false
            })
        )
                break
        }
    })
})

const validMove={
    random:['0-0','0-1','0-2','1-0','1-1','1-2','2-0','2-1','2-2'],
    player:[],
    robot:[]
}

  boundaries.forEach((boundary,index)=>{
      boundary.draw()
      let userMove = true
      addEventListener('mousedown', (e) => {
              if (e.clientX >= boundary.position.x &&
                  e.clientX <= boundary.position.x + 60 &&
                  e.clientY >= boundary.position.y &&
                  e.clientY <= boundary.position.y + 60 &&
                  !boundary.pressed ) {
                  const valid = validMove.random.some(move => move === boundary.name)
                  userMove = valid
                  if (valid) {
                  boundary.drawX({
                      coordinate: {
                          x: boundary.position.x + (width / 2) - 5,
                          y: boundary.position.y + (height / 2) - 5
                      },
                      color: 'red'
                  })
                  console.log(validMove.random)
                      validMove.random.splice(validMove.random.indexOf(boundary.name), 1)
              }
              }
              validMove.play=false
              turn.innerHTML='Robot'

          })


          addEventListener('mouseup', (e) => {
              const randomMove = validMove.random[Math.floor(Math.random() * validMove.random.length)]
              const robotMove = boundaries.find(el => el.name === randomMove)
              const valid = validMove.random.some(move => move === robotMove.name)
              if (e.clientX >= boundary.position.x &&
                  e.clientX <= boundary.position.x + 60 &&
                  e.clientY >= boundary.position.y &&
                  e.clientY <= boundary.position.y + 60 &&
                  valid && userMove
                    ) {
                  setTimeout(()=>{

                  boundary.drawO({
                      coordinate:{
                          x:robotMove.position.x + (width/2)-5,
                          y:robotMove.position.y + (height/2)-5
                      },color:'blue'
                  })
                  validMove.random.splice(validMove.random.indexOf(robotMove.name), 1)
                      turn.innerHTML= "Your"
                  },1000)
                  validMove.play=true
              }

          })

  })


