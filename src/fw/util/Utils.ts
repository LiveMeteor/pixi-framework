/// <reference path = "../fw.ts" /> 
namespace fw {
    
    const _startTime = Date.now();

    /** 获取游戏客户端的运行时间 */
    export function getTimer(): number {
        return Date.now() - _startTime;
    }

    /** 浅克隆一个 Object */
    export function cloneObject(source: any): any
    {
        let newObj: any = {};
        for (let i in source)
        {
            newObj[i] = source[i];
        }
        return newObj;
    }

    /** 剪出路径中的文件名 */
    export function cutFilename(path: string): string {
        const splitPath = path.split("/");
        return splitPath[splitPath.length - 1];
    }

    /** 获取设备类型 */
    export function getDeviceType(): DeviceType {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf("iPad") > -1)
            return DeviceType.iPad;
        else if (userAgent.indexOf("iPhone") > -1)
            return DeviceType.iPhone;
        else if (userAgent.indexOf("Macintosh") > -1) {
            if ("ontouchend" in document)
                return DeviceType.iPad;
            else
                return DeviceType.Mac;
        }
        else(userAgent.indexOf("Windows") > -1)
            return DeviceType.Windows;
    }

    /** 获取设备版本号 */
    export function getDeviceVer(): number[] {
        const userAgent = navigator.userAgent.toLowerCase();
        
        let osversion;
        if (userAgent.indexOf("macintosh") > -1) {
            osversion = userAgent.match(/mac os x (.*?)\)/);
        }
        else if (userAgent.indexOf("ipad") > -1) {
            osversion = userAgent.match(/cpu os (.*?) like mac os/);
        }

        if (!osversion)
            return [10];
        
        const rtn: number[] = [];
        osversion = (<string>osversion[1]).split("_");
        for (let i = 0; i < osversion.length; i++) {
            rtn.push(parseInt(osversion[i]));
        }
        return rtn;
    }

    let tempArea: HTMLAreaElement;

    /** 相对路径转绝对路径 */
    export function relativePath2fullPath(url: string): string {
        !tempArea && (tempArea = document.createElement('A') as HTMLAreaElement);
        tempArea.href = url;
        url = tempArea.href;
        var prefix = "";
        const head = ["file://", "http://", "https://"]
        for (var i in head)
        {
            if (url.indexOf(head[i]) != -1)
            {
                url = url.replace(head[i], "");
                prefix = head[i];
                break;
            }
        }
        url = url.replace("//", "/");
        url = url.replace("/courses/", "/");
        if (prefix)
            url = prefix + url;
        return url;
    }

    /** 检测 WebGL 渲染硬件(可以判断设备类型)) */
    export function checkGLRenderer(): string {
        let canvas: HTMLCanvasElement;
        if (Config.currentDirector) {
            canvas = Config.currentDirector.app.view;
        }
        else {
            canvas = document.createElement("CANVAS") as HTMLCanvasElement;
        }

        const gl = canvas.getContext("experimental-webgl");
        const debugInfo = (<any>gl).getExtension("WEBGL_debug_renderer_info");
        if (!debugInfo || !debugInfo["UNMASKED_RENDERER_WEBGL"])
            return "";
        const glRenderer = (<any>gl).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (!glRenderer)
            return "";
        return glRenderer;
    }



}
