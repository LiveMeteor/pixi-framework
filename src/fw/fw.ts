
namespace fw {
    export let Config:{
        /** DEBUG 模式 */
        isDebug: boolean,
        /** 游戏版本号 */
        version: string,
        /** 舞台尺寸 */
        stageWidth: number,
        stageHeight: number,
        /** UI 图集存放位置 */
        pathTexturesResource: string,
        /** JS图集模式 */
        jsTexturesMode: boolean,
        /** 显示品质等级 */
        quality: number,
        /** 当前导演 */
        currentDirector?: GameDirector
    };

    /** 点结构体 */
    export interface Point {
        x: number;
        y: number;
    }

    /** 矩形结构体 */
    export interface Rect {
        x: number;
        y: number;
        w: number;
        h: number;
    }
}

declare interface Window {
    /** 性能监视器 */
    Stats: any;
    /** 游戏动态 Id */
    gameId: number;
    /** 游戏动态 ModelId */
    gameModelId: number;
    /** 游戏名称 */
    gameName: string;
    /** 调 client 方法（只在 Div 模式有效） */
    callClient(type: string, data: string): void;
}