/// <reference path = "../fw.ts" /> 
namespace fw {

    export interface SceneData<T extends BaseScene> {
        clsKey: string;
        content: T;
        data: any;
        resourcePath: string[] | undefined;
        align: number;
        hasModal: boolean;
    }

    export class SceneNavigator extends HashObject {

        public currentProps?: SceneData<BaseScene>
        private mapSceneData: HashMap<SceneData<any>>;
        private modalBlocker: GQuad;

        public constructor() {
            super();
            this.mapSceneData = new HashMap();
            this.modalBlocker = new GQuad(0x0, 0, 0, 100, 100, 0);
            this.modalBlocker.interactive = true;
        }

        public getSceneData<T extends BaseScene>(scene: new () => T): SceneData<T> | undefined {
            let mapKey: string = this.getMapKey(scene);
            return this.mapSceneData.getValue(mapKey);
        }

        public setCurrentScene<T extends BaseScene>(scene: new () => T, data: any, align?: number, resourcePath?: string[], hasModal: boolean = false): T {
            this.hideCurrentScene();
            let mapKey: string = this.getMapKey(scene);;
            let props = this.mapSceneData.getValue(mapKey) as SceneData<T>;
            if (!props)
                props = this.createSceneData(mapKey, scene, data, align, resourcePath, hasModal);
            else {
                props.data = data;
                align && (props.align = align);
                resourcePath && (props.resourcePath = resourcePath);
                props.hasModal = hasModal;
            }
            const content = props.content;
            const self = this;
            this.currentProps = props;
            if (content.status == PanelStatus.READY || content.status == PanelStatus.CLOSE) {
                onLoadPanelComplete();
            }
            else {
                content.load(props.resourcePath, onLoadPanelComplete, onLoadingPanel, onClosePanel, this);
            }
            return content;

            function onLoadPanelComplete(): void {
                content.show(props.data, props.align);
                if (props.hasModal)
                    self.checkModal();

                Log.log(`open scene key: ${props.clsKey}`);
            }

            function onLoadingPanel(proress: number): void {
                //Nothing
            }

            function onClosePanel(): void {
                self.checkModal();
                Log.log(`close scene key: ${props.clsKey}`);
            }
        }

        private checkModal(): void {
            if (this.modalBlocker.parent)
                this.modalBlocker.parent.removeChild(this.modalBlocker);

            if (this.currentProps && this.currentProps.hasModal) {
                const director = Config.currentDirector as GameDirector;
                director.stage.addChildAt(this.modalBlocker, 0);
                this.modalBlocker.width = Config.stageWidth;
                this.modalBlocker.height = Config.stageHeight;
            }
        }

        private createSceneData<T extends BaseScene>(mapKey: string, scene: new () => T, data: any, align?: number, resourcePath?: string[], hasModal: boolean = false): SceneData<T> {
            let props: SceneData<T> = {
                clsKey: mapKey,
                content: new scene(),
                data: data,
                align: align || 1,
                resourcePath: resourcePath,
                hasModal: hasModal,
            };
            props.content.name = scene.name;
            this.mapSceneData.put(mapKey, props);
            return props;
        }

        private getMapKey<T extends BaseScene>(panel: new () => T): string {
            let clsHashCode = HashObject.GetHashCode(panel);
            return `${panel.name}_${clsHashCode}`;
        }

        public getScene<T extends BaseScene>(scene: new () => T): T {
            let mapKey: string = scene.name;
            let props = this.mapSceneData.getValue(mapKey);
            if (!props)
                props = this.createSceneData(mapKey, scene, null);
            return props.content;
        }

        private hideCurrentScene(): void {
            if (!this.currentProps)
                return;
            let props = this.mapSceneData.getValue(this.currentProps.clsKey);
            if (!props)
                return;

            this.currentProps.content.removeAllListeners();
            this.currentProps.content.hide(true);
            this.mapSceneData.remove(props.clsKey);
            return;
        }

        public destroyAllScene(): void {
            this.mapSceneData.eachValue(props => {
                const content = props.content as BaseScene;
                content.removeAllListeners();
                if (content.isOpen) {
                    content.hide(true);
                }
                else {
                    content.destroy();
                    this.mapSceneData.remove(props.clsKey);
                }
            }, this);
        }
    }
}

