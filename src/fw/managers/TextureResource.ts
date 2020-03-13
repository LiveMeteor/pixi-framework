/// <reference path = "../fw.ts" />
/// <reference path = "../core/HashObject.ts" /> 
namespace fw {
    export class TextureResource extends HashObject {

        private source: PIXI.loaders.Resource;
        private spritesheet: PIXI.Spritesheet;
        private textures: PIXI.loaders.TextureDictionary;
    
        public constructor(source: PIXI.loaders.Resource | PIXI.Spritesheet) {
            super();
            
            if (source instanceof PIXI.loaders.Resource) {
                this.source = source;
                this.spritesheet = source.spritesheet;
                this.textures = source.textures as PIXI.loaders.TextureDictionary;
            }
            else {
                this.spritesheet = source
                this.textures = source.textures;
            }
        }
        
        /**
         * 获取贴图
         * @param name 贴图名称
         * @returns PIXI.Texture
         */
        public getTexture(name: string): PIXI.Texture | undefined{
            return this.textures[name] as PIXI.Texture;
        }
        
        /**
         * 创建 Sprite
         * @param name 贴图名称
         * @param xpos 坐标X
         * @param ypos 坐标Y
         * @param interactive 是否开启交互
         * @returns PIXI.Sprite
         */
        public createSprite(name?: string, xpos: number= 0, ypos: number= 0, interactive: boolean = false): PIXI.Sprite {
            const sprite = new PIXI.Sprite(name ? this.textures[name] : undefined);
            HashObject.InjectHashCode(sprite);
            sprite.interactive = interactive;
            sprite.x = xpos;
            sprite.y = ypos;
            return sprite;
        }
        
        /**
         * 创建 Button
         * @param name 贴图名称
         * @param xpos 坐标X
         * @param ypos 坐标Y
         * @param clickHandler click 或 tap 事件回调
         * @param thisObj 回调 this
         * @param args 回调参数
         */
        public createButton(name: string, xpos: number= 0, ypos: number= 0, clickHandler?:Function, thisObj?:any, args?:any): GButton {
            const button = new GButton(this.textures[name]);
            button.x = xpos;
            button.y = ypos;
            button.on("tap", onTouch);
            button.on("click", onTouch);
            
            function onTouch(evt: PIXI.interaction.InteractionEvent):void {
                if (clickHandler)
                {
                    if (args)
                        clickHandler.call(thisObj, args);
                    else
                        clickHandler.call(thisObj);
                }
            }
            return button;
        }
    
        public createProgressBar(namePrefix: string, xpos: number, ypos: number, width?: number, height?: number): GProgressBar;
        public createProgressBar(name: {bg: string, fg: string}, xpos: number, ypos: number, width?: number, height?: number): GProgressBar;
        /**
         * 创建进度条
         * @param name 贴图名称前缀或指定前景背景
         * @param xpos 坐标X
         * @param ypos 坐标Y
         * @param width 宽
         * @param height 高
         */
        public createProgressBar(name: {bg: string, fg: string} | string, xpos: number = 0, ypos: number = 0, width?: number, height?: number): GProgressBar
        {
            const nameParams = (typeof name == "string") ? {bg: `${name}_bg.png`, fg: `${name}_fg.png`} : name;
            const progressBar = new GProgressBar(this.textures[nameParams.bg], this.textures[nameParams.fg], width, height);
            progressBar.x = xpos;
            progressBar.y = ypos;
            return progressBar;
        }
    
        /**
         * 创建文本框
         * @param text 文本内容
         * @param xpos 坐标X
         * @param ypos 坐标Y
         * @param size 字号
         * @param color 颜色
         * @param align 对齐方式
         */
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
                fill: color,
                align: align
            });
            HashObject.InjectHashCode(label);
            label.anchor.x = align == "left" ? 0 : (align == "center" ? 0.5 : 1);
            label.anchor.y = 0.5;
            label.x = xpos;
            label.y = ypos;
            return label;
        }

        /**
         * 创建序列帧动画
         * @param animationName 序列帧名称前缀
         * @param xpos 坐标X
         * @param ypos 坐标Y
         * @param loop 是否循环
         * @param onComplete click 或 tap 事件回调
         * @param thisObj 回调 this
         * @param args 回调参数
         */
        public createAnimatedSprite(animationName: string, xpos: number = 0, ypos: number = 0, loop: boolean = false, onCompleteHandler?:Function, thisObj?:any, args?:any): PIXI.extras.AnimatedSprite {
            const mc = new PIXI.extras.AnimatedSprite(this.spritesheet.animations[animationName]);
            HashObject.InjectHashCode(mc);
            mc.x = xpos;
            mc.y = ypos;
            mc.animationSpeed = 0.2;
            mc.loop = loop;
            mc.onComplete = () => {
                mc.gotoAndStop(0);
                if (onCompleteHandler)
                {
                    if (args)
                        onCompleteHandler.call(thisObj, args);
                    else
                        onCompleteHandler.call(thisObj);
                }
            }
            return mc;
        }
    
        public destroy(): void
        {
            this.source && this.source.spritesheet && this.source.spritesheet.destroy(true);
            for (let key in this.textures) {
                PIXI.Texture.removeFromCache(this.textures[key]);
            }
            this.textures = null;
        }
    }
}

