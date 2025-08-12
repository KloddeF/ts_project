import Figure from "../entities/Figure";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

class EllipticParaboloid extends Figure {
    constructor(
        minX = -1, 
        maxX = 1, 
        minZ = -1, 
        maxZ = 1, 
        resolution = 24,
        a = 1, // Коэффициент для x²
        b = 1  // Коэффициент для z²
    ) {
        super();

        // Генерация точек
        this.points = [];
        const stepX = (maxX - minX) / resolution;
        const stepZ = (maxZ - minZ) / resolution;

        for (let i = 0; i <= resolution; i++) {
            const x = minX + i * stepX;
            for (let j = 0; j <= resolution; j++) {
                const z = minZ + j * stepZ;
                // Уравнение эллиптического параболоида: y = (x²)/a² + (z²)/b²
                const y = (x * x) / (a * a) + (z * z) / (b * b);
                this.points.push(new Point(x, y, z));
            }
        }

        // Генерация рёбер
        this.edges = [];
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const currentIndex = i * (resolution + 1) + j;
                const rightIndex = currentIndex + 1;
                const downIndex = currentIndex + resolution + 1;

                this.edges.push(new Edge(currentIndex, rightIndex));
                this.edges.push(new Edge(currentIndex, downIndex));
            }
        }

        // Генерация полигонов
        this.polygons = [];
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const currentIndex = i * (resolution + 1) + j;
                const rightIndex = currentIndex + 1;
                const downIndex = currentIndex + resolution + 1;
                const diagIndex = downIndex + 1;

                this.polygons.push(new Polygon([
                    currentIndex,
                    rightIndex,
                    diagIndex,
                    downIndex
                ]));
            }
        }
    }
}

export default EllipticParaboloid;