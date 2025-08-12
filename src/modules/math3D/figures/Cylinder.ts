import Figure from "../entities/Figure";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

class Cylinder extends Figure {
    constructor(count = 24, radius = 5, height = 12) {
        super();
        this.points = [];
        this.edges = [];
        this.polygons = [];

        const dPhi = (2 * Math.PI) / count;

        // Создаем боковую поверхность (точки)
        for (let i = 0; i <= count; i++) {
            const phi = i * dPhi;
            const x = radius * Math.cos(phi);
            const y = radius * Math.sin(phi);

            this.points.push(new Point(x, y, -height / 2)); // Нижний уровень
            this.points.push(new Point(x, y, height / 2));  // Верхний уровень
        }

        // Создаем рёбра
        for (let i = 0; i < count; i++) {
            // Горизонтальные рёбра (окружности)
            const lower1 = i * 2;
            const lower2 = (i + 1) * 2;
            this.edges.push(new Edge(lower1, lower2)); // Нижнее кольцо

            const upper1 = lower1 + 1;
            const upper2 = lower2 + 1;
            this.edges.push(new Edge(upper1, upper2)); // Верхнее кольцо

            // Вертикальные рёбра (столбики)
            this.edges.push(new Edge(lower1, upper1));
        }

        // Создаем полигоны боковой поверхности (с правильным порядком вершин)
        for (let i = 0; i < count; i++) {
            const lower1 = i * 2;
            const lower2 = (i + 1) * 2;
            const upper1 = lower1 + 1;
            const upper2 = lower2 + 1;

            // Важно: порядок вершин должен быть против часовой стрелки (если смотреть снаружи)
            this.polygons.push(new Polygon([lower1, lower2, upper2, upper1], '#ffff00'));
        }

       
    }

}

export default Cylinder;