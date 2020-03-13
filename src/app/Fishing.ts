namespace app {
    /** 游戏启动器(导演) */
    export class Fishing extends fw.GameDirector {

        private pastTime?: number;
        private reportStamp: number;
        private reportCounter: number;

        public constructor(stageWidth: number, stageHeight: number, containerId?: string, data?: any) {
            let fps = 24;
            fw.Config.quality = data.level;
            switch (data.forceSoundEngine) {
                case 1:
                    fw.SoundManager.engine = new fw.HTMLAudioEngine();
                    break;
                case 2:
                    fw.SoundManager.engine = new fw.WebAudioEngine();
                    break;
                case 3:
                    fw.SoundManager.engine = new fw.NativeAudioEngine();
                    break;
            }
            if (data.level <= 0) {
                // 品质方案改动
                data.level = 1;
                fps = 6;
            }
            FishingModel.quiet = false;
            super(stageWidth, stageHeight, false, containerId, data.level, fps);
            this.reportCounter = 0;
            this.reportStamp = fw.getTimer();
            FishingModel.sensorsReport("game_init", {});
            fw.GResponser.initialize();
            fw.GResponser.addListener("gamerunning", this.onCheckGameRunning, this);
            fw.GResponser.addListener("destroy", this.destroy, this);
            this.updateUserInfo();
        }

        private onCheckGameRunning(data: any): void {
            let status = FishingModel.cacheSyncInfo ? FishingModel.cacheSyncInfo.status : 1;
            // 历史课件和老师预习永远是0，游戏未开启的状态
            if (FishingModel.mode == RoleType.REVIEW || FishingModel.mode == RoleType.PREVIEW)
                status = 0;
            fw.GResponser.postMessage("gamerunning", { status });
        }

        /** 更新用户信息 */
        private async updateUserInfo(): Promise<void> {
            const role = await fw.GResponser.asyncPostMessage("role", {}, "role");
            switch (role) {
                case "student":
                    FishingModel.mode = RoleType.STUDENT;
                    break;
                case "teacher":
                    FishingModel.mode = RoleType.TEACHER;
                    break;
                case "observer":
                    FishingModel.mode = RoleType.OBSERVER;
                    break;
                case "record":
                    FishingModel.mode = RoleType.RECORDER;
                    break;
                case "preview":
                    FishingModel.mode = RoleType.PREVIEW;
                    break;
                case "admin":
                    FishingModel.mode = RoleType.ADMIN;
                    break;
                default:
                    FishingModel.mode = RoleType.REVIEW;
                    break;
            }
            fw.Log.log(`Game Mode: ${FishingModel.mode}`);

            if ((FishingModel.mode == RoleType.REVIEW || FishingModel.mode == RoleType.PREVIEW) && fw.getDeviceType() == fw.DeviceType.iPad && !fw.SoundManager.engine) {
                //iPad 历史课件和老师预习的情况下，且 ios9 以上启动 WebAudio 声音引擎 ios9 以下启动 HTMLAudio
                if (fw.getDeviceVer()[0] >= 9) {
                    fw.SoundManager.engine = new fw.WebAudioEngine();
                }
                else {
                    fw.SoundManager.engine = new fw.HTMLAudioEngine();
                }
            }

            let studentsInfo = await fw.GResponser.asyncPostMessage("studentsinfo", {}, "studentsinfo");
            FishingModel.studentsInfo = [];

            for (let info of studentsInfo) {
                if (info.index == -1)
                    continue;

                FishingModel.studentsInfo.push({
                    uid: <string>info.studentId || "",
                    name: <string>info.studentName || "",
                    index: <number>info.index || 0
                });
            }
            FishingModel.studentsInfo.sort((a, b) => {
                if (a.index < b.index)
                    return -1;
                else if (a.index > b.index)
                    return 1;
                else
                    return 0;
            });

            if (FishingModel.mode == RoleType.STUDENT) {
                const myinfo = await fw.GResponser.asyncPostMessage("myinfo", {}, "myinfo");
                FishingModel.myUid = <string>myinfo.uid;
                FishingModel.myName = <string>myinfo.name;
            }

            this.updateGameInfo();
        }

        /** 更新游戏信息 */
        private async updateGameInfo(): Promise<void> {
            const pageDetail = await fw.GResponser.asyncPostMessage("init", {}, "pageDetail");
            pageDetail.gameId && (GameAPI.gameId = pageDetail.gameId);
            pageDetail.gameMode && (GameAPI.gameModelId = pageDetail.gameMode);

            if (FishingModel.mode == RoleType.STUDENT || FishingModel.mode == RoleType.TEACHER || FishingModel.mode == RoleType.OBSERVER) {
                const syncInfo: IStageGameSync = await fw.GResponser.asyncPostMessage("stageGameSync", { type: GameAPI.gameName }, "stageGameSync");
                if (syncInfo.type != GameAPI.gameName) {
                    fw.Log.warn("receive wrong game type message!!!");
                    return;
                }
                fw.GResponser.postMessage("studentmute", syncInfo.status == 1);
                FishingModel.cacheSyncInfo = syncInfo;
                FishingModel.clientTimeDist = Date.now() - syncInfo.currTime;

                if (syncInfo.status == 1) {
                    if (syncInfo.currentTime - syncInfo.startTime > FishingModel.stageTime * 4) {
                        syncInfo.status = 2;
                    }
                    else {
                        this.pastTime = (syncInfo.currentTime - syncInfo.startTime) / 1000;
                    }
                }
                FishingModel.scoreBars && FishingModel.scoreBars.updateScores();
            }
            this.setData(pageDetail);
        }

        /** 起动游戏 */
        public async setData(value: any): Promise<void> {
            FishingModel.randomSeed = value.randomId % 100;
            FishingModel.gameConfig = value.list;

            for (let url of FishingModel.mapAudios) {
                await fw.SoundManager.addSound(url.name, url.url, url.url.indexOf("music") > -1)
            }

            const resources = [
                "img/fishing.json",
                "img/fishing_bg.png",
                "img/fishing_foreground.png",
                "img/fishing_wave.png",
                "img/fishing_spindrift1.png",
                "img/fishing_spindrift2.png",
                "img/fishing_spindrift3.png"
            ];
            if (fw.getDeviceType() == fw.DeviceType.iPad) {
                resources.push("img/bbubbles_submarine_ipad.png");
            }
            else {
                resources.push("img/bbubbles_submarine.png");
            }
            fw.SceneManager.setCurrentScene(FishingScene, value, fw.ResizeAlign.SCALE_FILL, resources, false);
            this.resize(this.stageWidth, this.stageHeight);

            if (this.pastTime) {
                (fw.SceneManager.current() as FishingScene).setCurrTime(this.pastTime);
                FishingModel.sensorsReport("game_start", {
                    start_type: "ingame",
                    start_time: (FishingModel.cacheSyncInfo ? FishingModel.cacheSyncInfo.currTime : Date.now()) - FishingModel.clientTimeDist
                });
                this.pastTime = null;
            }

            fw.GResponser.addListener("stageGameSwitch", this.onGameSwitch, this);
        }

        private onGameSwitch(data: IStageGameSwitch): void {
            if (FishingModel.mode == RoleType.RECORDER) {
                // 录课虚拟数据
                FishingModel.cacheSyncInfo = {
                    type: GameAPI.gameName,
                    status: 0,
                    currTime: Date.now()
                } as IStageGameSync;
                data.currTime = Date.now();
            }
            if (data.type != GameAPI.gameName || !FishingModel.cacheSyncInfo)
                return;
            FishingModel.cacheSyncInfo.status = data.status;
            fw.GResponser.postMessage("studentmute", data.status == 1);
            fw.GResponser.postMessage("hideGuideLoad", { status: 1 });
            if (data.status == 1) {
                //start game
                FishingModel.cacheSyncInfo.startTime = data.currTime;
                fw.Log.log(`game start time: ${new Date(FishingModel.cacheSyncInfo.startTime).toString()}`);
                fw.PanelManager.isOpen(FishingEnding) &&
                    fw.PanelManager.hidePanel(FishingEnding);
                (<any>window).hideEffectTrophy();

                const panelEntrance = fw.PanelManager.getPanel(FishingEntrance);
                if (panelEntrance.isOpen) {
                    panelEntrance.hide();
                }
                else {
                    const scene = fw.SceneManager.current() as FishingScene;
                    scene.isOpen && scene.onOpenIntro();
                }
                FishingModel.sensorsReport("game_start", {
                    start_type: "normal",
                    start_time: FishingModel.cacheSyncInfo.startTime - FishingModel.clientTimeDist
                });
            }
            else {
                //end game
                FishingModel.cacheSyncInfo.startTime = null;

                FishingModel.quiet = true;
                fw.PanelManager.hideAllPanel();
                FishingModel.quiet = false;
                const scene = fw.SceneManager.current() as FishingScene;
                scene.isOpen && scene.onOpenEnding();
            }
        }

        public setCurrTime(time: number): void {
            FishingModel.cacheSyncInfo = { startTime: Date.now() - time * 1000 } as IStageGameSync;
            const currScnee = fw.SceneManager.current();
            if (currScnee && currScnee instanceof FishingScene) {
                currScnee.setCurrTime(time);
            }
            else {
                this.pastTime = time;
            }
        }

        public render(): void {
            super.render();
            this.reportCounter++;
            const now = fw.getTimer();
            if (now - this.reportStamp > 3000) {
                FishingModel.sensorsReport("game_fps", {fps: (this.reportCounter / 3).toFixed(2)})
                this.reportStamp = now;
                this.reportCounter = 0;
            }
        }

        public destroy(): void {
            FishingModel.quiet = false;
            fw.SoundManager.stopSound("fishing_bg_music");
            fw.GResponser.destroy();
            FishingModel.gameConfig = null;
            super.destroy();
        }
    }
}


