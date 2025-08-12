import Figure from "../entities/Figure";
import Point from "../entities/Point";
import Edge from "../entities/Edge";
import Polygon from "../entities/Polygon";

class Torus extends Figure {
    constructor(innerRadius = 3, outerRadius = 5, segments = 32, rings = 32) {
        super();
        this.points = [];
        this.edges = [];
        this.polygons = [];

        for (let i = 0; i < rings; i++) {
            const theta = (i / rings) * Math.PI * 2; 
            for (let j = 0; j < segments; j++) {
                const phi = (j / segments) * Math.PI * 2; 
                const x = (outerRadius + innerRadius * Math.cos(phi)) * Math.cos(theta);
                const y = (outerRadius + innerRadius * Math.cos(phi)) * Math.sin(theta);
                const z = innerRadius * Math.sin(phi);
                this.points.push(new Point(x, y, z));
            }
        }

        for (let i = 0; i < rings; i++) {
            for (let j = 0; j < segments; j++) {
                const nextI = (i + 1) % rings;
                const nextJ = (j + 1) % segments;

            
                this.edges.push(new Edge(i * segments + j, nextI * segments + j));
                
                this.edges.push(new Edge(i * segments + j, i * segments + nextJ));
            }
        }


        for (let i = 0; i < rings; i++) {
            for (let j = 0; j < segments; j++) {
                const nextI = (i + 1) % rings;
                const nextJ = (j + 1) % segments;

                this.polygons.push(new Polygon([
                    i * segments + j,
                    nextI * segments + j,
                    nextI * segments + nextJ,
                    i * segments + nextJ
                ]));
            }
        }
    }
}

export default Torus;