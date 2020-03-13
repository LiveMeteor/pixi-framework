/// <reference path = "../fw.ts" /> 
namespace fw {

    /** 消息总线 */
    class GResponserIns extends PIXI.utils.EventEmitter {

        public constructor() {
            super();
        }

        public initialize(): void {
            document.addEventListener("visibilitychange", GResponserIns.onVisibleChange, false);
            window.addEventListener("message", GResponserIns.onReceiveMessage, false);
        }

        /** 向外层 post 数据 */
        public postMessage(type: string, data: any = {}): void {
            Log.log(`[SEND] type: ${type} data: ${JSON.stringify(data)}`);
            !Config.isDebug && window.parent.postMessage({type: "clientLog", data: `[SEND] type: ${type} data: ${JSON.stringify(data)}`}, "*");
            window.parent.postMessage({type, data}, "*");
        }

        /** 收外层 post 回来的数据 */
        public static onReceiveMessage(evt: MessageEvent): void {
            if (!evt.data || !evt.data.type || !evt.data.data)
                return;
            evt.data.from && (evt.data.data.userId = parseInt(evt.data.from));
            Log.log(`[RECEIVE] type: ${evt.data.type} data: ${JSON.stringify(evt.data.data)}`);
            !Config.isDebug && window.parent.postMessage({type: "clientLog", data: `[RECEIVE] type: ${evt.data.type} data: ${JSON.stringify(evt.data.data)}`}, "*");
            GResponser.emit(evt.data.type, evt.data.data);
        }

        private static hideTime: number;

        public static onVisibleChange(evt: Event): void {
            if (document.hidden) {
                GResponserIns.hideTime = getTimer();
            }
            else {
                if (!GResponserIns.hideTime || getTimer() - GResponserIns.hideTime < 2000)
                    return;
                Log.log("device resume");
                document.removeEventListener("visibilitychange", GResponserIns.onVisibleChange);
                Config.currentDirector && Config.currentDirector.destroy();
                window.location.reload();
            }
        }

        /** 同步等待获取 post 信息 */
        public async asyncPostMessage(sendType: string, sendData: any, recvType: string): Promise<any> {
            return new Promise<any>((resolve, reject) => {
                this.once(recvType, data => {
                    resolve(data);
                });
                this.postMessage(sendType, sendData);
            });
        }

        public destroy(): void {
            this.removeAllListeners();
            window.removeEventListener("message", GResponserIns.onReceiveMessage, false);
        }
    }

    export let GResponser = new GResponserIns();
}

