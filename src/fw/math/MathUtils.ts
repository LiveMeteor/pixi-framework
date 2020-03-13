/// <reference path = "../fw.ts" /> 
namespace fw {
    export module MathUtils {

        /** 限制区间 */
        export function keepRange(min: number, input: number, max: number): number
        {
            return Math.max(Math.min(input, max), min);
        }
    
        /** 计算两点间的距离 */
        export function GetPointDistance(fromX: number, fromY: number, toX: number, toY: number): number
        {
            return Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY));
        }
    
        /** 点是否是矩型内 */
        export function isContain(point: PIXI.Point, rect: PIXI.Rectangle): boolean {
            return point.x > rect.x && point.x < (rect.x + rect.width) && point.y > rect.y && (point.y < rect.y + rect.height)
        }
        
        /** 生成伪随机 */
        // export function seedRandom(seed: number): number {
        //     let num = Math.PI * 10000000 * Math.pow(3, seed % 17);
        //     num = num / Math.pow(2, seed) - Math.floor(num / Math.pow(2, seed));
        //     console.log(`seed: ${seed} random: ${num}`);
        //     return num;
        // }

        export function seedRandom(seed: number, max: number = 1, min: number = 0): number {
            const seed2 = (seed * 9301 + 49297) % 233280;
            let rnd = seed2 / 233280.0;
            rnd = min + rnd * (max - min);
            rnd = rnd * 971 - Math.floor(rnd * 971);
            // console.log(`seed: ${seed} random: ${rnd}`);
            return rnd;
        }

        /** 弧度转角度 */
        export function ran2deg(value: number): number {
            return 180 / Math.PI * value;
        }

        /** 角度转弧度 */
        export function deg2ran(value: number): number {
            return value / (180 / Math.PI);
        }
    }
}


