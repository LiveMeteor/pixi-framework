namespace app {
    /** 开始界面 */
    export class FishingEntrance extends fw.BasePanel {

        private labelMsg: PIXI.Text;
        private btnStart: fw.GButton;

        public constructor() {
            super(435, 270);
        }

        public initialize(): void {
            super.initialize();
            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json") as fw.TextureResource;
            const bg = this.resource.createSprite("fishing_panel_bg.png", 0, 0, true);
            bg.width = 435;
            bg.height = 270;
            this.addChild(bg);

            this.labelMsg = this.resource.createLabel("Click to start the word game", 218, 100, 20, 0x7b452b, "center");
            this.labelMsg.style.wordWrap = true;
            this.labelMsg.style.wordWrapWidth = 435;
            this.addChild(this.labelMsg);
        }

        public onOpen(): void {
            super.onOpen();
            this.btnStart = this.resource.createButton("fishing_btn_start_up.png", 18, 150, this.onStart, this);
            this.btnStart.width = 300;
            this.btnStart.height = 60;
            this.addChild(this.btnStart);
        }

        private onStart(): void {
            if (FishingModel.mode == RoleType.TEACHER) {
                const msgBody: IStageGameSwitch = { type: GameAPI.gameName, status: 1 };
                fw.GResponser.postMessage("stageGameSwitch", msgBody);
            }
            else if (FishingModel.mode == RoleType.REVIEW || FishingModel.mode == RoleType.PREVIEW) {
                FishingModel.cacheSyncInfo = {
                    type: GameAPI.gameName,
                    status: 0
                } as IStageGameSync;
                fw.GResponser.emit("stageGameSwitch", {
                    type: GameAPI.gameName,
                    status: 1,
                    currTime: Date.now()
                } as IStageGameSwitch);
            }
            else if (FishingModel.mode = RoleType.RECORDER) {
                //测试用的录课数据，正式环境由于点不到按钮所以触发不到这里
                fw.GResponser.emit("stageGameSwitch", {
                    type: GameAPI.gameName,
                    status: 1,
                } as IStageGameSwitch);
            }
        }

        public onClose(): void {
            this.btnStart.destroy();
            !FishingModel.quiet && this.mData && this.mData.func && this.mData.func.call(this.mData.this);
            super.onClose();
        }
    }
}