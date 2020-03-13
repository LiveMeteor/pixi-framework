/// <reference path = "../fw.ts" /> 
/// <reference path = "../core/HashObject.ts" /> 
namespace fw {
    export class TimerManager extends HashObject {
        private static clockMap: any = {};
        private static lastTime: number = 0;
        public static running: boolean;//是否正在运行
    
        /**
         * 添加时钟
         * @param clockID            时钟ID[int或字符串]
         * @param seconds          剩余秒数
         * @param updateDelay    更新频率时间[毫秒为单位]
         * @param repeatCount    重复次数
         * @param totalSeconds   总秒数[默认等于seconds剩余秒数]
         * @param speedFactor    时间速度系数[用于加速减速]
         * @return 
         */
        public static addClock(clockID: any, seconds: number = 0, updateDelay: number = 1000, repeatCount: number = 1, totalSeconds: number = -1, speedFactor: number = 1): TimerClock {
            let clock: TimerClock = TimerManager.getClock(clockID);
            if (clock == null) {
                clock = new TimerClock(clockID, updateDelay);
                TimerManager.clockMap[clockID] = clock;
            }
    
            if (seconds >= 0) {
                TimerManager.start();
                clock.start(seconds, repeatCount, totalSeconds, speedFactor);
            } else {
                Log.error(null, "[TimerManager]addClock seconds不允许小于0.");
            }
            return clock;
        }
    
        //移除时钟
        public static removeClock(clockID: any): void {
            if (TimerManager.clockMap[clockID]) {
                TimerManager.getClock(clockID).stop();
                delete TimerManager.clockMap[clockID];
            }
        }
    
        //获取时钟
        public static getClock(clockID: any, autoCreate: boolean = false): TimerClock {
            let clock: TimerClock = TimerManager.clockMap[clockID];
            if (autoCreate && clock == null) {
                clock = new TimerClock(clockID);
                TimerManager.clockMap[clockID] = clock;
            }
            return clock;
        }
    
        //开始
        public static start(): void {
            if (TimerManager.running)
                return;
    
            TimerManager.lastTime = getTimer();
            PIXI.ticker.shared.start();
            PIXI.ticker.shared.add(TimerManager.tick);
            TimerManager.running = true;
        }
    
        //停止
        public static stop(clockID: any = null): void {
            if (clockID == null) {
                if (!TimerManager.running)
                    return;
                PIXI.ticker.shared.remove(TimerManager.tick);
                PIXI.ticker.shared.stop();
                TimerManager.running = false;
            } else {
                if (TimerManager.clockMap[clockID]) TimerManager.getClock(clockID).stop();
            }
        }
    
        //暂停
        public static pause(clockID: any = null): void {
            if (clockID == null) {
                if (!TimerManager.running)
                    return;
                PIXI.ticker.shared.remove(TimerManager.tick);
                TimerManager.running = false;
            } else {
                if (TimerManager.clockMap[clockID]) TimerManager.getClock(clockID).pause();
            }
        }
    
        //恢复
        public static resume(clockID: any = null): void {
            if (clockID == null) {
                if (TimerManager.running)
                    return;
                PIXI.ticker.shared.add(TimerManager.tick);
                TimerManager.running = true;
                TimerManager.lastTime = getTimer();
            } else {
                if (TimerManager.clockMap[clockID]) TimerManager.getClock(clockID).resume();
            }
        }
    
        //帧频更新
        private static tick(frameDelta: number): void {
            if (!TimerManager.running)
                return;
    
            //当前时间
            let currentTime: number = getTimer();
            let passedTime: number = currentTime - TimerManager.lastTime;
            TimerManager.lastTime = currentTime;
            //检测
            for (let i in TimerManager.clockMap) {
                let clock: TimerClock = TimerManager.clockMap[i];
                if (clock.running) {
                    clock.update(passedTime, TimerManager, TimerManager.checkActive);
                }
            }
        }
    
    
        //检查活动个数
        private static checkActive(): void {
            let activeCount: number = 0;
            for (let i in TimerManager.clockMap) {
                let clock: TimerClock = TimerManager.clockMap[i];
                activeCount += clock.running ? 1 : 0;
            }
            //活动个数为0，停止驱动
            if (activeCount == 0)
                TimerManager.pause();
            else
                TimerManager.resume();
        }
    }
    
    interface TimerCallBackProps {
        thisObject: any;
        onComplete?: () => void;
        onProgress?: (progress: number) => void;
    }
    
    export class TimerClock {
        public running: boolean;//是否正在运行
        public id: any;//ID
        public totalTime: number = -1000;//单次总时间[毫秒单位]
        private m_passedTime: number = 0;//单次经历时间[毫秒单位]
        public speedFactor: number = 1;//速度系数
        public repeatCount: number = 0;//重复次数
        public currentCount: number = 0;//当前次数
    
        private updateDelay: number = 0;//进度更新间隔[毫秒单位]
        private currentUpdateDelay: number = 0;//当前进度更新间隔[毫秒单位，修正剩下时间不足updateDelay]
        private passedUpdateTime: number = 0;
    
        private callBackMap: HashMap<TimerCallBackProps> = new HashMap();
        constructor(id: any, updateDelay: number = 1000) {
            this.id = id;
            this.running = false;
            this.updateDelay = updateDelay;
        }
    
        //注册回调函数
        public registCallBack(thisObject: any, onComplete?: () => void, onProgress?: (progress: number) => void): void {
            this.callBackMap.put(thisObject, { thisObject: thisObject, onComplete: onComplete, onProgress: onProgress });
            if (onProgress != null) {
                onProgress.call(thisObject, this.progress);
            }
            if (onComplete != null) {
                if (this.progress == 1) onComplete.call(thisObject);
            }
        }
    
        //删除回调函数
        public removeCallBack(thisObject: any): void {
            this.callBackMap.remove(thisObject);
        }
    
        //开始(秒为单位)
        public start(seconds: number, repeatCount: number = 1, totalSeconds: number = -1, speedFactor: number = 1): void {
            if (this.running) this.stop();
    
            totalSeconds = (totalSeconds > 0) ? totalSeconds : seconds;
            this.totalTime = totalSeconds * 1000;
            this.passedTime = (totalSeconds - seconds) * 1000;
            this.speedFactor = speedFactor;
            this.currentCount = 1;
            this.repeatCount = repeatCount;
            this.currentUpdateDelay = Math.min(this.updateDelay, this.totalTime);
            if (this.totalTime > 0) {
                this.running = true;
            } else {
                this.callBackMap.eachValue(this.postComplete, this);
            }
        }
    
        //暂停
        public pause(): void {
            this.running = false;
        }
    
        //恢复
        public resume(): void {
            this.running = true;
        }
    
        //停止
        public stop(): void {
            this.running = false;
            this.passedUpdateTime = 0;
            this.passedTime = 0;
            this.currentCount = 1;
        }
    
        //销毁
        public dispose(): void {
            this.stop();
            this.callBackMap.clear();
        }
    
        //更新显示
        public update(deltaTime: number, thisObject: any, onComplete: Function): void {
            if (!this.running) return;
    
            deltaTime *= this.speedFactor;
            this.passedTime += deltaTime;
            this.passedUpdateTime += deltaTime;
            while (this.passedUpdateTime > this.currentUpdateDelay) {
                this.passedUpdateTime -= this.currentUpdateDelay;
                if (this.leftTime > 0) {
                    this.currentUpdateDelay = Math.min(this.currentUpdateDelay, this.leftTime);
                }
                this.callBackMap.eachValue(this.postProgress, this);
                if (this.passedTime >= this.totalTime) {
                    this.currentCount++;
                    if (this.currentCount > this.repeatCount) {
                        this.running = false;
                        this.callBackMap.eachValue(this.postComplete, this);
                        onComplete.call(thisObject);
                    } else {
                        this.passedTime -= this.totalTime;
                    }
                }
            }
        }
    
        //剩余时间[毫秒单位]
        public get leftTime(): number {
            return this.totalTime - this.passedTime;
        }
    
        //剩余时间格式化字符[毫秒单位]
        public get leftTimeFormat(): string {
            return NumberFormatter.formatTime(this.leftTime);
        }
    
        public get passedTime(): number {
            return this.m_passedTime;
        }
    
        public set passedTime(value: number) {
            this.m_passedTime = Math.min(value, this.totalTime);
        }
    
        //进度
        public get progress(): number {
            return this.m_passedTime ? (this.m_passedTime / this.totalTime) : 0;
        }
    
        private postProgress(value: TimerCallBackProps): void {
            const func = value.onProgress;
            const thisObject = value.thisObject;
            if (func) func.call(thisObject, this.progress);
        }
    
        private postComplete(value: TimerCallBackProps): void {
            const func = value.onComplete;
            const thisObject = value.thisObject;
            if (func) func.call(thisObject);
        }
    
    }
}

