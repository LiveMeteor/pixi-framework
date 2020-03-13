/// <reference path = "../fw.ts" /> 
namespace fw {
    export class GProgressBar extends Component {

        private frontSprite: PIXI.Sprite;
        private backSprite: PIXI.Sprite;
        private maskQuad: PIXI.Graphics;
        private valuePercent = 1;
        // private label?: PIXI.Text;
    
        public constructor(bg: PIXI.Texture, fg: PIXI.Texture, width?: number, height?: number) {
            super(width, height);
    
            this.backSprite = new PIXI.Sprite(bg);
            this.addChild(this.backSprite);
            if (width && height)
            {
                this.backSprite.width = width;
                this.backSprite.height = height;
            }
    
            this.frontSprite = new PIXI.Sprite(fg)
            this.addChild(this.frontSprite);
            if (width && height)
            {
                this.frontSprite.width = width;
                this.frontSprite.height = height;
            }
    
            this.maskQuad = new PIXI.Graphics();
            this.maskQuad.clear();
            this.maskQuad.beginFill(0xffffff);
            this.maskQuad.drawRect(0,0,0,0);
            this.maskQuad.endFill();
            this.frontSprite.mask = this.maskQuad;
            this.addChild(this.maskQuad);
        }
    
        protected fixedInitialize(): void
        {
            super.fixedInitialize();
            this.updatePercent();
        }
    
        /** 设置百分比 (0.0-1.0) 区间 */
        public set percent(value: number)
        {
            this.valuePercent = MathUtils.keepRange(0, value, 1);
            this.isInit && this.updatePercent();
        }
    
        public get percent(): number
        {
            return this.valuePercent;
        }
    
        private updatePercent(): void
        {
            this.maskQuad.clear();
            this.maskQuad.beginFill(0xffffff);
            if (this.designWidth && this.designHeight)
                this.maskQuad.drawRect(0, 0, this.designWidth * this.valuePercent, this.designHeight);
            else
                this.maskQuad.drawRect(0, 0, this.width * this.valuePercent, this.height);
            this.maskQuad.endFill();
        }
    }
    
}

