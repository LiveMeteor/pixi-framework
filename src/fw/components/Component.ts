/// <reference path = "../fw.ts" /> 
namespace fw {
    export class Component extends PIXI.Container {

        protected designWidth?: number;
        protected designHeight?: number;
        protected isInit: boolean = false;
    
        public constructor(width?: number, height?: number) {
            super();
            HashObject.InjectHashCode(this);
            this.designWidth = width;
            this.designHeight = height;
    
            PIXI.ticker.shared.addOnce(deltraTime => {
                this.fixedInitialize();
            }, this);
        }
    
        /** 构造方法的次帧方法，UI 测量的相关方法应该写在这里 */
        protected fixedInitialize(): void
        {
            this.isInit = true;
            const bounds = this.getLocalBounds();
            this.width = bounds.width;
            this.height = bounds.height;
        }
    
        public destroy(): void
        {
            this.removeAllListeners();
            DisplayUtil.removeFromParent(this);
        }
    }
    
}

