namespace app {
    /** 老师成绩条 */
    export class FishingScoreBars extends PIXI.Container {

        private bars: ScoreBar[];

        public constructor() {
            super();
            this.bars = [];
            for (let i = 0; i < FishingModel.studentsInfo.length; i++) {
                const bar = new ScoreBar(FishingModel.studentsInfo[i]);
                bar.x = i * 280;
                this.addChild(bar);
                this.bars.push(bar);
            }
            this.updateScores();
        }

        public updateScores(): void
        {
            const syncInfo = FishingModel.cacheSyncInfo;
            if (!syncInfo)
                return;
            for (let bar of this.bars) {
                if (syncInfo[bar.studentInfo.uid]) {
                    bar.setData(<number>syncInfo[bar.studentInfo.uid]);
                }
                else {
                    bar.setData(0);
                }
            }
        }

        public destroy(): void {
            this.bars && this.bars.forEach(bar => { bar.destroy(); });
            this.removeChildren();
            this.bars = [];
            fw.DisplayUtil.removeFromParent(this);
        }

    }

    class ScoreBar extends PIXI.Container {

        public studentInfo: {uid: string, name: string};
        private resource: fw.TextureResource;
        private icons: PIXI.Sprite[];

        public constructor(studentInfo: {uid: string, name: string}) {
            super();
            this.studentInfo = studentInfo;
            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            const bg = this.resource.createSprite("fishing_bg_score.png");
            this.addChild(bg);
            this.icons = [];
            for (let i = 0; i < 4; i++) {
                const icon = this.resource.createSprite("", 52 + 55 * i, 30);
                icon.anchor.x = icon.anchor.y = 0.5;
                this.addChild(icon);
                this.icons.push(icon);
            }
            this.setData(0); //init
        }

        public setData(value: number): void {
            for (let i = 0; i < 4; i++) {
                const pos = 1 << i;
                const score = (value & pos) == pos;
                this.icons[i].texture = this.resource.getTexture(score ? "fishing_score_star.png" : "fishing_score_ask.png");
            }
        }

        public destroy(): void {
            this.removeChildren();
            this.icons = null;
            this.resource = null;
        }
    }
}