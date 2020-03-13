/// <reference path = "../fw.ts" /> 
namespace fw {
	export module DisplayUtil {

		/** 获取有效全局范围，主要用于捕捉对象的全局坐标 */
		export function getGlobalBounds(target: PIXI.DisplayObject): PIXI.Rectangle {
			const bound = new PIXI.Rectangle();
			const targetBound = target.getLocalBounds();
			let globalPointTl = target.getGlobalPosition(new PIXI.Point(0, 0));
			let globalPointRb = target.getGlobalPosition(new PIXI.Point(targetBound.width, targetBound.height));
			bound.x = globalPointTl.x;
			bound.y = globalPointTl.y;
			bound.width = globalPointRb.x - globalPointTl.x;
			bound.height = globalPointRb.y - globalPointTl.y;
			return bound;
		}
	
		/** 全屏居中，相对居中
		 * @param target 需要居中的对象
		 * @param spaceWidth 容器宽
		 * @param spaceHeight 容器高
		 * @param intact true不足留空 false超出裁剪
		 */
		export function fillCenter(target: PIXI.Container, spaceWidth: number, spaceHeight: number, intact: boolean = true): void {
			const tarWidth: number = (<any>target)["designWidth"] ? (<any>target)["designWidth"] : target.width;
			const tarHeight: number = (<any>target)["designHeight"] ? (<any>target)["designHeight"] : target.height;
			let widthRatio: number = spaceWidth / tarWidth;
			let heightRatio: number = spaceHeight / tarHeight;
			let scale: number = intact ? Math.min(widthRatio, heightRatio) : Math.max(widthRatio, heightRatio);
			target.setTransform(0, 0, scale, scale);
			target.x = (spaceWidth - tarWidth) >> 1;
			target.y = (spaceHeight - tarHeight) >> 1;
		}
	
	
		export function fillScale(target: PIXI.Container, spaceWidth: number, spaceHeight: number): void {
			const tarWidth: number = (<any>target)["designWidth"] ? (<any>target)["designWidth"] : target.width;
			const tarHeight: number = (<any>target)["designHeight"] ? (<any>target)["designHeight"] : target.height;
			let widthRatio: number = spaceWidth / tarWidth;
			let heightRatio: number = spaceHeight / tarHeight;
			target.setTransform(0, 0, widthRatio, heightRatio);
		}
	
	
		/** 从父类移除子对象 */
		export function removeFromParent(child: PIXI.DisplayObject): void {
			child && child.parent && child.parent.removeChild(child);
		}
	
		/** 检测某点是否在某矩形内 */
		export function pointInRect(point: PIXI.Point, rect: PIXI.Rectangle): boolean {
			return point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height
		}
	
		/** 添加到某显示对象之前(之下) */
		export function addChildBefore(child: PIXI.DisplayObject, displayObj: PIXI.DisplayObject): PIXI.DisplayObject {
			return displayObj.parent.addChildAt(child, displayObj.parent.getChildIndex(displayObj));
		}
	
		/** 添加到某显示对象之后(之上) */
		export function addChildAfter(child: PIXI.DisplayObject, displayObj: PIXI.DisplayObject): PIXI.DisplayObject {
			return displayObj.parent.addChildAt(child, displayObj.parent.getChildIndex(displayObj) + 1);
		}
	
	}
}
