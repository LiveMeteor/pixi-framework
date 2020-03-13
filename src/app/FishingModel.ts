namespace app {
    /** 关卡数据结构 */
    export interface IStageData {
        id: number;
        audioUrl: string;
        imageUrl: string;
        list: IWordData[];
    }

    /** 单词数据 */
    export interface IWordData {
        imageUrl: string;
        audioUrl: string;
        trueOpt: boolean;
    }

    /** 信息同步接口 */
    export interface IStageGameSync {
        type: string;
        /** 0未开始 1开始 2结束 */
        status : 0 | 1 | 2;
        currTime: number;
        startTime: number;
        [userId: string]: any;
    }

    /** 游戏用户行为通知(钓到鱼) */
    export interface IStageGameNotice {
        type: string;
        noticeId: number;
        step: number;
        textContent: string;
        userId: string;
        userName: string;
        currTime: number;
    }

    /** 开始结束开关 */
    export interface IStageGameSwitch {
        type: string;
        status: 1 | 2;
        currTime?: number;
    }

    export enum RoleType {
        /** 历史课件 */
        REVIEW = 0,
        /** 学生模式 */
        STUDENT = 1,
        /** 老师模式 */
        TEACHER = 2,
        /** 监课 */
        OBSERVER = 3,
        /** 录课 */
        RECORDER = 4,
        /** 老师预习 */
        PREVIEW = 5,
        /** 后台管理 */
        ADMIN = 6
    }
}

namespace app.FishingModel {

    /** 历史课件 0，学生模式 1，老师模式 2, 监课 3, 录课 4，老师预习 5，后台管理 6*/
    export let mode: RoleType = 0;
    /** 学生用户信息 */
    export let studentsInfo: {uid: string, name: string, index: number}[];
    /** 缓存同步信息 */
    export let cacheSyncInfo: IStageGameSync;
    /** 用户自己的 UID */
    export let myUid: string = "";
    /** 用户自己的名字 */
    export let myName: string = "";
    /** 安静开关，关闭面板接连跳转 */
    export let quiet: boolean = false;
    /** 每条鱼间隔(毫秒) */
    export let fishGapTime: number = 1500;
    /** 每关时间(毫秒) */
    export let stageTime: number = 15000;
    /** 入场潜水艇时间(毫秒) */
    export let introTime: number = 0;
    /** 每关钓到鱼的条数 */
    export let gotFishCount: number = 0;

    /** 成绩 Bars */
    export let scoreBars: FishingScoreBars | undefined;
    /** 开始运行游戏的计时器，不包含 intro 的6秒，游戏开始时从0开始 */
    export let startRunningTime: number;
    /** 客户端与服务器的时间差 */
    export let clientTimeDist: number;
    /** 随机种子 */
    export let randomSeed: number = 12;
    /** 课件配置 */
    export let gameConfig: any[];
    /** 鱼对象池 */
    export let fishingInsDeadPool: FishingIns[] = [];
    export let fishingInsActivatePool: FishingIns[] = [];

    /** 声音列表 */
    export let mapAudios: {name: string, url: string}[] = [
        {name: "fishing_bg_music", url:"sounds/fishing_bg_music.mp3"},
        {name: "fishing_excellent", url:"sounds/fishing_excellent.mp3"},
        {name: "fishing_gold_sound", url:"sounds/fishing_gold_sound.mp3"},
        {name: "fishing_good_job", url:"sounds/fishing_good_job.mp3"},
        {name: "fishing_nice_try", url:"sounds/fishing_nice_try.mp3"},
        {name: "fishing_right", url:"sounds/fishing_right.mp3"},
        {name: "fishing_succeed", url:"sounds/fishing_succeed.mp3"},
        {name: "fishing_touch", url:"sounds/fishing_touch.mp3"},
        {name: "fishing_wrong", url:"sounds/fishing_wrong.mp3"},
    ];

    /**
     * 获取阶段
     * 0 异常或没开始
     * 11 12 13 第一关
     * ?1 示例阶段
     * ?2 冒泡泡阶段
     * ?3 地图阶段
     * 50 4关都通过
     */
    export function getPhases(): number {
        const runningTime = Date.now() - FishingModel.cacheSyncInfo.startTime - FishingModel.introTime;
        if (runningTime < 0)
            return 0
        const stageId = Math.ceil(runningTime / stageTime);
        if (stageId >= 5)
            return 50;
        let sep;
        if (runningTime % stageTime <= 100) //每关 intro
            sep = 0;
        else if (runningTime % stageTime <= 12000)
            sep = 1;
        else
            sep = 2;
        return stageId * 10 + sep;
    }

    /** 获取原始关卡数据 */
    export function getOriginStageData(value: number): any {
        if (!gameConfig || gameConfig.length == 0)
            return null;
        for (let data of gameConfig) {
            if (data.id == value) {
                return data;
            }
        }
        return null;
    }

    /** 生成正确的关卡数据 */
    export function generateTrueData(originStage: any): IWordData {
        return {
            imageUrl: originStage.beforeImageUrl,
            audioUrl: originStage.audioUrl,
            trueOpt: true
        }
    }

    /** 生成错误的关卡数据 */
    export function generateFalseData(originStage: any): IWordData {
        return {
            imageUrl: originStage.errorsUrl[Math.floor(originStage.errorsUrl.length * Math.random())],
            audioUrl: originStage.audioUrl,
            trueOpt: false
        }
    }

    /** 生成关卡数据 */
    export function generateStageData(value: number): IStageData | null {
        const originData = getOriginStageData(value);
        if (!originData)
            return null;
        const list: IWordData[] = [];
        for (let i = 0; i < 6; i++) {
            list.push(generateTrueData(originData));
        }
        let insertIndex = 0;
        for (let i = 0; i < 4; i++) {
            insertIndex += fw.MathUtils.seedRandom(value * 13) * list.length;
            list.splice(Math.round(insertIndex) % list.length, 0, generateFalseData(originData));
        }
        return {
            id: originData.id,
            audioUrl: originData.audioUrl,
            imageUrl: originData.rightUrl,
            list: list
        }
    }

    /** 数据汇报 */
    export function sensorsReport(type: string, data: any): void {
        if (FishingModel.mode != RoleType.STUDENT && FishingModel.mode != RoleType.TEACHER)
            return;
        const body = { event_name: type, data: data };
        body.data.game_id = app.GameAPI.gameId;
        body.data.game_model_id = app.GameAPI.gameModelId;
        body.data.game_name = app.GameAPI.gameName;
        fw.GResponser.postMessage("sensors", body);
    }

    /** 海草摇摆 */
    export function addSwing(target: PIXI.Sprite, time: number): void {
        if (fw.Config.quality <= 1)
            return;
        fw.Tween.removeTweens(target);
        fw.Tween.removeTweens(target.scale);
        target.rotation = -1 / 20 * Math.PI;
        target.scale.x = 1.0;
        fw.Tween.get(target).to({ rotation: 1 / 20 * Math.PI}, time)
            .to({ rotation: -1 / 20 * Math.PI}, time);
        fw.Tween.get(target.scale).to( { x: 0.8 }, time)
            .to( { x: 1.0 }, time)
            .call(addSwing, null, [target, time]);
    }

    /** 清除摇摆 */
    export function clearSwing(target: PIXI.Sprite): void {
        fw.Tween.removeTweens(target);
        fw.Tween.removeTweens(target.scale);
        target.scale.x = 1;
        target.rotation = 0;
    }

    /** 鱼的路径 */
    export let fishPaths = [
        {x: [0, 126, 300, 774, 1104, 1308, 1440], y: [426, 377, 390, 531, 409, 390, 424]},
        {x: [0, 237, 521, 1156, 1439], y: [342, 421, 448, 597, 340]},
        {x: [0, 59, 284, 502, 816, 1002, 1255, 1440], y: [343, 509, 566, 458, 439, 525, 610, 366]},
    ];
}