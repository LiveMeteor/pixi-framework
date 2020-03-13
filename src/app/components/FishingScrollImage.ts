namespace app {
    export class FishingScrollImage extends PIXI.Container {

        private sprite1: PIXI.Sprite;
        private sprite2: PIXI.Sprite;
        private length: number;
        private obstruction: number;
        private construcTime: number;

        public constructor(texture: PIXI.Texture, obstruction: number = 10) {
            super();
            this.length = texture.width;
            this.obstruction = obstruction;
            this.sprite1 = new PIXI.Sprite(texture);
            this.addChild(this.sprite1);
            this.sprite2 = new PIXI.Sprite(texture);
            this.addChild(this.sprite2);
            this.construcTime = fw.getTimer();
            if (fw.Config.quality >= 2) {
                PIXI.ticker.shared.add(this.updateTime, this);
            }
        }

        private updateTime(deltaTime: number): void {
            const offset = (fw.getTimer() - this.construcTime) % (this.length * this.obstruction);
            this.sprite1.x = -offset / this.obstruction;
            this.sprite2.x = this.sprite1.x + this.sprite1.width;
        }

        public destroy(options?: PIXI.DestroyOptions | boolean): void {
            PIXI.ticker.shared.remove(this.updateTime, this);
            fw.DisplayUtil.removeFromParent(this.sprite1);
            this.sprite1.destroy();
            fw.DisplayUtil.removeFromParent(this.sprite2);
            this.sprite2.destroy();
            super.destroy(options);
        }
    }
}