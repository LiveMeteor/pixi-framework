/// <reference path = "../fw.ts" /> 
/// <reference path = "../util/HashMap.ts" /> 
namespace fw {
	export module ResizeManager {

		let _stageWidth: number;
		let _stageHeight: number;
		let _map: HashMap<ResizeProperty> = new HashMap<ResizeProperty>();
	
		export function initialize(stageWidth: number, stageHeight: number): void
		{
			_stageWidth = stageWidth;
			_stageHeight = stageHeight;
			_map = new HashMap<ResizeProperty>();
		}
	
		export function refresh(): void {
			_map.eachValue(prop => {_excuteResize(prop);}, null);
		}
	
		export function add(target: PIXI.Container, align:ResizeAlign, alignlistener?: () => void, ): void {
			let hashCode:number = (<any>target)["_hashCode"];
			if (!hashCode)
				return;
			let prop:ResizeProperty = {target: target, align:align, callback:alignlistener, bound:null};
			_map.put(hashCode, prop);
			_excuteResize(prop);
		}
	
		export function remove(target: PIXI.Container): void {
			let hashCode:string = (<any>target)["_hashCode"];
			if (!hashCode)
				return;
			if (_map.containsKey(hashCode))
				_map.remove(hashCode);
		}
	
	
		function _excuteResize(prop:ResizeProperty, tryTimes: number = 1): void {
			const tar = prop.target as any;
			prop.bound = {x:prop.target.x, y:prop.target.y, 
				width: tar["designWidth"] ? tar["designWidth"] : tar.width, 
				height: tar["designHeight"] ? tar["designHeight"] : tar.height};
			
			if ((prop.bound.width == 0 || prop.bound.height == 0) && tryTimes < 3) {
				//如果取不到宽、高，重试2帧
				PIXI.ticker.shared.addOnce(evt => { _excuteResize(prop, tryTimes + 1); }, ResizeManager);
				return;
			}
			// console.log(`align=${prop.align}`);
			
			switch (prop.align)
			{
				case ResizeAlign.CENTER:
					let posX = _stageWidth - prop.bound.width >> 1;
					let posY = _stageHeight - prop.bound.height >> 1;
					prop.target.x = posX + prop.target.width * prop.target.pivot.x;
					prop.target.y = posY + prop.target.height * prop.target.pivot.y;
					break;
				case ResizeAlign.FILL:
					prop.target.x = prop.target.y = 0;
					prop.target.width = _stageWidth;
					prop.target.height = _stageHeight;
					break;
				case ResizeAlign.SCALE_INTACT:
					DisplayUtil.fillCenter(prop.target, _stageWidth, _stageHeight, true);
					break;
				case ResizeAlign.SCALE_CLIP:
					DisplayUtil.fillCenter(prop.target, _stageWidth, _stageHeight, false);
					break;
				case ResizeAlign.SCALE_FILL:
					DisplayUtil.fillScale(prop.target, _stageWidth, _stageHeight);
					break;
			}
	
			if (prop.callback)
				prop.callback.call(prop.target);
		}
	
		interface ResizeProperty {
			target: PIXI.Container;
			align: ResizeAlign;
			callback: Function | undefined;
			bound: {x:number, y:number, width:number, height:number} | null;
		}
	}
}
