namespace app {
    /** 入场动画(钓鱼没有，暂留) */
    export class FishingIntro extends fw.BasePanel {

        private static ClockId = 11;

        private submarine: PIXI.extras.AnimatedSprite;
        private clock: fw.TimerClock;

        public constructor() {
            super(1080, 810);
        }

        public initialize(): void {
            super.initialize();
        }

        public onOpen(): void {
            super.onOpen();

            this.submarine = this.resource.createAnimatedSprite("yellow_submarine", 540, 405, true);
            this.submarine.anchor.x = this.submarine.anchor.y = 0.5;
            this.submarine.play();
            this.addChild(this.submarine);

            this.clock = fw.TimerManager.addClock(FishingIntro.ClockId, FishingModel.introTime / 1000, 10); //动画6秒
            this.clock.registCallBack(this, this.onComplete, this.onProgress);
            // fw.SoundManager.playSound("bbubbles_intro");
        }

        private onProgress(progress: number): void {
            // const off = 200;
            const sx = this.designWidth * progress;
            // let sy = off + (this.designHeight - off * 2) * (1 - progress);
            let sy = this.designHeight / 2;
            sy = sy + Math.sin(360 * progress * (Math.PI / 180)) * 100;
            this.submarine.x = sx;
            this.submarine.y = sy;
        }

        private onComplete(): void {
            this.hide(true);
        }

        public onClose(): void {
            this.clock.removeCallBack(this);
            fw.TimerManager.stop(FishingIntro.ClockId);
            this.clock = null;
            this.submarine.stop();
            this.submarine.destroy();
            fw.ResourceManager.ins.destroyResource("yellow_submarine.json");
            !FishingModel.quiet && this.mData && this.mData.func && this.mData.func.call(this.mData.this);
            super.onClose();
        }
    }
}