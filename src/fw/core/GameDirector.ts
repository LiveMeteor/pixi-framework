/// <reference path = "HashObject.ts" /> 

namespace fw {
    export class GameDirector extends HashObject {

        public stageWidth: number = 0;
        public stageHeight: number = 0;
        public fps: number;
        public transparent: boolean;
        public htmlContainer: HTMLElement;
        public quality: number;
    
        public stage: PIXI.Container;
        public app: PIXI.Application;
        protected stats?: { update:() => void, dom:HTMLElement };
    
        public constructor(stageWidth: number, stageHeight: number, transparent: boolean = false, containerId?: string, quality:number = 2, fps: number = 24) {
            super();
            Config.currentDirector = this;
            this.stageWidth = stageWidth;
            this.stageHeight = stageHeight;
            this.transparent = transparent;
            this.quality = quality;
            this.fps = fps;
    
            const container = containerId ? document.getElementById(containerId) : null;
            this.htmlContainer = container || document.body;
    
            Config.stageWidth = this.stageWidth = stageWidth;
            Config.stageHeight = this.stageHeight = stageHeight;
    
            const opt = {
                width: this.stageWidth,
                height: this.stageHeight,
                antialias: false,
                forceFXAA: true,
                clearBeforeRender: true,
                preserveDrawingBuffer: true,
    
                autoResize: true,
                transparent: this.transparent,
                resolution: this.quality <= 0 ? 0.4 : 1,
                forceCanvas: this.quality <= 1
            } as PIXI.ApplicationOptions;
        
            this.app = new Application(opt, this.render, this, fps);
            this.stage = this.app.stage;
            this.stage.name = "stage";
            this.htmlContainer.appendChild(this.app.view);
    
            TimerManager.start();
    
            const Stats = window.Stats;
            if (Stats)
            {
                this.stats = new Stats() as { update:() => void, dom:HTMLElement };
                this.htmlContainer.appendChild(this.stats.dom);
                this.stats.dom.style.top = "50%";
                this.stats.dom.style.left = "0%";
                if (getDeviceType() == DeviceType.iPad) {
                    for (let i in this.stats.dom.children)
                    {
                        const ele = this.stats.dom.children[i];
                        if (ele.localName == "canvas")
                        {
                            (ele as HTMLCanvasElement).style.width = "160px";
                            (ele as HTMLCanvasElement).style.height = "96px";
                        }
                    }
                }
            }
        }
    
        public validateStage(): void
        {
            let childrenStage: PIXI.DisplayObject[] = [];
            if (this.stage)
            {
                childrenStage = [];
                while (this.stage.children.length > 0)
                {
                    const child = this.stage.getChildAt(0);
                    this.stage.removeChild(child);
                    childrenStage.push(child);
                }
                this.app.view.parentElement && this.htmlContainer.removeChild(this.app.view);
            }
    
            const opt = {
                width: this.stageWidth,
                height: this.stageHeight,
                antialias: false,
                forceFXAA: true,
                clearBeforeRender: true,
                preserveDrawingBuffer: true,
    
                autoResize: true,
                transparent: this.transparent,
                resolution: this.quality <= 0 ? 0.4 : 1,
                forceCanvas: this.quality <= 1
            } as PIXI.ApplicationOptions;
            Config.isDebug && console.log(opt);
            this.app = new Application(opt, this.render, this, this.fps);
            this.stage = this.app.stage;
            this.stage.name = "stage";
            this.htmlContainer.appendChild(this.app.view);
    
            while (childrenStage.length > 0)
            {
                const child = childrenStage.shift() as PIXI.DisplayObject;
                this.stage.addChild(child);
            }
        }
    
        public resize(stageWidth: number, stageHeight: number): void
        {
            Config.stageWidth = this.stageWidth = stageWidth;
            Config.stageHeight = this.stageHeight = stageHeight;
            this.app.renderer.resize(stageWidth, stageHeight);
    
            const scene = SceneManager.current();
            if (scene)
            {
                const ratio = Math.max(stageWidth / scene.designWidth, stageHeight / scene.designHeight);
                scene.setTransform(0, 0, ratio, ratio);
                scene.x = stageWidth - scene.designWidth * ratio >> 1;
                scene.y = stageHeight - scene.designHeight * ratio >> 1;
                Log.log(`Resize the scale of Scene ${ratio} stage width ${stageWidth} stage height ${stageHeight}`);
            }
        }
    
        public render():void {
            // TWEEN.update(); //Tween.js 刷新方法，需要再打开
            this.stats && this.stats.update();
        }
    
        public destroy(): void
        {
            TimerManager.stop();
            Tween.removeAllTweens();
            PIXI.ticker.shared.destroy();
            SoundManager.destroy();
            PanelManager.destroyAllPanel();
            SceneManager.destroyAllScene();
            ResourceManager.ins.destroy();
            GResponser.destroy();
            Config.currentDirector = undefined;
            this.app.destroy(true, true);
        }
    }

    class Application extends PIXI.Application {

        private renderFunc?: () => void;
        private thisObj: any;
        private deviceType: DeviceType;
        private lastRenderTime: number = 0;
        private renderGap: number;
    
        constructor(options?: PIXI.ApplicationOptions, renderFunc?:() => void, thisObj?: any, fps: number = 24) {
            super(options);
            this.renderFunc = renderFunc;
            this.thisObj = thisObj;
            this.renderGap = 1000 / fps;
            this.deviceType = getDeviceType() as DeviceType;
        }
    
        public render(): void
        {
            if (fw.getTimer() - this.lastRenderTime < this.renderGap)
                return;

            if (fw.getTimer() - this.lastRenderTime > 1000)
                this.lastRenderTime = fw.getTimer();
            else
                this.lastRenderTime += this.renderGap;
            
            try {
                super.render();
            }
            catch (evt) {
                window.parent.postMessage({ type: "decreasequality", data: {} }, "*");
                location.reload();
            }
            
            this.renderFunc && this.renderFunc.call(this.thisObj);
        }
    }
}

let verNum = parseInt(PIXI.VERSION.split(".").join(""));
/** 修正中文分词折行的问题 4.8 和 4.6 文本渲染方式不一样，所以只能分开写*/
if (verNum >= 470) {
    PIXI.TextMetrics.tokenize = (text?: string): string[] => {
        const tokens: string[] = [];
        let token = '';
        if (typeof text !== 'string') {
            return tokens;
        }
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            tokens.push(char);
        }
        if (token !== '') {
            tokens.push(token);
        }
        return tokens;
    }
}
else {
    PIXI.TextMetrics.wordWrap = (text: string, style: PIXI.TextStyle, canvas: HTMLCanvasElement = PIXI.TextMetrics._canvas) => {
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;

        // Greedy wrapping algorithm that will wrap words as the line grows longer
        // than its horizontal bounds.
        let result = '';
        const firstChar = text.charAt(0);
        const lines = text.split('\n');
        const wordWrapWidth = style.wordWrapWidth * 1.6;
        const characterCache: any = {};

        for (let i = 0; i < lines.length; i++) {
            let spaceLeft = wordWrapWidth;
            const words = lines[i].split('');

            for (let j = 0; j < words.length; j++) {
                const wordWidth = context.measureText(words[j]).width;

                if (style.breakWords && wordWidth > wordWrapWidth) {
                    // Word should be split in the middle
                    const characters = words[j].split('');

                    for (let c = 0; c < characters.length; c++) {
                        const character = characters[c];
                        let characterWidth = characterCache[character];

                        if (characterWidth === undefined) {
                            characterWidth = context.measureText(character).width;
                            characterCache[character] = characterWidth;
                        }

                        if (characterWidth > spaceLeft) {
                            result += `\n${character}`;
                            spaceLeft = wordWrapWidth - characterWidth;
                        }
                        else {
                            if (c === 0 && (j > 0 || firstChar === ' ')) {
                                result += ' ';
                            }

                            result += character;
                            spaceLeft -= characterWidth;
                        }
                    }
                }
                else {
                    const wordWidthWithSpace = wordWidth + context.measureText(' ').width;

                    if (j === 0 || wordWidthWithSpace > spaceLeft) {
                        // Skip printing the newline if it's the first word of the line that is
                        // greater than the word wrap width.
                        if (j > 0) {
                            result += '\n';
                        }
                        result += words[j];
                        spaceLeft = wordWrapWidth - wordWidth;
                    }
                    else {
                        spaceLeft -= wordWidthWithSpace;
                        result += `${words[j]}`;
                    }
                }
            }

            if (i < lines.length - 1) {
                result += '\n';
            }
        }
        return result;
    }
}

/** 修正了 4.8 版本以后在没有开启 allow-file-access-from-files 时连 IMG 都不能读取的问题 */
if (verNum >= 480)
{
    (<any>PIXI.loaders.Resource).prototype["_determineCrossOrigin"] = (url: string, loc?: Location): string => {
        return '';
    }
}

function useClientReadFile(): void {
    // (<any>PIXI.loaders.Resource.prototype)._loadXhr = function () {
    //     if (typeof this.xhrType !== "string") {
    //         this.xhrType = this._determineXhrType();
    //     }
    
    //     var xhr = this.xhr = new XMLHttpRequest();
    
    //     xhr.open("GET", this.url, true);
    //     console.log("GET", this.url);
    
    //     if (this.xhrType === PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON || 
    //         this.xhrType === PIXI.loaders.Resource.XHR_RESPONSE_TYPE.DOCUMENT) {
    //         (<any>xhr).responseType = PIXI.loaders.Resource.XHR_RESPONSE_TYPE.TEXT;
    //     }
    //     else {
    //         xhr.responseType = this.xhrType;
    //     }
    
    //     xhr.addEventListener("error", this._boundXhrOnError, false);
    //     xhr.addEventListener("abort", this._boundXhrOnAbort, false);
    //     xhr.addEventListener("progress", this._boundOnProgress, false);
    //     xhr.addEventListener("load", this._boundXhrOnLoad, false);
    //     (<any>xhr)["url"] = CommonUtils.relativePath2fullPath(this.url);
    //     // window.AssetsCustomProcessor.virtualRequest[xhr["url"]] = xhr;
    //     // net.ClientMsgModel.ins.webToClient("readLocalFile", JSON.stringify({
    //     //     path: xhr["url"],
    //     //     type: 0
    //     // }));
    // }
    
    // PIXI.loaders.Resource.prototype._xhrOnLoad = function () {
    //     var xhr = this.xhr;
    //     var status = typeof xhr.status === "undefined" ? xhr.status : 200;
    //     if (status === 200 || status === 204 || (status === 0 && (xhr.responseText.length > 0 || xhr.content && xhr.content.length > 0))) {
    //         if (this.xhrType === PIXI.loaders.Resource.XHR_RESPONSE_TYPE.TEXT) {
    //             this.data = xhr.responseText || xhr.content;
    //         }
    //         else if (this.xhrType === PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON) {
    //             try {
    //                 this.data = JSON.parse(xhr.responseText || xhr.content);
    //                 this.isJson = true;
    //             }
    //             catch (e) {
    //                 this.abort("Error trying to parse loaded json:", e);
    //                 return;
    //             }
    //         }
    //         else if (this.xhrType === PIXI.loaders.Resource.XHR_RESPONSE_TYPE.DOCUMENT) {
    //             try {
    //                 if (window.DOMParser) {
    //                     var domparser = new DOMParser();
    //                     this.data = domparser.parseFromString(xhr.responseText, "text/xml");
    //                 }
    //                 else {
    //                     var div = document.createElement("div");
    //                     div.innerHTML = xhr.responseText;
    //                     this.data = div;
    //                 }
    //                 this.isXml = true;
    //             }
    //             catch (e) {
    //                 this.abort("Error trying to parse loaded xml:", e);
    //                 return;
    //             }
    //         }
    //         else {
    //             this.data = xhr.response || xhr.responseText;
    //         }
    //     }
    //     else {
    //         this.abort("[" + xhr.status + "]" + xhr.statusText + ":" + xhr.responseURL);
    //         return;
    //     }
    //     xhr["url"] && window.AssetsCustomProcessor.virtualRequest[xhr["url"]] &&
    //         delete window.AssetsCustomProcessor.virtualRequest[xhr["url"]]
    //     this.complete();
    // }
}