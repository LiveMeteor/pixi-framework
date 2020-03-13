/// <reference path = "../fw.ts" /> 
/// <reference path = "Component.ts" /> 
namespace fw {
    export class GButton extends Component {

        public useTween: boolean = true;
        private skinSprite: PIXI.Sprite;
        private normalTexture: PIXI.Texture;
        private downTexture?: PIXI.Texture;
        private disableTexture?: PIXI.Texture;
    
        public constructor(normalTexture: PIXI.Texture, downTexture?: PIXI.Texture, disableTexture?: PIXI.Texture, width?: number, height?: number) {
            super(width, height);
            this.buttonMode = true;
            this.interactive = true;
    
            this.normalTexture = normalTexture;
            this.downTexture = downTexture;
            this.disableTexture = disableTexture;
    
            this.skinSprite = new PIXI.Sprite(normalTexture);
            this.addChild(this.skinSprite);
    
            this.addListener("pointerdown", this.onTouchDown, this);
            this.addListener("pointerup", this.onTouchUp, this);
            this.addListener("pointerupoutside", this.onTouchUp, this);
        }
    
        protected fixedInitialize(): void
        {
            super.fixedInitialize();
            this.skinSprite.anchor.x = this.skinSprite.anchor.y = 0.5;
            this.skinSprite.x = this.width >> 1;
            this.skinSprite.y = this.height >> 1;
        }
    
        public set scale(value: PIXI.Point)
        {
            this.skinSprite.scale = value;
        }
    
        public get scale(): PIXI.Point
        {
            return this.skinSprite.scale;
        }
    
        private onTouchDown(evt: PIXI.interaction.InteractionEvent): void
        {
            if (this.downTexture)
            {
                this.skinSprite.texture = this.downTexture;
            }
            else
            {
                if (this.useTween)
                {
                    Tween.removeTweens(this.skinSprite.scale);
                    Tween.get(this.skinSprite.scale).to({x: 0.95, y: 0.95}, 100);
                }
                else
                {
                    this.skinSprite.scale.x = this.skinSprite.scale.y = 0.95;
                }
            }
            this.skinSprite.tint = 0xaaaaaa;
        }
    
        private onTouchUp(evt: PIXI.interaction.InteractionEvent): void
        {
            this.skinSprite.texture = this.normalTexture;
            if (this.useTween)
            {
                Tween.removeTweens(this.skinSprite.scale);
                Tween.get(this.skinSprite.scale).to({x: 1.0, y: 1.0}, 100);
            }
            else
            {
                this.skinSprite.scale.x = this.skinSprite.scale.y = 1;
            }
            this.skinSprite.tint = 0xffffff;
        }
    
        public destroy(): void
        {
            this.useTween && Tween.removeTweens(this.skinSprite.scale);
            super.destroy();
        }
    }
    
}

