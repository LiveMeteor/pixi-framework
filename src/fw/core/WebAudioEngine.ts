/// <reference path = "../fw.ts" /> 
namespace fw {
    /**
     * 声音引擎，使用 pixi-sound 插件，WebAudio 方式
     * 声音不预加载，随用随加载
     */
    export class WebAudioEngine extends HashObject implements SoundEngine {

        private soundMap: HashMap<SoundProps>;

        public constructor() {
            super();
            this.soundMap = new HashMap();
        }

        public async addSound(name:string, url:string, isMusic:boolean = false): Promise<SoundProps>
        {
            return new Promise<SoundProps>((resolve, reject) => {
                ResourceManager.ins.loadByUrl(url, res => {
                    const sound: SoundProps = {name, url, content: res, isMusic};
                    this.soundMap.put(name, sound);
                    resolve(sound);
                }, this);
            });
        }

        public async playSound(name:string, url:string = "", loop: boolean = false, isMusic:boolean = false, compatibility: boolean = true): Promise<PIXI.sound.IMediaInstance>
        {
            let props = this.soundMap.getValue(name);
            if (!props) {
                props = await this.addSound(name, url, isMusic)
            }
            let sound = props.content as PIXI.sound.Sound;
            sound.loop = loop || props.isMusic;
            if(isMusic){
                sound.volume = 0.5;
            }
            return sound.play();
        }

        public setSoundVolume(value: number): void {
            PIXI.sound.volumeAll = value;
        }

        public getSoundVolume(): number
        {
            return PIXI.sound.volumeAll;
        }

        public setMusicVolume(value: number): void {
            PIXI.sound.volumeAll = value;
        }

        public getMusicVolume(): number
        {
            return PIXI.sound.volumeAll;
        }

        public stopSound(name: string): void {
            PIXI.sound.exists(name) && PIXI.sound.stop(name);
        }

        public removeSound(name: string): void {
            ResourceManager.ins.destroyResource(name);
            this.soundMap.remove(name);
        }

        public removeAllSound(): void {
            //由 ResourceManager 统一管理
            this.soundMap.clear();
        }

        public destroy(): void {
            this.soundMap.clear();
        }
    }
}
