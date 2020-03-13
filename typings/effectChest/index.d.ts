/// <reference types="pixi.js" />
declare namespace effectChest {
    let Config: {
        isDebug: boolean;
        version: string;
        stageWidth: number;
        stageHeight: number;
        pathTexturesResource: string;
        jsTexturesMode: boolean;
        quality: number;
    };
}
declare namespace effectChest {
    class EffectChest extends PIXI.Container {
        static resRoot: string;
        designWidth: number;
        designHeight: number;
        private resource;
        private fromX;
        private fromY;
        private quality;
        private videoPosTemplates;
        private videoPos;
        private imgChestClosed;
        private imgChestOpen;
        private imgLight;
        private imgHighLight;
        private particlesConfig;
        private particles;
        constructor();
        addChild<T extends PIXI.DisplayObject>(child: T): T;
        show(data: any): Promise<void>;
        private showSwing;
        private showOpen;
        private showLight;
        private addParticles;
        private showBubble;
        private showComplete;
        private clear;
        hide(): void;
    }
}
declare namespace effectChest {
    class EffectChestBubble extends PIXI.Text {
        constructor(text: string, colorType: number, xpos?: number, ypos?: number);
        private show;
        private clear;
        scaleX: number;
        scaleY: number;
    }
}
declare namespace effectChest {
    class EffectChestDirector extends fw.GameDirector {
        constructor(stageWidth: number, stageHeight: number, containerId?: string, quality?: number, data?: any);
        destroy(): void;
    }
}
declare namespace effectChest {
    class EffectChestTweenSprite extends PIXI.Sprite {
        constructor(texture?: PIXI.Texture);
        scaleX: number;
        scaleY: number;
    }
}
declare namespace effectChest {
    class GameAPIIns implements fw.IGameAPI {
        gameId: number;
        gameModelId: number;
        gameName: string;
        version: string;
        router: fw.ICoursewareData;
        private director?;
        effect: EffectChest;
        constructor();
        init(stageWidth?: number, stageHeight?: number, containerId?: string, quality?: number, data?: any): boolean;
        setDebug(value: boolean): void;
        resize(stageWidth: number, stageHeight: number): boolean;
        command(type: string, jsonData: any, callback?: (result: any) => void): void;
        destroy(force?: boolean): boolean;
    }
    let GameAPI: GameAPIIns;
}
