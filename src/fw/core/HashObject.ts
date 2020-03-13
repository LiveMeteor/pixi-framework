/// <reference path = "../fw.ts" /> 
namespace fw {

    /** 对象基类，每个对象一个 HashCode ，保证其唯一性 */
    export class HashObject{

        private static hashCount = 1;

        private _hashCode: number;
        
        public constructor() {
            this._hashCode = HashObject.hashCount++;
        }

        /** 为 any 对象注入 HashCode */
        public static InjectHashCode(target:any): number
        {
            target._hashCode = HashObject.hashCount++;
            if (target.prototype)
            {
                //class
                target.prototype.getHashCode = function(): number {
                    return this["_hashCode"];
                }
            }
            else
            {
                //instance
                target.__proto__.getHashCode = function(): number {
                    return this["_hashCode"];
                }
            }
            return target._hashCode;
        }

        /** 获取 any 对象的 HashCode，如果没有就创建一个新的 */
        public static GetHashCode(target:any): number
        {
            let hashCode: number = target["_hashCode"];
            if (!hashCode)
            {
                HashObject.InjectHashCode(target);
                hashCode = target["_hashCode"];
            }
            return hashCode;
        }

        /** 生成一个新的 HashCode */
        public static GenerateHashCode(): number
        {
            const id = HashObject.hashCount++;
            return id;
        }

        public getHashCode(): number
        {
            return this._hashCode;
        }
    }
}

