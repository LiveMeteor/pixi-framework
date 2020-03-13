/// <reference path = "../fw.ts" /> 
namespace fw {
    export module SceneManager  {

        let navigator: SceneNavigator;
    
        /** 获取当前场景 */
        export function current(): BaseScene | undefined {
            !navigator && (navigator = new SceneNavigator());
            return navigator.currentProps ? navigator.currentProps.content : undefined;
        }
    
        /**
         * 设置当前场景
         * @param scene 场景类名
         * @param data 场景需要的数据
         * @param align 对齐方式，对应 ResizeAlign
         * @param resourcePath 面板需要加载的资源
         * @param hasModal 是否需要底部模态
         */
        export function setCurrentScene<T extends BaseScene>(scene: new() => T, data: any, align?: number, resourcePath?: string[], hasModal: boolean = false): T
        {
            !navigator && (navigator = new SceneNavigator());
            return navigator.setCurrentScene(scene, data, align, resourcePath, hasModal);
        }
    
        /**
         * 获取场景实例 
         * @param scene 场景类名
         */
        export function getScene<T extends BaseScene>(scene: new() => T): T
        {
            !navigator && (navigator = new SceneNavigator());
            return navigator.getScene(scene);
        }
    
        /**
         * 销毁全部场景实例
         */
        export function destroyAllScene(): void
        {
            !navigator && (navigator = new SceneNavigator());
            return navigator.destroyAllScene();
        }
    }
}

