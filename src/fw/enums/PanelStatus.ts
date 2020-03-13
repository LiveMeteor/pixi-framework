/// <reference path = "../fw.ts" /> 
namespace fw {
    /** 0未初始化 1初始化中 2已就绪 3已打开 4异常 */
    export enum PanelStatus {
        /** 未初始化 */
        START = 0,
        /** 初始化中 */
        INITIALIZATION = 1,
        /** 已就绪 (未打开过) */
        READY = 2,
        /** 已打开 */
        OPEN = 3,
        /** 已就绪 (已打开过)*/
        CLOSE = 4,
        /** 异常 */
        ERROR = 5,
    }
}


