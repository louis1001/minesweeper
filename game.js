
class Game{
    constructor(sz, bombs){
        this.sz = sz.copy()
        this.cellSize = min((width-1)/this.sz.x, (height-1)/this.sz.y)
        this.initGrid()
        this.initedBombs = false
        this.numBombs = bombs
    }

    initGrid(){
        const newGrid = []
        for(let i = 0; i < this.sz.x; i++){
            const newRow = []
            for(let j = 0; j < this.sz.y; j++){
                const pos = createVector(i, j)
                const sz = createVector(this.cellSize, this.cellSize)
                const newCell = new Cell(pos, sz)
                newRow.push(newCell)
            }
            newGrid.push(newRow)
        }

        newGrid.forEach(row => {
            row.forEach(cell => {
                for(let i = -1; i < 2; i++){
                    for(let j = -1; j < 2; j++){
                        if (i == 0 && j == 0) continue

                        const row = newGrid[cell.pos.x+i]
                        if (row){
                            const neighbor = row[cell.pos.y+j]
                            if (neighbor){
                                cell.neighbors.push(neighbor)
                            }
                        }
                    }
                }
            })
        })

        this.grid = newGrid
        this.bombCells = []
    }

    cellsThat(test){
        const cells = []
        this.grid.forEach(row=>{
            row.forEach(x=>{
                if(test(x)){
                    cells.push(x)
                }
            })
        })

        return cells
    }

    toGridSpace(x, y){
        return createVector(Math.floor(x / this.cellSize), Math.floor(y / this.cellSize))
    }

    cellAt(x, y){
        let newX = x
        let newY = y
        if (x instanceof p5.Vector){
            newY = x.y
            newX = x.x
        }
        const row = this.grid[Math.floor(newX)]

        if (row){
            return row[Math.floor(newY)]
        } else {
            return null
        }
    }

    clickCell(x, y, px=false, ignoreFlag=false){
        let nX = x
        let nY = y
        if (px){
            nX = x / this.cellSize
            nY = y / this.cellSize
        }

        const pickedCell = this.cellAt(nX, nY)
        if (!pickedCell || pickedCell.flagCount == 1) return null

        const wasHidden = pickedCell.hidden

        pickedCell.hidden = false
        if (!this.initedBombs){
            this.initBombs()
        }
        
        if (pickedCell.isBomb){
            this.gameOver(pickedCell)
        } else if (pickedCell.bombCount == 0){
            pickedCell.neighbors.forEach(cell => {
                if (cell.hidden){
                    this.clickCell(cell.pos.x, cell.pos.y)
                }
            })
        }

        if (!wasHidden){
            const flaggedBombs = pickedCell.neighbors.filter(
                x => x.flagCount==1).length
            if (flaggedBombs == pickedCell.bombCount){
                pickedCell.neighbors.forEach(x=>{
                    if (x.hidden)
                        this.clickCell(x.pos.x, x.pos.y)
                })
            }
        }
    }

    flagCell(x, y, px=false){
        let nX = x
        let nY = y
        if (px){
            nX = x / this.cellSize
            nY = y / this.cellSize
        }

        const pickedCell = this.cellAt(nX, nY)
        if (!pickedCell) return null

        if(pickedCell.hidden){
            pickedCell.toggleFlag()
        }
    }

    initBombs(){
        const numBombs = 100

        while(this.bombCells.length < this.numBombs){
            const randomCell = random(random(this.grid))

            if (randomCell.hidden && !randomCell.isBomb){
                randomCell.isBomb = true
                this.bombCells.push(randomCell)
            }
        }

        this.grid.forEach(row => {
            row.forEach(cell => {
                if (!cell.isBomb){
                    cell.bombCount = cell.neighbors.filter(x => x.isBomb).length
                }
            })
        })
    }

    gameOver(cellHit){
        cellHit.isExplosion = true

        this.bombCells.forEach(x =>{
            if(x.flagCount != 1) x.hidden = false
        })

        const wronglyFlagged = this.cellsThat(x=>(x.flagCount==1 && !x.isBomb))

        wronglyFlagged.forEach(x=>{x.failed = true})
    }

    render(){
        this.grid.forEach(row => {
            row.forEach(cell => {
                cell.render()
            })
        })
    }
}