/// <reference path = "../fw.ts" /> 
namespace fw {
    export module Log {

        let win:any = window;
    
        /** Normal Log */
        export function log(...params: any[]) {
            if (Config.isDebug) {
                if (win.logView)
                    win.logView.log(formatMessage("[GameLayer]", params));
                else
                    console.log(formatMessage("[GameLayer]", params));
                win.logOnClient && win.logOnClient("[GameLayer]L", params.join(","));
            }
        }
    
        /** Error Log */
        export function error(...params: any[]) {
            if (Config.isDebug) {
                if (win.logView)
                    win.logView.error(formatMessage("[GameLayer]", params));
                else
                    console.error(formatMessage("[GameLayer]", params));
                win.logOnClient && win.logOnClient("[GameLayer]E", params.join(","));
            }
        }

        /** Warning Log */
        export function warn(...params: any[]) {
            if (Config.isDebug) {
                if (win.logView)
                    win.logView.warn(formatMessage("[GameLayer]", params));
                else
                    console.warn(formatMessage("[GameLayer]", params));
                win.logOnClient && win.logOnClient("[GameLayer]W", params.join(","));
            }
        }
    
        function formatMessage(sender: any, messages?: any[]): string {
            let rtn: string = "";
            if (sender == null)
                rtn += "null ";
            else if (sender == undefined)
                rtn += "undefined ";
            else if (typeof sender == "string")
                rtn += (sender + " ");
            else if (typeof sender == "object" && sender["__class__"])
                rtn += ("[" + sender['__class__'] + "] ");
            else if (sender["toString"])
                rtn += (sender.toString() + " ");
            else
                rtn += (<string>sender + " ");
    
            if (messages && messages.length)
            {
                rtn += messages.join(",");
            }
            return rtn;
        }
    }
}


