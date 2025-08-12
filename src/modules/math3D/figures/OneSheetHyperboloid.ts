import Figure from "../entities/Figure";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

class OneSheetHyperboloid extends Figure {
    constructor(
        minU = -1, 
        maxU = 1, 
        minV = 0, 
        maxV = 2 * Math.PI, 
        resolution = 24
    ) {
        super();

        this.points = [];
        this.edges = [];
        this.polygons = [];

        const stepU = (maxU - minU) / resolution;
        const stepV = (maxV - minV) / resolution;

        // Генерация точек для однополостного гиперболоида
        for (let i = 0; i <= resolution; i++) {
            const u = minU + i * stepU;
            for (let j = 0; j <= resolution; j++) {
                const v = minV + j * stepV;
                
                // Уравнение однополостного гиперболоида: x² + y² - z² = 1
                const x = Math.cosh(u) * Math.cos(v);
                const y = Math.cosh(u) * Math.sin(v);
                const z = Math.sinh(u);

                this.points.push(new Point(x, y, z));
            }
        }

        // Генерация рёбер
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

export default OneSheetHyperboloid;