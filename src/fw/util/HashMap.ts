/// <reference path = "../fw.ts" /> 
namespace fw {
    export class HashMap<T> {

        private mLength: number = 0;
        public content: any;
    
        constructor() {
            this.mLength = 0;
            this.content = {};
        }
    
        //-------------------公共方法--------------------
    
        /**
         * 返回长度
         */
        public get length(): number {
            return this.mLength;
        }
    
        /**
         * 返回是否为空
         */
        public isEmpty(): boolean {
            return (this.mLength == 0);
        }
    
        /**
         * 返回所有键
         */
        public keys(): string[] {
            let temp: string[] = [];
            for (let i in this.content) {
                temp.push(i);
            }
            return temp;
        }
    
        /**
       * 函数执行每一个键
       * @param 函数
       */
        public eachKey(func: (key: string) => void, thisObj: any): void {
            for (let i in this.content) {
                func.call(thisObj, i);
            }
        }
    
        /**
       * 函数执行每一个值
       * @param 函数
       */
        public eachValue(func: (value: T) => void, thisObj: any): void {
            for (let i in this.content) {
                let value: T = this.content[i];
                func.call(thisObj, value);
            }
        }
    
        /**
         * 数组形式返回map内容
         */
        public values(): T[] {
            let temp: T[] = [];
            for (let i in this.content) {
                temp.push(this.content[i])
            }
            return temp;
        }
    
        /**
         * 检查是否存在某值
         */
        public containsValue(value: T): boolean {
            for (let i in this.content) {
                let result: T = this.content[i];
                if (result === value) {
                    return true;
                }
            }
            return false;
        }
    
        /**
         * 检查是否存在某键
         */
        public containsKey(key: any): boolean {
            key = this.generateKey(key);
            if (this.content[key] != undefined) {
                return true;
            }
            return false;
        }
    
        /**
       * 获取键值
       */
        public getValue(key: any): T | undefined {
            key = this.generateKey(key);
            let value: T = this.content[key];
            if (value !== undefined) {
                return value;
            }
            return undefined;
        }
    
        /**
       * 加入元素
     * 新值替换旧值；空则删；返回旧值
         */
        public put(key: any, value: T): T | undefined{
            key = this.generateKey(key);
            if (!key) {
                throw new Error("cannot put a value with undefined or null key!");
            } else if (!value) {
                return this.remove(key);
            } else {
                let exist: boolean = this.containsKey(key);
                if (!exist) {
                    this.mLength++;
                }
                this.content[key] = value;
                return value;
            }
        }
    
        /**
     * 移除键及内容
         */
        public remove(key: any): T | undefined {
            key = this.generateKey(key);
            let exist: boolean = this.containsKey(key);
            if (!exist) {
                return undefined;
            }
            let temp: T = this.content[key];
            this.content[key] = null;
            delete this.content[key];
            this.mLength--;
            return temp;
        }
    
        /**
       * 清除所有
       */
        public clear(): void {
            this.mLength = 0;
            this.content = {};
        }
    
        /**
       * 克隆
       */
        public clone(): HashMap<T> {
            let temp: HashMap<T> = new HashMap<T>();
            for (let i in this.content) {
                temp.put(i, this.content[i]);
            }
            return temp;
        }
    
        /**
         * 打印字符串形式
         * @return
         */
        public toString(): string {
            let ks: string[] = this.keys();
            let vs: T[] = this.values();
            let temp = "HashMap Content:\n";
            for (let i = 0; i < ks.length; i++) {
                temp += ks[i] + " -> " + vs[i] + "\n";
            }
            return temp;
        }
    
    
        /**
        * 生成每个物品唯一key
        * @return
        */
        private static id: number = 0;
        private generateKey(key: any): number | string {
            if (key && typeof key != "string" && typeof key != "number") {
                if (key._hashtableUniqueId == undefined) {
                    key._hashtableUniqueId = "___HID___" + (HashMap.id++);
                }
                key = key._hashtableUniqueId;
            }
    
            return key;
        }
    }
}
