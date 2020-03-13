/// <reference path = "fw.ts" /> 
namespace fw {

    export interface ICoursewareData {
        /** 是否是老师 */
        isTeacher(): boolean;
        /** 获取设备类型 */
        getClientUa(): string;
        /** 获取系统版本号 */
        getClientUaVer(): string;
        /** 获取 App 版本号 */
        getAppVer(): string;
        /** 学生静音开关 */
        setStudentMute(value: boolean): void;

        /** 请求客户端 */
        callClient(type: string, jsonData: any): void;
        /** 请求 Socket */
        sendMessage(type: string, jsonData: any): void;
    }

    export interface IGameAPI {

        /** 游戏动态 Id */
        gameId: number;
        /** 游戏动态 ModelId */
        gameModelId: number;
        /** 游戏名称 */
        gameName: string;

        /** 游戏版本号 */
        version: string;

        /** 游戏主动请求外部数据接口(游戏加载完成之后需要立刻赋值) */
        router: ICoursewareData;

        /**
         * 初始化游戏数据
         * @param stageWidth 舞台宽
         * @param stageHeight 舞台高
         * @param containerId Div容器ID
         * @param data 初始化需要的数据
         * @param forceCanvas 是否强制 Canvas 兼容模式
         * @returns 启动是否成功
         */
        init(stageWidth: number, stageHeight: number, containerId?: string, data?:any, forceCanvas?:boolean): boolean;

        /**
         * Debug 日志开关
         * @param value boolean
         */
        setDebug(value: boolean): void;

        /**
         * 实时改变舞台尺寸
         * @param stageWidth 舞台宽
         * @param stageHeight 舞台高
         * @returns 改变尺寸是否成功
         */
        resize(stageWidth: number, stageHeight: number): boolean;

        /**
         * 向互动游戏请求数据
         * @param type 命令ID
         * @param jsonData Json数据
         * @param callback 异步回调(如果需要)
         */
        command(type: string, jsonData: any, callback?: (result: any) => void): void;

        /**
         * 销毁游戏
         * @param force false 延迟300毫秒销毁，true 立即销毁
         * @returns 是否销毁成功
         */
        destroy(force?: boolean): boolean;
    }
}
