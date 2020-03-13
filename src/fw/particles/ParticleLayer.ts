namespace fw {

    export class ParticleLayer extends PIXI.Container {

        private designWidth: number;
        private designHeight: number;
        private elapsed: number;
        private emitter: PIXI.particles.Emitter;
        private timer: TimerClock;
        
        /**
         * 粒子层
         * @param designWidth 粒子层设计宽
         * @param designHeight 粒子层设计高
         * @param textures 材质图
         * @param config 粒子发射器配置
         * @param touchEmit 是否点击出发
         * @param type 默认/路径模式/动画模式
         * @param useParticleContainer 是否使用粒子容器(支持不好)
         * @param colorListConfig 颜色配置列表(支持不好)
         */
        public constructor(designWidth: number, designHeight: number, textures: PIXI.Texture | PIXI.Texture[], config: PIXI.particles.EmitterConfig, touchEmit: boolean = true,type?:"path"|"anim", useParticleContainer: boolean = false, colorListConfig?: PIXI.particles.ColorListConfig) {
            super();
            HashObject.InjectHashCode(this)
            this.designWidth = designWidth;
            this.designHeight = designHeight;
            this.interactive = this.interactiveChildren = true;
            this.elapsed = Date.now();
    
            // let bg = new GQuad(0x0, 0, 0, designWidth, designHeight, 0.1);
            // this.addChild(bg);
    
    
            let container: PIXI.Container;
            if(useParticleContainer)
            {
                if (PIXI.particles.ParticleContainer)
                {
                    container = new PIXI.particles.ParticleContainer();
                    (<any>container).setProperties({
                        scale: true,
                        position: true,
                        rotation: true,
                        uvs: true,
                        alpha: true
                    });
                    this.addChild(container);
                }
                else {
                    container = this;
                }
            }
            else {
                container = this;
            }
            
            if (Config.quality >= 2) {
                this.emitter = new PIXI.particles.Emitter(container, textures, config);
                if (colorListConfig)
                    this.emitter.startColor = PIXI.particles.ParticleUtils.createSteppedGradient(colorListConfig.list, colorListConfig.stepColors);
                if(type == "path")
                    this.emitter.particleConstructor = PIXI.particles.PathParticle;
                else if(type == "anim")
                    this.emitter.particleConstructor = PIXI.particles.AnimatedParticle;
            }
    
            if (touchEmit)
            {
                container.on('pointerup', (evt: PIXI.interaction.InteractionEvent) => {
                    const pos = evt.data.getLocalPosition(this);
                    this.emitParticle(pos.x, pos.y);
                });
            }
            else
            {
                this.emitParticle();
            }
        }
    
        /**
         * 发射粒子
         * @param x 
         * @param y 
         */
        public emitParticle(x?:number, y?:number): void
        {
            if(!this.emitter)
                return;
    
            if (!this.timer)
            {
                this.timer = TimerManager.addClock("ParticleLayer" + HashObject.GetHashCode(this), 9999, 10);
                this.timer.registCallBack(this, undefined, this.update);
            }
            this.emitter.emit = true;
            this.emitter.resetPositionTracking();
            this.emitter.updateOwnerPos(x || this.designWidth / 2, y ||this.designHeight / 2);
        }
    
        private update(): void {
            var now = Date.now();
            if (this.emitter)
                this.emitter.update((now - this.elapsed) * 0.001);
    
            this.elapsed = now;
        }
    
        public destroy(): void {
            if (this.timer)
            {
                this.timer.removeCallBack(this);
                TimerManager.removeClock("ParticleLayer" + HashObject.GetHashCode(this));
                this.timer = null;
            }
            this.emitter && this.emitter.destroy();
            this.emitter = null;
            this.removeAllListeners();
            this.removeChildren();
            fw.DisplayUtil.removeFromParent(this);
        }
    }
}

