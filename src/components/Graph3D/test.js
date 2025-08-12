import React from "react";
import Math3D, { Point, Light, Polygon, Edge, Cube, Cone, Cylinder, Paraboloid, Sphere, Torus, Graph } from "../../modules/math3D";

class Graph3D extends React.Component {
    constructor(props) {
        super(props);

        this.LIGHT = new Light(-40, 5, 10, 25000);

        this.WIN = {
            LEFT: -5,
            BOTTOM: -5,
            WIDTH: 10,
            HEIGHT: 10,
            CENTER: new Point(0, 0, 30),
            CAMERA: new Point(0, 0, 50)
        };

        this.scene = new Cube();
        this.math3D = new Math3D({ WIN: this.WIN });
        this.canRotate = false;
        this.dx = 0;
        this.dy = 0;

        this.state = {
            figure: 'Cube',
            color: '#ff0000',
            showPolygons: true,
            showEdges: true,
            showPoints: false
        };

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.interval = setInterval(()=>this.renderFrame(),5)
        this.canvas = new Graph({
            id: 'canvas3D',
            width: 500,
            height: 500,
            WIN: this.WIN,
            callbacks: {
                wheel: event => this.wheel(event),
                mouseup: () => this.mouseup(),
                mousedown: event => this.mousedown(event),
                mousemove: event => this.mousemove(event),
                mouseleave: () => this.mouseleave(),
            }
        });
    }

    componentWillUnmount(){
        if(this.interval){
            clearInterval(this.interval);
            this.interval=null;
        }
    }

    changeFigure = (e) => {
        const figure = e.target.value;
        const figureColors = {
            Cube: '#ff0000',
            Sphere: '#00ff00',
            Torus: '#0000ff',
            Cone: '#ffff00',
            Cylinder: '#ffa500',
            Paraboloid: '#800080',
        };

        this.setState({
            figure,
            color: figureColors[figure]
        }, () => {
            switch (figure) {
                case 'Cube': this.scene = new Cube(); break;
                case 'Sphere': this.scene = new Sphere(); break;
                case 'Torus': this.scene = new Torus(); break;
                case 'Cone': this.scene = new Cone(); break;
                case 'Cylinder': this.scene = new Cylinder(); break;
                case 'Paraboloid': this.scene = new Paraboloid(); break;
                default: this.scene = new Cube();
            };
        });
    }

    handleColorChange = (e) => {
        this.setState({ color: e.target.value }, this.renderFrame);
    }

    handleCheckboxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.checked
        }, this.renderFrame);
    }

    mouseup = () => {
        this.canRotate = false;
    }

    mouseleave = () => {
        this.canRotate = false;
    }

    mousedown = (event) => {
        this.canRotate = true;
        this.dx = event.offsetX;
        this.dy = event.offsetY;
    }

    wheel = (event) => {
        const delta = event.wheelDelta > 0 ? 1.1 : 0.9;
        this.scene.points.forEach(point =>
            this.math3D.zoom(delta, point)
        );
    }

    mousemove = (event) => {
        if (this.canRotate) {
            const gradus = Math.PI / 180 / 10;
            this.scene.points.forEach(point => {
                this.math3D.rotateOy((this.dx - event.offsetX) * gradus, point);
                this.math3D.rotateOx((this.dy - event.offsetY) * gradus, point);
            });
            this.dx = event.offsetX;
            this.dy = event.offsetY;
        }
    }

    renderFrame = () => {
        if (!this.scene) return;

        const { color, showPolygons, showEdges, showPoints } = this.state;

        this.canvas.clear();
        

        if (showPolygons) {
            this.math3D.calcDistance(this.scene, this.LIGHT, 'lumen');
            this.math3D.calcDistance(this.scene, this.WIN.CAMERA, 'distance');
            this.math3D.sortByArtistAlgorithm(this.scene.polygons);

            this.scene.polygons.forEach(polygon => {
                const array = [];
                polygon.setColor(color);
                polygon.points.forEach(index =>
                    array.push({
                        x: this.math3D.xs(this.scene.points[index]),
                        y: this.math3D.ys(this.scene.points[index]),
                    })
                );
                const lumen = this.math3D.calcIllumitation(polygon.lumen, this.LIGHT.lumen);
                let { r, g, b } = polygon.color;
                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);
                this.canvas.polygon(array, polygon.rgbToHex(r, g, b));
            });
        }

        if (showEdges) {
            this.scene.edges.forEach(edge => {
                const p1 = this.scene.points[edge.p1];
                const p2 = this.scene.points[edge.p2];
                this.canvas.line(
                    this.math3D.xs(p1),
                    this.math3D.ys(p1),
                    this.math3D.xs(p2),
                    this.math3D.ys(p2)
                );
            });
        }

        if (showPoints) {
            this.scene.points.forEach(p => this.canvas.point(
                this.math3D.xs(p),
                this.math3D.ys(p)
            ));
        }
    }

    render() {
        const { figure, color, showPolygons, showEdges, showPoints } = this.state;

        return (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <canvas 
                    id='canvas3D' 
                    ref={this.canvasRef} 
                    width={500} 
                    height={500}
                    style={{ 
                        border: '1px solid #000', 
                        marginBottom: '20px',
                        backgroundColor: '#f5f5f5'
                    }}
                ></canvas>
                
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '20px', 
                    alignItems: 'center',
                    padding: '15px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '5px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Фигура:</label>
                        <select 
                            value={figure}
                            onChange={this.changeFigure}
                            style={{ 
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                            }}
                        >
                            <option value="Cube">Куб</option>
                            <option value="Sphere">Сфера</option>
                            <option value="Torus">Тор</option>
                            <option value="Cone">Конус</option>
                            <option value="Cylinder">Цилиндр</option>
                            <option value="Paraboloid">Параболоид</option>
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Цвет:</label>
                        <input 
                            type="color" 
                            value={color}
                            onChange={this.handleColorChange}
                            style={{
                                width: '40px',
                                height: '40px',
                                padding: '2px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                name="showPolygons"
                                checked={showPolygons}
                                onChange={this.handleCheckboxChange}
                                style={{ 
                                    marginRight: '8px',
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer'
                                }}
                            />
                            Полигоны
                        </label>
                        
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                name="showEdges"
                                checked={showEdges}
                                onChange={this.handleCheckboxChange}
                                style={{ 
                                    marginRight: '8px',
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer'
                                }}
                            />
                            Рёбра
                        </label>
                        
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                name="showPoints"
                                checked={showPoints}
                                onChange={this.handleCheckboxChange}
                                style={{ 
                                    marginRight: '8px',
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer'
                                }}
                            />
                            Точки
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default Graph3D;