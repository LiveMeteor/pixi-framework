namespace app {
    /** fw 框架需要的配置和系统级的配置 */
    export let Config = {
        /** DEBUG 模式 */
        isDebug: true,
        /** 游戏版本号 */
        version: "1.0.0",
        /** 舞台尺寸 */
        stageWidth: 1440,
        stageHeight: 810,
        /** UI 图集存放位置(Div模式会用到) */
        pathTexturesResource: "img/",
        /** JS图集模式 */
        jsTexturesMode: true,
        /** 显示品质等级 */
        quality: 2
    }
}
