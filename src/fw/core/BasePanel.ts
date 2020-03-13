/// <reference path = "../fw.ts" /> 
namespace fw {
    export class BasePanel extends PIXI.Container {

        public designWidth: number;
        public designHeight: number;
        
        protected mStatus: PanelStatus = 0;
        protected resource?: TextureResource;
        protected onCloseCallback?: {func: () => void, thisObj: any};
        protected mIsInitialized: boolean = false;
        protected mData: any;
    
        public constructor(designWidth: number, designHeight: number, resource?:TextureResource) {
            super();
            HashObject.InjectHashCode(this);
            this.designWidth = designWidth;
            this.designHeight = designHeight;
            this.resource = resource;
            this.interactive = this.interactiveChildren = true;
        }
    
        /** 添加自定义事件 */
        public addEventListener(event: string, fn: (data: any) => void, context?: any): this
        {
            return this.addListener(<any>event, fn, context);
        }
    
        /** 移除自定义事件 */
        public removeEventListener(event: string, fn: (data: any) => void, context?: any): this
        {
            return this.removeListener(<any>event, fn, context);
        }
    
        /** 开始加载面板 */
        public load(resourcePaths?: string[], onComplete?: () => void, onProgress?: (progress: number) => void, onClose?: () => void, thisObj?: any): void
        {
            if (onClose)
                this.onCloseCallback = {func: onClose, thisObj: thisObj};
    
            this.status = PanelStatus.INITIALIZATION;
            if (resourcePaths)
            {
                const urls: string[] = [];
                resourcePaths.forEach((path, index, arr) => {
                    const splitUrl = path.split("/");
                    urls.push(splitUrl.length == 1 ? Config.pathTexturesResource + path : path);
                });
                ResourceManager.ins.loadByUrls(urls, () => {
                    if (!this.resource && resourcePaths.length > 0) {
                        this.resource = fw.ResourceManager.ins.getTextureResource(cutFilename(urls[0]));
                    }
                    this.checkInitialize();
                    onComplete && onComplete.call(thisObj);
                }, (progress: number) => {
                    onProgress && onProgress.call(thisObj, progress);
                },this);
            }
            else
            {
                this.checkInitialize();
                onComplete && onComplete.call(thisObj);
            }
        }
    
        /** 检查是否初始化过 */
        private checkInitialize(): void {
            if (!this.mIsInitialized) {
                this.initialize();
                this.mIsInitialized = true;
                this.status = PanelStatus.READY;
            }
        }
    
        /** 显示面板 */
        public show(container: PIXI.Container, data?: any, align: number = 1): void
        {
            this.setData(data);
            if (!this.isOpen)
            {
                container.addChild(this);
                align && ResizeManager.add(this, align);
                this.status = PanelStatus.OPEN;
                this.onOpen();
            }
        }
    
        /** 关闭、隐藏面板 */
        public hide(destroy: boolean = false): void
        {
            if (!this.parent)
                return;
    
            ResizeManager.remove(this);
            this.parent.removeChild(this);
            this.status = PanelStatus.CLOSE;
            this.onCloseCallback && this.onCloseCallback.func.call(this.onCloseCallback.thisObj);
            this.onClose();
    
            if (destroy)
            {
                this.destroy();
                this.status = PanelStatus.START;
            }
        }
    
        /** 初始化功能逻辑 */
        public initialize(): void {
    
            // this.emit("onInit");
        }
    
        /** 面板需要的数据 */
        public setData(value: any): void
        {
            this.mData = value;
        }
    
        /** 面板需要的数据 */
        public getData(): any
        {
            return this.mData;
        }
    
        /** 面板状态 0未初始化 1初始化中 2已就绪 3已打开 4异常 */
        public get status(): PanelStatus {
            return this.mStatus;
        }
    
        public set status(value: PanelStatus) {
            this.mStatus = value;
            this.emit("change", this.mStatus);
            // console.log("emit change" + this.mStatus);
        }
    
        /** 打开后的功能逻辑 */
        protected onOpen(): void {
            
        }
    
        /** 是否已打开 */
        public get isOpen():boolean {
            return this.status == PanelStatus.OPEN;
        }
    
        /** 是否在舞台上 */
        public get onStage(): boolean {
            function checkStage(value: PIXI.Container): boolean
            {
                if (!value)
                    return false;
                else if (value.name == "stage")
                    return true;
                else
                    return checkStage(value.parent);
            }
            return checkStage(this.parent);
        }
    
        /** 关闭后的功能逻辑 */
        protected onClose(): void {
    
        }
    
        /** 销毁、释放面板 */
        public destroy(): void {
            this.resource = undefined;
        }
    }
}

