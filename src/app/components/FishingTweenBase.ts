namespace app {
    /** 为了方便使用 Tween，加了一层壳 */
    export class FishingTweenBase extends PIXI.Container {

        public constructor() {
            super();
        }

        public get scaleX(): number {
            return this.scale.x;
        }

        public set scaleX(value: number) {
            this.scale.x = value;
        }

        public get scaleY(): number {
            return this.scale.y;
        }

        public set scaleY(value: number) {
            this.scale.y = value;
        }
    }
}
