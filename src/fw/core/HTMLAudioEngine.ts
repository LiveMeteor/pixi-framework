/// <reference path = "../fw.ts" /> 
namespace fw {

    /**
     * 声音管理器，Music Sound 两音轨设计，使用 <audio></audio> 标签的方式
     * 声音不预加载，随用随加载
     */
    export class HTMLAudioEngine extends HashObject implements SoundEngine {

        private soundMap: HashMap<SoundProps>;
        private channels: HTMLAudioElement[];
        private soundVol: number = 1;
        private musicVol: number = 1;

        public constructor() {
            super();
            this.soundMap = new HashMap();
            this.channels = [];
        }

        private createAudio(src: string): HTMLAudioElement {
            const audio = new Audio();
            audio.src = src;
            document.body.appendChild(audio);
            this.channels.push(audio);
            return audio;
        }

        public addSound(name:string, url:string, isMusic:boolean = false): SoundProps {
            const content = this.createAudio(url);
            const sound: SoundProps = {name, url, isMusic, content};
            this.soundMap.put(name, sound);
            return sound;
        }

        public async playSound(name:string, url:string = "", loop: boolean = false, isMusic:boolean = false, compatibility: boolean = true): Promise<void>
        {
            // if (compatibility && Config.quality <= 1)
            //     return;
            let sound = this.soundMap.getValue(name);
            if (!sound) {
                sound = this.addSound(name, url, isMusic);
            }
            sound.isMusic = isMusic;
            sound.content.loop = loop || isMusic;
            sound.content.volume = isMusic ? this.musicVol : this.soundVol;
            sound.content.pause();
            this.tryToPlay(sound.content);
        }

        private async tryToPlay(audio: HTMLAudioElement): Promise<void>
        {
            await audio.play().then(resolve => {
                return;
            }, reason => {
                if (reason.code != 0)
                    return;
                Log.log("Can not autoplay try again 3sec later. https://goo.gl/xX8pDD");
                const self = this;
                setTimeout(() => {
                    self.tryToPlay(audio);
                }, 3000);
            });
        }

        public setSoundVolume(value: number): void {
            this.soundVol = value;
        }

        public getSoundVolume(): number {
            return this.soundVol;
        }

        public setMusicVolume(value: number): void {
            this.musicVol = value;
        }

        public getMusicVolume(): number {
            return this.musicVol;
        }

        public stopSound(name: string): void {
            let sound = this.soundMap.getValue(name);
            if (!sound)
                return;
            
            (sound.content as HTMLAudioElement).pause();
        }

        public removeSound(name: string): void {
            let sound = this.soundMap.getValue(name);
            if (!sound)
                return;

            (sound.content as HTMLAudioElement).pause();
            
            this.stopSound(name);
            this.soundMap.remove(name);
        }

        public removeAllSound(): void {
            for (const audio of this.channels) {
                audio.src = "";
                audio.pause();
                audio.parentNode && document.body.removeChild(audio);
            }
            this.channels = [];
            this.soundMap.clear();
        }

        public destroy(): void
        {
            this.removeAllSound();
        }
    }
}


