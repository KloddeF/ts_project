import Figure from "../entities/Figure";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

class TwoSheetHyperboloid extends Figure {
    constructor(
        minU = -2, 
        maxU = 2, 
        minV = 0, 
        maxV = 2 * Math.PI, 
        resolution = 24,
        gap = 0.1 // зазор между чашами
    ) {
        super();

        this.points = [];
        this.edges = [];
        this.polygons = [];

        const stepV = (maxV - minV) / resolution;

        
        function generateSheet(minU, maxU, vMin, vMax, res, startIndex) {
            const points = [];
            const edges = [];
            const polygons = [];

            const stepU = (maxU - minU) / res;

            // Генерация точек
            for (let i = 0; i <= res; i++) {
                const u = minU + i * stepU;
                for (let j = 0; j <= res; j++) {
                    const v = vMin + j * stepV;

                    const x = Math.sinh(u) * Math.cos(v);
                    const y = Math.sinh(u) * Math.sin(v);
                    const z = Math.cosh(u) * (u < 0 ? -1 : 1);

                    points.push(new Point(x, y, z));
                }
            }

            // Генерация рёбер
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const currentIndex = i * (res + 1) + j + startIndex;
                    const rightIndex = currentIndex + 1;
                    const downIndex = currentIndex + res + 1;

                    edges.push(new Edge(currentIndex, rightIndex));
                    edges.push(new Edge(currentIndex, downIndex));
                }
            }

            // Генерация полигонов
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const currentIndex = i * (res + 1) + j + startIndex;
                    const rightIndex = currentIndex + 1;
                    const downIndex = currentIndex + res + 1;
                    const diagIndex = downIndex + 1;

                    polygons.push(new Polygon([
                        currentIndex,
                        rightIndex,
                        diagIndex,
                        downIndex
                    ]));
                }
            }

            return { points, edges, polygons };
        }

        // Первая чаша (нижняя)
        const sheet1 = generateSheet(minU, -gap, minV, maxV, resolution, 0);

        // Вторая чаша (верхняя)
        const sheet2 = generateSheet(gap, maxU, minV, maxV, resolution, sheet1.points.length);

        // Объединяем данные
        this.points = [...sheet1.points, ...sheet2.points];
        this.edges = [...sheet1.edges, ...sheet2.edges];
        this.polygons = [...sheet1.polygons, ...sheet2.polygons];
    }
}

export default TwoSheetHyperboloid;