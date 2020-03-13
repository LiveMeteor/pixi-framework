/// <reference path = "../fw.ts" /> 
namespace fw {
    export class BSpline {
        private inputPos: Point[];
        private ctrlPos: Point[];
        private subdivisionPos: Point[];
        private segmentNum: number;
        private beClosed: boolean;
        private num: number;

        /**
         * 通过点生成 B-Spline 曲线
         * @param inputX[]
         * @param inputY[]
         * @param segmentNum 切分段数
         * @param beClosed 是否闭合
         */
        public constructor(inputX: number[], inputY: number[], segmentNum: number = 20, beClosed: boolean = false) {
            this.segmentNum = segmentNum;
            this.beClosed = beClosed;
            this.num = Math.min(inputX.length, inputY.length);
            this.inputPos = [];
            for (let i = 0; i < this.num; i++) {
                this.inputPos.push({ x: inputX[i], y: inputY[i] });
            }

            if (beClosed && (inputX[0] != inputX[this.num - 1] || inputY[0] != inputY[this.num - 1])) {
                inputX = inputX.concat();
                inputY = inputY.concat();
                // close-curve: last point == first point
                inputX.push(inputX[0]);
                inputY.push(inputY[0]);
                this.inputPos.push({ x: inputX[0], y: inputY[0] });
                this.num++;
            }

            const c2 = beClosed ? this.num - 1 : 1;
            const c3 = beClosed ? 2 : this.num;
            const validX = this.inverse(inputX, this.num, c2, c3);
            const validY = this.inverse(inputY, this.num, c2, c3);
            this.ctrlPos = [];
            for (let i = 0; i < Math.min(validX.length, validY.length); i++) {
                this.ctrlPos.push({ x: validX[i], y: validY[i] });
            }
            this.num = this.num + 2;
            this.subdivisionCurve();
        }

        /**
         * 迭代拟合曲线控制点
         * @param subValues[] 要经过曲线的点
         * @param num 原始点的数量
         * @param c2 1 开放, n-1 闭合
         * @param c3 n 开放, 2 闭合
         * @return genValues[] 拟合好的控制点
         **/
        private inverse(subValues: number[], num: number, c2: number, c3: number): number[] {
            let esp, maxesp;
            // Open-Curve:
            //		v[] = p[0] p[...] p[n-1]
            // Close-Curve: p[0] === p[n-1]
            //		v[] = p[n-2] p[...] p[1]
            const genValues = subValues.concat();
            genValues.unshift(subValues[c2 - 1]);
            genValues.push(subValues[c3 - 1]);

            do {
                maxesp = 0;
                for (let i = 1; i <= num; i++) {
                    esp = subValues[i - 1] - genValues[i] + (subValues[i - 1] - (genValues[i - 1] + genValues[i + 1]) / 2) / 2;
                    genValues[i] += esp;
                    Math.abs(esp) > maxesp && (maxesp = Math.abs(esp));
                    genValues[0] = genValues[c2];
                    genValues[num + 1] = genValues[c3];
                }
            } while (maxesp > 3);
            return genValues;
        }

        /** 细分计算曲线 */
        private subdivisionCurve(): void {
            if (this.segmentNum < 0)
                return;

            const e1 = new Array(this.segmentNum);
            const e2 = new Array(this.segmentNum);
            const e3 = new Array(this.segmentNum);
            const e4 = new Array(this.segmentNum);
            let x1, x2, x3, x4, y1, y2, y3, y4;

            for (let i = 0; i < this.segmentNum; i++) {
                const t = (i + 1) / this.segmentNum;
                e1[i] = (((3 - t) * t - 3) * t + 1) / 6;
                e2[i] = ((3 * t - 6) * t * t + 4) / 6;
                e3[i] = (((3 - 3 * t) * t + 3) * t + 1) / 6;
                e4[i] = t * t * t / 6;
            }

            x2 = this.ctrlPos[0].x; x3 = this.ctrlPos[1].x; x4 = this.ctrlPos[2].x;
            y2 = this.ctrlPos[0].y; y3 = this.ctrlPos[1].y; y4 = this.ctrlPos[2].y;
            this.subdivisionPos = [];
            this.subdivisionPos.push({x: (x2 + 4 * x3 + x4) / 6, y: (y2 + 4 * y3 + y4) / 6});

            for (let i = 3; i < this.num; i++) {
                x1 = x2; x2 = x3; x3 = x4; x4 = this.ctrlPos[i].x;
                y1 = y2; y2 = y3; y3 = y4; y4 = this.ctrlPos[i].y;
                for (let j = 0; j < this.segmentNum; j++) {
                    this.subdivisionPos.push({
                        x: e1[j] * x1 + e2[j] * x2 + e3[j] * x3 + e4[j] * x4, 
                        y: e1[j] * y1 + e2[j] * y2 + e3[j] * y3 + e4[j] * y4
                    });
                }
            }
        }

        /**
         * 绘制原始经过的点
         * @param container 画板容器
         * @param circleSize 小圈尺寸
         * @param color 小图颜色
         * @returns 画好点的画板
         */
        public drawCtrlPoint(container: PIXI.Container, circleSize: number = 10, color: number = 0xffffff): PIXI.Graphics {
            const pos = this.inputPos; //需要 draw 其点的话改这里即可
            const marksBoard = new PIXI.Graphics();
            container.addChild(marksBoard);
            marksBoard.lineStyle(2, color);
            for (let i = 0; i < (this.beClosed ? pos.length - 1 : pos.length); i++) {
                marksBoard.beginFill(0, 0);
                marksBoard.drawCircle(pos[i].x, pos[i].y, circleSize);
                marksBoard.endFill();
                const labelCount = new PIXI.Text((i + 1).toString(), {
                    fontSize: 20,
                    fill: color
                });
                labelCount.anchor.x = labelCount.anchor.y = 0.5;
                labelCount.x = pos[i].x;
                labelCount.y = pos[i].y;
                marksBoard.addChild(labelCount);
            }
            return marksBoard;
        }

        /** 
         * 绘制曲线
         * @param board 画板
         * @param lineWidth 线宽
         * @param color 颜色
         */
        public drawLine(board: PIXI.Graphics, lineWidth: number = 4, color: number = 0xffffff): void {
            if (this.segmentNum < 0)
                return;

            board.lineStyle(lineWidth, color);
            board.moveTo(this.subdivisionPos[0].x, this.subdivisionPos[0].y);
            for (let i = 1; i < this.subdivisionPos.length; i++) {
                board.lineTo(this.subdivisionPos[i].x, this.subdivisionPos[i].y);
            }
        }

        /**
         * 输出曲线点
         * @returns 细分点列表
         */
        public getLinePoints(): Point[] {
            return this.subdivisionPos;
        }
    }
}
