import Figure from "../entities/Figure";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

class Ellipsoid extends Figure {
    constructor(
        radiusX = 10, 
        radiusY = 7, 
        radiusZ = 5, 
        segments = 24, 
        rings = 12
    ) {
        super();

        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.radiusZ = radiusZ;
        this.segments = segments;
        this.rings = rings;

        this.points = [];
        this.edges = [];
        this.polygons = [];

        this.createPoints();
        this.createEdges();
        this.createPolygons();
    }

    createPoints() {
        const stepPhi = Math.PI / this.rings;
        const stepTheta = 2 * Math.PI / this.segments;

        for (let i = 0; i <= this.rings + 1; ++i) {
            const phi = i * stepPhi;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            for (let j = 0; j <= this.segments; ++j) {
                const theta = j * stepTheta;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                // Основное изменение - разные радиусы по осям
                const x = this.radiusX * sinPhi * cosTheta;
                const y = this.radiusY * sinPhi * sinTheta;
                const z = this.radiusZ * cosPhi;

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
}

export default Ellipsoid;