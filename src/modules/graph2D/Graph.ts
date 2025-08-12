import { Point } from "../math3D";

type TWIN = {
    LEFT: number;
    BOTTOM: number;
    WIDTH: number;
    HEIGHT: number;
    CENTER: Point;
    CAMERA: Point;
}

type TGraphOptions = {
    id: string;
    width?: number;
    height?: number;
    WIN: TWIN;
    callbacks: {
        wheel: (e: WheelEvent) => void;
        mousemove: (e: MouseEvent) => void;
        mouseup: (e: MouseEvent) => void;
        mousedown: (e: MouseEvent) => void;
        mouseleave: (e: MouseEvent) => void;
    }
}

class Graph {
    WIN: TWIN;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor({ id, WIN, height = 500, width = 500, callbacks }: TGraphOptions) {
        this.WIN = WIN;
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.canvas.addEventListener('wheel', callbacks.wheel);
        this.canvas.addEventListener('mousedown', callbacks.mousedown);
        this.canvas.addEventListener('mousemove', callbacks.mousemove);
        this.canvas.addEventListener('mouseup', callbacks.mouseup);
        this.canvas.addEventListener('mouseleave', callbacks.mouseleave);
    }


    
    //x
    xs(x: number): number {
        return ((x - this.WIN.LEFT) / this.WIN.WIDTH) * this.canvas.width;
    }

    //y
    ys(y: number): number {
        return (this.WIN.HEIGHT - (y - this.WIN.BOTTOM)) * this.canvas.width / this.WIN.HEIGHT;
    }

    //xs
    sx(x: number): number {
        return this.WIN.WIDTH / this.canvas.width + this.WIN.LEFT;
    }

    //ys
    sy(y: number): number {
        return -y * this.WIN.HEIGHT / this.canvas.height - this.WIN.BOTTOM;
    }

    polygon(points: Omit<Point, 'z'>[], color: string = '#000000'): void {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.moveTo(this.xs(points[0].x), this.ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.context.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.context.lineTo(this.xs(points[0].x), this.ys(points[0].y));
        this.context.closePath();
        this.context.fill();
    }

    clear(color: string = '#fff'): void {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    line(x1: number, y1: number, x2: number, y2: number, color: string, width: number): void {
        this.context.beginPath();
        this.context.strokeStyle = color || 'black';
        this.context.lineWidth = width || 0;
        this.context.moveTo(this.xs(x1), this.ys(y1));
        this.context.lineTo(this.xs(x2), this.ys(y2));
        this.context.stroke();
        this.context.closePath();
    }

    point(x: number, y: number, color = 'black', size = 2): void {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.arc(this.xs(x), this.ys(y), size, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
    }

    print(x: number, y: number, text: string, color: string, size: number): void {
        this.context.font = size / WIN.WIDTH + "px Verdana";
        this.context.fillStyle = color;
        this.context.fillText(text, this.xs(x), this.ys(y));
        this.context.stroke();
    }

    dashedLine(x1: number, y1: number, x2: number, y2: number, color: string, width: number): void {
        this.context.beginPath();
        this.context.setLineDash([20, 5]);
        this.context.strokeStyle = color || 'black';
        this.context.lineWidth = width || 0;
        this.context.moveTo(this.xs(x1), this.ys(y1));
        this.context.lineTo(this.xs(x2), this.ys(y2));
        this.context.stroke();
        this.context.closePath();
        this.context.setLineDash([0, 0]);
    }
}

export default Graph;