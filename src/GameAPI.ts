/// <reference path = "fw/core/GameDirector.ts" /> 
/// <reference path = "fw/core/BaseScene.ts" /> 
/// <reference path = "fw/core/BasePanel.ts" /> 
namespace app {

    class GameAPIInstance implements fw.IGameAPI {

        /** 游戏动态 Id */
        public gameId = 112;
        /** 游戏动态 ModelId */
        public gameModelId = 9;
        /** 游戏名称 */
        public gameName: string = "fishing";

        /** 游戏版本号 */
        public version: string = "1.0.0";

        /** 游戏主动请求外部数据接口(游戏加载完成之后需要立刻赋值) */
        public router: fw.ICoursewareData;

        private director?: Fishing;

        public constructor() {
            fw.Config = app.Config;
            window.gameId = this.gameId;
            window.gameModelId = this.gameModelId;
            window.gameName = this.gameName;
        }

        /** 初始化关卡数据 */
        public init(stageWidth: number = 1440, stageHeight: number = 810, containerId?: string, data?: any): boolean {
            if (this.director) {
                return false;
            }
            else {
                this.director = new Fishing(stageWidth, stageHeight, containerId, data);
                return true;
            }
        }

        public setData(data: any): void {
            this.director.setData(data);
        }

        /** 设置当前游戏时间(秒) */
        public setCurrTime(time: number): void {
            this.director && this.director.setCurrTime(time);
        }

        public setDebug(value: boolean): void {
            fw.Config.isDebug = value;
        }

        public resize(stageWidth: number, stageHeight: number): boolean {
            this.director && this.director.resize(stageWidth, stageHeight);
            return this.director ? true : false;
        }

        public command(type: string, jsonData: any, callback?: (result: any) => void): void {}

        public destroy(force?: boolean): boolean {
            if (this.director) {
                this.director.destroy();
                this.director = undefined;
                return true;
            }
            else {
                return false;
            }
        }
    }

    export let GameAPI = new GameAPIInstance();
}
