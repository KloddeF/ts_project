import Figure from "../entities/Figure";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

class Cone extends Figure {
    constructor(height = 10, radius = 5, slices = 16) {
        super();
        const pointsCount = slices + 1;
        const da = 2 * Math.PI / slices;

        // точки
        this.points = [];
        for (let i = 0; i < pointsCount; i++) {
            const angle = i * da;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const z = 0;
            this.points.push(new Point(x, y, z));
        }
        // вершина
        this.points.push(new Point(0, 0, height));

        // ребра
        this.edges = [];
        for (let i = 0; i < slices; i++) {
            this.edges.push(new Edge(i, (i + 1) % slices));
            this.edges.push(new Edge(i, pointsCount));
        }

        // полигоны
        this.polygons = [];
        for (let i = 0; i < slices; i++) {
            this.polygons.push(new Polygon([i, (i + 1) % slices, pointsCount]));
        }

        //  дно конуса
        this.polygons.push(new Polygon(Array.from({ length: slices }, (_, i) => i)));
    }
}

export default Cone;