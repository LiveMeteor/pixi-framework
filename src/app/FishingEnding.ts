namespace app {
    /** 结束界面 */
    export class FishingEnding extends fw.BasePanel {

        private labelMsg: PIXI.Text;
        private btnNext: fw.GButton;

        public constructor() {
            super(435, 270);
        }

        public initialize(): void {
            super.initialize();
            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            const bg = this.resource.createSprite("fishing_panel_bg.png", 0, 0, true);
            bg.width = 435;
            bg.height = 270;
            this.addChild(bg);

            const msg = FishingModel.mode == 1 ? "What’s next? Let’s have a look!" : "Click to move on to the next slide";
            this.labelMsg = this.resource.createLabel(msg, 218, 100, 20, 0x7b452b, "center");
            this.labelMsg.style.wordWrap = true;
            this.labelMsg.style.wordWrapWidth = 435;
            this.addChild(this.labelMsg);
        }

        public onOpen(): void {
            super.onOpen();
            if (FishingModel.mode != 1) {
                this.btnNext = this.resource.createButton("fishing_btn_start_up.png", 18, 150, this.onNext, this);
                this.btnNext.width = 300;
                this.btnNext.height = 60;
                this.addChild(this.btnNext);
            }
        }

        private onNext(): void {
            fw.GResponser.postMessage("nextslide");
        }

        public onClose(): void {
            this.btnNext && this.btnNext.destroy();
            !FishingModel.quiet && this.mData && this.mData.func && this.mData.func.call(this.mData.this);
            super.onClose();
        }
    }
}