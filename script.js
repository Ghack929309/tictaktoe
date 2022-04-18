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
    constructor({position,name,pressed,finish}) {
        this.position=position
        this.width=width
        this.height=height
        this.name = name
        this.pressed = pressed
        this.finish = finish
    }

    draw() {
        ctx.fillStyle = 'orange'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    drawX({coordinate, color}) {
        if(!this.finish){
        ctx.save()
        ctx.fillStyle = color
        ctx.fillRect(coordinate.x, coordinate.y, 10, 10)
        ctx.restore()
        }

    }

    drawO({coordinate, color}) {
        if(!this.finish) {
            ctx.save()
            ctx.fillStyle = color
            ctx.fillRect(coordinate.x, coordinate.y, 10, 10)
            ctx.restore()
        }
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
                    x: columnIndex ===0?(innerWidth/2)-90:(innerWidth/2)-90+(62*columnIndex) ,
                    y: 62 * rowIndex===0?(innerWidth/2)-360:(innerWidth/2)-360+(62*rowIndex)
                },name:`${rowIndex}-${columnIndex}`,
                pressed:false,
                finish:false
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

function startGame(e,boundary) {
        if (e.clientX >= boundary.position.x &&
            e.clientX <= boundary.position.x + 60 &&
            e.clientY >= boundary.position.y &&
            e.clientY <= boundary.position.y + 60) {
            const valid = validMove.random.some(move => move === boundary.name)
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
                validMove.play = false
                turn.innerHTML = 'Robot'
                if (validMove.player.length >= 3) {
                    if (winnerFunction(validMove.player)){
                    document.getElementById('player').innerHTML = ++score
                        validMove.random=[]
                    }
                }
            }
        }
        boundary.finish =winnerFunction(validMove.player)
}

function moveRobot(e,boundary){
        const randomMove = validMove.random[Math.floor(Math.random() * validMove.random.length)]
        const robotMove = boundaries.find(el => el.name === randomMove)
        const valid = validMove.random.some(move => move === robotMove.name)
        if (e.clientX >= boundary.position.x &&
            e.clientX <= boundary.position.x + 60 &&
            e.clientY >= boundary.position.y &&
            e.clientY <= boundary.position.y + 60 &&
            valid
        ) {
            setTimeout(() => {

                boundary.drawO({
                    coordinate: {
                        x: robotMove.position.x + (width / 2) - 5,
                        y: robotMove.position.y + (height / 2) - 5
                    }, color: 'blue'
                })
                validMove.robot.push(randomMove)
                if (validMove.robot.length >= 3) {
                    if (winnerFunction(validMove.robot)){
                    document.getElementById('robot').innerHTML = ++score
                        validMove.robot=[]
                    }
                }
                validMove.random.splice(validMove.random.indexOf(robotMove.name), 1)
                turn.innerHTML = "Your"
            }, 1000)

        }
    boundary.finish =winnerFunction(validMove.player)
}

  boundaries.forEach((boundary)=>{
      boundary.draw()
      addEventListener('mousedown', (e) => startGame(e,boundary))
      addEventListener('mouseup', (e) => moveRobot(e,boundary))
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
let result = false
    winnerPath.some(winner=>{
       const sortWinner = winner.sort()
       const sortPath = paths.sort()
      if(JSON.stringify(sortPath)===JSON.stringify(sortWinner)){
          return result=true
      }else{
         const tracker =[]
         return sortWinner.forEach((win)=>{
              sortPath.forEach((path)=>{
                  if(win===path){
                      tracker.push(path)
                      if(tracker.length>2){
                          return result = true
                      }
                  }
              })
          })
      }
    })
    return result
}


