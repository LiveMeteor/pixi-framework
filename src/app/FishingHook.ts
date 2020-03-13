namespace app {
    /** 钓鱼钩 */
    export class FishingHook extends PIXI.Container {
        
        private cable: PIXI.Graphics;
        private imgHook: PIXI.Sprite;

        private length: number = 100;
        private imgHookLength: number = 65;
        private fish?: FishingIns;

        public constructor() {
            super();
            this.cable = new PIXI.Graphics();
            this.cable.clear();
            this.cable.beginFill(0x33334c);
            this.cable.drawRect(0, 0, this.length - this.imgHookLength, 6);
            this.cable.endFill();
            this.addChild(this.cable);

            const resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            this.imgHook = resource.createSprite("fishing_hock.png");
            this.imgHook.rotation = -Math.PI / 2;
            this.imgHook.x = this.length - this.imgHookLength;
            this.imgHook.y = 12;
            this.addChild(this.imgHook);
        }

        public set hookLength(value: number) {
            this.length = Math.max(value, this.imgHookLength);
            this.cable.width = this.length - this.imgHookLength;
            this.imgHook.x = this.length - this.imgHookLength;
            const globalPos = this.getGlobalPosition();
            globalPos.x *= (fw.SceneManager.current() as FishingScene).designWidth / fw.Config.stageWidth;
            globalPos.y *= (fw.SceneManager.current() as FishingScene).designHeight / fw.Config.stageHeight;
            const globalRotation = Math.PI / 2 - this.rotation;
            if (this.fish) {
                this.fish.x = globalPos.x + this.length * Math.sin(globalRotation);
                this.fish.y = globalPos.y + this.length * Math.cos(globalRotation);
            }
        }

        public get hookLength(): number {
            return this.length;
        }

        /** 挂着鱼 */
        public hangingFish(fish: FishingIns | null): void {
            this.fish = fish;

        }

        public destroy(options?: PIXI.DestroyOptions | boolean): void {
            super.destroy(options);
        }
    }
}