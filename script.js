const canvas = document.querySelector('.canvasEl')
const ctx = canvas.getContext('2d')
const turn = document.querySelector('.turn')
canvas.width = innerWidth
let score = 0
canvas.height= innerHeight
const width = 60
const height = 60
const playerTurn = ['Your', 'Robot']
turn.innerHTML = playerTurn[Math.floor(Math.random()* playerTurn.length)]

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
                  e.clientY <= boundary.position.y + 60 ) {
                  const valid = validMove.random.some(move => move === boundary.name)
                  userMove = valid
                  if (valid) {
                      boundary.pressed = true
                  boundary.drawX({
                      coordinate: {
                          x: boundary.position.x + (width / 2) - 5,
                          y: boundary.position.y + (height / 2) - 5
                      },
                      color: 'red'
                  })
                      validMove.player.push(boundary.name)
                      validMove.random.splice(validMove.random.indexOf(boundary.name), 1)
              validMove.play=false
              turn.innerHTML='Robot'
              }

          if(validMove.player.length>=3){
              const winner = winnerFunction(validMove.player)
              if(winner){
                  score++
                  document.getElementById('player').innerHTML= score

              }else{
                  validMove.player=[]
              }
          }
              }


          })


          addEventListener('mouseup', (e) => {
              const winner = winnerFunction(validMove.robot)
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
                      validMove.robot.push(randomMove)
                  validMove.random.splice(validMove.random.indexOf(robotMove.name), 1)
                      turn.innerHTML= "Your"
                  },1000)
                  console.log(validMove.robot)
                  if(validMove.robot.length>=3){

                      if(winner){
                          score++
                         document.getElementById('robot').innerHTML=score
                      }else{
                          validMove.robot=[]
                      }
                  }
              }

          })

  })
//define the winner function
function winnerFunction (paths){
const winnerPath = [
    ['0-0','0-1','0-2'],
    ['1-0','1-1','1-2'],
    ['2-0','2-1','2-2'],
    ['2-0','1-1','0-2'],
    ['2-0','1-0','0-0'],
    ['2-1','1-1','0-1'],
    ['2-2','1-2','0-2'],
    ['0-0','1-1','2-2'],

]
    return winnerPath.some(row => {
    const sortedRow = row.sort()
    const sortedPath = paths.sort()
    return JSON.stringify(sortedPath) === JSON.stringify(sortedRow)

})
}


