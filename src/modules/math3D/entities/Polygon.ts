type TRGB = {
    r: number;
    g: number;
    b: number;
}

enum EDistance {
    distance = 'distance',
    lumen = 'lumen',
}

class Polygon {
    points: number[];
    color: TRGB;
    [EDistance.distance]: number = 0;
    [EDistance.lumen]: number = 1; 
    figureIndex: number = 0;
    newColor: boolean = false;
    preserveColor: boolean = false;

    constructor(points: number[] = [], color: string = '#4fa19e') {
        this.points = points;
        this.color = this.hexToRgb(color); 
    }

    private hexToRgb(hexColor: string): TRGB {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    rgbToHex(r: number, g: number, b: number): string {
        return `rgb(${r},${g},${b})`;
    }

    setColor(color: string, force: boolean = false): void {
        if (!this.newColor || force) {
            this.color = this.hexToRgb(color);
        }
    }
}

export default Polygon;

