namespace app {
    export class FishingWaveImage extends PIXI.Container {

        private sprite1: PIXI.Sprite;
        private length: number;
        private offsetTime: number;
        private construcTime: number;

        public constructor(texture: PIXI.Texture, offsetTime: number) {
            super();
            this.length = 10000;
            this.offsetTime = offsetTime;
            this.sprite1 = new PIXI.Sprite(texture);
            this.addChild(this.sprite1);
            this.construcTime = fw.getTimer();
            if (fw.Config.quality >= 2) {
                PIXI.ticker.shared.add(this.updateTime, this);
            }
        }

        private updateTime(deltaTime: number): void {
            const offset = Math.sin((fw.getTimer() - this.offsetTime - this.construcTime) % this.length / this.length * (Math.PI * 2));
            this.sprite1.y = offset * 20;
        }

        public destroy(options?: PIXI.DestroyOptions | boolean): void {
            PIXI.ticker.shared.remove(this.updateTime, this);
            fw.DisplayUtil.removeFromParent(this.sprite1);
            this.sprite1.destroy();
            super.destroy(options);
        }
    }
}