namespace fw {
    export class DragonBones extends PIXI.Container {

        private static factory = dragonBones.PixiFactory.factory;

        private armatureDisplay: dragonBones.PixiArmatureDisplay;
        private dbPath: string;
        private dbName: string;
        private armatureName: string;
        private isLoaded: boolean;

        public constructor(dbPath?: string, armatureName?: string) {
            super();
            dbPath && this.load(dbPath, armatureName);
        }

        public load(dbPath: string, armatureName?: string): void {
            this.isLoaded = false;
            this.dbPath = dbPath;
            this.dbName = cutFilename(dbPath);
            this.armatureName = armatureName;
            const urls = [
                `${dbPath}/${this.dbName}_ske.json`,
                `${dbPath}/${this.dbName}_tex.json`,
                `${dbPath}/${this.dbName}_tex.png`,
            ];
            ResourceManager.ins.loadByUrls(urls, this.onLoaded, null, this);
        }

        private onLoaded(): void {
            const ske = ResourceManager.ins.getJson(`${this.dbName}_ske.json`);
            const checkDbData = DragonBones.factory.getDragonBonesData(this.dbName);
            if (!checkDbData) {
                DragonBones.factory.parseDragonBonesData(ske);
            }

            const texJson = ResourceManager.ins.getJson(`${this.dbName}_tex.json`);
            const texPng = ResourceManager.ins.getTexture(`${this.dbName}_tex.png`);
            const checkAtlasData = DragonBones.factory.getTextureAtlasData(this.dbName);
            if (!checkAtlasData) {
                DragonBones.factory.parseTextureAtlasData(texJson, texPng);
            }
            
            this.armatureDisplay = DragonBones.factory.buildArmatureDisplay(this.armatureName || this.dbName, this.dbName);
            this.addChild(this.armatureDisplay);

            this.isLoaded = true;
            this.emit("loaded", this.armatureDisplay);
        }

        /** 
         * 替换插槽显示对象
         * @param slotName 插槽名字
         * @param display 替换的显示对象
         */
        public replaceSlotDisplay(slotName :string, display: PIXI.DisplayObject): PIXI.DisplayObject {
            if (!this.isLoaded)
                return;
            
            return this.armatureDisplay.armature.getSlot(slotName).display = display;
        }

        /** 
         * 播放动画
         * @param animationName 动画名称
         * @param playTimes 播放次数
         */
        public play(animationName?: string, playTimes?: number): dragonBones.AnimationState {
            if (!this.isLoaded)
                return;

            return this.armatureDisplay.animation.play(animationName, playTimes);
        }

        public destroy(options?: boolean): void {
            fw.DisplayUtil.removeFromParent(this.armatureDisplay);
            this.armatureDisplay.destroy();
            super.destroy(options);
        }
    }
}