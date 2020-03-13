/// <reference path = "../fw.ts" />
/// <reference path = "../core/HashObject.ts" /> 
/// <reference path = "../util/Utils.ts" /> 

namespace fw {
    interface QueueProps {
        file: string;
        path: string;
        onComplete?: (res: any) => void;
        thisObj: any;
        isTextures: boolean;
    }
    
    export class ResourceManager extends HashObject {
        private static _ins: ResourceManager;
        
        private loader: PIXI.loaders.Loader;
        /** 资源字典 */
        private mapImages: HashMap<PIXI.Texture>;
        private mapTextureResources: HashMap<TextureResource>;
        private mapAudios: HashMap<PIXI.sound.Sound>;
        private mapAny: HashMap<any>
    
        private loadingQueue: QueueProps[] = [];
        private isLoading: boolean = false;
    
        public constructor() {
            super();
            this.loader = new PIXI.loaders.Loader();
            this.mapImages = new HashMap();
            this.mapTextureResources = new HashMap();
            this.mapAudios = new HashMap();
            this.mapAny = new HashMap();
            this.loadingQueue = [];
            this.isLoading = false;
    
            this.loader.onError.add((error) => {
                Log.error(error.message);
                if (error.message.indexOf("XMLHttpRequest") > 0) {
                    if (error.stack.indexOf("pixi-sound")) {
                        //出现 pixi-sound 有关的加载错误时，直接切换到 HTMLAudioEngine
                        window.parent.postMessage({ type: "forceSoundEngine", data: 1 }, "*");
                    }
                    else {
                        //出现加载故障时降级，并 reload 页面
                        window.parent.postMessage({ type: "decreasequality", data: {} }, "*");
                    }
                    location.reload();
                }
            });
        }
    
        public static get ins(): ResourceManager {
            return ResourceManager._ins || (ResourceManager._ins = new ResourceManager());
        }
    
        private getHashMap(file: string): HashMap<any> {
            const splitUrl = file.split(".");
            switch (splitUrl[splitUrl.length - 1]) {
                case "png":
                case "jpg":
                    return this.mapImages;
                case "mp3":
                case "wav":
                    return this.mapAudios;
                default:
                    return this.mapAny;
            }
        }

        /** 按资源配置组加载资源 */
        public loadByGroup(resPath: string, onComplete?: () => void, onProgress?: (progress: number) => void, thisObj?: any): void {
            const onResComplete = (json: any) => {
                const files = json.files as string[];
                this.loadByUrls(files, onComplete, onProgress, thisObj);
            }
            this.loadByUrl(resPath, onResComplete, this);
        }
    
        /** 按 URL 列表加载资源 */
        public loadByUrls(urls: string[], onComplete?: () => void, onProgress?: (progress: number) => void, thisObj?: any): void {
            let totalCount = urls.length;
            if (totalCount == 0)
            {
                onComplete && onComplete.call(thisObj);
                return;
            }
            let currentCount = 0;
            for (let i = 0; i < urls.length; i++) {
                this.loadByUrl(urls[i], onSingleComplete, this);
            }
    
            function onSingleComplete(): void {
                currentCount++;
                onProgress && onProgress.call(thisObj, currentCount / totalCount);
                if (currentCount >= totalCount && onComplete)
                    onComplete.call(thisObj);
            }
        }
    
        /** 按 URL 加载单个资源 */
        public loadByUrl(url: string, onComplete?: (res: any) => void, thisObj?: any): void {
            const file = cutFilename(url);

            this.loadingQueue.push({ file, path: url, onComplete, thisObj, 
                isTextures: file.indexOf(".json") > 0 && file.indexOf("_ske") == -1 && file.indexOf("_tex") == -1});
    
            if (this.isLoading)
                return;
    
            this.loadNextFile();
        }
    
        private loadNextFile(): void {
            let ele = this.loadingQueue.shift();
            if (!ele) {
                this.isLoading = false;
                return;
            }
    
            this.isLoading = true;
            const loadName = cutFilename(ele.path);
            const map = this.getHashMap(loadName);
            const self = this;
    
            if (map.containsKey(loadName)) {
                ele.onComplete && ele.onComplete.call(ele.thisObj, map.getValue(loadName));
                this.loadNextFile();
                return;
            }

            let loaderPath = ele.path;
            if (Config.jsTexturesMode && ele.file.indexOf(".json") >= 0 && !ele.isTextures) {
                // JS 配置加载普通 Json 文件
                loaderPath = ele.path.replace(".json", ".js");
                (<any>require)([loaderPath], function(jsonMap: any) {
                    Log.log(`load ${loadName} complete`);
                    map.put(ele.file, jsonMap);
                    ele.onComplete && ele.onComplete.call(ele.thisObj, jsonMap);
                    self.loadNextFile.call(self);
                });
                return;
            }

            if (Config.jsTexturesMode && ele.isTextures) {
                // JS 配置加载图集
                loaderPath = ele.path.replace(".json", ".png");
            }

            this.loader.add(loadName, loaderPath).load((loader, response): void => {
                if (!ele)
                    return;
                
                const res: PIXI.loaders.Resource = response[loadName];
                if (res.error)
                {
                    delete this.loader.resources[loadName];
                    this.loadNextFile();
                    return;
                }
                Log.log(`load ${loadName} complete`);
                let resData: any, immediately: boolean = true;
                switch (res.extension) {
                    case "png":
                    case "jpg":
                        if (ele.isTextures) {
                            immediately = false;
                            let generateTextureResourceFromJS = (res: TextureResource) => {
                                this.mapTextureResources.put(loadName, res);
                                resData = res;
                                ele && ele.onComplete && ele.onComplete.call(ele.thisObj, resData);
                                this.loadNextFile();
                            }
                            TexturesUtil.parseSpritesheet(ele.path.replace(".json", ".js"), res.texture, generateTextureResourceFromJS, this);
                        }
                        else {
                            map.put(res.name, res.texture);
                            resData = res.texture;
                        }
                        break;
                    case "mp3":
                    case "wav":
                        if (PIXI.sound && res.sound) {
                            map.put(res.name, res.sound as PIXI.sound.Sound);
                            res.sound._instances = []; //防止destroy后再加载时这两个属性为 null
                            res.sound._sprites = {};
                            resData = res.sound;
                        }
                        break;
                    case "json":
                        let generateTextureResource = () => {
                            const textures = new TextureResource(res);
                            self.mapTextureResources.put(res.name, textures);
                            resData = res.textures;
                            ele && ele.onComplete && ele.onComplete.call(ele.thisObj, resData);
                            self.loadNextFile.call(self);
                        }
                        if (res.textures)
                        {
                            immediately = false;
                            generateTextureResource();
                        }
                        else if (res.data["meta"])
                        {
                            immediately = false;
                            this.spritesheetParser(res, generateTextureResource);
                        }
                        else
                        {
                            map.put(res.name, res.data);
                            resData = res.data;
                        }
                        break;
                    default:
                        map.put(res.name, res.data);
                        resData = res.data;
                        break;
                }
                // Log.log(`load ${res.url} complete`);
                if (immediately)
                {
                    ele.onComplete && ele.onComplete.call(ele.thisObj, resData);
                    this.loadNextFile();
                }
            });
        }
        
        /** 改自 PIXI 的 spritesheetParser 方法，解析图集 */
        private spritesheetParser(resource: PIXI.loaders.Resource, onComplete: () => void): void {
            const imageResourceName = `${resource.name}_image`;
    
            if (!resource.data
                || !resource.data.frames
                || this.loader.resources[imageResourceName]
            ) {
                return;
            }
    
            const loadOptions = {
                crossOrigin: resource.crossOrigin,
                loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE,
                metadata: (<any>resource.metadata)["imageMetadata"],
                parentResource: resource,
            };
    
            const resourcePath = resource.url.replace("json", "png");
            this.loader.add(imageResourceName, resourcePath, loadOptions, function onImageLoad(res: PIXI.loaders.Resource) {
                const spritesheet = new PIXI.Spritesheet(
                    res.texture.baseTexture,
                    resource.data,
                    resource.url
                );
    
                spritesheet.parse(() => {
                    resource.spritesheet = spritesheet;
                    resource.textures = spritesheet.textures;
                });
    
                onComplete();
            });
        }
    
        public getTextureResource(name: string): TextureResource | undefined {
            return this.mapTextureResources.getValue(name);
        }
    
        public getTexture(name: string): PIXI.Texture | undefined {
            return this.mapImages.getValue(name);
        }
    
        public getAudio(name: string): PIXI.sound.Sound | undefined {
            return this.mapAudios.getValue(name);
        }
    
        public getJson(name: string): any | undefined {
            return this.mapAny.getValue(name);
        }
    
        public createSprite(name: string, xpos: number = 0, ypos: number = 0, interactive: boolean = false): PIXI.Sprite {
            const sprite = new PIXI.Sprite();
            HashObject.InjectHashCode(sprite);
            const texture = this.mapImages.getValue(name);
            if (texture)
                sprite.texture = texture;
            sprite.interactive = interactive;
            sprite.x = xpos;
            sprite.y = ypos;
            return sprite;
        }
    
        /** 创建文本框 */
        public createLabel(text: string, xpos: number= 0, ypos: number= 0, size: number = 27, color: number = 0xffffff, align: string = "center"): PIXI.Text
        {
            let font: string = getDeviceType();
            if (font == DeviceType.iPad)
                font = "STHeitiSC-Medium";
            else if (font == DeviceType.Mac)
                font = "STHeitiSC-Medium";
            else
                font = "Microsoft YaHei";
            const label = new PIXI.Text(text, {
                fontFamily: font,
                fontSize: size,
                fill: color
            });
            HashObject.InjectHashCode(label);
            label.anchor.x = align == "left" ? 0 : (align == "center" ? 0.5 : 1);
            label.anchor.y = 0.5;
            label.x = xpos;
            label.y = ypos;
            return label;
        }

        /**
         * 销毁资源
         * @param name 资源名
         */
        public destroyResource(name: string): void {
            const map = this.getHashMap(name);
            let res = map.remove(name);
            if (res) {
                if (res instanceof PIXI.Texture) {
                    res.destroy(true);
                    PIXI.Texture.removeFromCache(res);
                }
                else if (res instanceof PIXI.sound.Sound) {
                    PIXI.sound.remove(name);
                }
                else {
                    res["destroy"] && res["destroy"]();
                }
            }
            
            res = this.loader.resources[name];
            if (res) {
                delete this.loader.resources[name];
                PIXI.Texture.removeFromCache(name);
                PIXI.BaseTexture.removeFromCache(name);
                PIXI.Texture.removeFromCache(res.url);
                PIXI.BaseTexture.removeFromCache(res.url);
                Log.log(`destroy ${name} complete`);
            }

            if (name.indexOf(".json") != -1) {
                const textureResource = this.mapTextureResources.getValue(name);
                if (textureResource) {
                    this.mapTextureResources.remove(name);
                    textureResource.destroy();
                    Log.log(`destroy TextureResource ${name} complete`);

                    delete this.loader.resources[`${name}_image`]; //删除关联 image
                }
            }
        }
    
        public destroy(): void {
            this.mapImages.eachKey(key => {
                let res = this.mapImages.remove(key);
                res.destroy(true);
                let succeed = this.loader.resources[key];
                delete this.loader.resources[key];
                PIXI.Texture.removeFromCache(key);
                PIXI.BaseTexture.removeFromCache(key);
                succeed && Log.log(`destroy ${key} complete`);
            }, this);
            this.mapImages = new HashMap();

            this.mapTextureResources.eachKey(key => {
                let textureResource = this.mapTextureResources.remove(key);
                textureResource.destroy();
                Log.log(`destroy TextureResource ${key} complete`);
                delete this.loader.resources[`${key}_image`];
            }, this);
            this.mapTextureResources = new HashMap();

            this.mapAudios.eachKey(key => {
                this.mapAudios.remove(key);
                PIXI.sound.remove(key);
                Log.log(`destroy ${key} complete`);
            }, this);
            this.mapAudios = new HashMap();
            PIXI.sound && PIXI.sound.removeAll();

            this.mapAny.eachKey(key => {
                let res = this.mapAny.remove(key);
                res["destroy"] && res["destroy"]();
                Log.log(`destroy ${key} complete`);
            }, this);
            this.mapAny = new HashMap();
            this.loadingQueue = [];
            this.isLoading = false;
            this.loader.onError.detachAll();
            this.loader.reset();
            this.loader.destroy();
            this.loader = null;
            ResourceManager._ins = null;
        }
    }
}



