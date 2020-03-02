let quadTree
let displayGrid = false

function setup() {
    const localWidth = 1000
    const localHeight = 800
    const capacity = 4
    const numberOfRandomPoints = 1000

    createCanvas(localWidth, localHeight)

    let boundary = new Rectangle(new Point(localWidth / 2, localHeight / 2), localWidth / 2, localHeight / 2)
    quadTree = new QuadTree(boundary, capacity)

    for(let i = 0; i < numberOfRandomPoints; i++) {
        quadTree.insert(new Point(random(width), random(height)))
    }
}

function draw() {
    background(0);

    quadTree.show(displayGrid)

    const range = new Rectangle(new Point(mouseX, mouseY), 80, 80)

    showRangeResult(range, quadTree.query(range))
}

const showRangeResult = (range, points) => {
    stroke(0, 255, 0)
    strokeWeight(2)
    noFill()
    rectMode(CENTER)

    rect(range.centerPoint.x, range.centerPoint.y, range.halfWidth * 2, range.halfHeight * 2)

    for(let p of points) {
        p.show()
    }
}