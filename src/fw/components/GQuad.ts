/// <reference path = "../fw.ts" /> 
namespace fw {
    export class GQuad extends Component {

        public skinGraphics: PIXI.Graphics;
    
        public constructor(color: number = 0x0000ff, posx: number = 0, posy: number = 0, width: number = 200, height: number = 200, alpha: number = 1) {
            super(width, height);
            this.interactive = true;
    
            this.skinGraphics = new PIXI.Graphics();
            this.skinGraphics.clear();
            this.skinGraphics.beginFill(color);
            this.skinGraphics.drawRect(posx, posy, width, height);
            this.skinGraphics.endFill();
            this.addChild(this.skinGraphics);
            this.alpha = alpha;
        }
    
        protected fixedInitialize(): void
        {
            super.fixedInitialize();
        }
    
        public destroy(): void
        {
            super.destroy();
        }
    }
    
}

