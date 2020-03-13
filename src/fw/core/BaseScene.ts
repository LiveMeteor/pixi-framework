/// <reference path = "../fw.ts" /> 
/// <reference path = "BasePanel.ts" /> 
namespace fw {

    /** 默认分层规则 */
    export let DefaultLayers = {
        /** 背景层 */
        BACKGROUND_LAYER : "BACKGROUND_LAYER",
        /** 互动层 */
        INTERACTIVE_LAYER : "INTERACTIVE_LAYER",
        /** UI层 */
        UI_LAYER : "UI_LAYER",
        /** 弹出面板层 */
        PANEL_LAYER : "PANEL_LAYER",
        /** 最高层 (警示、新手等) */
        TOP_LAYER : "TOP_LAYER"
    }

    export class BaseScene extends BasePanel {

        protected layers: PIXI.Container[];
        private _background: PIXI.Sprite | undefined;

        public constructor(designWidth: number, designHeight: number) {
            super(designWidth, designHeight);
            this.layers = [];
            
            // this.initialize();
            // this.initLayers();
        }

        public initialize(): void {
            super.initialize();
            ResizeManager.initialize(this.designWidth, this.designHeight);
            // SceneManager.current = this;
            this.initLayers();
        }

        /** 层初始化 */
        protected initLayers(): void
        {
            const layerNames = [
                DefaultLayers.BACKGROUND_LAYER,
                DefaultLayers.INTERACTIVE_LAYER,
                DefaultLayers.UI_LAYER,
                DefaultLayers.PANEL_LAYER,
                DefaultLayers.TOP_LAYER
            ];
            for (const name of layerNames)
            {
                const layer = new PIXI.Container();
                layer.name = name;
                super.addChild(layer);
                this.layers.push(layer);
            }
        }

        /** 获取层，无参数默认返回最下层 */
        public getLayer(id?: string): PIXI.Container
        {
            if (!id)
                return this.layers[0];
            for (let i in this.layers)
            {
                if (this.layers[i].name == id)
                    return this.layers[i];
            }
            return this.layers[0];
        }

        /** 显示场景 */
        public show(data?: any, align: number = 1): void
        {
            this.setData(data);
            if (!this.isOpen)
            {
                const director = Config.currentDirector as GameDirector;
                director.stage.addChild(this);
                const ratio = Math.max(director.stageWidth / this.designWidth, director.stageHeight / this.designHeight);
                this.setTransform(0, 0, ratio, ratio);
                this.x = director.stageWidth - this.designWidth * ratio >> 1;
                this.y = director.stageHeight - this.designHeight * ratio >> 1;

                this.status = PanelStatus.OPEN;
                this.onOpen();
            }
        }

        public onOpen(): void {
            super.onOpen();
            this._background && ResizeManager.add(this._background, ResizeAlign.SCALE_CLIP);
        }

        public setBackground(texture:PIXI.Texture): void
        {
            this._background = new PIXI.Sprite(texture);
            HashObject.InjectHashCode(this._background);
            this.addChildAt(this._background, 0);
            ResizeManager.add(this._background, ResizeAlign.SCALE_CLIP);
        }

        public addChild<T extends PIXI.DisplayObject>(...children: T[]): T {
            fw.Log.error("Can't use addChild in BaseScene");
            return children[0];
        }

        public onClose(): void {
            this._background && ResizeManager.remove(this._background);
            super.onClose();
        }

        public destroy(): void {
            if (this._background)
            {
                this._background.parent && this._background.parent.removeChild(this._background);
                this._background.destroy();
            }
            while (this.layers.length > 1)
            {
                const layer = this.layers.shift() as PIXI.Container;
                layer.removeAllListeners();
                layer.removeChildren();
                layer.parent && layer.parent.removeChild(layer);
            }
            super.destroy();
        }
    }
}

