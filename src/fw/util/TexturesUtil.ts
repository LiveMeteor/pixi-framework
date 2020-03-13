/// <reference path = "../fw.ts" /> 
namespace fw {
	export module TexturesUtil {

        /**
         * 通过 JS 文件生成图集
         * @param jsPath .js 文件路径
         * @param imgTexture 图集的图片文件
         * @param onComplete 生成结束回调
         * @param thisObj 回调this
         */
        export function parseSpritesheet(jsPath: string, imgTexture: PIXI.Texture, onComplete: (res: fw.TextureResource) => void, thisObj: any): void
        {
            (<any>require)([jsPath], function(jsonMap: any) {

                const spritesheet = new PIXI.Spritesheet(
                    imgTexture.baseTexture,
                    jsonMap,
                    jsPath
                );
                
                spritesheet.parse(() => {
                    const textureResource = new TextureResource(spritesheet);
                    onComplete.call(thisObj, textureResource);
                });

            });
        }

    }
}