/// <reference path = "../fw.ts" /> 

namespace fw {
/** 对客户端 clientMediaCallBack 的接口格式 */
interface ISoundJson {
    /** 媒体名称 */
    name: string,
    /** 媒体类型 */
    type: "audio" | "video",
    /** 路径 */
    path: string,
    /** 显示框(如果是视频) */
    position?: PIXI.Rectangle,
    /** 执行命令 */
    event: "stop" | "play" | "pause",
    /** 设置进度 */
    progress: number,
    /** 是否循环 (默认 false)*/
    loop: boolean,
    /** 音量(默认 1) */
    volume: number,
    /** 声音场景 */
    scene:number,
    /** 标记播放的那个音频 */
    soundId:number,
}
    /**
     * 声音引擎，使用 原生播放 的方式
     */
    export class NativeAudioIFrameEngine extends HashObject implements SoundEngine {

        private soundMap: HashMap<ISoundJson>;
        private preLoopName: string = "";
        public constructor() {
            super();
            this.soundMap = new HashMap();
        }

        public addSound(name:string, url:string, isMusic:boolean = false): ISoundJson
        {
            url = relativePath2fullPath(url);
            let volume = 1;
            const props: ISoundJson = {
                name: name,
                type: "audio",
                path: url,
                event: "play",
                progress: 0,
                loop: false,
                volume: volume,
                scene: 10000,
                soundId: 1
            };
            this.soundMap.put(props.name, props);
            return props;
        }

        public playSound(name:string, url:string = "", loop: boolean = false, isMusic:boolean = false): ISoundJson
        {
            let props = this.soundMap.getValue(name);
            if (!props)
            {
                props = this.addSound(name, url, isMusic);
            }

            if (props.loop && this.preLoopName == props.name)
            {
                props.event = "stop";
                // window.callClient("PlayNativeAudio", JSON.stringify(props));
                fw.GResponser.postMessage("PlayNativeAudio", JSON.stringify(props));
            }
            props.loop = loop;
            props.soundId = HashObject.GenerateHashCode() % 10000;
            props.event = "play";
            
            Log.log(`call PlayNativeAudio json=${JSON.stringify(props)}`);
            // window.callClient("PlayNativeAudio", JSON.stringify(props));
            fw.GResponser.postMessage("PlayNativeAudio", JSON.stringify(props));
            props.loop && (this.preLoopName = props.name);
            return props;
        }

        public setSoundVolume(value: number): void {
            const props = this.soundMap.getValue(name);
            if (props)
            {
                props.volume = value;
            }
            //TODO
        }

        public getSoundVolume(): number
        {
            const props = this.soundMap.getValue(name);
            return props ? props.volume : 0;
        }

        public setMusicVolume(value: number): void {
            const props = this.soundMap.getValue(name);
            if (props)
            {
                props.volume = value;
            }
            //TODO
        }

        public getMusicVolume(): number
        {
            const props = this.soundMap.getValue(name);
            return props ? props.volume : 0;
        }

        public stopSound(name: string): void {
            const props = this.soundMap.getValue(name);
            if (props)
            {
                props.event = "stop";
            }
            Log.log(`call PlayNativeAudio json=${JSON.stringify(props)}`);
            // window.callClient("PlayNativeAudio", JSON.stringify(props));
            fw.GResponser.postMessage("PlayNativeAudio", JSON.stringify(props));
        }

        public removeSound(name: string): void {
            //
        }

        public removeAllSound(): void {
            this.soundMap.clear();
        }

        public destroy(): void
        {
            this.removeAllSound();
        }

       
    }
}


