namespace app {
    /** 过关地图界面 */
    export class FishingSample extends fw.BasePanel {

        private originPos: {x: number, y: number} = {x: Config.stageWidth / 2, y: Config.stageHeight / 2};
        private imgWord: PIXI.Sprite;
        private hasCallHide: boolean = false;

        private testLabel: PIXI.Text;

        public constructor() {
            super(460, 376);
        }

        public initialize(): void {
            super.initialize();
            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            const bg = this.resource.createSprite("bbubbles_sample_bg.png", 0, 0, true);
            this.addChild(bg);
            this.imgWord = this.resource.createSprite("", 230, 138);
            this.imgWord.anchor.x = this.imgWord.anchor.y = 0.5;
            this.addChild(this.imgWord);
        }

        public onOpen(): void {
            super.onOpen();
            this.originPos = {x: this.x, y: this.y};
            if (this.hasCallHide) {
                this.willHide();
                return;
            }
            if (fw.Config.isDebug) {
                this.testLabel = this.resource.createLabel("", 0, 0, 20, 0xff0000, "left");
                this.addChild(this.testLabel);
            }
            if (!this.mData || !this.mData.list) {
                this.testLabel && (this.testLabel.text = "No Panel Data");
                return;
            }
            for (let wordData of (this.mData as IStageData).list) {
                if (wordData.trueOpt) {
                    this.testLabel && (this.testLabel.text = "Loading Image");
                    fw.ResourceManager.ins.loadByUrl(`../../${wordData.imageUrl}`, res => {
                        this.testLabel && (this.testLabel.text = "Image Loaded");
                        this.imgWord.texture = res;
                    }, this);
                    break;
                }
            }

            this.fadeIn();
        }

        private fadeIn(): void {
            this.scaleX = this.scaleY = 0.3;
            this.x = this.originPos.x + this.designWidth / 2 * 0.7;
            this.y = this.originPos.y + this.designHeight / 2 * 0.7;
            fw.Tween.get(this).to({x: this.originPos.x, y: this.originPos.y, scaleX: 1.0, scaleY: 1.0}, 600, fw.Ease.backOut).call(this.openComplete, this);
        }

        private openComplete(): void {
            
        }

        public willHide(): void {
            if (!this.isOpen) {
                this.hasCallHide = true;
                return;
            }
            fw.Tween.removeTweens(this);
            this.scaleX = this.scaleY = 1.0;
            this.x = this.originPos.x;
            this.y = this.originPos.y;
            fw.Tween.get(this).to({
                x: this.originPos.x + this.designWidth / 2 * 0.7,
                y: this.originPos.y + this.designHeight / 2 * 0.7,
                scaleX: 0.3, scaleY: 0.3}, 200)
                .call(this.hide, this);
        }

        public onClose(): void {
            fw.Tween.removeTweens(this);
            this.imgWord && (this.imgWord.texture = null);
            this.hasCallHide = false;
            if (this.testLabel) {
                fw.DisplayUtil.removeFromParent(this.testLabel);
                this.testLabel = null;
            }
            super.onClose();
        }

        /** 以下是 Tween 需在的方法 */
        public get scaleX(): number { return this.scale.x; }

        public set scaleX(value: number) { this.scale.x = value; }

        public get scaleY(): number { return this.scale.y; }

        public set scaleY(value: number) { this.scale.y = value; }
    }
}