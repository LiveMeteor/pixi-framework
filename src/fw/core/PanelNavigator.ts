/// <reference path = "../fw.ts" /> 
namespace fw {
    export interface PanelData<T extends BasePanel> {
        clsKey: string;
        content: T;
        data: any;
        layer: PIXI.Container;
        resourcePath: string[] | undefined;
        align: number;
        hasModal: boolean;
    }
    
    export class PanelNavigator extends HashObject {
    
        private mapPanelData:HashMap<PanelData<any>>;
        private validPanelData: PanelData<any>[];
        private modalBlocker: GQuad;
    
        public constructor() {
            super();
            this.mapPanelData = new HashMap();
            this.validPanelData = [];
        }
    
        public getPanelData<T extends BasePanel>(panel: new () => T): PanelData<T> | undefined
        {
            let mapKey:string = this.getMapKey(panel);
            return this.mapPanelData.getValue(mapKey);
        }
    
        public showPanel<T extends BasePanel>(panel: new() => T, data: any, align?: number, layer?: PIXI.Container, resourcePath?: string[], hasModal: boolean = false): T
        {
            let mapKey:string = this.getMapKey(panel);
            let props = this.mapPanelData.getValue(mapKey) as PanelData<T>;
            if (!props)
                props = this.createPanelData(mapKey, panel, data, align, layer, resourcePath, hasModal);
            else
            {
                props.data = data;
                (align != undefined) && (props.align = align);
                (layer != undefined) && (props.layer = layer);
                resourcePath && (props.resourcePath = resourcePath);
                props.hasModal = hasModal;
            }
            const content = props.content;
            const self = this;
            if (content.status == PanelStatus.INITIALIZATION)
            {
                //打开中，等待打开完成
                return content;
            }
            if (content.status == PanelStatus.READY || content.status == PanelStatus.CLOSE || content.status == PanelStatus.OPEN)
            {
                onLoadPanelComplete();
            }
            else
            {
                content.load(props.resourcePath, onLoadPanelComplete, onLoadingPanel, onClosePanel, this);
            }
            return content;
    
            function onLoadPanelComplete(): void
            {
                content.show(props.layer, props.data, props.align);
                if (self.validPanelData.indexOf(props) >= 0)
                    self.validPanelData.splice(self.validPanelData.indexOf(props), 1);
                self.validPanelData.push(props);
                if (props.hasModal)
                    self.checkModal();
                Log.log(`open panel key: ${props.clsKey}`);
            }
    
            function onLoadingPanel(proress: number): void
            {
                //Nothing
            }
    
            function onClosePanel(): void
            {
                const index = self.validPanelData.indexOf(props);
                if (index < 0)
                    return;
                self.validPanelData.splice(index, 1);
                self.checkModal();
                Log.log(`close panel key: ${props.clsKey}`);
            }
        }
    
        private checkModal(): void
        {
            if (this.modalBlocker && this.modalBlocker.parent)
            {
                this.modalBlocker.parent.removeChild(this.modalBlocker);
                this.modalBlocker = null;
            }
            
            const currScene = SceneManager.current() as BaseScene;
            if (!currScene)
                return;
    
            for (let i = this.validPanelData.length - 1; i >= 0; i--)
            {
                let props = this.validPanelData[i];
                if (props.hasModal && props.content.parent)
                {
                    this.modalBlocker = new GQuad(0x0, 0, 0, currScene.designWidth, currScene.designHeight, 0.6);
                    this.modalBlocker.interactive = true;
                    DisplayUtil.addChildBefore(this.modalBlocker, props.content);
                    break;
                }
            }
        }
    
        private createPanelData<T extends BasePanel>(mapKey:string, panel: new() => T, data: any, align?: number, layer?: PIXI.Container, resourcePath?: string[], hasModal: boolean = false): PanelData<T>
        {
            let props: PanelData<T> = {
                clsKey: mapKey,
                content: new panel(),
                data: data,
                align: align == undefined ? 1 : align,
                layer: layer || (SceneManager.current() as BaseScene).getLayer(),
                resourcePath: resourcePath,
                hasModal: hasModal,
            };
            props.content.name = panel.name;
            this.mapPanelData.put(mapKey, props);
            return props;
        }
    
        private getMapKey<T extends BasePanel>(panel: new() => T): string
        {
            let clsHashCode = HashObject.GetHashCode(panel);
            return `${panel.name}_${clsHashCode}`; 
        }
    
        public getPanel<T extends BasePanel>(panel: new() => T): T
        {
            let mapKey = this.getMapKey(panel);
            let props = this.mapPanelData.getValue(mapKey);
            
            if (!props)
                props = this.createPanelData(mapKey, panel, null);
            return props.content;
        }
    
        public isOpen(panel: new () => BasePanel): boolean {
            let mapKey:string = this.getMapKey(panel);
            let props = this.mapPanelData.getValue(mapKey);
            if (!props)
                return false;
            return (props.content as BasePanel).isOpen;
        }
    
        public hidePanel<T extends BasePanel>(panel: new () => T, destroy: boolean = false): T | undefined
        {
            let mapKey:string = this.getMapKey(panel);
            let props = this.mapPanelData.getValue(mapKey);
            if (!props)
                return undefined;
            
            (props.content as BasePanel).hide(destroy);
            
            if (destroy)
            {
                this.mapPanelData.remove(props.clsKey);
                return undefined;
            }
            else
            {
                return props.content;
            }
        }
    
        public hideAllPanel(): void
        {
            this.mapPanelData.eachValue(props => {
                (props.content as BasePanel).hide(false);
            }, this);
        }
    
        public destroyPanel(panel: new () => BasePanel): void
        {
            let mapKey:string = this.getMapKey(panel);
            let props = this.mapPanelData.getValue(mapKey);
            if (!props)
                return;
            
            const content = props.content as BasePanel;
            content.removeAllListeners();
            if (content.isOpen)
            {
                content.hide(true);
            }
            else
            {
                content.destroy();
                this.mapPanelData.remove(props.clsKey); 
            }
        }
    
        public destroyAllPanel(): void
        {
            this.mapPanelData.eachValue(props => {
                const content = props.content as BasePanel;
                content.removeAllListeners();
                if (content.isOpen)
                {
                    content.hide(true);
                }
                else
                {
                    content.destroy();
                    this.mapPanelData.remove(props.clsKey); 
                }
            }, this);
            this.mapPanelData.clear();
        }
    }
}

