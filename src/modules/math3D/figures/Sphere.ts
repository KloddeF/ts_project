import Figure from "../entities/Figure";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

class Sphere extends Figure {
    constructor(radius = 7, segments = 24, rings = 12) {
        super();

        this.radius = radius;
        this.segments = segments;
        this.rings = rings;

        this.points = [];
        this.edges = [];
        this.polygons = [];

                


        this.createPoints();
        this.createEdges();
        this.createPolygons(); 
        /*this.createCube();*/
    }

    createPoints() {
        const stepPhi = Math.PI / this.rings;
        const stepTheta = 2 * Math.PI / this.segments;

        for (let i = 0; i <= this.rings; ++i) {
            const phi = i * stepPhi;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            for (let j = 0; j <= this.segments; ++j) {
                const theta = j * stepTheta;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                const x = this.radius * sinPhi * cosTheta;
                const y = this.radius * sinPhi * sinTheta;
                const z = this.radius * cosPhi;

                this.points.push(new Point(x, y, z));
            }
        }
    }

    createEdges() {
        for (let i = 0; i < this.rings; ++i) {
            for (let j = 0; j < this.segments; ++j) {
                const currentIndex = i * (this.segments + 1) + j;
                const nextIndex = currentIndex + 1;
                const nextRingIndex = currentIndex + this.segments + 1;

                this.edges.push(new Edge(currentIndex, nextIndex));
                this.edges.push(new Edge(currentIndex, nextRingIndex));
            }
        }
    }

    createPolygons() {
        for (let i = 0; i < this.rings; ++i) {
            for (let j = 0; j < this.segments; ++j) {
                const currentIndex = i * (this.segments + 1) + j;
                const nextIndex = currentIndex + 1;
                const nextRingCurrentIndex = currentIndex + this.segments + 1;
                const nextRingNextIndex = nextRingCurrentIndex + 1;

                this.polygons.push(new Polygon([
                    currentIndex,
                    nextIndex,
                    nextRingNextIndex,
                    nextRingCurrentIndex
                ]));
            }
        }
    }

    createCube() { 
    let size = 5;

    const startIndex = this.points.length; 

    this.points.push(new Point(-size, size, size));   
    this.points.push(new Point(size, size, size));    
    this.points.push(new Point(size, -size, size));  
    this.points.push(new Point(-size, -size, size));  
    this.points.push(new Point(-size, size, -size));  
    this.points.push(new Point(size, size, -size));   
    this.points.push(new Point(size, -size, -size));  
    this.points.push(new Point(-size, -size, -size)); 

    
    this.edges.push(new Edge(startIndex + 0, startIndex + 1));
    this.edges.push(new Edge(startIndex + 1, startIndex + 2));
    this.edges.push(new Edge(startIndex + 2, startIndex + 3));
    this.edges.push(new Edge(startIndex + 3, startIndex + 0));
    this.edges.push(new Edge(startIndex + 4, startIndex + 5));
    this.edges.push(new Edge(startIndex + 5, startIndex + 6));
    this.edges.push(new Edge(startIndex + 6, startIndex + 7));
    this.edges.push(new Edge(startIndex + 7, startIndex + 4));
    this.edges.push(new Edge(startIndex + 0, startIndex + 4));
    this.edges.push(new Edge(startIndex + 1, startIndex + 5));
    this.edges.push(new Edge(startIndex + 2, startIndex + 6));
    this.edges.push(new Edge(startIndex + 3, startIndex + 7));
}


}

export default Sphere;