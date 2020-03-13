/// <reference path = "../fw.ts" /> 
namespace fw {
    /** 显示对象对齐方式 */
    export enum ResizeAlign {
        /** 不需要适配 */
        NONE = 0,
        /** 居中 */
        CENTER = 1, 
        /** 不保持比例铺满 */
        FILL = 2,
        /** 缩放并保持显示完整 */
        SCALE_INTACT = 3,
        /** 缩放并保持充满屏幕 */
        SCALE_CLIP = 4,
        /** 缩放并保持充满父容器 */
        SCALE_FILL = 5,
    }
}


