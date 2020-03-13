/// <reference path = "../fw.ts" /> 
namespace fw {

    export class Model implements IBindable {
        private binder: Binder;
        private onChangeFunc: Function;
        private thisObj: any;
        private bindSource: any;
        public isPersistant: boolean;//是否持久保存
        public constructor(source: any = null, bindSource: any = null) {
            this.bindSource = bindSource;
            if (source != null)
                this.inject(source);
        }

		/**
		 * 绑定对象
		 * @param	property
		 * @param	target
		 * @param	setterOrFunction
		 * @return
		 */
        public bind(property: string, target: any, setterOrFunction?: Function | string, thisObj?: any): void {
            if (!this.binder) {
                this.binder = new Binder(this.bindSource || this, this.onPropertyChange, this);
            }


            if (property == null && (typeof setterOrFunction == "function")) {
                this.onChangeFunc = setterOrFunction;
                this.thisObj = thisObj;
            } else {
                if (this.binder.source[property]) {
                    this.binder.bind(property, target, setterOrFunction, thisObj);
                }
            }
        }

		/**
		 * 解除绑定
		 * @param	target
		 * @param	property
		 */
        public unbind(target: any, property?: string): void {
            this.binder && this.binder.unbind(target, property);
        }

        public dispose(): void {
            if (!this.isPersistant) {
                if (this.binder) {
                    this.binder.dispose();
                    this.binder = null;
                }
                this.onChangeFunc = null;
                this.thisObj = null;
            }
        }

		/**
		 * 为模型注入新的数据
		 **/
        public inject(data: any): void {
            if (data) {
                for (let idx in data) {
                    this.setProperty(idx, data[idx]);
                }
            }
        }

        /**设置属性值*/
        public setProperty(property: string, value: any, forceRefresh: boolean = false): void {
            if ((<any>this)[property]) {
                if (this.binder != null)
                    this.binder.setProperty(property, value, forceRefresh);
                else if (this.bindSource != null)
                    this.bindSource[property] = value;
                else
                    (<any>this)[property] = value;
            }
        }

		/**
		 * 强制更新一次属性
		 * @param	property
		 */
        public updateProperty(property: string): void {
            if (this.binder != null)
                this.binder.updateProperty(property);
        }

		/**
		 * 获取模型的数据源表示形式,可遍历的Object类型
		 * @param	property
		 */
        public get source(): any {
            return this.binder ? this.binder.source : this;
        }

		/**
		 * 克隆
		 */
        public clone(): Model {
            let newModel = new Model();
            newModel.inject(this);
            return newModel;
        }

		/**
		 * 当属性发生变化
		 */
        public onPropertyChange(): void {
            if (this.onChangeFunc) {
                this.onChangeFunc.call(this.thisObj);
            }
        }

    }
}