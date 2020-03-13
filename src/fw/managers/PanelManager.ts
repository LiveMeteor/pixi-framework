/// <reference path = "../fw.ts" /> 
namespace fw {
    export module PanelManager {

        let navigator: PanelNavigator;
    
        /**
         * 显示面板
         * @param panel 面板类名
         * @param data 面板需要的数据
         * @param align 对齐方式，对应 ResizeAlign
         * @param layer 需要显示到哪个层
         * @param resourcePath 面板需要加载的资源
         * @param hasModal 是否需要面板下面的模态
         */
        export function showPanel<T extends BasePanel>(panel: new () => T, data: any, align?: number, layer?: PIXI.Container, resourcePath?: string[], hasModal: boolean = false): T
        {
            !navigator && (navigator = new PanelNavigator());
            return navigator.showPanel(panel, data, align, layer, resourcePath, hasModal);
        }
    
        /**
         * 获取面板实例
         * @param panel 面板类名
         */
        export function getPanel<T extends BasePanel>(panel: new() => T): T
        {
            !navigator && (navigator = new PanelNavigator());
            return navigator.getPanel(panel);
        }
    
        /**
         * 是否已经打开
         * @param panel 面板类名
         */
        export function isOpen(panel: new () => BasePanel): boolean {
            !navigator && (navigator = new PanelNavigator());
            return navigator.isOpen(panel);
        }
    
        /**
         * 关闭、隐藏面板
         * @param panel 面板类名
         * @param destroy 是否销毁、释放实例
         */
        export function hidePanel<T extends BasePanel>(panel: new () => T, destroy: boolean = false): T | undefined
        {
            return navigator && navigator.hidePanel(panel, destroy);
        }
    
        /** 
         * 关闭、隐藏全部面板
         */
        export function hideAllPanel(): void
        {
            navigator && navigator.hideAllPanel();
        }
    
        /**
         * 销毁、释放全部面板实例
         */
        export function destroyAllPanel(): void
        {
            navigator && navigator.destroyAllPanel();
        }
    }
}
