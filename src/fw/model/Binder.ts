namespace fw {

    export interface IBindable {
        bind(property: string, target: any, setterOrFunction?: Function | string, thisObj?: any): void;
        unbind(target: any, property?: string): void;
    }

    /**
     * 绑定器
     * model.bind("price",price_txt,"text")
        model.bind("price",price_mc,onPriceChange)
     * @author sunxinzhe
     */
    export class Binder implements IBindable {

        private static bindings: any = {};

        public source: any;
        private propertys: any = {};
        private propertyCount: number;
        private onChange: Function;
        private thisObj: any;

        public constructor(source: any, onChange?: Function, thisObj?: any) {
            this.source = source;
            this.onChange = onChange;
            this.thisObj = thisObj;
            Binder.bindings[source] = this;
        }

        /**
         * 绑定目标
         * eg...model.bind("price",price_txt,"text")
         * eg...model.bind("price",price_txt,onPriceChange)
         * @param	property
         * @param	target
         * @param	setterOrFunction
         */
        public bind(property: string, target: any, setterOrFunction?: Function | string, thisObj?: any): void {
            var bindProperty: BindProperty = this.propertys[property];
            if (!bindProperty) {
                bindProperty = new BindProperty(this.source, property, this.onChange, this.thisObj);
                this.propertys[property] = bindProperty;
                this.propertyCount++;
            }
            bindProperty.bind(target, setterOrFunction);
        }

        /**
         * 解除绑定
         * @param	target
         * @param	property
         */
        public unbind(target: any, property: string = null): void {
            let unbindSingle = (bproperty: BindProperty): void => {
                var hasElement: boolean = bproperty.unbind(target);
                if (!hasElement) {
                    delete this.propertys[bproperty.property];
                    bproperty = null;
                    this.propertyCount--;
                    if (this.propertyCount <= 0)
                        delete Binder.bindings[this.source];
                }
            }

            var bindProperty: BindProperty;
            if (property) {
                bindProperty = this.propertys[property];
                bindProperty && unbindSingle(bindProperty);
            } else {
                for (let idx in this.propertys) {
                    unbindSingle(this.propertys[idx]);
                }
            }
        }


        /**
         * 设置属性，触发绑定
         * @param	property
         * @param	value
         */
        public setProperty(property: string, value: any, forceRefresh: boolean = false): void {
            var bindProperty: BindProperty = this.propertys[property];
            if (bindProperty) {
                bindProperty.forceRefresh = forceRefresh;
                bindProperty.value = value;
            } else {
                this.source[property] = value;
            }
        }

        /**
         * 强制更新一次属性
         * @param	property
         */
        public updateProperty(property: string): void {
            var bindProperty: BindProperty = this.propertys[property];
            if (bindProperty)
                this.setProperty(property, this.source[property], true);
        }

        /**
         * 获取属性值
         * @param	property
         * @return
         */
        public getProperty(property: string): any {
            return this.source[property];
        }

        /**
         * 清除
         */
        public dispose(): void {
            if (this.propertys != null) {
                for (let idx in this.propertys) {
                    const item: BindProperty = this.propertys[idx];
                    item.dispose();
                    delete this.propertys[item.property];
                }
                this.propertys = null;
            }
            if (this.source != null) {
                delete Binder.bindings[this.source];
                this.source = null;
            }

            this.propertyCount = 0;
            this.onChange = null;
            this.thisObj = null;
        }

        public static create(source: any, property: string, target: any, setterOrFunction?: Function | string): Binder {
            var binder: Binder = Binder.bindings[source] || (new Binder(source));
            binder.bind(property, target, setterOrFunction);
            return binder;
        }

        public static remove(target: any, property: string = null): void {
            for (let idx in Binder.bindings) {
                (Binder.bindings[idx] as Binder).unbind(target, property);
            }
        }
    }

    class BindProperty {
        public source: any;
        public property: string;
        public oldValue: any;
        public forceRefresh: boolean;
        public targets: any = {};
        private targetCount: number;
        private onChange: Function;
        private thisObj: any;

        public constructor(source: any, property: string, onChange?: Function, thisObj?: any) {
            this.source = source;
            this.property = property;
            this.onChange = onChange;
            this.thisObj = thisObj;
            this.oldValue = source[property];
        }

        public bind(target: any, setterOrFunction?: Function | string, thisObj?: any): void {
            !setterOrFunction && (setterOrFunction = this.property);
            if (!this.targets[target]) {
                this.targets[target] = new BindTarget(target, setterOrFunction, thisObj);
                this.targetCount++;
            }
            this.oldValue = this.value;
            this.fixBind(this.targets[target], this.oldValue);
        }

        public unbind(target: any): boolean {
            var bindTarget: BindTarget = this.targets[target];
            if (bindTarget) {
                bindTarget.dispose();
                delete this.targets[target];
                this.targetCount--;
                return this.targetCount > 0;
            }
            return true;
        }

        public get value(): any {
            return this.source[this.property];
        }

        public set value(val: any) {
            if (this.forceRefresh || (this.source[this.property] !== val)) {
                this.oldValue = this.value;
                this.source[this.property] = val;
                for (let idx in this.targets) {
                    this.fixBind(this.targets[idx], val);
                }
                if (this.onChange) {
                    this.onChange.call(this.thisObj);
                }
            }
        }

        private fixBind(bindTarget: BindTarget, val: any): void {
            if (bindTarget.targetSetter) {
                val = (bindTarget.targetSetter == 'text') ? <string>(val) : val;
                bindTarget.target[bindTarget.targetSetter] = val;
            }
            else if (bindTarget.targetFunction) {
                bindTarget.targetFunction.call(bindTarget.thisObj, bindTarget.target, val, this.oldValue);
            }
        }

        public dispose(): void {
            this.source = null;
            this.property = null;
            this.oldValue = null;
            this.targetCount = 0;
            for (let idx in this.targets) {
                this.targets[idx].dispose();
            }
            this.targets = null;
        }

        public clone(source: any): any {
            let newObj: any = {};
            for (let i in source) {
                newObj[i] = source[i];
            }
            return newObj;
        }
    }

    /**
     * 绑定属性的目标
     */
    class BindTarget {
        public target: any;
        public targetSetter: string;
        public targetFunction: Function;
        public thisObj: any;

        public constructor(target: any, setterOrFunction?: Function | string, thisObj?: any) {
            this.target = target;
            if (typeof setterOrFunction == 'function') {
                this.targetSetter = null;
                this.targetFunction = setterOrFunction as Function;
            } else {
                this.targetSetter = setterOrFunction as string;
                this.targetFunction = null;
            }
        }

        public dispose(): void {
            this.target = null;
            this.targetSetter = null;
            this.targetFunction = null;
        }
    }
}


