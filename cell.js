
class Cell{
    constructor(pos, sz, isBomb = false){
        this.pos = pos
        this.sz = sz
        this.pxSz = createVector(pos.x * sz.x, pos.y * sz.y)

        this.isBomb = isBomb
        this.isExplosion = false
        this.hidden = true
        this.failed = false
        this.flagCount = 0
        this.neighbors = []
        this.bombCount = 0

        this.numberColors = [
            "#0951D8FF",
            "#019c16",
            "#D80909FF",
            "#6309D8FF",
            "#850000FF",
            "#A8FF07FF",
            "#07CDFFFF",
            "#4f00A8FF"
        ]
    }

    toggleFlag(){
        this.flagCount = (this.flagCount+1)%3
    }

    render(){
        push()
        // Style based on this cell's state.

        //rect(this.pxSz.x, this.pxSz.y, this.sz.x, this.sz.y)
        let imgToRender = sprites['hidden']
        if (this.hidden){
            if (this.flagCount == 1){
                imgToRender = sprites['flag']
            }
        } else {
            imgToRender = sprites['empty']
            if (this.isExplosion){
                imgToRender = sprites['explosion']
            } else if (this.isBomb){
                imgToRender = sprites['bomb']
            }
        }

        image(imgToRender, this.pxSz.x, this.pxSz.y, this.sz.x, this.sz.y)

        noStroke()
        fill(0)
        textSize(this.sz.y * 0.7)
        textAlign(CENTER, CENTER)
        const textPos = createVector(
            this.pxSz.x + this.sz.x/2,
            this.pxSz.y + (this.sz.y/2.5)
        )

        if (this.failed){
            image(
                sprites['bomb'],
                this.pxSz.x,
                this.pxSz.y,
                this.sz.x,
                this.sz.y
            )

            stroke(255, 0, 0)
            strokeWeight(2)

            const pad = this.sz.x * 0.8
            line(
                this.pxSz.x + pad,
                this.pxSz.y + pad,
                this.pxSz.x + this.sz.x - pad,
                this.pxSz.y + this.sz.y - pad
            )

            line(
                this.pxSz.x + this.sz.x - pad,
                this.pxSz.y + pad,
                this.pxSz.x + pad,
                this.pxSz.y + this.sz.y - pad
            )
        } else if(!this.hidden){
            if (this.bombCount != 0){
                const col = this.numberColors[this.bombCount-1]
                fill(col)
                text(this.isBomb ? "*" : this.bombCount, textPos.x, textPos.y)
            }
        } else if (this.flagCount == 2) {
            fill(100)
            text('?', textPos.x, textPos.y)
        }
        pop()
    }
}