class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.isHighlight = false
    }

    show() {
        strokeWeight(4)
        point(this.x, this.y)
    }
}

class Rectangle {
    constructor(centerPoint, halfWidth, halfHeight) {
        this.centerPoint = centerPoint
        this.halfWidth = halfWidth
        this.halfHeight = halfHeight
    }

    contains(point) {
        return point.x >= this.centerPoint.x - this.halfWidth &&
            point.x <= this.centerPoint.x + this.halfWidth &&
            point.y >= this.centerPoint.y - this.halfHeight &&
            point.y <= this.centerPoint.y + this.halfHeight
    }

    intersects(range) {
        const tl1 = this.getTopLeftPoint()
        const br1 = this.getBottomRightPoint()
        const tl2 = range.getTopLeftPoint()
        const br2 = range.getBottomRightPoint()

        return !(tl1.x > br2.x || tl2.x > br1.x ||
            tl1.y > br2.y || tl2.y > br1.y)
    }

    getTopLeftPoint() {
        return new Point(this.centerPoint.x - this.halfWidth, this.centerPoint.y - this.halfHeight)
    }

    getBottomRightPoint() {
        return new Point(this.centerPoint.x + this.halfWidth, this.centerPoint.y + this.halfHeight)
    }
}

class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary
        this.capacity = capacity
        this.points = []
    }

    insert(point) {
        if(!this.boundary.contains(point)) {
            return false
        }

        if(this.points.length < this.capacity) {
            this.points.push(point)
            return true
        }

        if(!this.isSubdivided()) {
            this.subdivide();
        }

        return this.northWest.insert(point) ||
            this.northEast.insert(point) ||
            this.southWest.insert(point) ||
            this.southEast.insert(point)
    }

    isSubdivided() {
        return this.northWest !== undefined
    }

    subdivide() {
        const x = this.boundary.centerPoint.x
        const y = this.boundary.centerPoint.y
        const newWidth = this.boundary.halfWidth / 2
        const newHeight = this.boundary.halfHeight / 2

        this.northWest = new QuadTree(new Rectangle(new Point(x - newWidth, y - newHeight), newWidth, newHeight), this.capacity)
        this.northEast = new QuadTree(new Rectangle(new Point(x + newWidth, y - newHeight), newWidth, newHeight), this.capacity)
        this.southWest = new QuadTree(new Rectangle(new Point(x - newWidth, y + newHeight), newWidth, newHeight), this.capacity)
        this.southEast = new QuadTree(new Rectangle(new Point(x + newWidth, y + newHeight), newWidth, newHeight), this.capacity)
    }

    query(range) {
        if(!this.boundary.intersects(range)) {
            return [];
        }

        const foundPoints = []

        for(let p of this.points) {
            if(range.contains(p)) {
                foundPoints.push(p)
            }
        }

        if(!this.isSubdivided()) {
            return foundPoints
        }

        return foundPoints.concat(
            this.northWest.query(range),
            this.northEast.query(range),
            this.southWest.query(range),
            this.southEast.query(range))
    }

    show(displayGrid) {
        stroke(255)
        if(displayGrid) {
            rectMode(CENTER)
            strokeWeight(1)
            noFill()

            rect(this.boundary.centerPoint.x, this.boundary.centerPoint.y, this.boundary.halfWidth * 2, this.boundary.halfHeight * 2)
        }

        if(this.isSubdivided()) {
            this.northWest.show(displayGrid)
            this.northEast.show(displayGrid)
            this.southWest.show(displayGrid)
            this.southEast.show(displayGrid)
        }

        for(let p of this.points) {
            p.show()
        }
    }
}