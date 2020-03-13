/// <reference path = "../fw.ts" /> 
namespace fw {
    export class Vector {
        private _x: number;
        private _y: number;
    
        constructor(x: number, y: number) {
            this._x = x;
            this._y = y;
        }
    
        /** 两点之间距离 */
        public getDistance(x: number, y: number): number {
            let a = (this._x - x) * (this._x - x) + (this._y - y) * (this._y - y);
            let l = Math.sqrt(a);
            let w = Math.floor(l);
            if (l - w < 0.00001) {
                return w;
            }
    
            return l;
        }
    
        /** 获取单位向量 */
        public getNormal(): Vector {
            //
            let n = this._x * this._x + this._y * this._y;
            if (n === 1) {
                return this;
            }
            n = Math.sqrt(n);
            if (n < Number.MIN_VALUE) {
                return this;
            }
            n = 1 / n;
            let x = this._x * n;
            let y = this._y * n;
            return new Vector(x, y);
        }
    
        /** 转换成单位向量 */
        public normal(): Vector {
            return this.getNormal();
        }
    
        /** 向量加 */
        public add(vec: Vector): Vector {
            let x = this._x + vec._x;
            let y = this._y + vec._y;
            return new Vector(x, y);
        }
    
        /** 向量减 */
        public sub(vec: Vector): Vector {
            let x = this._x - vec._x;
            let y = this._y - vec._y;
            return new Vector(x, y);
        }
    
        public multValue(value: number): Vector {
            let x = this._x * value;
            let y = this._y * value;
            return new Vector(x, y);
        }
    
        public addValue(value: number): Vector {
            let x = this._x + value;
            let y = this._y + value;
            return new Vector(x, y);
        }
    }
}

