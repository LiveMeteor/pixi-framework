/// <reference path = "../fw.ts" /> 
/// <reference path = "./TouchMoveCtrl.ts" /> 
namespace fw {
	export class MouseMoveCtrl extends TouchMoveCtrl {

		public constructor(target: PIXI.Container)
		{
			super(target);
			this.touchShake = 0;
		}
	
		protected onTouchScroll(evt: PIXI.interaction.InteractionEvent): void {
			if (evt.type == "pointerdown") {
				this.isTouchDown = true;
				if (this.bindBeginProp && this.bindBeginProp.func.length == 0)
					this.bindBeginProp.func.call(this.bindBeginProp.target);
				else if (this.bindBeginProp)
					this.bindBeginProp.func.call(this.bindBeginProp.target, evt);
				this.beginPoint = evt.data.getLocalPosition(this.target.parent).clone();
				// Log.log(`TOUCH_BEGIN ${this.beginPoint.x} ${this.beginPoint.y}`);
			}
			else if (evt.type == "pointermove" || evt.type == "pointerup" || evt.type == "pointerupoutside") {
				this.nowPoint = evt.data.getLocalPosition(this.target.parent).clone();
				// Log.log(`TOUCH_MOVE ${evt.type} ${this.nowPoint.x} ${this.nowPoint.y}`);
				if (this.bindXProp)
					this.bindXProp.target[this.bindXProp.prop] = this.nowPoint.x;
				if (this.bindYProp) {
					this.bindYProp.target[this.bindYProp.prop] = this.nowPoint.y;
				}
				if (this.bindXYProp)
					this.bindXYProp.setfunc.call(this.bindXYProp.target, this.nowPoint.x, this.nowPoint.y);
			}
			if (evt.type == "pointerup" || evt.type == "pointerupoutside") {
				if (!this.isTouchDown)
					return;
				if (this.bindEndProp && this.bindEndProp.func.length == 0)
					this.bindEndProp.func.call(this.bindEndProp.target);
				else if (this.bindEndProp)
					this.bindEndProp.func.call(this.bindEndProp.target, evt);
				this.beginPoint = undefined;
				this.isTouchDown = false;
			}
		}
	}
}

