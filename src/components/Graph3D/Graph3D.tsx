import Math3D, { Point, Light, Polygon, Edge, Cube, Cone, Cylinder, Paraboloid,
                 Sphere, Torus, Ellipsoid, OneSheetHyperboloid, TwoSheetHyperboloid, EllipticParaboloid, Graph } from "../../modules/math3D";

import { useState, useRef, useEffect } from "react";


const Graph3D = () => {
    const [state, setState] = useState({
        figure: 'Cube',
        color: '#ff0000',
        showPolygons: true,
        showEdges: true,
        showPoints: false,
        lumen: 1.0 
    });

    const sceneRef = useRef(new Cube());
    const math3DRef = useRef(null);
    const canvasRef = useRef(null);
    const canRotateRef = useRef(false);
    const mousePosRef = useRef({ dx: 0, dy: 0 });
    const lightRef = useRef(new Light(-40, 5, 10, 25000));
    const winRef = useRef({
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        CENTER: new Point(0, 0, 30),
        CAMERA: new Point(0, 0, 50)
    });

   
    useEffect(() => {
        math3DRef.current = new Math3D({ WIN: winRef.current });
        
        const canvas = new Graph({
            id: 'canvas3D',
            width: 500,
            height: 500,
            WIN: winRef.current,
            callbacks: {
                wheel: handleWheel,
                mouseup: handleMouseUp,
                mousedown: handleMouseDown,
                mousemove: handleMouseMove,
                mouseleave: handleMouseLeave,
            }
        });
        canvasRef.current = canvas;

        const interval = setInterval(renderFrame, 5);
        
        return () => {
            clearInterval(interval);
        };
    }, [state]); 

    const handleChangeFigure = (e) => {
        const figure = e.target.value;
        const figureColors = {
            Cube: '#ff0000',
            Sphere: '#00ff00',
            Torus: '#0000ff',
            Cone: '#ffff00',
            Cylinder: '#ffa500',
            Paraboloid: '#800080',
            Ellipsoid: '#7FFFD4',
            OneSheetHyperboloid: '#FF00FF',
            TwoSheetHyperboloid: '#BA55D3',
            EllipticParaboloid: '#F4A460',
        };

        setState({
            ...state,
            figure,
            color: figureColors[figure]
        });

        switch (figure) {
            case 'Cube': sceneRef.current = new Cube(); break;
            case 'Sphere': sceneRef.current = new Sphere(); break;
            case 'Torus': sceneRef.current = new Torus(); break;
            case 'Cone': sceneRef.current = new Cone(); break;
            case 'Cylinder': sceneRef.current = new Cylinder(); break;
            case 'Paraboloid': sceneRef.current = new Paraboloid(); break;
            case 'Ellipsoid': sceneRef.current = new Ellipsoid(10, 7, 5, 24, 12); break;
            case 'OneSheetHyperboloid': sceneRef.current = new OneSheetHyperboloid(); break;
            case 'TwoSheetHyperboloid': sceneRef.current = new TwoSheetHyperboloid(); break;
            case 'EllipticParaboloid': sceneRef.current = new EllipticParaboloid(); break;
            default: sceneRef.current = new Cube();
        }
    };

    const handleColorChange = (e) => {
        setState({ ...state, color: e.target.value });
    };

    //кнопка смены цвета
    /*
    const handleColorRChange = () => {
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        setState({ ...state, color: randomColor });
    };*/

    
    const handleCheckboxChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.checked
        });
    };

    const handleMouseUp = () => {
        canRotateRef.current = false;
    };

    const handleMouseLeave = () => {
        canRotateRef.current = false;
    };

    const handleMouseDown = (e) => {
        canRotateRef.current = true;
        mousePosRef.current = {
            dx: e.offsetX,
            dy: e.offsetY
        };
    };

    const increaseLumen = () => {
        setState(prevState => ({
            ...prevState,
            lumen: Math.min(prevState.lumen + 0.1, 2.0) 
        }));
    };

    const decreaseLumen = () => {
        setState(prevState => ({
            ...prevState,
            lumen: Math.max(prevState.lumen - 0.1, 0.1) 
        }));
    };

    
    const handleRemoveRandomPolygon = () => {
        const scene = sceneRef.current;
        if (scene.polygons.length === 0) return; 

        const randomIndex = Math.floor(Math.random() * scene.polygons.length);
        scene.polygons.splice(randomIndex, 1);

        setState(prev => ({ ...prev })); 
    };

    const handleRemoveRandomPoint = () => {
        const scene = sceneRef.current;
        if (scene.points.length === 0) return;

       
        const randomPointIndex = Math.floor(Math.random() * scene.points.length);
        
        
        scene.polygons = scene.polygons.filter(polygon => 
            !polygon.points.includes(randomPointIndex)
        );
        
        
        scene.edges = scene.edges.filter(edge => 
            edge.p1 !== randomPointIndex && edge.p2 !== randomPointIndex
        );
        
        
        scene.points.splice(randomPointIndex, 1);
        
        
        scene.polygons.forEach(polygon => {
            polygon.points = polygon.points.map(index => 
                index > randomPointIndex ? index - 1 : index
            );
        });
        
        scene.edges.forEach(edge => {
            edge.p1 = edge.p1 > randomPointIndex ? edge.p1 - 1 : edge.p1;
            edge.p2 = edge.p2 > randomPointIndex ? edge.p2 - 1 : edge.p2;
        });

        
        setState(prev => ({ ...prev }));
    };


    const handleWheel = (e) => {
        const delta = e.wheelDelta > 0 ? 1.1 : 0.9;
        sceneRef.current.points.forEach(point => {
            math3DRef.current.zoom(delta, point);
        });
    };

    const handleMouseMove = (e) => {
        if (canRotateRef.current) {
            const gradus = Math.PI / 180 / 10;
            const { dx, dy } = mousePosRef.current;
            
            sceneRef.current.points.forEach(point => {
                math3DRef.current.rotateOy((dx - e.offsetX) * gradus, point);
                math3DRef.current.rotateOx((dy - e.offsetY) * gradus, point);
            });
            
            mousePosRef.current = {
                dx: e.offsetX,
                dy: e.offsetY
            };
        }
    };

    

    const renderFrame = () => {
        if (!sceneRef.current || !canvasRef.current) return;

        const { color, showPolygons, showEdges, showPoints } = state;
        const canvas = canvasRef.current;
        let count = 1
        let count2 = 1

        canvas.clear();

        if (showPolygons) {
            math3DRef.current.calcDistance(sceneRef.current, lightRef.current, 'lumen');
            math3DRef.current.calcDistance(sceneRef.current, winRef.current.CAMERA, 'distance');
            math3DRef.current.sortByArtistAlgorithm(sceneRef.current.polygons);

            sceneRef.current.polygons.forEach(polygon => {
                const points = polygon.points.map(index => ({
                    x: math3DRef.current.xs(sceneRef.current.points[index]),
                    y: math3DRef.current.ys(sceneRef.current.points[index]),
                }));
                //для зебры
                //if(count2%24==1){count+=1}


                if (!polygon.preserveColor) {
                    polygon.setColor(color);
                }   

                
                let countl = Math.floor(Math.random()*3)+1;
                let lumen = math3DRef.current.calcIllumitation(polygon.lumen, lightRef.current.lumen) * state.lumen;
                if(count%2==1){polygon.setColor(color);}
                else{polygon.setColor('fff');
                    //для затененая под зебру
                    //polygon.setColor(color);
                    //lumen=1
                }
                //для диско шара
                //if (countl==1){lumen=1}
                const { r, g, b } = polygon.color;
                const shadedColor = polygon.rgbToHex(
                    Math.round(r * lumen),
                    Math.round(g * lumen),
                    Math.round(b * lumen)
                );

                canvas.polygon(points, shadedColor);
            //для зебры
            //count+=1;count2+=1
            });
        }

        if (showEdges) {
            sceneRef.current.edges.forEach(edge => {
                const p1 = sceneRef.current.points[edge.p1];
                const p2 = sceneRef.current.points[edge.p2];
                canvas.line(
                    math3DRef.current.xs(p1),
                    math3DRef.current.ys(p1),
                    math3DRef.current.xs(p2),
                    math3DRef.current.ys(p2)
                );
            });
        }

        if (showPoints) {
            sceneRef.current.points.forEach(p => {
                canvas.point(
                    math3DRef.current.xs(p),
                    math3DRef.current.ys(p)
                );
            });
        }
    };

    return (
        <div>
                <div>
                    <label>Фигура:</label>
                    <select value={state.figure} onChange={handleChangeFigure}>
                        <option value="Cube">Куб</option>
                        <option value="Sphere">Сфера</option>
                        <option value="Torus">Тор</option>
                        <option value="Cone">Конус</option>
                        <option value="Cylinder">Цилиндр</option>
                        <option value="Paraboloid">Седло</option>
                        <option value="Ellipsoid">Эллипс</option>
                        <option value="OneSheetHyperboloid">Однополостной гиперболоид</option>
                        <option value="TwoSheetHyperboloid">Двуполостной гиперболоид</option>
                        <option value="EllipticParaboloid">Эллиптический парабалоид</option>
                    </select>
                </div>
                
                <div>
                    <label>Цвет:</label>
                    <input
                        type="color"
                        value={state.color}
                        onChange={handleColorChange}
                    />
                </div>
                
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="showPolygons"
                            checked={state.showPolygons}
                            onChange={handleCheckboxChange}
                        />
                        Полигоны
                    </label>
                    
                    <label>
                        <input
                            type="checkbox"
                            name="showEdges"
                            checked={state.showEdges}
                            onChange={handleCheckboxChange}
                        />
                        Рёбра
                    </label>
                    
                    <label>
                        <input
                            type="checkbox"
                            name="showPoints"
                            checked={state.showPoints}
                            onChange={handleCheckboxChange}
                        />
                        Точки
                    </label>
                    
                    <label>
                        <button >ТЕСТ</button>
                    </label>


                </div>

                <canvas id="canvas3D"/>
            
        </div>
    );
};

export default Graph3D;
