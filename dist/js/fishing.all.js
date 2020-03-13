"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var app;
(function (app) {
    app.Config = {
        isDebug: true,
        version: "1.0.0",
        stageWidth: 1440,
        stageHeight: 810,
        pathTexturesResource: "img/",
        jsTexturesMode: true,
        quality: 2
    };
})(app || (app = {}));
var fw;
(function (fw) {
})(fw || (fw = {}));
var fw;
(function (fw) {
    var HashObject = (function () {
        function HashObject() {
            this._hashCode = HashObject.hashCount++;
        }
        HashObject.InjectHashCode = function (target) {
            target._hashCode = HashObject.hashCount++;
            if (target.prototype) {
                target.prototype.getHashCode = function () {
                    return this["_hashCode"];
                };
            }
            else {
                target.__proto__.getHashCode = function () {
                    return this["_hashCode"];
                };
            }
            return target._hashCode;
        };
        HashObject.GetHashCode = function (target) {
            var hashCode = target["_hashCode"];
            if (!hashCode) {
                HashObject.InjectHashCode(target);
                hashCode = target["_hashCode"];
            }
            return hashCode;
        };
        HashObject.GenerateHashCode = function () {
            var id = HashObject.hashCount++;
            return id;
        };
        HashObject.prototype.getHashCode = function () {
            return this._hashCode;
        };
        HashObject.hashCount = 1;
        return HashObject;
    }());
    fw.HashObject = HashObject;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var GameDirector = (function (_super) {
        __extends(GameDirector, _super);
        function GameDirector(stageWidth, stageHeight, transparent, containerId, quality, fps) {
            if (transparent === void 0) { transparent = false; }
            if (quality === void 0) { quality = 2; }
            if (fps === void 0) { fps = 24; }
            var _this = _super.call(this) || this;
            _this.stageWidth = 0;
            _this.stageHeight = 0;
            fw.Config.currentDirector = _this;
            _this.stageWidth = stageWidth;
            _this.stageHeight = stageHeight;
            _this.transparent = transparent;
            _this.quality = quality;
            _this.fps = fps;
            var container = containerId ? document.getElementById(containerId) : null;
            _this.htmlContainer = container || document.body;
            fw.Config.stageWidth = _this.stageWidth = stageWidth;
            fw.Config.stageHeight = _this.stageHeight = stageHeight;
            var opt = {
                width: _this.stageWidth,
                height: _this.stageHeight,
                antialias: false,
                forceFXAA: true,
                clearBeforeRender: true,
                preserveDrawingBuffer: true,
                autoResize: true,
                transparent: _this.transparent,
                resolution: _this.quality <= 0 ? 0.4 : 1,
                forceCanvas: _this.quality <= 1
            };
            _this.app = new Application(opt, _this.render, _this, fps);
            _this.stage = _this.app.stage;
            _this.stage.name = "stage";
            _this.htmlContainer.appendChild(_this.app.view);
            fw.TimerManager.start();
            var Stats = window.Stats;
            if (Stats) {
                _this.stats = new Stats();
                _this.htmlContainer.appendChild(_this.stats.dom);
                _this.stats.dom.style.top = "50%";
                _this.stats.dom.style.left = "0%";
                if (fw.getDeviceType() == fw.DeviceType.iPad) {
                    for (var i in _this.stats.dom.children) {
                        var ele = _this.stats.dom.children[i];
                        if (ele.localName == "canvas") {
                            ele.style.width = "160px";
                            ele.style.height = "96px";
                        }
                    }
                }
            }
            return _this;
        }
        GameDirector.prototype.validateStage = function () {
            var childrenStage = [];
            if (this.stage) {
                childrenStage = [];
                while (this.stage.children.length > 0) {
                    var child = this.stage.getChildAt(0);
                    this.stage.removeChild(child);
                    childrenStage.push(child);
                }
                this.app.view.parentElement && this.htmlContainer.removeChild(this.app.view);
            }
            var opt = {
                width: this.stageWidth,
                height: this.stageHeight,
                antialias: false,
                forceFXAA: true,
                clearBeforeRender: true,
                preserveDrawingBuffer: true,
                autoResize: true,
                transparent: this.transparent,
                resolution: this.quality <= 0 ? 0.4 : 1,
                forceCanvas: this.quality <= 1
            };
            fw.Config.isDebug && console.log(opt);
            this.app = new Application(opt, this.render, this, this.fps);
            this.stage = this.app.stage;
            this.stage.name = "stage";
            this.htmlContainer.appendChild(this.app.view);
            while (childrenStage.length > 0) {
                var child = childrenStage.shift();
                this.stage.addChild(child);
            }
        };
        GameDirector.prototype.resize = function (stageWidth, stageHeight) {
            fw.Config.stageWidth = this.stageWidth = stageWidth;
            fw.Config.stageHeight = this.stageHeight = stageHeight;
            this.app.renderer.resize(stageWidth, stageHeight);
            var scene = fw.SceneManager.current();
            if (scene) {
                var ratio = Math.max(stageWidth / scene.designWidth, stageHeight / scene.designHeight);
                scene.setTransform(0, 0, ratio, ratio);
                scene.x = stageWidth - scene.designWidth * ratio >> 1;
                scene.y = stageHeight - scene.designHeight * ratio >> 1;
                fw.Log.log("Resize the scale of Scene " + ratio + " stage width " + stageWidth + " stage height " + stageHeight);
            }
        };
        GameDirector.prototype.render = function () {
            this.stats && this.stats.update();
        };
        GameDirector.prototype.destroy = function () {
            fw.TimerManager.stop();
            fw.Tween.removeAllTweens();
            PIXI.ticker.shared.destroy();
            fw.SoundManager.destroy();
            fw.PanelManager.destroyAllPanel();
            fw.SceneManager.destroyAllScene();
            fw.ResourceManager.ins.destroy();
            fw.GResponser.destroy();
            fw.Config.currentDirector = undefined;
            this.app.destroy(true, true);
        };
        return GameDirector;
    }(fw.HashObject));
    fw.GameDirector = GameDirector;
    var Application = (function (_super) {
        __extends(Application, _super);
        function Application(options, renderFunc, thisObj, fps) {
            if (fps === void 0) { fps = 24; }
            var _this = _super.call(this, options) || this;
            _this.lastRenderTime = 0;
            _this.renderFunc = renderFunc;
            _this.thisObj = thisObj;
            _this.renderGap = 1000 / fps;
            _this.deviceType = fw.getDeviceType();
            return _this;
        }
        Application.prototype.render = function () {
            if (fw.getTimer() - this.lastRenderTime < this.renderGap)
                return;
            if (fw.getTimer() - this.lastRenderTime > 1000)
                this.lastRenderTime = fw.getTimer();
            else
                this.lastRenderTime += this.renderGap;
            try {
                _super.prototype.render.call(this);
            }
            catch (evt) {
                window.parent.postMessage({ type: "decreasequality", data: {} }, "*");
                location.reload();
            }
            this.renderFunc && this.renderFunc.call(this.thisObj);
        };
        return Application;
    }(PIXI.Application));
})(fw || (fw = {}));
var verNum = parseInt(PIXI.VERSION.split(".").join(""));
if (verNum >= 470) {
    PIXI.TextMetrics.tokenize = function (text) {
        var tokens = [];
        var token = '';
        if (typeof text !== 'string') {
            return tokens;
        }
        for (var i = 0; i < text.length; i++) {
            var char = text[i];
            tokens.push(char);
        }
        if (token !== '') {
            tokens.push(token);
        }
        return tokens;
    };
}
else {
    PIXI.TextMetrics.wordWrap = function (text, style, canvas) {
        if (canvas === void 0) { canvas = PIXI.TextMetrics._canvas; }
        var context = canvas.getContext('2d');
        var result = '';
        var firstChar = text.charAt(0);
        var lines = text.split('\n');
        var wordWrapWidth = style.wordWrapWidth * 1.6;
        var characterCache = {};
        for (var i = 0; i < lines.length; i++) {
            var spaceLeft = wordWrapWidth;
            var words = lines[i].split('');
            for (var j = 0; j < words.length; j++) {
                var wordWidth = context.measureText(words[j]).width;
                if (style.breakWords && wordWidth > wordWrapWidth) {
                    var characters = words[j].split('');
                    for (var c = 0; c < characters.length; c++) {
                        var character = characters[c];
                        var characterWidth = characterCache[character];
                        if (characterWidth === undefined) {
                            characterWidth = context.measureText(character).width;
                            characterCache[character] = characterWidth;
                        }
                        if (characterWidth > spaceLeft) {
                            result += "\n" + character;
                            spaceLeft = wordWrapWidth - characterWidth;
                        }
                        else {
                            if (c === 0 && (j > 0 || firstChar === ' ')) {
                                result += ' ';
                            }
                            result += character;
                            spaceLeft -= characterWidth;
                        }
                    }
                }
                else {
                    var wordWidthWithSpace = wordWidth + context.measureText(' ').width;
                    if (j === 0 || wordWidthWithSpace > spaceLeft) {
                        if (j > 0) {
                            result += '\n';
                        }
                        result += words[j];
                        spaceLeft = wordWrapWidth - wordWidth;
                    }
                    else {
                        spaceLeft -= wordWidthWithSpace;
                        result += "" + words[j];
                    }
                }
            }
            if (i < lines.length - 1) {
                result += '\n';
            }
        }
        return result;
    };
}
if (verNum >= 480) {
    PIXI.loaders.Resource.prototype["_determineCrossOrigin"] = function (url, loc) {
        return '';
    };
}
function useClientReadFile() {
}
var fw;
(function (fw) {
    var BasePanel = (function (_super) {
        __extends(BasePanel, _super);
        function BasePanel(designWidth, designHeight, resource) {
            var _this = _super.call(this) || this;
            _this.mStatus = 0;
            _this.mIsInitialized = false;
            fw.HashObject.InjectHashCode(_this);
            _this.designWidth = designWidth;
            _this.designHeight = designHeight;
            _this.resource = resource;
            _this.interactive = _this.interactiveChildren = true;
            return _this;
        }
        BasePanel.prototype.addEventListener = function (event, fn, context) {
            return this.addListener(event, fn, context);
        };
        BasePanel.prototype.removeEventListener = function (event, fn, context) {
            return this.removeListener(event, fn, context);
        };
        BasePanel.prototype.load = function (resourcePaths, onComplete, onProgress, onClose, thisObj) {
            var _this = this;
            if (onClose)
                this.onCloseCallback = { func: onClose, thisObj: thisObj };
            this.status = fw.PanelStatus.INITIALIZATION;
            if (resourcePaths) {
                var urls_1 = [];
                resourcePaths.forEach(function (path, index, arr) {
                    var splitUrl = path.split("/");
                    urls_1.push(splitUrl.length == 1 ? fw.Config.pathTexturesResource + path : path);
                });
                fw.ResourceManager.ins.loadByUrls(urls_1, function () {
                    if (!_this.resource && resourcePaths.length > 0) {
                        _this.resource = fw.ResourceManager.ins.getTextureResource(fw.cutFilename(urls_1[0]));
                    }
                    _this.checkInitialize();
                    onComplete && onComplete.call(thisObj);
                }, function (progress) {
                    onProgress && onProgress.call(thisObj, progress);
                }, this);
            }
            else {
                this.checkInitialize();
                onComplete && onComplete.call(thisObj);
            }
        };
        BasePanel.prototype.checkInitialize = function () {
            if (!this.mIsInitialized) {
                this.initialize();
                this.mIsInitialized = true;
                this.status = fw.PanelStatus.READY;
            }
        };
        BasePanel.prototype.show = function (container, data, align) {
            if (align === void 0) { align = 1; }
            this.setData(data);
            if (!this.isOpen) {
                container.addChild(this);
                align && fw.ResizeManager.add(this, align);
                this.status = fw.PanelStatus.OPEN;
                this.onOpen();
            }
        };
        BasePanel.prototype.hide = function (destroy) {
            if (destroy === void 0) { destroy = false; }
            if (!this.parent)
                return;
            fw.ResizeManager.remove(this);
            this.parent.removeChild(this);
            this.status = fw.PanelStatus.CLOSE;
            this.onCloseCallback && this.onCloseCallback.func.call(this.onCloseCallback.thisObj);
            this.onClose();
            if (destroy) {
                this.destroy();
                this.status = fw.PanelStatus.START;
            }
        };
        BasePanel.prototype.initialize = function () {
        };
        BasePanel.prototype.setData = function (value) {
            this.mData = value;
        };
        BasePanel.prototype.getData = function () {
            return this.mData;
        };
        Object.defineProperty(BasePanel.prototype, "status", {
            get: function () {
                return this.mStatus;
            },
            set: function (value) {
                this.mStatus = value;
                this.emit("change", this.mStatus);
            },
            enumerable: true,
            configurable: true
        });
        BasePanel.prototype.onOpen = function () {
        };
        Object.defineProperty(BasePanel.prototype, "isOpen", {
            get: function () {
                return this.status == fw.PanelStatus.OPEN;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasePanel.prototype, "onStage", {
            get: function () {
                function checkStage(value) {
                    if (!value)
                        return false;
                    else if (value.name == "stage")
                        return true;
                    else
                        return checkStage(value.parent);
                }
                return checkStage(this.parent);
            },
            enumerable: true,
            configurable: true
        });
        BasePanel.prototype.onClose = function () {
        };
        BasePanel.prototype.destroy = function () {
            this.resource = undefined;
        };
        return BasePanel;
    }(PIXI.Container));
    fw.BasePanel = BasePanel;
})(fw || (fw = {}));
var fw;
(function (fw) {
    fw.DefaultLayers = {
        BACKGROUND_LAYER: "BACKGROUND_LAYER",
        INTERACTIVE_LAYER: "INTERACTIVE_LAYER",
        UI_LAYER: "UI_LAYER",
        PANEL_LAYER: "PANEL_LAYER",
        TOP_LAYER: "TOP_LAYER"
    };
    var BaseScene = (function (_super) {
        __extends(BaseScene, _super);
        function BaseScene(designWidth, designHeight) {
            var _this = _super.call(this, designWidth, designHeight) || this;
            _this.layers = [];
            return _this;
        }
        BaseScene.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            fw.ResizeManager.initialize(this.designWidth, this.designHeight);
            this.initLayers();
        };
        BaseScene.prototype.initLayers = function () {
            var layerNames = [
                fw.DefaultLayers.BACKGROUND_LAYER,
                fw.DefaultLayers.INTERACTIVE_LAYER,
                fw.DefaultLayers.UI_LAYER,
                fw.DefaultLayers.PANEL_LAYER,
                fw.DefaultLayers.TOP_LAYER
            ];
            for (var _i = 0, layerNames_1 = layerNames; _i < layerNames_1.length; _i++) {
                var name_1 = layerNames_1[_i];
                var layer = new PIXI.Container();
                layer.name = name_1;
                _super.prototype.addChild.call(this, layer);
                this.layers.push(layer);
            }
        };
        BaseScene.prototype.getLayer = function (id) {
            if (!id)
                return this.layers[0];
            for (var i in this.layers) {
                if (this.layers[i].name == id)
                    return this.layers[i];
            }
            return this.layers[0];
        };
        BaseScene.prototype.show = function (data, align) {
            if (align === void 0) { align = 1; }
            this.setData(data);
            if (!this.isOpen) {
                var director = fw.Config.currentDirector;
                director.stage.addChild(this);
                var ratio = Math.max(director.stageWidth / this.designWidth, director.stageHeight / this.designHeight);
                this.setTransform(0, 0, ratio, ratio);
                this.x = director.stageWidth - this.designWidth * ratio >> 1;
                this.y = director.stageHeight - this.designHeight * ratio >> 1;
                this.status = fw.PanelStatus.OPEN;
                this.onOpen();
            }
        };
        BaseScene.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            this._background && fw.ResizeManager.add(this._background, fw.ResizeAlign.SCALE_CLIP);
        };
        BaseScene.prototype.setBackground = function (texture) {
            this._background = new PIXI.Sprite(texture);
            fw.HashObject.InjectHashCode(this._background);
            this.addChildAt(this._background, 0);
            fw.ResizeManager.add(this._background, fw.ResizeAlign.SCALE_CLIP);
        };
        BaseScene.prototype.addChild = function () {
            var children = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                children[_i] = arguments[_i];
            }
            fw.Log.error("Can't use addChild in BaseScene");
            return children[0];
        };
        BaseScene.prototype.onClose = function () {
            this._background && fw.ResizeManager.remove(this._background);
            _super.prototype.onClose.call(this);
        };
        BaseScene.prototype.destroy = function () {
            if (this._background) {
                this._background.parent && this._background.parent.removeChild(this._background);
                this._background.destroy();
            }
            while (this.layers.length > 1) {
                var layer = this.layers.shift();
                layer.removeAllListeners();
                layer.removeChildren();
                layer.parent && layer.parent.removeChild(layer);
            }
            _super.prototype.destroy.call(this);
        };
        return BaseScene;
    }(fw.BasePanel));
    fw.BaseScene = BaseScene;
})(fw || (fw = {}));
var app;
(function (app) {
    var GameAPIInstance = (function () {
        function GameAPIInstance() {
            this.gameId = 112;
            this.gameModelId = 9;
            this.gameName = "fishing";
            this.version = "1.0.0";
            fw.Config = app.Config;
            window.gameId = this.gameId;
            window.gameModelId = this.gameModelId;
            window.gameName = this.gameName;
        }
        GameAPIInstance.prototype.init = function (stageWidth, stageHeight, containerId, data) {
            if (stageWidth === void 0) { stageWidth = 1440; }
            if (stageHeight === void 0) { stageHeight = 810; }
            if (this.director) {
                return false;
            }
            else {
                this.director = new app.Fishing(stageWidth, stageHeight, containerId, data);
                return true;
            }
        };
        GameAPIInstance.prototype.setData = function (data) {
            this.director.setData(data);
        };
        GameAPIInstance.prototype.setCurrTime = function (time) {
            this.director && this.director.setCurrTime(time);
        };
        GameAPIInstance.prototype.setDebug = function (value) {
            fw.Config.isDebug = value;
        };
        GameAPIInstance.prototype.resize = function (stageWidth, stageHeight) {
            this.director && this.director.resize(stageWidth, stageHeight);
            return this.director ? true : false;
        };
        GameAPIInstance.prototype.command = function (type, jsonData, callback) { };
        GameAPIInstance.prototype.destroy = function (force) {
            if (this.director) {
                this.director.destroy();
                this.director = undefined;
                return true;
            }
            else {
                return false;
            }
        };
        return GameAPIInstance;
    }());
    app.GameAPI = new GameAPIInstance();
})(app || (app = {}));
var app;
(function (app) {
    var Fishing = (function (_super) {
        __extends(Fishing, _super);
        function Fishing(stageWidth, stageHeight, containerId, data) {
            var _this = this;
            var fps = 24;
            fw.Config.quality = data.level;
            switch (data.forceSoundEngine) {
                case 1:
                    fw.SoundManager.engine = new fw.HTMLAudioEngine();
                    break;
                case 2:
                    fw.SoundManager.engine = new fw.WebAudioEngine();
                    break;
                case 3:
                    fw.SoundManager.engine = new fw.NativeAudioEngine();
                    break;
            }
            if (data.level <= 0) {
                data.level = 1;
                fps = 6;
            }
            app.FishingModel.quiet = false;
            _this = _super.call(this, stageWidth, stageHeight, false, containerId, data.level, fps) || this;
            _this.reportCounter = 0;
            _this.reportStamp = fw.getTimer();
            app.FishingModel.sensorsReport("game_init", {});
            fw.GResponser.initialize();
            fw.GResponser.addListener("gamerunning", _this.onCheckGameRunning, _this);
            fw.GResponser.addListener("destroy", _this.destroy, _this);
            _this.updateUserInfo();
            return _this;
        }
        Fishing.prototype.onCheckGameRunning = function (data) {
            var status = app.FishingModel.cacheSyncInfo ? app.FishingModel.cacheSyncInfo.status : 1;
            if (app.FishingModel.mode == app.RoleType.REVIEW || app.FishingModel.mode == app.RoleType.PREVIEW)
                status = 0;
            fw.GResponser.postMessage("gamerunning", { status: status });
        };
        Fishing.prototype.updateUserInfo = function () {
            return __awaiter(this, void 0, void 0, function () {
                var role, studentsInfo, _i, studentsInfo_1, info, myinfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, fw.GResponser.asyncPostMessage("role", {}, "role")];
                        case 1:
                            role = _a.sent();
                            switch (role) {
                                case "student":
                                    app.FishingModel.mode = app.RoleType.STUDENT;
                                    break;
                                case "teacher":
                                    app.FishingModel.mode = app.RoleType.TEACHER;
                                    break;
                                case "observer":
                                    app.FishingModel.mode = app.RoleType.OBSERVER;
                                    break;
                                case "record":
                                    app.FishingModel.mode = app.RoleType.RECORDER;
                                    break;
                                case "preview":
                                    app.FishingModel.mode = app.RoleType.PREVIEW;
                                    break;
                                case "admin":
                                    app.FishingModel.mode = app.RoleType.ADMIN;
                                    break;
                                default:
                                    app.FishingModel.mode = app.RoleType.REVIEW;
                                    break;
                            }
                            fw.Log.log("Game Mode: " + app.FishingModel.mode);
                            if ((app.FishingModel.mode == app.RoleType.REVIEW || app.FishingModel.mode == app.RoleType.PREVIEW) && fw.getDeviceType() == fw.DeviceType.iPad && !fw.SoundManager.engine) {
                                if (fw.getDeviceVer()[0] >= 9) {
                                    fw.SoundManager.engine = new fw.WebAudioEngine();
                                }
                                else {
                                    fw.SoundManager.engine = new fw.HTMLAudioEngine();
                                }
                            }
                            return [4, fw.GResponser.asyncPostMessage("studentsinfo", {}, "studentsinfo")];
                        case 2:
                            studentsInfo = _a.sent();
                            app.FishingModel.studentsInfo = [];
                            for (_i = 0, studentsInfo_1 = studentsInfo; _i < studentsInfo_1.length; _i++) {
                                info = studentsInfo_1[_i];
                                if (info.index == -1)
                                    continue;
                                app.FishingModel.studentsInfo.push({
                                    uid: info.studentId || "",
                                    name: info.studentName || "",
                                    index: info.index || 0
                                });
                            }
                            app.FishingModel.studentsInfo.sort(function (a, b) {
                                if (a.index < b.index)
                                    return -1;
                                else if (a.index > b.index)
                                    return 1;
                                else
                                    return 0;
                            });
                            if (!(app.FishingModel.mode == app.RoleType.STUDENT)) return [3, 4];
                            return [4, fw.GResponser.asyncPostMessage("myinfo", {}, "myinfo")];
                        case 3:
                            myinfo = _a.sent();
                            app.FishingModel.myUid = myinfo.uid;
                            app.FishingModel.myName = myinfo.name;
                            _a.label = 4;
                        case 4:
                            this.updateGameInfo();
                            return [2];
                    }
                });
            });
        };
        Fishing.prototype.updateGameInfo = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pageDetail, syncInfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, fw.GResponser.asyncPostMessage("init", {}, "pageDetail")];
                        case 1:
                            pageDetail = _a.sent();
                            pageDetail.gameId && (app.GameAPI.gameId = pageDetail.gameId);
                            pageDetail.gameMode && (app.GameAPI.gameModelId = pageDetail.gameMode);
                            if (!(app.FishingModel.mode == app.RoleType.STUDENT || app.FishingModel.mode == app.RoleType.TEACHER || app.FishingModel.mode == app.RoleType.OBSERVER)) return [3, 3];
                            return [4, fw.GResponser.asyncPostMessage("stageGameSync", { type: app.GameAPI.gameName }, "stageGameSync")];
                        case 2:
                            syncInfo = _a.sent();
                            if (syncInfo.type != app.GameAPI.gameName) {
                                fw.Log.warn("receive wrong game type message!!!");
                                return [2];
                            }
                            fw.GResponser.postMessage("studentmute", syncInfo.status == 1);
                            app.FishingModel.cacheSyncInfo = syncInfo;
                            app.FishingModel.clientTimeDist = Date.now() - syncInfo.currTime;
                            if (syncInfo.status == 1) {
                                if (syncInfo.currentTime - syncInfo.startTime > app.FishingModel.stageTime * 4) {
                                    syncInfo.status = 2;
                                }
                                else {
                                    this.pastTime = (syncInfo.currentTime - syncInfo.startTime) / 1000;
                                }
                            }
                            app.FishingModel.scoreBars && app.FishingModel.scoreBars.updateScores();
                            _a.label = 3;
                        case 3:
                            this.setData(pageDetail);
                            return [2];
                    }
                });
            });
        };
        Fishing.prototype.setData = function (value) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, url, resources;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            app.FishingModel.randomSeed = value.randomId % 100;
                            app.FishingModel.gameConfig = value.list;
                            _i = 0, _a = app.FishingModel.mapAudios;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3, 4];
                            url = _a[_i];
                            return [4, fw.SoundManager.addSound(url.name, url.url, url.url.indexOf("music") > -1)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3, 1];
                        case 4:
                            resources = [
                                "img/fishing.json",
                                "img/fishing_bg.png",
                                "img/fishing_foreground.png",
                                "img/fishing_wave.png",
                                "img/fishing_spindrift1.png",
                                "img/fishing_spindrift2.png",
                                "img/fishing_spindrift3.png"
                            ];
                            if (fw.getDeviceType() == fw.DeviceType.iPad) {
                                resources.push("img/bbubbles_submarine_ipad.png");
                            }
                            else {
                                resources.push("img/bbubbles_submarine.png");
                            }
                            fw.SceneManager.setCurrentScene(app.FishingScene, value, fw.ResizeAlign.SCALE_FILL, resources, false);
                            this.resize(this.stageWidth, this.stageHeight);
                            if (this.pastTime) {
                                fw.SceneManager.current().setCurrTime(this.pastTime);
                                app.FishingModel.sensorsReport("game_start", {
                                    start_type: "ingame",
                                    start_time: (app.FishingModel.cacheSyncInfo ? app.FishingModel.cacheSyncInfo.currTime : Date.now()) - app.FishingModel.clientTimeDist
                                });
                                this.pastTime = null;
                            }
                            fw.GResponser.addListener("stageGameSwitch", this.onGameSwitch, this);
                            return [2];
                    }
                });
            });
        };
        Fishing.prototype.onGameSwitch = function (data) {
            if (app.FishingModel.mode == app.RoleType.RECORDER) {
                app.FishingModel.cacheSyncInfo = {
                    type: app.GameAPI.gameName,
                    status: 0,
                    currTime: Date.now()
                };
                data.currTime = Date.now();
            }
            if (data.type != app.GameAPI.gameName || !app.FishingModel.cacheSyncInfo)
                return;
            app.FishingModel.cacheSyncInfo.status = data.status;
            fw.GResponser.postMessage("studentmute", data.status == 1);
            fw.GResponser.postMessage("hideGuideLoad", { status: 1 });
            if (data.status == 1) {
                app.FishingModel.cacheSyncInfo.startTime = data.currTime;
                fw.Log.log("game start time: " + new Date(app.FishingModel.cacheSyncInfo.startTime).toString());
                fw.PanelManager.isOpen(app.FishingEnding) &&
                    fw.PanelManager.hidePanel(app.FishingEnding);
                window.hideEffectTrophy();
                var panelEntrance = fw.PanelManager.getPanel(app.FishingEntrance);
                if (panelEntrance.isOpen) {
                    panelEntrance.hide();
                }
                else {
                    var scene = fw.SceneManager.current();
                    scene.isOpen && scene.onOpenIntro();
                }
                app.FishingModel.sensorsReport("game_start", {
                    start_type: "normal",
                    start_time: app.FishingModel.cacheSyncInfo.startTime - app.FishingModel.clientTimeDist
                });
            }
            else {
                app.FishingModel.cacheSyncInfo.startTime = null;
                app.FishingModel.quiet = true;
                fw.PanelManager.hideAllPanel();
                app.FishingModel.quiet = false;
                var scene = fw.SceneManager.current();
                scene.isOpen && scene.onOpenEnding();
            }
        };
        Fishing.prototype.setCurrTime = function (time) {
            app.FishingModel.cacheSyncInfo = { startTime: Date.now() - time * 1000 };
            var currScnee = fw.SceneManager.current();
            if (currScnee && currScnee instanceof app.FishingScene) {
                currScnee.setCurrTime(time);
            }
            else {
                this.pastTime = time;
            }
        };
        Fishing.prototype.render = function () {
            _super.prototype.render.call(this);
            this.reportCounter++;
            var now = fw.getTimer();
            if (now - this.reportStamp > 3000) {
                app.FishingModel.sensorsReport("game_fps", { fps: (this.reportCounter / 3).toFixed(2) });
                this.reportStamp = now;
                this.reportCounter = 0;
            }
        };
        Fishing.prototype.destroy = function () {
            app.FishingModel.quiet = false;
            fw.SoundManager.stopSound("fishing_bg_music");
            fw.GResponser.destroy();
            app.FishingModel.gameConfig = null;
            _super.prototype.destroy.call(this);
        };
        return Fishing;
    }(fw.GameDirector));
    app.Fishing = Fishing;
})(app || (app = {}));
var app;
(function (app) {
    var FishingEnding = (function (_super) {
        __extends(FishingEnding, _super);
        function FishingEnding() {
            return _super.call(this, 435, 270) || this;
        }
        FishingEnding.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            var bg = this.resource.createSprite("fishing_panel_bg.png", 0, 0, true);
            bg.width = 435;
            bg.height = 270;
            this.addChild(bg);
            var msg = app.FishingModel.mode == 1 ? "What’s next? Let’s have a look!" : "Click to move on to the next slide";
            this.labelMsg = this.resource.createLabel(msg, 218, 100, 20, 0x7b452b, "center");
            this.labelMsg.style.wordWrap = true;
            this.labelMsg.style.wordWrapWidth = 435;
            this.addChild(this.labelMsg);
        };
        FishingEnding.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            if (app.FishingModel.mode != 1) {
                this.btnNext = this.resource.createButton("fishing_btn_start_up.png", 18, 150, this.onNext, this);
                this.btnNext.width = 300;
                this.btnNext.height = 60;
                this.addChild(this.btnNext);
            }
        };
        FishingEnding.prototype.onNext = function () {
            fw.GResponser.postMessage("nextslide");
        };
        FishingEnding.prototype.onClose = function () {
            this.btnNext && this.btnNext.destroy();
            !app.FishingModel.quiet && this.mData && this.mData.func && this.mData.func.call(this.mData.this);
            _super.prototype.onClose.call(this);
        };
        return FishingEnding;
    }(fw.BasePanel));
    app.FishingEnding = FishingEnding;
})(app || (app = {}));
var app;
(function (app) {
    var FishingEntrance = (function (_super) {
        __extends(FishingEntrance, _super);
        function FishingEntrance() {
            return _super.call(this, 435, 270) || this;
        }
        FishingEntrance.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            var bg = this.resource.createSprite("fishing_panel_bg.png", 0, 0, true);
            bg.width = 435;
            bg.height = 270;
            this.addChild(bg);
            this.labelMsg = this.resource.createLabel("Click to start the word game", 218, 100, 20, 0x7b452b, "center");
            this.labelMsg.style.wordWrap = true;
            this.labelMsg.style.wordWrapWidth = 435;
            this.addChild(this.labelMsg);
        };
        FishingEntrance.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            this.btnStart = this.resource.createButton("fishing_btn_start_up.png", 18, 150, this.onStart, this);
            this.btnStart.width = 300;
            this.btnStart.height = 60;
            this.addChild(this.btnStart);
        };
        FishingEntrance.prototype.onStart = function () {
            if (app.FishingModel.mode == app.RoleType.TEACHER) {
                var msgBody = { type: app.GameAPI.gameName, status: 1 };
                fw.GResponser.postMessage("stageGameSwitch", msgBody);
            }
            else if (app.FishingModel.mode == app.RoleType.REVIEW || app.FishingModel.mode == app.RoleType.PREVIEW) {
                app.FishingModel.cacheSyncInfo = {
                    type: app.GameAPI.gameName,
                    status: 0
                };
                fw.GResponser.emit("stageGameSwitch", {
                    type: app.GameAPI.gameName,
                    status: 1,
                    currTime: Date.now()
                });
            }
            else if (app.FishingModel.mode = app.RoleType.RECORDER) {
                fw.GResponser.emit("stageGameSwitch", {
                    type: app.GameAPI.gameName,
                    status: 1,
                });
            }
        };
        FishingEntrance.prototype.onClose = function () {
            this.btnStart.destroy();
            !app.FishingModel.quiet && this.mData && this.mData.func && this.mData.func.call(this.mData.this);
            _super.prototype.onClose.call(this);
        };
        return FishingEntrance;
    }(fw.BasePanel));
    app.FishingEntrance = FishingEntrance;
})(app || (app = {}));
var app;
(function (app) {
    var FishingHook = (function (_super) {
        __extends(FishingHook, _super);
        function FishingHook() {
            var _this = _super.call(this) || this;
            _this.length = 100;
            _this.imgHookLength = 65;
            _this.cable = new PIXI.Graphics();
            _this.cable.clear();
            _this.cable.beginFill(0x33334c);
            _this.cable.drawRect(0, 0, _this.length - _this.imgHookLength, 6);
            _this.cable.endFill();
            _this.addChild(_this.cable);
            var resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            _this.imgHook = resource.createSprite("fishing_hock.png");
            _this.imgHook.rotation = -Math.PI / 2;
            _this.imgHook.x = _this.length - _this.imgHookLength;
            _this.imgHook.y = 12;
            _this.addChild(_this.imgHook);
            return _this;
        }
        Object.defineProperty(FishingHook.prototype, "hookLength", {
            get: function () {
                return this.length;
            },
            set: function (value) {
                this.length = Math.max(value, this.imgHookLength);
                this.cable.width = this.length - this.imgHookLength;
                this.imgHook.x = this.length - this.imgHookLength;
                var globalPos = this.getGlobalPosition();
                globalPos.x *= fw.SceneManager.current().designWidth / fw.Config.stageWidth;
                globalPos.y *= fw.SceneManager.current().designHeight / fw.Config.stageHeight;
                var globalRotation = Math.PI / 2 - this.rotation;
                if (this.fish) {
                    this.fish.x = globalPos.x + this.length * Math.sin(globalRotation);
                    this.fish.y = globalPos.y + this.length * Math.cos(globalRotation);
                }
            },
            enumerable: true,
            configurable: true
        });
        FishingHook.prototype.hangingFish = function (fish) {
            this.fish = fish;
        };
        FishingHook.prototype.destroy = function (options) {
            _super.prototype.destroy.call(this, options);
        };
        return FishingHook;
    }(PIXI.Container));
    app.FishingHook = FishingHook;
})(app || (app = {}));
var app;
(function (app) {
    var FishingIns = (function (_super) {
        __extends(FishingIns, _super);
        function FishingIns() {
            var _this = _super.call(this) || this;
            _this.lifeLength = 1440;
            _this.swingCycle = 100;
            _this.interactive = true;
            _this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            _this.fishImg = new PIXI.Sprite();
            _this.fishImg.anchor.x = _this.fishImg.anchor.y = 0.5;
            _this.addChild(_this.fishImg);
            _this.wordImg = new PIXI.Sprite();
            _this.wordImg.anchor.x = _this.wordImg.anchor.y = 0.5;
            _this.addChild(_this.wordImg);
            return _this;
        }
        FishingIns.create = function (par, fishId, posY) {
            var ins = app.FishingModel.fishingInsDeadPool.shift();
            !ins && (ins = new FishingIns());
            ins.activate(fishId, Math.floor(Math.random() * 3), 10667 + Math.random() * 1000, posY);
            app.FishingModel.fishingInsActivatePool.push(ins);
            par.addChild(ins);
            return ins;
        };
        FishingIns.prototype.activate = function (fishId, pathId, lifeTime, posY) {
            this.fishId = fishId;
            this.status = 0;
            var fishModelId = Math.floor(this.fishId / 100);
            this.fishImg.texture = this.resource.getTexture("fishing_fish" + fishModelId + ".png");
            this.lifeTime = lifeTime;
            this.swingCycle = this.lifeLength * (0.8 + Math.random() + 0.5);
            this.posY = posY;
            if (app.FishingModel.mode == 0 || app.FishingModel.mode == 1) {
                this.addListener("pointerup", this.onTouchFish, this);
            }
            this.clock = fw.TimerManager.addClock(this.fishId, this.lifeTime / 1000, 10);
            this.clock.registCallBack(this, this.willDie, this.update);
        };
        FishingIns.prototype.update = function (progress) {
            if (this.status != 0)
                return;
            this.x = (this.lifeLength + 100) * (1 - progress) - 100;
            this.y = this.posY + Math.sin(this.lifeLength * 2 * progress * (2 * Math.PI / this.swingCycle)) * 60;
        };
        FishingIns.prototype.onTouchFish = function (evt) {
            if (!this.dataItem || this.status != 0)
                return;
            if (this.dataItem.trueOpt) {
                this.playRight();
            }
            else {
                this.playWrong();
            }
            fw.SoundManager.playSound("fishing_touch");
        };
        FishingIns.prototype.playWrong = function () {
            if (this.status != 0)
                return;
            this.status = 2;
            fw.GResponser.emit("miss", { obj: this, x: this.x, y: this.y });
        };
        FishingIns.prototype.playWrongComplete = function () {
            console.log("playWrongComplete");
            this.status = 0;
            fw.SoundManager.playSound("fishing_wrong");
        };
        FishingIns.prototype.playRight = function () {
            if (this.status != 0)
                return;
            this.status = 1;
            fw.GResponser.emit("bomb", { obj: this, x: this.x, y: this.y });
            app.FishingModel.gotFishCount++;
        };
        FishingIns.prototype.playRightComplete = function () {
            console.log("playRightComplete");
            fw.SoundManager.playSound("fishing_right");
            if (this.dataItem && this.dataItem.audioUrl) {
                var audioFileName = fw.cutFilename(this.dataItem.audioUrl);
                fw.SoundManager.playSound(audioFileName, "../../" + this.dataItem.audioUrl);
            }
            this.status = 0;
            this.willDie();
        };
        FishingIns.prototype.fishGoHome = function () {
            if (this.status == -1 || this.status == 1)
                return;
            this.status = 3;
            fw.Tween.get(this).to({ x: -100 }, (this.x + 100) * 2).call(this.willDie, this);
        };
        FishingIns.prototype.willDie = function () {
            if (this.status == 1 || this.status == -1)
                return;
            this.destroy();
        };
        FishingIns.prototype.setData = function (value) {
            var _this = this;
            this.dataItem = value;
            fw.ResourceManager.ins.loadByUrl("../../" + value.imageUrl, function (res) {
                _this.wordImg.texture = res;
            }, this);
        };
        FishingIns.prototype.destroy = function () {
            if (this.status == -1)
                return;
            this.status = -1;
            this.removeAllListeners();
            if (this.clock) {
                this.clock.removeCallBack(this);
                fw.TimerManager.removeClock(this.fishId);
                this.clock = undefined;
            }
            this.fishImg.texture = null;
            this.wordImg.texture = null;
            fw.DisplayUtil.removeFromParent(this);
            this.dataItem = null;
            var actIndex = app.FishingModel.fishingInsActivatePool.indexOf(this);
            if (actIndex > -1) {
                app.FishingModel.fishingInsActivatePool.splice(actIndex, 1);
            }
            app.FishingModel.fishingInsDeadPool.push(this);
        };
        return FishingIns;
    }(PIXI.Container));
    app.FishingIns = FishingIns;
})(app || (app = {}));
var app;
(function (app) {
    var FishingIntro = (function (_super) {
        __extends(FishingIntro, _super);
        function FishingIntro() {
            return _super.call(this, 1080, 810) || this;
        }
        FishingIntro.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        FishingIntro.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            this.submarine = this.resource.createAnimatedSprite("yellow_submarine", 540, 405, true);
            this.submarine.anchor.x = this.submarine.anchor.y = 0.5;
            this.submarine.play();
            this.addChild(this.submarine);
            this.clock = fw.TimerManager.addClock(FishingIntro.ClockId, app.FishingModel.introTime / 1000, 10);
            this.clock.registCallBack(this, this.onComplete, this.onProgress);
        };
        FishingIntro.prototype.onProgress = function (progress) {
            var sx = this.designWidth * progress;
            var sy = this.designHeight / 2;
            sy = sy + Math.sin(360 * progress * (Math.PI / 180)) * 100;
            this.submarine.x = sx;
            this.submarine.y = sy;
        };
        FishingIntro.prototype.onComplete = function () {
            this.hide(true);
        };
        FishingIntro.prototype.onClose = function () {
            this.clock.removeCallBack(this);
            fw.TimerManager.stop(FishingIntro.ClockId);
            this.clock = null;
            this.submarine.stop();
            this.submarine.destroy();
            fw.ResourceManager.ins.destroyResource("yellow_submarine.json");
            !app.FishingModel.quiet && this.mData && this.mData.func && this.mData.func.call(this.mData.this);
            _super.prototype.onClose.call(this);
        };
        FishingIntro.ClockId = 11;
        return FishingIntro;
    }(fw.BasePanel));
    app.FishingIntro = FishingIntro;
})(app || (app = {}));
var app;
(function (app) {
    var RoleType;
    (function (RoleType) {
        RoleType[RoleType["REVIEW"] = 0] = "REVIEW";
        RoleType[RoleType["STUDENT"] = 1] = "STUDENT";
        RoleType[RoleType["TEACHER"] = 2] = "TEACHER";
        RoleType[RoleType["OBSERVER"] = 3] = "OBSERVER";
        RoleType[RoleType["RECORDER"] = 4] = "RECORDER";
        RoleType[RoleType["PREVIEW"] = 5] = "PREVIEW";
        RoleType[RoleType["ADMIN"] = 6] = "ADMIN";
    })(RoleType = app.RoleType || (app.RoleType = {}));
})(app || (app = {}));
(function (app) {
    var FishingModel;
    (function (FishingModel) {
        FishingModel.mode = 0;
        FishingModel.myUid = "";
        FishingModel.myName = "";
        FishingModel.quiet = false;
        FishingModel.fishGapTime = 1500;
        FishingModel.stageTime = 15000;
        FishingModel.introTime = 0;
        FishingModel.gotFishCount = 0;
        FishingModel.randomSeed = 12;
        FishingModel.fishingInsDeadPool = [];
        FishingModel.fishingInsActivatePool = [];
        FishingModel.mapAudios = [
            { name: "fishing_bg_music", url: "sounds/fishing_bg_music.mp3" },
            { name: "fishing_excellent", url: "sounds/fishing_excellent.mp3" },
            { name: "fishing_gold_sound", url: "sounds/fishing_gold_sound.mp3" },
            { name: "fishing_good_job", url: "sounds/fishing_good_job.mp3" },
            { name: "fishing_nice_try", url: "sounds/fishing_nice_try.mp3" },
            { name: "fishing_right", url: "sounds/fishing_right.mp3" },
            { name: "fishing_succeed", url: "sounds/fishing_succeed.mp3" },
            { name: "fishing_touch", url: "sounds/fishing_touch.mp3" },
            { name: "fishing_wrong", url: "sounds/fishing_wrong.mp3" },
        ];
        function getPhases() {
            var runningTime = Date.now() - FishingModel.cacheSyncInfo.startTime - FishingModel.introTime;
            if (runningTime < 0)
                return 0;
            var stageId = Math.ceil(runningTime / FishingModel.stageTime);
            if (stageId >= 5)
                return 50;
            var sep;
            if (runningTime % FishingModel.stageTime <= 100)
                sep = 0;
            else if (runningTime % FishingModel.stageTime <= 12000)
                sep = 1;
            else
                sep = 2;
            return stageId * 10 + sep;
        }
        FishingModel.getPhases = getPhases;
        function getOriginStageData(value) {
            if (!FishingModel.gameConfig || FishingModel.gameConfig.length == 0)
                return null;
            for (var _i = 0, gameConfig_1 = FishingModel.gameConfig; _i < gameConfig_1.length; _i++) {
                var data = gameConfig_1[_i];
                if (data.id == value) {
                    return data;
                }
            }
            return null;
        }
        FishingModel.getOriginStageData = getOriginStageData;
        function generateTrueData(originStage) {
            return {
                imageUrl: originStage.beforeImageUrl,
                audioUrl: originStage.audioUrl,
                trueOpt: true
            };
        }
        FishingModel.generateTrueData = generateTrueData;
        function generateFalseData(originStage) {
            return {
                imageUrl: originStage.errorsUrl[Math.floor(originStage.errorsUrl.length * Math.random())],
                audioUrl: originStage.audioUrl,
                trueOpt: false
            };
        }
        FishingModel.generateFalseData = generateFalseData;
        function generateStageData(value) {
            var originData = getOriginStageData(value);
            if (!originData)
                return null;
            var list = [];
            for (var i = 0; i < 6; i++) {
                list.push(generateTrueData(originData));
            }
            var insertIndex = 0;
            for (var i = 0; i < 4; i++) {
                insertIndex += fw.MathUtils.seedRandom(value * 13) * list.length;
                list.splice(Math.round(insertIndex) % list.length, 0, generateFalseData(originData));
            }
            return {
                id: originData.id,
                audioUrl: originData.audioUrl,
                imageUrl: originData.rightUrl,
                list: list
            };
        }
        FishingModel.generateStageData = generateStageData;
        function sensorsReport(type, data) {
            if (FishingModel.mode != app.RoleType.STUDENT && FishingModel.mode != app.RoleType.TEACHER)
                return;
            var body = { event_name: type, data: data };
            body.data.game_id = app.GameAPI.gameId;
            body.data.game_model_id = app.GameAPI.gameModelId;
            body.data.game_name = app.GameAPI.gameName;
            fw.GResponser.postMessage("sensors", body);
        }
        FishingModel.sensorsReport = sensorsReport;
        function addSwing(target, time) {
            if (fw.Config.quality <= 1)
                return;
            fw.Tween.removeTweens(target);
            fw.Tween.removeTweens(target.scale);
            target.rotation = -1 / 20 * Math.PI;
            target.scale.x = 1.0;
            fw.Tween.get(target).to({ rotation: 1 / 20 * Math.PI }, time)
                .to({ rotation: -1 / 20 * Math.PI }, time);
            fw.Tween.get(target.scale).to({ x: 0.8 }, time)
                .to({ x: 1.0 }, time)
                .call(addSwing, null, [target, time]);
        }
        FishingModel.addSwing = addSwing;
        function clearSwing(target) {
            fw.Tween.removeTweens(target);
            fw.Tween.removeTweens(target.scale);
            target.scale.x = 1;
            target.rotation = 0;
        }
        FishingModel.clearSwing = clearSwing;
        FishingModel.fishPaths = [
            { x: [0, 126, 300, 774, 1104, 1308, 1440], y: [426, 377, 390, 531, 409, 390, 424] },
            { x: [0, 237, 521, 1156, 1439], y: [342, 421, 448, 597, 340] },
            { x: [0, 59, 284, 502, 816, 1002, 1255, 1440], y: [343, 509, 566, 458, 439, 525, 610, 366] },
        ];
    })(FishingModel = app.FishingModel || (app.FishingModel = {}));
})(app || (app = {}));
var app;
(function (app) {
    var FishingSample = (function (_super) {
        __extends(FishingSample, _super);
        function FishingSample() {
            var _this = _super.call(this, 460, 376) || this;
            _this.originPos = { x: app.Config.stageWidth / 2, y: app.Config.stageHeight / 2 };
            _this.hasCallHide = false;
            return _this;
        }
        FishingSample.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            var bg = this.resource.createSprite("bbubbles_sample_bg.png", 0, 0, true);
            this.addChild(bg);
            this.imgWord = this.resource.createSprite("", 230, 138);
            this.imgWord.anchor.x = this.imgWord.anchor.y = 0.5;
            this.addChild(this.imgWord);
        };
        FishingSample.prototype.onOpen = function () {
            var _this = this;
            _super.prototype.onOpen.call(this);
            this.originPos = { x: this.x, y: this.y };
            if (this.hasCallHide) {
                this.willHide();
                return;
            }
            if (fw.Config.isDebug) {
                this.testLabel = this.resource.createLabel("", 0, 0, 20, 0xff0000, "left");
                this.addChild(this.testLabel);
            }
            if (!this.mData || !this.mData.list) {
                this.testLabel && (this.testLabel.text = "No Panel Data");
                return;
            }
            for (var _i = 0, _a = this.mData.list; _i < _a.length; _i++) {
                var wordData = _a[_i];
                if (wordData.trueOpt) {
                    this.testLabel && (this.testLabel.text = "Loading Image");
                    fw.ResourceManager.ins.loadByUrl("../../" + wordData.imageUrl, function (res) {
                        _this.testLabel && (_this.testLabel.text = "Image Loaded");
                        _this.imgWord.texture = res;
                    }, this);
                    break;
                }
            }
            this.fadeIn();
        };
        FishingSample.prototype.fadeIn = function () {
            this.scaleX = this.scaleY = 0.3;
            this.x = this.originPos.x + this.designWidth / 2 * 0.7;
            this.y = this.originPos.y + this.designHeight / 2 * 0.7;
            fw.Tween.get(this).to({ x: this.originPos.x, y: this.originPos.y, scaleX: 1.0, scaleY: 1.0 }, 600, fw.Ease.backOut).call(this.openComplete, this);
        };
        FishingSample.prototype.openComplete = function () {
        };
        FishingSample.prototype.willHide = function () {
            if (!this.isOpen) {
                this.hasCallHide = true;
                return;
            }
            fw.Tween.removeTweens(this);
            this.scaleX = this.scaleY = 1.0;
            this.x = this.originPos.x;
            this.y = this.originPos.y;
            fw.Tween.get(this).to({
                x: this.originPos.x + this.designWidth / 2 * 0.7,
                y: this.originPos.y + this.designHeight / 2 * 0.7,
                scaleX: 0.3, scaleY: 0.3
            }, 200)
                .call(this.hide, this);
        };
        FishingSample.prototype.onClose = function () {
            fw.Tween.removeTweens(this);
            this.imgWord && (this.imgWord.texture = null);
            this.hasCallHide = false;
            if (this.testLabel) {
                fw.DisplayUtil.removeFromParent(this.testLabel);
                this.testLabel = null;
            }
            _super.prototype.onClose.call(this);
        };
        Object.defineProperty(FishingSample.prototype, "scaleX", {
            get: function () { return this.scale.x; },
            set: function (value) { this.scale.x = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FishingSample.prototype, "scaleY", {
            get: function () { return this.scale.y; },
            set: function (value) { this.scale.y = value; },
            enumerable: true,
            configurable: true
        });
        return FishingSample;
    }(fw.BasePanel));
    app.FishingSample = FishingSample;
})(app || (app = {}));
var app;
(function (app) {
    var FishingScene = (function (_super) {
        __extends(FishingScene, _super);
        function FishingScene() {
            return _super.call(this, 1440, 810) || this;
        }
        FishingScene.prototype.initialize = function () {
            var _this = this;
            fw.ResizeManager.initialize(1080, 810);
            this.initLayers();
            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            this.background = fw.ResourceManager.ins.createSprite("fishing_bg.png");
            var bgLayer = this.getLayer(fw.DefaultLayers.BACKGROUND_LAYER);
            bgLayer.addChild(this.background);
            this.elements = [];
            var createElements = function (name, x, y, w, h, globalRes) {
                if (globalRes === void 0) { globalRes = false; }
                var ele = globalRes
                    ? fw.ResourceManager.ins.createSprite(name, x, y)
                    : _this.resource.createSprite(name, x, y);
                ele.width = w;
                ele.height = h;
                bgLayer.addChild(ele);
                _this.elements.push(ele);
                return ele;
            };
            var grass = createElements("fishing_grass5.png", 102, 659, 151, 254);
            grass.anchor.x = 0.5;
            grass.anchor.y = 1;
            app.FishingModel.addSwing(grass, 5000);
            createElements("fishing_grass6.png", 203, 421, 129, 274);
            createElements("fishing_grass3.png", 379, 652, 138, 137);
            createElements("fishing_grass7.png", 873, 659, 64, 144);
            createElements("fishing_grass8.png", 1144, 449, 179, 361);
            createElements("fishing_grass4.png", 9, 527, 406, 230);
            grass = createElements("fishing_grass2.png", 1130, 810, 109, 193);
            grass.anchor.x = 0.25;
            grass.anchor.y = 1;
            app.FishingModel.addSwing(grass, 4000);
            createElements("fishing_grass1.png", 1206, 652, 192, 158);
            createElements("fishing_bg_bottom.png", 0, 659, 1096, 151);
        };
        FishingScene.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            fw.SoundManager.playSound("fishing_bg_music", "", true, true);
            this.updateStage(this.currTime);
            fw.GResponser.postMessage("sceneenabled", { status: 1 });
            if (app.FishingModel.mode != 1) {
                fw.GResponser.postMessage("hideGuideLoad", { status: 1 });
            }
        };
        FishingScene.prototype.setCurrTime = function (time) {
            if (this.isOpen) {
                this.updateStage(time);
            }
            else {
                this.currTime = time;
            }
        };
        FishingScene.prototype.updateStage = function (currTime) {
            if (currTime) {
                if (app.FishingModel.mode != 2) {
                    fw.GResponser.postMessage("hideGuideLoad", { status: 1 });
                }
                app.FishingModel.quiet = true;
                fw.PanelManager.hideAllPanel();
                app.FishingModel.quiet = false;
                var panel = fw.PanelManager.showPanel(app.FishingStage, { func: this.onOpenEnding, this: this }, fw.ResizeAlign.SCALE_CLIP, this.getLayer(fw.DefaultLayers.INTERACTIVE_LAYER), []);
                panel.setCurrTime(currTime);
                this.currTime = null;
                return;
            }
            if (app.FishingModel.mode == 0 || app.FishingModel.mode == 2 || app.FishingModel.mode == 3 || app.FishingModel.mode == 4) {
                fw.PanelManager.showPanel(app.FishingEntrance, { func: this.onOpenIntro, this: this }, fw.ResizeAlign.CENTER, this.getLayer(fw.DefaultLayers.PANEL_LAYER), [], true);
            }
            else {
                app.FishingModel.cacheSyncInfo && app.FishingModel.cacheSyncInfo.status == 1 && this.onOpenIntro();
            }
        };
        FishingScene.prototype.onOpenIntro = function () {
            this.onOpenStage();
        };
        FishingScene.prototype.onOpenStage = function () {
            fw.PanelManager.showPanel(app.FishingStage, { func: this.onOpenEnding, this: this }, fw.ResizeAlign.SCALE_CLIP, this.getLayer(fw.DefaultLayers.INTERACTIVE_LAYER), []);
        };
        FishingScene.prototype.onOpenEnding = function () {
            var self = this;
            if (app.FishingModel.mode != 1) {
                fw.PanelManager.showPanel(app.FishingEnding, {}, fw.ResizeAlign.CENTER, self.getLayer(fw.DefaultLayers.PANEL_LAYER), [], true);
            }
        };
        FishingScene.prototype.setData = function (value) {
            this.mData = value;
        };
        FishingScene.prototype.onClose = function () {
            fw.GResponser.postMessage("sceneenabled", { status: 0 });
            fw.SoundManager.stopSound("fishing_bg_music");
            fw.PanelManager.hideAllPanel();
            _super.prototype.onClose.call(this);
        };
        FishingScene.prototype.destroy = function () {
            if (app.FishingModel.scoreBars) {
                app.FishingModel.scoreBars.destroy();
                app.FishingModel.scoreBars = undefined;
            }
            for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
                var grass = _a[_i];
                app.FishingModel.clearSwing(grass);
                fw.DisplayUtil.removeFromParent(grass);
                grass.destroy();
            }
            fw.DisplayUtil.removeFromParent(this.background);
            this.background && this.background.destroy();
            for (var _b = 0, _c = app.FishingModel.fishingInsActivatePool; _b < _c.length; _b++) {
                var ins = _c[_b];
                ins.destroy();
            }
            app.FishingModel.fishingInsActivatePool = [];
            app.FishingModel.fishingInsDeadPool = [];
            fw.ResourceManager.ins.destroyResource("fishing.json");
            fw.ResourceManager.ins.destroyResource("bbubbles_submarine.png");
            fw.ResourceManager.ins.destroyResource("bbubbles_submarine_ipad.png");
            fw.ResourceManager.ins.destroyResource("fishing_bg.png");
            fw.ResourceManager.ins.destroyResource("fishing_foreground.png");
            fw.ResourceManager.ins.destroyResource("fishing_wave.png");
            fw.ResourceManager.ins.destroyResource("fishing_spindrift1.png");
            fw.ResourceManager.ins.destroyResource("fishing_spindrift2.png");
            fw.ResourceManager.ins.destroyResource("fishing_spindrift3.png");
            _super.prototype.destroy.call(this);
        };
        return FishingScene;
    }(fw.BaseScene));
    app.FishingScene = FishingScene;
})(app || (app = {}));
var app;
(function (app) {
    var FishingScoreBars = (function (_super) {
        __extends(FishingScoreBars, _super);
        function FishingScoreBars() {
            var _this = _super.call(this) || this;
            _this.bars = [];
            for (var i = 0; i < app.FishingModel.studentsInfo.length; i++) {
                var bar = new ScoreBar(app.FishingModel.studentsInfo[i]);
                bar.x = i * 280;
                _this.addChild(bar);
                _this.bars.push(bar);
            }
            _this.updateScores();
            return _this;
        }
        FishingScoreBars.prototype.updateScores = function () {
            var syncInfo = app.FishingModel.cacheSyncInfo;
            if (!syncInfo)
                return;
            for (var _i = 0, _a = this.bars; _i < _a.length; _i++) {
                var bar = _a[_i];
                if (syncInfo[bar.studentInfo.uid]) {
                    bar.setData(syncInfo[bar.studentInfo.uid]);
                }
                else {
                    bar.setData(0);
                }
            }
        };
        FishingScoreBars.prototype.destroy = function () {
            this.bars && this.bars.forEach(function (bar) { bar.destroy(); });
            this.removeChildren();
            this.bars = [];
            fw.DisplayUtil.removeFromParent(this);
        };
        return FishingScoreBars;
    }(PIXI.Container));
    app.FishingScoreBars = FishingScoreBars;
    var ScoreBar = (function (_super) {
        __extends(ScoreBar, _super);
        function ScoreBar(studentInfo) {
            var _this = _super.call(this) || this;
            _this.studentInfo = studentInfo;
            _this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            var bg = _this.resource.createSprite("fishing_bg_score.png");
            _this.addChild(bg);
            _this.icons = [];
            for (var i = 0; i < 4; i++) {
                var icon = _this.resource.createSprite("", 52 + 55 * i, 30);
                icon.anchor.x = icon.anchor.y = 0.5;
                _this.addChild(icon);
                _this.icons.push(icon);
            }
            _this.setData(0);
            return _this;
        }
        ScoreBar.prototype.setData = function (value) {
            for (var i = 0; i < 4; i++) {
                var pos = 1 << i;
                var score = (value & pos) == pos;
                this.icons[i].texture = this.resource.getTexture(score ? "fishing_score_star.png" : "fishing_score_ask.png");
            }
        };
        ScoreBar.prototype.destroy = function () {
            this.removeChildren();
            this.icons = null;
            this.resource = null;
        };
        return ScoreBar;
    }(PIXI.Container));
})(app || (app = {}));
var app;
(function (app) {
    var FishingWaveImage = (function (_super) {
        __extends(FishingWaveImage, _super);
        function FishingWaveImage(texture, offsetTime) {
            var _this = _super.call(this) || this;
            _this.length = 10000;
            _this.offsetTime = offsetTime;
            _this.sprite1 = new PIXI.Sprite(texture);
            _this.addChild(_this.sprite1);
            _this.construcTime = fw.getTimer();
            if (fw.Config.quality >= 2) {
                PIXI.ticker.shared.add(_this.updateTime, _this);
            }
            return _this;
        }
        FishingWaveImage.prototype.updateTime = function (deltaTime) {
            var offset = Math.sin((fw.getTimer() - this.offsetTime - this.construcTime) % this.length / this.length * (Math.PI * 2));
            this.sprite1.y = offset * 20;
        };
        FishingWaveImage.prototype.destroy = function (options) {
            PIXI.ticker.shared.remove(this.updateTime, this);
            fw.DisplayUtil.removeFromParent(this.sprite1);
            this.sprite1.destroy();
            _super.prototype.destroy.call(this, options);
        };
        return FishingWaveImage;
    }(PIXI.Container));
    app.FishingWaveImage = FishingWaveImage;
})(app || (app = {}));
var app;
(function (app) {
    var FishingStage = (function (_super) {
        __extends(FishingStage, _super);
        function FishingStage() {
            var _this = _super.call(this, 1080, 810) || this;
            _this.fishCounter = 0;
            _this.isAwardPhase = false;
            return _this;
        }
        FishingStage.prototype.initialize = function () {
            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            var bgClock = this.resource.createSprite("fishing_clock.png", 110, 40);
            this.addChild(bgClock);
            this.labelTime = this.resource.createLabel("", 146, 86, 32, 0x614A36, "center");
            this.addChild(this.labelTime);
            this.fishPool = new PIXI.Container();
            this.addChild(this.fishPool);
            this.maskBoard = new fw.GQuad(0x0, 0, 0, 1440, 810, 0);
            this.maskBoard.interactive = this.maskBoard.interactiveChildren = false;
            this.addChild(this.maskBoard);
            var bgSumbarine;
            if (fw.getDeviceType() == fw.DeviceType.iPad) {
                bgSumbarine = fw.ResourceManager.ins.createSprite("bbubbles_submarine_ipad.png", 0, this.designHeight - 218);
                this.addChild(bgSumbarine);
            }
            else {
                bgSumbarine = fw.ResourceManager.ins.createSprite("bbubbles_submarine.png", 0, this.designHeight - 258);
                this.addChild(bgSumbarine);
            }
            this.hook = new app.FishingHook();
            this.imgCurrWord = new PIXI.Sprite();
            this.imgCurrWord.anchor.x = this.imgCurrWord.anchor.y = 0.5;
            if (app.FishingModel.mode == app.RoleType.TEACHER || app.FishingModel.mode == app.RoleType.OBSERVER
                || app.FishingModel.mode == app.RoleType.RECORDER || app.FishingModel.mode == app.RoleType.PREVIEW) {
                var scoreBars = new app.FishingScoreBars();
                scoreBars.x = 15;
                scoreBars.y = 537;
                this.addChild(scoreBars);
                app.FishingModel.scoreBars = scoreBars;
            }
            if (fw.Config.isDebug) {
                this.testLabel = this.resource.createLabel("", 0, 160, 20, 0xff0000, "left");
                this.addChild(this.testLabel);
                var labelDevice = this.resource.createLabel("DeviceLevel: " + fw.Config.quality + " \nStageSize: " + fw.Config.currentDirector.app.screen.width + "x" + fw.Config.currentDirector.app.screen.height + " \nResolution: " + fw.Config.currentDirector.app.view.width + "x" + fw.Config.currentDirector.app.view.height + "\nVersion: " + fw.Config.version, 0, 210, 20, 0xff0000, "left");
                this.addChild(labelDevice);
            }
            _super.prototype.initialize.call(this);
        };
        FishingStage.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            this.wave = new app.FishingScrollImage(fw.ResourceManager.ins.getTexture("fishing_wave.png"), 25);
            this.wave.y = 341;
            this.addChildAt(this.wave, 0);
            this.foreground = new app.FishingScrollImage(fw.ResourceManager.ins.getTexture("fishing_foreground.png"), 20);
            this.foreground.y = 241;
            this.addChildAt(this.foreground, 1);
            this.spindrifts = [];
            var spindriftY = [283, 420, 591];
            for (var i = 1; i <= 3; i++) {
                var spindrift = new app.FishingWaveImage(fw.ResourceManager.ins.getTexture("fishing_spindrift" + i + ".png"), 2000 * i);
                spindrift.y = spindriftY[i - 1];
                this.addChildAt(spindrift, 2);
                this.spindrifts.push(spindrift);
            }
            this.dbRabbit = new fw.DragonBones();
            this.dbRabbit.x = 540;
            this.dbRabbit.y = 250;
            this.dbRabbit.load("img/rabbit", "rabbit");
            this.dbRabbit.once("loaded", this.onBonesLoaded, this);
            fw.DisplayUtil.addChildAfter(this.dbRabbit, this.wave);
            PIXI.ticker.shared.add(this.updateTime, this);
            fw.GResponser.addListener("bomb", this.onCatchHandler, this);
            fw.GResponser.addListener("miss", this.onMissHandler, this);
            fw.GResponser.addListener("stageGameNotice", this.onClickMsg, this);
            this.stageId = 1;
            this.stageData = app.FishingModel.generateStageData(this.stageId);
            this.nextStage();
        };
        FishingStage.prototype.onBonesLoaded = function (armature) {
            this.dbRabbit.play("idle");
            this.dbRabbit.replaceSlotDisplay("cable_hook", this.hook);
            this.dbRabbit.replaceSlotDisplay("word_pos", this.imgCurrWord);
        };
        FishingStage.prototype.resetHook = function () {
            this.hook.rotation = Math.PI / 2;
            this.hook.hookLength = 160;
        };
        FishingStage.prototype.setData = function (value) {
            this.mData = value;
        };
        FishingStage.prototype.setCurrTime = function (time) {
        };
        FishingStage.prototype.nextStage = function (time) {
            var _this = this;
            this.clearFishPool();
            this.resetHook();
            if (this.stageId >= 5) {
                fw.Log.log("stage complete");
                this.hide();
                if (app.FishingModel.mode == 2 || app.FishingModel.mode == 4) {
                    var msgBody = { type: app.GameAPI.gameName, status: 2 };
                    fw.GResponser.postMessage("stageGameSwitch", msgBody);
                }
                return;
            }
            this.fishCounter = time ? Math.ceil(time / app.FishingModel.fishGapTime) : 1;
            this.isAwardPhase = false;
            app.FishingModel.gotFishCount = 0;
            fw.Log.log("stage start: " + this.stageId);
            fw.ResourceManager.ins.loadByUrl("../../" + this.stageData.imageUrl, function (res) {
                _this.imgCurrWord.texture = res;
            }, this);
            var audioFileName = fw.cutFilename(this.stageData.audioUrl);
            fw.SoundManager.playSound(audioFileName, "../../" + this.stageData.audioUrl);
        };
        FishingStage.prototype.clearFishPool = function () {
            this.fishLastTimes = null;
            var valid = app.FishingModel.fishingInsActivatePool.concat();
            for (var _i = 0, valid_1 = valid; _i < valid_1.length; _i++) {
                var ins = valid_1[_i];
                ins.destroy();
            }
        };
        FishingStage.prototype.updateTime = function (deltaTime) {
            var passTime = Date.now() - app.FishingModel.cacheSyncInfo.startTime - app.FishingModel.introTime;
            var allPhase = app.FishingModel.getPhases();
            this.testLabel && (this.testLabel.text = "phase=" + allPhase + " time=" + fw.NumberFormatter.formatTime(passTime, true, true));
            if (allPhase <= 0)
                return;
            var subPhase = allPhase % 10;
            var remainingTime = Math.max(Math.ceil(15 - passTime % app.FishingModel.stageTime / 1000), 0);
            this.labelTime.text = "" + remainingTime;
            if (subPhase == 1 && this.fishCounter <= 10) {
                if (!this.fishLastTimes || passTime - this.fishLastTimes > app.FishingModel.fishGapTime) {
                    this.fishLastTimes = passTime;
                    var modelId = 1 + Math.floor(Math.random() * 6);
                    var newFish = app.FishingIns.create(this, modelId * 100 + this.fishCounter, 341 + Math.random() * 200);
                    newFish.setData(this.stageData.list[(this.fishCounter - 1) % 10]);
                    this.fishPool.addChild(newFish);
                    this.fishCounter++;
                }
            }
            var awardPhase = subPhase == 2;
            if (this.isAwardPhase != awardPhase) {
                if (awardPhase) {
                    this.showAwardChest();
                    this.maskBoard.alpha = 0.6;
                    var valid = app.FishingModel.fishingInsActivatePool.concat();
                    for (var _i = 0, valid_2 = valid; _i < valid_2.length; _i++) {
                        var ins = valid_2[_i];
                        ins.fishGoHome();
                    }
                }
                else {
                    window.hideEffectTrophy();
                    this.maskBoard.alpha = 0;
                    var runningTime = Date.now() - app.FishingModel.cacheSyncInfo.startTime - app.FishingModel.introTime;
                    this.stageId = Math.round(runningTime / app.FishingModel.stageTime) + 1;
                    this.stageData = app.FishingModel.generateStageData(this.stageId);
                    this.nextStage();
                }
                this.isAwardPhase = awardPhase;
            }
        };
        FishingStage.prototype.showAwardChest = function () {
            var soundName = "fishing_good_job";
            var ribbonName = "nicetry";
            if (app.FishingModel.mode == 0 || app.FishingModel.mode == 1) {
                if (app.FishingModel.gotFishCount >= 6) {
                    soundName = "fishing_excellent";
                    ribbonName = "excellent";
                }
                else if (app.FishingModel.gotFishCount >= 1) {
                    soundName = "fishing_good_job";
                    ribbonName = "goodjob";
                }
                else {
                    soundName = "fishing_nice_try";
                    ribbonName = "nicetry";
                }
            }
            fw.SoundManager.playSound("fishing_succeed");
            setTimeout(function () {
                fw.SoundManager.playSound(soundName);
                fw.SoundManager.playSound("fishing_gold_sound");
            }, 1500);
            if (app.FishingModel.mode != app.RoleType.STUDENT && app.FishingModel.mode != app.RoleType.REVIEW)
                ribbonName = "";
            window.showEffectTrophy(ribbonName, this.designWidth / 2, this.designHeight, ["fish6"]);
        };
        FishingStage.prototype.onCatchHandler = function (params) {
            var _this = this;
            var hookPos = this.hook.getGlobalPosition();
            hookPos.x *= fw.SceneManager.current().designWidth / fw.Config.stageWidth;
            hookPos.y *= fw.SceneManager.current().designHeight / fw.Config.stageHeight;
            var angel = Math.atan((params.y - hookPos.y) / (params.x - hookPos.x));
            var rotate = angel >= 0 ? angel + Math.PI / 2 : angel - Math.PI / 2;
            this.hook.rotation = rotate - Math.PI / 2;
            var maxLength = Math.sqrt(Math.pow(hookPos.x - params.x, 2) + Math.pow(hookPos.y - params.y, 2));
            this.hook.hookLength = maxLength / 2;
            fw.Tween.get(this.hook)
                .to({ hookLength: maxLength }, 200)
                .call(function () {
                _this.hook.hangingFish(params.obj);
            }, this)
                .to({ hookLength: 0 }, 1000)
                .call(function () {
                _this.hook.hangingFish(null);
                params.obj.playRightComplete();
            }, this)
                .to({ hookLength: 160, rotation: Math.PI / 2 }, 100)
                .call(this.resetHook, this);
        };
        FishingStage.prototype.onMissHandler = function (params) {
            var _this = this;
            var hookPos = this.hook.getGlobalPosition();
            hookPos.x *= fw.SceneManager.current().designWidth / fw.Config.stageWidth;
            hookPos.y *= fw.SceneManager.current().designHeight / fw.Config.stageHeight;
            var angel = Math.atan((params.y - hookPos.y) / (params.x - hookPos.x));
            var rotate = angel >= 0 ? angel + Math.PI / 2 : angel - Math.PI / 2;
            this.hook.rotation = rotate - Math.PI / 2;
            var maxLength = Math.sqrt(Math.pow(hookPos.x - params.x, 2) + Math.pow(hookPos.y - params.y, 2));
            this.hook.hookLength = maxLength - 30;
            fw.Tween.get(this.hook)
                .call(function () {
                _this.hook.hangingFish(params.obj);
            }, this)
                .to({ hookLength: maxLength + 30 }, 100)
                .to({ hookLength: maxLength - 30 }, 100)
                .to({ hookLength: maxLength + 30 }, 100)
                .to({ hookLength: maxLength }, 100)
                .call(function () {
                _this.hook.hangingFish(null);
                params.obj.playWrongComplete();
            }, this)
                .to({ hookLength: 160, rotation: Math.PI / 2 }, 100)
                .call(this.resetHook, this);
        };
        FishingStage.prototype.onClickMsg = function (data) {
            if (data.type != app.GameAPI.gameName)
                return;
            var checkIndex = -1;
            var studentsInfo = app.FishingModel.studentsInfo;
            for (var i = 0; i < studentsInfo.length; i++) {
                if (studentsInfo[i].uid == data.userId) {
                    checkIndex = i;
                    break;
                }
            }
            if (checkIndex != -1) {
                var score = app.FishingModel.cacheSyncInfo[data.userId] || 0;
                var pos = 1 << (data.step - 1);
                score = score | pos;
                app.FishingModel.cacheSyncInfo[data.userId] = score;
                app.FishingModel.scoreBars && app.FishingModel.scoreBars.updateScores();
            }
        };
        FishingStage.prototype.onClose = function () {
            PIXI.ticker.shared.remove(this.updateTime, this);
            fw.GResponser.removeListener("bomb", this.onCatchHandler, this);
            fw.GResponser.removeListener("miss", this.onMissHandler, this);
            fw.GResponser.removeListener("stageGameNotice", this.onClickMsg, this);
            this.wave && this.wave.destroy();
            this.foreground && this.foreground.destroy();
            for (var _i = 0, _a = this.spindrifts; _i < _a.length; _i++) {
                var ele = _a[_i];
                ele.destroy();
            }
            this.spindrifts = [];
            this.dbRabbit.destroy();
            app.FishingModel.startRunningTime = 0;
            !app.FishingModel.quiet && this.mData && this.mData.func && this.mData.func.call(this.mData.this);
            _super.prototype.onClose.call(this);
        };
        return FishingStage;
    }(fw.BasePanel));
    app.FishingStage = FishingStage;
})(app || (app = {}));
var app;
(function (app) {
    var FishingScrollImage = (function (_super) {
        __extends(FishingScrollImage, _super);
        function FishingScrollImage(texture, obstruction) {
            if (obstruction === void 0) { obstruction = 10; }
            var _this = _super.call(this) || this;
            _this.length = texture.width;
            _this.obstruction = obstruction;
            _this.sprite1 = new PIXI.Sprite(texture);
            _this.addChild(_this.sprite1);
            _this.sprite2 = new PIXI.Sprite(texture);
            _this.addChild(_this.sprite2);
            _this.construcTime = fw.getTimer();
            if (fw.Config.quality >= 2) {
                PIXI.ticker.shared.add(_this.updateTime, _this);
            }
            return _this;
        }
        FishingScrollImage.prototype.updateTime = function (deltaTime) {
            var offset = (fw.getTimer() - this.construcTime) % (this.length * this.obstruction);
            this.sprite1.x = -offset / this.obstruction;
            this.sprite2.x = this.sprite1.x + this.sprite1.width;
        };
        FishingScrollImage.prototype.destroy = function (options) {
            PIXI.ticker.shared.remove(this.updateTime, this);
            fw.DisplayUtil.removeFromParent(this.sprite1);
            this.sprite1.destroy();
            fw.DisplayUtil.removeFromParent(this.sprite2);
            this.sprite2.destroy();
            _super.prototype.destroy.call(this, options);
        };
        return FishingScrollImage;
    }(PIXI.Container));
    app.FishingScrollImage = FishingScrollImage;
})(app || (app = {}));
var app;
(function (app) {
    var FishingTweenBase = (function (_super) {
        __extends(FishingTweenBase, _super);
        function FishingTweenBase() {
            return _super.call(this) || this;
        }
        Object.defineProperty(FishingTweenBase.prototype, "scaleX", {
            get: function () {
                return this.scale.x;
            },
            set: function (value) {
                this.scale.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FishingTweenBase.prototype, "scaleY", {
            get: function () {
                return this.scale.y;
            },
            set: function (value) {
                this.scale.y = value;
            },
            enumerable: true,
            configurable: true
        });
        return FishingTweenBase;
    }(PIXI.Container));
    app.FishingTweenBase = FishingTweenBase;
})(app || (app = {}));
var fw;
(function (fw) {
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(width, height) {
            var _this = _super.call(this) || this;
            _this.isInit = false;
            fw.HashObject.InjectHashCode(_this);
            _this.designWidth = width;
            _this.designHeight = height;
            PIXI.ticker.shared.addOnce(function (deltraTime) {
                _this.fixedInitialize();
            }, _this);
            return _this;
        }
        Component.prototype.fixedInitialize = function () {
            this.isInit = true;
            var bounds = this.getLocalBounds();
            this.width = bounds.width;
            this.height = bounds.height;
        };
        Component.prototype.destroy = function () {
            this.removeAllListeners();
            fw.DisplayUtil.removeFromParent(this);
        };
        return Component;
    }(PIXI.Container));
    fw.Component = Component;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var GButton = (function (_super) {
        __extends(GButton, _super);
        function GButton(normalTexture, downTexture, disableTexture, width, height) {
            var _this = _super.call(this, width, height) || this;
            _this.useTween = true;
            _this.buttonMode = true;
            _this.interactive = true;
            _this.normalTexture = normalTexture;
            _this.downTexture = downTexture;
            _this.disableTexture = disableTexture;
            _this.skinSprite = new PIXI.Sprite(normalTexture);
            _this.addChild(_this.skinSprite);
            _this.addListener("pointerdown", _this.onTouchDown, _this);
            _this.addListener("pointerup", _this.onTouchUp, _this);
            _this.addListener("pointerupoutside", _this.onTouchUp, _this);
            return _this;
        }
        GButton.prototype.fixedInitialize = function () {
            _super.prototype.fixedInitialize.call(this);
            this.skinSprite.anchor.x = this.skinSprite.anchor.y = 0.5;
            this.skinSprite.x = this.width >> 1;
            this.skinSprite.y = this.height >> 1;
        };
        Object.defineProperty(GButton.prototype, "scale", {
            get: function () {
                return this.skinSprite.scale;
            },
            set: function (value) {
                this.skinSprite.scale = value;
            },
            enumerable: true,
            configurable: true
        });
        GButton.prototype.onTouchDown = function (evt) {
            if (this.downTexture) {
                this.skinSprite.texture = this.downTexture;
            }
            else {
                if (this.useTween) {
                    fw.Tween.removeTweens(this.skinSprite.scale);
                    fw.Tween.get(this.skinSprite.scale).to({ x: 0.95, y: 0.95 }, 100);
                }
                else {
                    this.skinSprite.scale.x = this.skinSprite.scale.y = 0.95;
                }
            }
            this.skinSprite.tint = 0xaaaaaa;
        };
        GButton.prototype.onTouchUp = function (evt) {
            this.skinSprite.texture = this.normalTexture;
            if (this.useTween) {
                fw.Tween.removeTweens(this.skinSprite.scale);
                fw.Tween.get(this.skinSprite.scale).to({ x: 1.0, y: 1.0 }, 100);
            }
            else {
                this.skinSprite.scale.x = this.skinSprite.scale.y = 1;
            }
            this.skinSprite.tint = 0xffffff;
        };
        GButton.prototype.destroy = function () {
            this.useTween && fw.Tween.removeTweens(this.skinSprite.scale);
            _super.prototype.destroy.call(this);
        };
        return GButton;
    }(fw.Component));
    fw.GButton = GButton;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var GProgressBar = (function (_super) {
        __extends(GProgressBar, _super);
        function GProgressBar(bg, fg, width, height) {
            var _this = _super.call(this, width, height) || this;
            _this.valuePercent = 1;
            _this.backSprite = new PIXI.Sprite(bg);
            _this.addChild(_this.backSprite);
            if (width && height) {
                _this.backSprite.width = width;
                _this.backSprite.height = height;
            }
            _this.frontSprite = new PIXI.Sprite(fg);
            _this.addChild(_this.frontSprite);
            if (width && height) {
                _this.frontSprite.width = width;
                _this.frontSprite.height = height;
            }
            _this.maskQuad = new PIXI.Graphics();
            _this.maskQuad.clear();
            _this.maskQuad.beginFill(0xffffff);
            _this.maskQuad.drawRect(0, 0, 0, 0);
            _this.maskQuad.endFill();
            _this.frontSprite.mask = _this.maskQuad;
            _this.addChild(_this.maskQuad);
            return _this;
        }
        GProgressBar.prototype.fixedInitialize = function () {
            _super.prototype.fixedInitialize.call(this);
            this.updatePercent();
        };
        Object.defineProperty(GProgressBar.prototype, "percent", {
            get: function () {
                return this.valuePercent;
            },
            set: function (value) {
                this.valuePercent = fw.MathUtils.keepRange(0, value, 1);
                this.isInit && this.updatePercent();
            },
            enumerable: true,
            configurable: true
        });
        GProgressBar.prototype.updatePercent = function () {
            this.maskQuad.clear();
            this.maskQuad.beginFill(0xffffff);
            if (this.designWidth && this.designHeight)
                this.maskQuad.drawRect(0, 0, this.designWidth * this.valuePercent, this.designHeight);
            else
                this.maskQuad.drawRect(0, 0, this.width * this.valuePercent, this.height);
            this.maskQuad.endFill();
        };
        return GProgressBar;
    }(fw.Component));
    fw.GProgressBar = GProgressBar;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var GQuad = (function (_super) {
        __extends(GQuad, _super);
        function GQuad(color, posx, posy, width, height, alpha) {
            if (color === void 0) { color = 0x0000ff; }
            if (posx === void 0) { posx = 0; }
            if (posy === void 0) { posy = 0; }
            if (width === void 0) { width = 200; }
            if (height === void 0) { height = 200; }
            if (alpha === void 0) { alpha = 1; }
            var _this = _super.call(this, width, height) || this;
            _this.interactive = true;
            _this.skinGraphics = new PIXI.Graphics();
            _this.skinGraphics.clear();
            _this.skinGraphics.beginFill(color);
            _this.skinGraphics.drawRect(posx, posy, width, height);
            _this.skinGraphics.endFill();
            _this.addChild(_this.skinGraphics);
            _this.alpha = alpha;
            return _this;
        }
        GQuad.prototype.fixedInitialize = function () {
            _super.prototype.fixedInitialize.call(this);
        };
        GQuad.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return GQuad;
    }(fw.Component));
    fw.GQuad = GQuad;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var GResponserIns = (function (_super) {
        __extends(GResponserIns, _super);
        function GResponserIns() {
            return _super.call(this) || this;
        }
        GResponserIns.prototype.initialize = function () {
            document.addEventListener("visibilitychange", GResponserIns.onVisibleChange, false);
            window.addEventListener("message", GResponserIns.onReceiveMessage, false);
        };
        GResponserIns.prototype.postMessage = function (type, data) {
            if (data === void 0) { data = {}; }
            fw.Log.log("[SEND] type: " + type + " data: " + JSON.stringify(data));
            !fw.Config.isDebug && window.parent.postMessage({ type: "clientLog", data: "[SEND] type: " + type + " data: " + JSON.stringify(data) }, "*");
            window.parent.postMessage({ type: type, data: data }, "*");
        };
        GResponserIns.onReceiveMessage = function (evt) {
            if (!evt.data || !evt.data.type || !evt.data.data)
                return;
            evt.data.from && (evt.data.data.userId = parseInt(evt.data.from));
            fw.Log.log("[RECEIVE] type: " + evt.data.type + " data: " + JSON.stringify(evt.data.data));
            !fw.Config.isDebug && window.parent.postMessage({ type: "clientLog", data: "[RECEIVE] type: " + evt.data.type + " data: " + JSON.stringify(evt.data.data) }, "*");
            fw.GResponser.emit(evt.data.type, evt.data.data);
        };
        GResponserIns.onVisibleChange = function (evt) {
            if (document.hidden) {
                GResponserIns.hideTime = fw.getTimer();
            }
            else {
                if (!GResponserIns.hideTime || fw.getTimer() - GResponserIns.hideTime < 2000)
                    return;
                fw.Log.log("device resume");
                document.removeEventListener("visibilitychange", GResponserIns.onVisibleChange);
                fw.Config.currentDirector && fw.Config.currentDirector.destroy();
                window.location.reload();
            }
        };
        GResponserIns.prototype.asyncPostMessage = function (sendType, sendData, recvType) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2, new Promise(function (resolve, reject) {
                            _this.once(recvType, function (data) {
                                resolve(data);
                            });
                            _this.postMessage(sendType, sendData);
                        })];
                });
            });
        };
        GResponserIns.prototype.destroy = function () {
            this.removeAllListeners();
            window.removeEventListener("message", GResponserIns.onReceiveMessage, false);
        };
        return GResponserIns;
    }(PIXI.utils.EventEmitter));
    fw.GResponser = new GResponserIns();
})(fw || (fw = {}));
var fw;
(function (fw) {
    var HTMLAudioEngine = (function (_super) {
        __extends(HTMLAudioEngine, _super);
        function HTMLAudioEngine() {
            var _this = _super.call(this) || this;
            _this.soundVol = 1;
            _this.musicVol = 1;
            _this.soundMap = new fw.HashMap();
            _this.channels = [];
            return _this;
        }
        HTMLAudioEngine.prototype.createAudio = function (src) {
            var audio = new Audio();
            audio.src = src;
            document.body.appendChild(audio);
            this.channels.push(audio);
            return audio;
        };
        HTMLAudioEngine.prototype.addSound = function (name, url, isMusic) {
            if (isMusic === void 0) { isMusic = false; }
            var content = this.createAudio(url);
            var sound = { name: name, url: url, isMusic: isMusic, content: content };
            this.soundMap.put(name, sound);
            return sound;
        };
        HTMLAudioEngine.prototype.playSound = function (name, url, loop, isMusic, compatibility) {
            if (url === void 0) { url = ""; }
            if (loop === void 0) { loop = false; }
            if (isMusic === void 0) { isMusic = false; }
            if (compatibility === void 0) { compatibility = true; }
            return __awaiter(this, void 0, void 0, function () {
                var sound;
                return __generator(this, function (_a) {
                    sound = this.soundMap.getValue(name);
                    if (!sound) {
                        sound = this.addSound(name, url, isMusic);
                    }
                    sound.isMusic = isMusic;
                    sound.content.loop = loop || isMusic;
                    sound.content.volume = isMusic ? this.musicVol : this.soundVol;
                    sound.content.pause();
                    this.tryToPlay(sound.content);
                    return [2];
                });
            });
        };
        HTMLAudioEngine.prototype.tryToPlay = function (audio) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, audio.play().then(function (resolve) {
                                return;
                            }, function (reason) {
                                if (reason.code != 0)
                                    return;
                                fw.Log.log("Can not autoplay try again 3sec later. https://goo.gl/xX8pDD");
                                var self = _this;
                                setTimeout(function () {
                                    self.tryToPlay(audio);
                                }, 3000);
                            })];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        HTMLAudioEngine.prototype.setSoundVolume = function (value) {
            this.soundVol = value;
        };
        HTMLAudioEngine.prototype.getSoundVolume = function () {
            return this.soundVol;
        };
        HTMLAudioEngine.prototype.setMusicVolume = function (value) {
            this.musicVol = value;
        };
        HTMLAudioEngine.prototype.getMusicVolume = function () {
            return this.musicVol;
        };
        HTMLAudioEngine.prototype.stopSound = function (name) {
            var sound = this.soundMap.getValue(name);
            if (!sound)
                return;
            sound.content.pause();
        };
        HTMLAudioEngine.prototype.removeSound = function (name) {
            var sound = this.soundMap.getValue(name);
            if (!sound)
                return;
            sound.content.pause();
            this.stopSound(name);
            this.soundMap.remove(name);
        };
        HTMLAudioEngine.prototype.removeAllSound = function () {
            for (var _i = 0, _a = this.channels; _i < _a.length; _i++) {
                var audio = _a[_i];
                audio.src = "";
                audio.pause();
                audio.parentNode && document.body.removeChild(audio);
            }
            this.channels = [];
            this.soundMap.clear();
        };
        HTMLAudioEngine.prototype.destroy = function () {
            this.removeAllSound();
        };
        return HTMLAudioEngine;
    }(fw.HashObject));
    fw.HTMLAudioEngine = HTMLAudioEngine;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var NativeAudioEngine = (function (_super) {
        __extends(NativeAudioEngine, _super);
        function NativeAudioEngine() {
            var _this = _super.call(this) || this;
            _this.preLoopName = "";
            _this.soundMap = new fw.HashMap();
            return _this;
        }
        NativeAudioEngine.prototype.addSound = function (name, url, isMusic) {
            if (isMusic === void 0) { isMusic = false; }
            url = fw.relativePath2fullPath(url);
            var props = {
                name: name,
                type: "audio",
                path: url,
                event: "play",
                progress: 0,
                loop: false,
                volume: 1,
                scene: 10000,
                soundId: 1
            };
            this.soundMap.put(props.name, props);
            return props;
        };
        NativeAudioEngine.prototype.playSound = function (name, url, loop, isMusic) {
            if (url === void 0) { url = ""; }
            if (loop === void 0) { loop = false; }
            if (isMusic === void 0) { isMusic = false; }
            var props = this.soundMap.getValue(name);
            if (!props) {
                props = this.addSound(name, url, isMusic);
            }
            if (props.loop && this.preLoopName == props.name) {
                props.event = "stop";
                window.callClient("PlayNativeAudio", JSON.stringify(props));
            }
            props.loop = loop;
            props.soundId = fw.HashObject.GenerateHashCode() % 10000;
            props.event = "play";
            fw.Log.log("call PlayNativeAudio json=" + JSON.stringify(props));
            window.callClient("PlayNativeAudio", JSON.stringify(props));
            props.loop && (this.preLoopName = props.name);
            return props;
        };
        NativeAudioEngine.prototype.setSoundVolume = function (value) {
            var props = this.soundMap.getValue(name);
            if (props) {
                props.volume = value;
            }
        };
        NativeAudioEngine.prototype.getSoundVolume = function () {
            var props = this.soundMap.getValue(name);
            return props ? props.volume : 0;
        };
        NativeAudioEngine.prototype.setMusicVolume = function (value) {
            var props = this.soundMap.getValue(name);
            if (props) {
                props.volume = value;
            }
        };
        NativeAudioEngine.prototype.getMusicVolume = function () {
            var props = this.soundMap.getValue(name);
            return props ? props.volume : 0;
        };
        NativeAudioEngine.prototype.stopSound = function (name) {
            var result = this.executeStopSound(name);
            result && this.soundMap.remove(name);
        };
        NativeAudioEngine.prototype.executeStopSound = function (name) {
            var props = this.soundMap.getValue(name);
            if (props) {
                props.event = "stop";
                fw.Log.log("call PlayNativeAudio json=" + JSON.stringify(props));
                window.callClient("PlayNativeAudio", JSON.stringify(props));
                return true;
            }
            else {
                return false;
            }
        };
        NativeAudioEngine.prototype.removeSound = function (name) {
            this.stopSound(name);
        };
        NativeAudioEngine.prototype.removeAllSound = function () {
            var _this = this;
            this.soundMap.eachKey(function (name) {
                _this.executeStopSound(name);
            }, this);
            this.soundMap.clear();
        };
        NativeAudioEngine.prototype.destroy = function () {
            this.removeAllSound();
        };
        return NativeAudioEngine;
    }(fw.HashObject));
    fw.NativeAudioEngine = NativeAudioEngine;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var NativeAudioIFrameEngine = (function (_super) {
        __extends(NativeAudioIFrameEngine, _super);
        function NativeAudioIFrameEngine() {
            var _this = _super.call(this) || this;
            _this.preLoopName = "";
            _this.soundMap = new fw.HashMap();
            return _this;
        }
        NativeAudioIFrameEngine.prototype.addSound = function (name, url, isMusic) {
            if (isMusic === void 0) { isMusic = false; }
            url = fw.relativePath2fullPath(url);
            var volume = 1;
            var props = {
                name: name,
                type: "audio",
                path: url,
                event: "play",
                progress: 0,
                loop: false,
                volume: volume,
                scene: 10000,
                soundId: 1
            };
            this.soundMap.put(props.name, props);
            return props;
        };
        NativeAudioIFrameEngine.prototype.playSound = function (name, url, loop, isMusic) {
            if (url === void 0) { url = ""; }
            if (loop === void 0) { loop = false; }
            if (isMusic === void 0) { isMusic = false; }
            var props = this.soundMap.getValue(name);
            if (!props) {
                props = this.addSound(name, url, isMusic);
            }
            if (props.loop && this.preLoopName == props.name) {
                props.event = "stop";
                fw.GResponser.postMessage("PlayNativeAudio", JSON.stringify(props));
            }
            props.loop = loop;
            props.soundId = fw.HashObject.GenerateHashCode() % 10000;
            props.event = "play";
            fw.Log.log("call PlayNativeAudio json=" + JSON.stringify(props));
            fw.GResponser.postMessage("PlayNativeAudio", JSON.stringify(props));
            props.loop && (this.preLoopName = props.name);
            return props;
        };
        NativeAudioIFrameEngine.prototype.setSoundVolume = function (value) {
            var props = this.soundMap.getValue(name);
            if (props) {
                props.volume = value;
            }
        };
        NativeAudioIFrameEngine.prototype.getSoundVolume = function () {
            var props = this.soundMap.getValue(name);
            return props ? props.volume : 0;
        };
        NativeAudioIFrameEngine.prototype.setMusicVolume = function (value) {
            var props = this.soundMap.getValue(name);
            if (props) {
                props.volume = value;
            }
        };
        NativeAudioIFrameEngine.prototype.getMusicVolume = function () {
            var props = this.soundMap.getValue(name);
            return props ? props.volume : 0;
        };
        NativeAudioIFrameEngine.prototype.stopSound = function (name) {
            var props = this.soundMap.getValue(name);
            if (props) {
                props.event = "stop";
            }
            fw.Log.log("call PlayNativeAudio json=" + JSON.stringify(props));
            fw.GResponser.postMessage("PlayNativeAudio", JSON.stringify(props));
        };
        NativeAudioIFrameEngine.prototype.removeSound = function (name) {
        };
        NativeAudioIFrameEngine.prototype.removeAllSound = function () {
            this.soundMap.clear();
        };
        NativeAudioIFrameEngine.prototype.destroy = function () {
            this.removeAllSound();
        };
        return NativeAudioIFrameEngine;
    }(fw.HashObject));
    fw.NativeAudioIFrameEngine = NativeAudioIFrameEngine;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var PanelNavigator = (function (_super) {
        __extends(PanelNavigator, _super);
        function PanelNavigator() {
            var _this = _super.call(this) || this;
            _this.mapPanelData = new fw.HashMap();
            _this.validPanelData = [];
            return _this;
        }
        PanelNavigator.prototype.getPanelData = function (panel) {
            var mapKey = this.getMapKey(panel);
            return this.mapPanelData.getValue(mapKey);
        };
        PanelNavigator.prototype.showPanel = function (panel, data, align, layer, resourcePath, hasModal) {
            if (hasModal === void 0) { hasModal = false; }
            var mapKey = this.getMapKey(panel);
            var props = this.mapPanelData.getValue(mapKey);
            if (!props)
                props = this.createPanelData(mapKey, panel, data, align, layer, resourcePath, hasModal);
            else {
                props.data = data;
                (align != undefined) && (props.align = align);
                (layer != undefined) && (props.layer = layer);
                resourcePath && (props.resourcePath = resourcePath);
                props.hasModal = hasModal;
            }
            var content = props.content;
            var self = this;
            if (content.status == fw.PanelStatus.INITIALIZATION) {
                return content;
            }
            if (content.status == fw.PanelStatus.READY || content.status == fw.PanelStatus.CLOSE || content.status == fw.PanelStatus.OPEN) {
                onLoadPanelComplete();
            }
            else {
                content.load(props.resourcePath, onLoadPanelComplete, onLoadingPanel, onClosePanel, this);
            }
            return content;
            function onLoadPanelComplete() {
                content.show(props.layer, props.data, props.align);
                if (self.validPanelData.indexOf(props) >= 0)
                    self.validPanelData.splice(self.validPanelData.indexOf(props), 1);
                self.validPanelData.push(props);
                if (props.hasModal)
                    self.checkModal();
                fw.Log.log("open panel key: " + props.clsKey);
            }
            function onLoadingPanel(proress) {
            }
            function onClosePanel() {
                var index = self.validPanelData.indexOf(props);
                if (index < 0)
                    return;
                self.validPanelData.splice(index, 1);
                self.checkModal();
                fw.Log.log("close panel key: " + props.clsKey);
            }
        };
        PanelNavigator.prototype.checkModal = function () {
            if (this.modalBlocker && this.modalBlocker.parent) {
                this.modalBlocker.parent.removeChild(this.modalBlocker);
                this.modalBlocker = null;
            }
            var currScene = fw.SceneManager.current();
            if (!currScene)
                return;
            for (var i = this.validPanelData.length - 1; i >= 0; i--) {
                var props = this.validPanelData[i];
                if (props.hasModal && props.content.parent) {
                    this.modalBlocker = new fw.GQuad(0x0, 0, 0, currScene.designWidth, currScene.designHeight, 0.6);
                    this.modalBlocker.interactive = true;
                    fw.DisplayUtil.addChildBefore(this.modalBlocker, props.content);
                    break;
                }
            }
        };
        PanelNavigator.prototype.createPanelData = function (mapKey, panel, data, align, layer, resourcePath, hasModal) {
            if (hasModal === void 0) { hasModal = false; }
            var props = {
                clsKey: mapKey,
                content: new panel(),
                data: data,
                align: align == undefined ? 1 : align,
                layer: layer || fw.SceneManager.current().getLayer(),
                resourcePath: resourcePath,
                hasModal: hasModal,
            };
            props.content.name = panel.name;
            this.mapPanelData.put(mapKey, props);
            return props;
        };
        PanelNavigator.prototype.getMapKey = function (panel) {
            var clsHashCode = fw.HashObject.GetHashCode(panel);
            return panel.name + "_" + clsHashCode;
        };
        PanelNavigator.prototype.getPanel = function (panel) {
            var mapKey = this.getMapKey(panel);
            var props = this.mapPanelData.getValue(mapKey);
            if (!props)
                props = this.createPanelData(mapKey, panel, null);
            return props.content;
        };
        PanelNavigator.prototype.isOpen = function (panel) {
            var mapKey = this.getMapKey(panel);
            var props = this.mapPanelData.getValue(mapKey);
            if (!props)
                return false;
            return props.content.isOpen;
        };
        PanelNavigator.prototype.hidePanel = function (panel, destroy) {
            if (destroy === void 0) { destroy = false; }
            var mapKey = this.getMapKey(panel);
            var props = this.mapPanelData.getValue(mapKey);
            if (!props)
                return undefined;
            props.content.hide(destroy);
            if (destroy) {
                this.mapPanelData.remove(props.clsKey);
                return undefined;
            }
            else {
                return props.content;
            }
        };
        PanelNavigator.prototype.hideAllPanel = function () {
            this.mapPanelData.eachValue(function (props) {
                props.content.hide(false);
            }, this);
        };
        PanelNavigator.prototype.destroyPanel = function (panel) {
            var mapKey = this.getMapKey(panel);
            var props = this.mapPanelData.getValue(mapKey);
            if (!props)
                return;
            var content = props.content;
            content.removeAllListeners();
            if (content.isOpen) {
                content.hide(true);
            }
            else {
                content.destroy();
                this.mapPanelData.remove(props.clsKey);
            }
        };
        PanelNavigator.prototype.destroyAllPanel = function () {
            var _this = this;
            this.mapPanelData.eachValue(function (props) {
                var content = props.content;
                content.removeAllListeners();
                if (content.isOpen) {
                    content.hide(true);
                }
                else {
                    content.destroy();
                    _this.mapPanelData.remove(props.clsKey);
                }
            }, this);
            this.mapPanelData.clear();
        };
        return PanelNavigator;
    }(fw.HashObject));
    fw.PanelNavigator = PanelNavigator;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var SceneNavigator = (function (_super) {
        __extends(SceneNavigator, _super);
        function SceneNavigator() {
            var _this = _super.call(this) || this;
            _this.mapSceneData = new fw.HashMap();
            _this.modalBlocker = new fw.GQuad(0x0, 0, 0, 100, 100, 0);
            _this.modalBlocker.interactive = true;
            return _this;
        }
        SceneNavigator.prototype.getSceneData = function (scene) {
            var mapKey = this.getMapKey(scene);
            return this.mapSceneData.getValue(mapKey);
        };
        SceneNavigator.prototype.setCurrentScene = function (scene, data, align, resourcePath, hasModal) {
            if (hasModal === void 0) { hasModal = false; }
            this.hideCurrentScene();
            var mapKey = this.getMapKey(scene);
            ;
            var props = this.mapSceneData.getValue(mapKey);
            if (!props)
                props = this.createSceneData(mapKey, scene, data, align, resourcePath, hasModal);
            else {
                props.data = data;
                align && (props.align = align);
                resourcePath && (props.resourcePath = resourcePath);
                props.hasModal = hasModal;
            }
            var content = props.content;
            var self = this;
            this.currentProps = props;
            if (content.status == fw.PanelStatus.READY || content.status == fw.PanelStatus.CLOSE) {
                onLoadPanelComplete();
            }
            else {
                content.load(props.resourcePath, onLoadPanelComplete, onLoadingPanel, onClosePanel, this);
            }
            return content;
            function onLoadPanelComplete() {
                content.show(props.data, props.align);
                if (props.hasModal)
                    self.checkModal();
                fw.Log.log("open scene key: " + props.clsKey);
            }
            function onLoadingPanel(proress) {
            }
            function onClosePanel() {
                self.checkModal();
                fw.Log.log("close scene key: " + props.clsKey);
            }
        };
        SceneNavigator.prototype.checkModal = function () {
            if (this.modalBlocker.parent)
                this.modalBlocker.parent.removeChild(this.modalBlocker);
            if (this.currentProps && this.currentProps.hasModal) {
                var director = fw.Config.currentDirector;
                director.stage.addChildAt(this.modalBlocker, 0);
                this.modalBlocker.width = fw.Config.stageWidth;
                this.modalBlocker.height = fw.Config.stageHeight;
            }
        };
        SceneNavigator.prototype.createSceneData = function (mapKey, scene, data, align, resourcePath, hasModal) {
            if (hasModal === void 0) { hasModal = false; }
            var props = {
                clsKey: mapKey,
                content: new scene(),
                data: data,
                align: align || 1,
                resourcePath: resourcePath,
                hasModal: hasModal,
            };
            props.content.name = scene.name;
            this.mapSceneData.put(mapKey, props);
            return props;
        };
        SceneNavigator.prototype.getMapKey = function (panel) {
            var clsHashCode = fw.HashObject.GetHashCode(panel);
            return panel.name + "_" + clsHashCode;
        };
        SceneNavigator.prototype.getScene = function (scene) {
            var mapKey = scene.name;
            var props = this.mapSceneData.getValue(mapKey);
            if (!props)
                props = this.createSceneData(mapKey, scene, null);
            return props.content;
        };
        SceneNavigator.prototype.hideCurrentScene = function () {
            if (!this.currentProps)
                return;
            var props = this.mapSceneData.getValue(this.currentProps.clsKey);
            if (!props)
                return;
            this.currentProps.content.removeAllListeners();
            this.currentProps.content.hide(true);
            this.mapSceneData.remove(props.clsKey);
            return;
        };
        SceneNavigator.prototype.destroyAllScene = function () {
            var _this = this;
            this.mapSceneData.eachValue(function (props) {
                var content = props.content;
                content.removeAllListeners();
                if (content.isOpen) {
                    content.hide(true);
                }
                else {
                    content.destroy();
                    _this.mapSceneData.remove(props.clsKey);
                }
            }, this);
        };
        return SceneNavigator;
    }(fw.HashObject));
    fw.SceneNavigator = SceneNavigator;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var WebAudioEngine = (function (_super) {
        __extends(WebAudioEngine, _super);
        function WebAudioEngine() {
            var _this = _super.call(this) || this;
            _this.soundMap = new fw.HashMap();
            return _this;
        }
        WebAudioEngine.prototype.addSound = function (name, url, isMusic) {
            if (isMusic === void 0) { isMusic = false; }
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2, new Promise(function (resolve, reject) {
                            fw.ResourceManager.ins.loadByUrl(url, function (res) {
                                var sound = { name: name, url: url, content: res, isMusic: isMusic };
                                _this.soundMap.put(name, sound);
                                resolve(sound);
                            }, _this);
                        })];
                });
            });
        };
        WebAudioEngine.prototype.playSound = function (name, url, loop, isMusic, compatibility) {
            if (url === void 0) { url = ""; }
            if (loop === void 0) { loop = false; }
            if (isMusic === void 0) { isMusic = false; }
            if (compatibility === void 0) { compatibility = true; }
            return __awaiter(this, void 0, void 0, function () {
                var props, sound;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            props = this.soundMap.getValue(name);
                            if (!!props) return [3, 2];
                            return [4, this.addSound(name, url, isMusic)];
                        case 1:
                            props = _a.sent();
                            _a.label = 2;
                        case 2:
                            sound = props.content;
                            sound.loop = loop || props.isMusic;
                            if (isMusic) {
                                sound.volume = 0.5;
                            }
                            return [2, sound.play()];
                    }
                });
            });
        };
        WebAudioEngine.prototype.setSoundVolume = function (value) {
            PIXI.sound.volumeAll = value;
        };
        WebAudioEngine.prototype.getSoundVolume = function () {
            return PIXI.sound.volumeAll;
        };
        WebAudioEngine.prototype.setMusicVolume = function (value) {
            PIXI.sound.volumeAll = value;
        };
        WebAudioEngine.prototype.getMusicVolume = function () {
            return PIXI.sound.volumeAll;
        };
        WebAudioEngine.prototype.stopSound = function (name) {
            PIXI.sound.exists(name) && PIXI.sound.stop(name);
        };
        WebAudioEngine.prototype.removeSound = function (name) {
            fw.ResourceManager.ins.destroyResource(name);
            this.soundMap.remove(name);
        };
        WebAudioEngine.prototype.removeAllSound = function () {
            this.soundMap.clear();
        };
        WebAudioEngine.prototype.destroy = function () {
            this.soundMap.clear();
        };
        return WebAudioEngine;
    }(fw.HashObject));
    fw.WebAudioEngine = WebAudioEngine;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var DragonBones = (function (_super) {
        __extends(DragonBones, _super);
        function DragonBones(dbPath, armatureName) {
            var _this = _super.call(this) || this;
            dbPath && _this.load(dbPath, armatureName);
            return _this;
        }
        DragonBones.prototype.load = function (dbPath, armatureName) {
            this.isLoaded = false;
            this.dbPath = dbPath;
            this.dbName = fw.cutFilename(dbPath);
            this.armatureName = armatureName;
            var urls = [
                dbPath + "/" + this.dbName + "_ske.json",
                dbPath + "/" + this.dbName + "_tex.json",
                dbPath + "/" + this.dbName + "_tex.png",
            ];
            fw.ResourceManager.ins.loadByUrls(urls, this.onLoaded, null, this);
        };
        DragonBones.prototype.onLoaded = function () {
            var ske = fw.ResourceManager.ins.getJson(this.dbName + "_ske.json");
            var checkDbData = DragonBones.factory.getDragonBonesData(this.dbName);
            if (!checkDbData) {
                DragonBones.factory.parseDragonBonesData(ske);
            }
            var texJson = fw.ResourceManager.ins.getJson(this.dbName + "_tex.json");
            var texPng = fw.ResourceManager.ins.getTexture(this.dbName + "_tex.png");
            var checkAtlasData = DragonBones.factory.getTextureAtlasData(this.dbName);
            if (!checkAtlasData) {
                DragonBones.factory.parseTextureAtlasData(texJson, texPng);
            }
            this.armatureDisplay = DragonBones.factory.buildArmatureDisplay(this.armatureName || this.dbName, this.dbName);
            this.addChild(this.armatureDisplay);
            this.isLoaded = true;
            this.emit("loaded", this.armatureDisplay);
        };
        DragonBones.prototype.replaceSlotDisplay = function (slotName, display) {
            if (!this.isLoaded)
                return;
            return this.armatureDisplay.armature.getSlot(slotName).display = display;
        };
        DragonBones.prototype.play = function (animationName, playTimes) {
            if (!this.isLoaded)
                return;
            return this.armatureDisplay.animation.play(animationName, playTimes);
        };
        DragonBones.prototype.destroy = function (options) {
            fw.DisplayUtil.removeFromParent(this.armatureDisplay);
            this.armatureDisplay.destroy();
            _super.prototype.destroy.call(this, options);
        };
        DragonBones.factory = dragonBones.PixiFactory.factory;
        return DragonBones;
    }(PIXI.Container));
    fw.DragonBones = DragonBones;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var DeviceType;
    (function (DeviceType) {
        DeviceType["iPad"] = "wk";
        DeviceType["iPhone"] = "wk";
        DeviceType["Mac"] = "mac";
        DeviceType["Windows"] = "windows";
    })(DeviceType = fw.DeviceType || (fw.DeviceType = {}));
})(fw || (fw = {}));
var fw;
(function (fw) {
    var PanelStatus;
    (function (PanelStatus) {
        PanelStatus[PanelStatus["START"] = 0] = "START";
        PanelStatus[PanelStatus["INITIALIZATION"] = 1] = "INITIALIZATION";
        PanelStatus[PanelStatus["READY"] = 2] = "READY";
        PanelStatus[PanelStatus["OPEN"] = 3] = "OPEN";
        PanelStatus[PanelStatus["CLOSE"] = 4] = "CLOSE";
        PanelStatus[PanelStatus["ERROR"] = 5] = "ERROR";
    })(PanelStatus = fw.PanelStatus || (fw.PanelStatus = {}));
})(fw || (fw = {}));
var fw;
(function (fw) {
    var ResizeAlign;
    (function (ResizeAlign) {
        ResizeAlign[ResizeAlign["NONE"] = 0] = "NONE";
        ResizeAlign[ResizeAlign["CENTER"] = 1] = "CENTER";
        ResizeAlign[ResizeAlign["FILL"] = 2] = "FILL";
        ResizeAlign[ResizeAlign["SCALE_INTACT"] = 3] = "SCALE_INTACT";
        ResizeAlign[ResizeAlign["SCALE_CLIP"] = 4] = "SCALE_CLIP";
        ResizeAlign[ResizeAlign["SCALE_FILL"] = 5] = "SCALE_FILL";
    })(ResizeAlign = fw.ResizeAlign || (fw.ResizeAlign = {}));
})(fw || (fw = {}));
var fw;
(function (fw) {
    var GlowFilter = (function (_super) {
        __extends(GlowFilter, _super);
        function GlowFilter(distance, outerStrength, innerStrength, color, quality) {
            if (distance === void 0) { distance = 10; }
            if (outerStrength === void 0) { outerStrength = 4; }
            if (innerStrength === void 0) { innerStrength = 0; }
            if (color === void 0) { color = 0xffffff; }
            if (quality === void 0) { quality = 0.1; }
            var _this = _super.call(this, GlowFilter.vert, GlowFilter.frag
                .replace(/%QUALITY_DIST%/gi, '' + (1 / quality / distance).toFixed(7))
                .replace(/%DIST%/gi, '' + distance.toFixed(7))) || this;
            _this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);
            _this.distance = distance;
            _this.color = color;
            _this.outerStrength = outerStrength;
            _this.innerStrength = innerStrength;
            return _this;
        }
        Object.defineProperty(GlowFilter.prototype, "color", {
            get: function () {
                return PIXI.utils.rgb2hex(this.uniforms.glowColor);
            },
            set: function (value) {
                PIXI.utils.hex2rgb(value, this.uniforms.glowColor);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "distance", {
            get: function () {
                return this.uniforms.distance;
            },
            set: function (value) {
                this.uniforms.distance = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "outerStrength", {
            get: function () {
                return this.uniforms.outerStrength;
            },
            set: function (value) {
                this.uniforms.outerStrength = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "innerStrength", {
            get: function () {
                return this.uniforms.innerStrength;
            },
            set: function (value) {
                this.uniforms.innerStrength = value;
            },
            enumerable: true,
            configurable: true
        });
        GlowFilter.vert = "\n        attribute vec2 aVertexPosition;\n        attribute vec2 aTextureCoord;\n        \n        uniform mat3 projectionMatrix;\n        \n        varying vec2 vTextureCoord;\n        \n        void main(void)\n        {\n            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n            vTextureCoord = aTextureCoord;\n        }";
        GlowFilter.frag = "\n        varying vec2 vTextureCoord;\n        varying vec4 vColor;\n        \n        uniform sampler2D uSampler;\n        \n        uniform float distance;\n        uniform float outerStrength;\n        uniform float innerStrength;\n        uniform vec4 glowColor;\n        uniform vec4 filterArea;\n        uniform vec4 filterClamp;\n        const float PI = 3.14159265358979323846264;\n        \n        void main(void) {\n            vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n            vec4 ownColor = texture2D(uSampler, vTextureCoord);\n            vec4 curColor;\n            float totalAlpha = 0.0;\n            float maxTotalAlpha = 0.0;\n            float cosAngle;\n            float sinAngle;\n            vec2 displaced;\n            for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n               cosAngle = cos(angle);\n               sinAngle = sin(angle);\n               for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n                   displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n                   displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n                   curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n                   totalAlpha += (distance - curDistance) * curColor.a;\n                   maxTotalAlpha += (distance - curDistance);\n               }\n            }\n            maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n        \n            ownColor.a = max(ownColor.a, 0.0001);\n            ownColor.rgb = ownColor.rgb / ownColor.a;\n            float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n            float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n            float resultAlpha = (ownColor.a + outerGlowAlpha);\n            gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n        }";
        return GlowFilter;
    }(PIXI.Filter));
    fw.GlowFilter = GlowFilter;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var PanelManager;
    (function (PanelManager) {
        var navigator;
        function showPanel(panel, data, align, layer, resourcePath, hasModal) {
            if (hasModal === void 0) { hasModal = false; }
            !navigator && (navigator = new fw.PanelNavigator());
            return navigator.showPanel(panel, data, align, layer, resourcePath, hasModal);
        }
        PanelManager.showPanel = showPanel;
        function getPanel(panel) {
            !navigator && (navigator = new fw.PanelNavigator());
            return navigator.getPanel(panel);
        }
        PanelManager.getPanel = getPanel;
        function isOpen(panel) {
            !navigator && (navigator = new fw.PanelNavigator());
            return navigator.isOpen(panel);
        }
        PanelManager.isOpen = isOpen;
        function hidePanel(panel, destroy) {
            if (destroy === void 0) { destroy = false; }
            return navigator && navigator.hidePanel(panel, destroy);
        }
        PanelManager.hidePanel = hidePanel;
        function hideAllPanel() {
            navigator && navigator.hideAllPanel();
        }
        PanelManager.hideAllPanel = hideAllPanel;
        function destroyAllPanel() {
            navigator && navigator.destroyAllPanel();
        }
        PanelManager.destroyAllPanel = destroyAllPanel;
    })(PanelManager = fw.PanelManager || (fw.PanelManager = {}));
})(fw || (fw = {}));
var fw;
(function (fw) {
    var HashMap = (function () {
        function HashMap() {
            this.mLength = 0;
            this.mLength = 0;
            this.content = {};
        }
        Object.defineProperty(HashMap.prototype, "length", {
            get: function () {
                return this.mLength;
            },
            enumerable: true,
            configurable: true
        });
        HashMap.prototype.isEmpty = function () {
            return (this.mLength == 0);
        };
        HashMap.prototype.keys = function () {
            var temp = [];
            for (var i in this.content) {
                temp.push(i);
            }
            return temp;
        };
        HashMap.prototype.eachKey = function (func, thisObj) {
            for (var i in this.content) {
                func.call(thisObj, i);
            }
        };
        HashMap.prototype.eachValue = function (func, thisObj) {
            for (var i in this.content) {
                var value = this.content[i];
                func.call(thisObj, value);
            }
        };
        HashMap.prototype.values = function () {
            var temp = [];
            for (var i in this.content) {
                temp.push(this.content[i]);
            }
            return temp;
        };
        HashMap.prototype.containsValue = function (value) {
            for (var i in this.content) {
                var result = this.content[i];
                if (result === value) {
                    return true;
                }
            }
            return false;
        };
        HashMap.prototype.containsKey = function (key) {
            key = this.generateKey(key);
            if (this.content[key] != undefined) {
                return true;
            }
            return false;
        };
        HashMap.prototype.getValue = function (key) {
            key = this.generateKey(key);
            var value = this.content[key];
            if (value !== undefined) {
                return value;
            }
            return undefined;
        };
        HashMap.prototype.put = function (key, value) {
            key = this.generateKey(key);
            if (!key) {
                throw new Error("cannot put a value with undefined or null key!");
            }
            else if (!value) {
                return this.remove(key);
            }
            else {
                var exist = this.containsKey(key);
                if (!exist) {
                    this.mLength++;
                }
                this.content[key] = value;
                return value;
            }
        };
        HashMap.prototype.remove = function (key) {
            key = this.generateKey(key);
            var exist = this.containsKey(key);
            if (!exist) {
                return undefined;
            }
            var temp = this.content[key];
            this.content[key] = null;
            delete this.content[key];
            this.mLength--;
            return temp;
        };
        HashMap.prototype.clear = function () {
            this.mLength = 0;
            this.content = {};
        };
        HashMap.prototype.clone = function () {
            var temp = new HashMap();
            for (var i in this.content) {
                temp.put(i, this.content[i]);
            }
            return temp;
        };
        HashMap.prototype.toString = function () {
            var ks = this.keys();
            var vs = this.values();
            var temp = "HashMap Content:\n";
            for (var i = 0; i < ks.length; i++) {
                temp += ks[i] + " -> " + vs[i] + "\n";
            }
            return temp;
        };
        HashMap.prototype.generateKey = function (key) {
            if (key && typeof key != "string" && typeof key != "number") {
                if (key._hashtableUniqueId == undefined) {
                    key._hashtableUniqueId = "___HID___" + (HashMap.id++);
                }
                key = key._hashtableUniqueId;
            }
            return key;
        };
        HashMap.id = 0;
        return HashMap;
    }());
    fw.HashMap = HashMap;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var ResizeManager;
    (function (ResizeManager) {
        var _stageWidth;
        var _stageHeight;
        var _map = new fw.HashMap();
        function initialize(stageWidth, stageHeight) {
            _stageWidth = stageWidth;
            _stageHeight = stageHeight;
            _map = new fw.HashMap();
        }
        ResizeManager.initialize = initialize;
        function refresh() {
            _map.eachValue(function (prop) { _excuteResize(prop); }, null);
        }
        ResizeManager.refresh = refresh;
        function add(target, align, alignlistener) {
            var hashCode = target["_hashCode"];
            if (!hashCode)
                return;
            var prop = { target: target, align: align, callback: alignlistener, bound: null };
            _map.put(hashCode, prop);
            _excuteResize(prop);
        }
        ResizeManager.add = add;
        function remove(target) {
            var hashCode = target["_hashCode"];
            if (!hashCode)
                return;
            if (_map.containsKey(hashCode))
                _map.remove(hashCode);
        }
        ResizeManager.remove = remove;
        function _excuteResize(prop, tryTimes) {
            if (tryTimes === void 0) { tryTimes = 1; }
            var tar = prop.target;
            prop.bound = { x: prop.target.x, y: prop.target.y,
                width: tar["designWidth"] ? tar["designWidth"] : tar.width,
                height: tar["designHeight"] ? tar["designHeight"] : tar.height };
            if ((prop.bound.width == 0 || prop.bound.height == 0) && tryTimes < 3) {
                PIXI.ticker.shared.addOnce(function (evt) { _excuteResize(prop, tryTimes + 1); }, ResizeManager);
                return;
            }
            switch (prop.align) {
                case fw.ResizeAlign.CENTER:
                    var posX = _stageWidth - prop.bound.width >> 1;
                    var posY = _stageHeight - prop.bound.height >> 1;
                    prop.target.x = posX + prop.target.width * prop.target.pivot.x;
                    prop.target.y = posY + prop.target.height * prop.target.pivot.y;
                    break;
                case fw.ResizeAlign.FILL:
                    prop.target.x = prop.target.y = 0;
                    prop.target.width = _stageWidth;
                    prop.target.height = _stageHeight;
                    break;
                case fw.ResizeAlign.SCALE_INTACT:
                    fw.DisplayUtil.fillCenter(prop.target, _stageWidth, _stageHeight, true);
                    break;
                case fw.ResizeAlign.SCALE_CLIP:
                    fw.DisplayUtil.fillCenter(prop.target, _stageWidth, _stageHeight, false);
                    break;
                case fw.ResizeAlign.SCALE_FILL:
                    fw.DisplayUtil.fillScale(prop.target, _stageWidth, _stageHeight);
                    break;
            }
            if (prop.callback)
                prop.callback.call(prop.target);
        }
    })(ResizeManager = fw.ResizeManager || (fw.ResizeManager = {}));
})(fw || (fw = {}));
var fw;
(function (fw) {
    var _startTime = Date.now();
    function getTimer() {
        return Date.now() - _startTime;
    }
    fw.getTimer = getTimer;
    function cloneObject(source) {
        var newObj = {};
        for (var i in source) {
            newObj[i] = source[i];
        }
        return newObj;
    }
    fw.cloneObject = cloneObject;
    function cutFilename(path) {
        var splitPath = path.split("/");
        return splitPath[splitPath.length - 1];
    }
    fw.cutFilename = cutFilename;
    function getDeviceType() {
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf("iPad") > -1)
            return fw.DeviceType.iPad;
        else if (userAgent.indexOf("iPhone") > -1)
            return fw.DeviceType.iPhone;
        else if (userAgent.indexOf("Macintosh") > -1) {
            if ("ontouchend" in document)
                return fw.DeviceType.iPad;
            else
                return fw.DeviceType.Mac;
        }
        else
            (userAgent.indexOf("Windows") > -1);
        return fw.DeviceType.Windows;
    }
    fw.getDeviceType = getDeviceType;
    function getDeviceVer() {
        var userAgent = navigator.userAgent.toLowerCase();
        var osversion;
        if (userAgent.indexOf("macintosh") > -1) {
            osversion = userAgent.match(/mac os x (.*?)\)/);
        }
        else if (userAgent.indexOf("ipad") > -1) {
            osversion = userAgent.match(/cpu os (.*?) like mac os/);
        }
        if (!osversion)
            return [10];
        var rtn = [];
        osversion = osversion[1].split("_");
        for (var i = 0; i < osversion.length; i++) {
            rtn.push(parseInt(osversion[i]));
        }
        return rtn;
    }
    fw.getDeviceVer = getDeviceVer;
    var tempArea;
    function relativePath2fullPath(url) {
        !tempArea && (tempArea = document.createElement('A'));
        tempArea.href = url;
        url = tempArea.href;
        var prefix = "";
        var head = ["file://", "http://", "https://"];
        for (var i in head) {
            if (url.indexOf(head[i]) != -1) {
                url = url.replace(head[i], "");
                prefix = head[i];
                break;
            }
        }
        url = url.replace("//", "/");
        url = url.replace("/courses/", "/");
        if (prefix)
            url = prefix + url;
        return url;
    }
    fw.relativePath2fullPath = relativePath2fullPath;
    function checkGLRenderer() {
        var canvas;
        if (fw.Config.currentDirector) {
            canvas = fw.Config.currentDirector.app.view;
        }
        else {
            canvas = document.createElement("CANVAS");
        }
        var gl = canvas.getContext("experimental-webgl");
        var debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (!debugInfo || !debugInfo["UNMASKED_RENDERER_WEBGL"])
            return "";
        var glRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (!glRenderer)
            return "";
        return glRenderer;
    }
    fw.checkGLRenderer = checkGLRenderer;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var ResourceManager = (function (_super) {
        __extends(ResourceManager, _super);
        function ResourceManager() {
            var _this = _super.call(this) || this;
            _this.loadingQueue = [];
            _this.isLoading = false;
            _this.loader = new PIXI.loaders.Loader();
            _this.mapImages = new fw.HashMap();
            _this.mapTextureResources = new fw.HashMap();
            _this.mapAudios = new fw.HashMap();
            _this.mapAny = new fw.HashMap();
            _this.loadingQueue = [];
            _this.isLoading = false;
            _this.loader.onError.add(function (error) {
                fw.Log.error(error.message);
                if (error.message.indexOf("XMLHttpRequest") > 0) {
                    if (error.stack.indexOf("pixi-sound")) {
                        window.parent.postMessage({ type: "forceSoundEngine", data: 1 }, "*");
                    }
                    else {
                        window.parent.postMessage({ type: "decreasequality", data: {} }, "*");
                    }
                    location.reload();
                }
            });
            return _this;
        }
        Object.defineProperty(ResourceManager, "ins", {
            get: function () {
                return ResourceManager._ins || (ResourceManager._ins = new ResourceManager());
            },
            enumerable: true,
            configurable: true
        });
        ResourceManager.prototype.getHashMap = function (file) {
            var splitUrl = file.split(".");
            switch (splitUrl[splitUrl.length - 1]) {
                case "png":
                case "jpg":
                    return this.mapImages;
                case "mp3":
                case "wav":
                    return this.mapAudios;
                default:
                    return this.mapAny;
            }
        };
        ResourceManager.prototype.loadByGroup = function (resPath, onComplete, onProgress, thisObj) {
            var _this = this;
            var onResComplete = function (json) {
                var files = json.files;
                _this.loadByUrls(files, onComplete, onProgress, thisObj);
            };
            this.loadByUrl(resPath, onResComplete, this);
        };
        ResourceManager.prototype.loadByUrls = function (urls, onComplete, onProgress, thisObj) {
            var totalCount = urls.length;
            if (totalCount == 0) {
                onComplete && onComplete.call(thisObj);
                return;
            }
            var currentCount = 0;
            for (var i = 0; i < urls.length; i++) {
                this.loadByUrl(urls[i], onSingleComplete, this);
            }
            function onSingleComplete() {
                currentCount++;
                onProgress && onProgress.call(thisObj, currentCount / totalCount);
                if (currentCount >= totalCount && onComplete)
                    onComplete.call(thisObj);
            }
        };
        ResourceManager.prototype.loadByUrl = function (url, onComplete, thisObj) {
            var file = fw.cutFilename(url);
            this.loadingQueue.push({ file: file, path: url, onComplete: onComplete, thisObj: thisObj,
                isTextures: file.indexOf(".json") > 0 && file.indexOf("_ske") == -1 && file.indexOf("_tex") == -1 });
            if (this.isLoading)
                return;
            this.loadNextFile();
        };
        ResourceManager.prototype.loadNextFile = function () {
            var _this = this;
            var ele = this.loadingQueue.shift();
            if (!ele) {
                this.isLoading = false;
                return;
            }
            this.isLoading = true;
            var loadName = fw.cutFilename(ele.path);
            var map = this.getHashMap(loadName);
            var self = this;
            if (map.containsKey(loadName)) {
                ele.onComplete && ele.onComplete.call(ele.thisObj, map.getValue(loadName));
                this.loadNextFile();
                return;
            }
            var loaderPath = ele.path;
            if (fw.Config.jsTexturesMode && ele.file.indexOf(".json") >= 0 && !ele.isTextures) {
                loaderPath = ele.path.replace(".json", ".js");
                require([loaderPath], function (jsonMap) {
                    fw.Log.log("load " + loadName + " complete");
                    map.put(ele.file, jsonMap);
                    ele.onComplete && ele.onComplete.call(ele.thisObj, jsonMap);
                    self.loadNextFile.call(self);
                });
                return;
            }
            if (fw.Config.jsTexturesMode && ele.isTextures) {
                loaderPath = ele.path.replace(".json", ".png");
            }
            this.loader.add(loadName, loaderPath).load(function (loader, response) {
                if (!ele)
                    return;
                var res = response[loadName];
                if (res.error) {
                    delete _this.loader.resources[loadName];
                    _this.loadNextFile();
                    return;
                }
                fw.Log.log("load " + loadName + " complete");
                var resData, immediately = true;
                switch (res.extension) {
                    case "png":
                    case "jpg":
                        if (ele.isTextures) {
                            immediately = false;
                            var generateTextureResourceFromJS = function (res) {
                                _this.mapTextureResources.put(loadName, res);
                                resData = res;
                                ele && ele.onComplete && ele.onComplete.call(ele.thisObj, resData);
                                _this.loadNextFile();
                            };
                            fw.TexturesUtil.parseSpritesheet(ele.path.replace(".json", ".js"), res.texture, generateTextureResourceFromJS, _this);
                        }
                        else {
                            map.put(res.name, res.texture);
                            resData = res.texture;
                        }
                        break;
                    case "mp3":
                    case "wav":
                        if (PIXI.sound && res.sound) {
                            map.put(res.name, res.sound);
                            res.sound._instances = [];
                            res.sound._sprites = {};
                            resData = res.sound;
                        }
                        break;
                    case "json":
                        var generateTextureResource = function () {
                            var textures = new fw.TextureResource(res);
                            self.mapTextureResources.put(res.name, textures);
                            resData = res.textures;
                            ele && ele.onComplete && ele.onComplete.call(ele.thisObj, resData);
                            self.loadNextFile.call(self);
                        };
                        if (res.textures) {
                            immediately = false;
                            generateTextureResource();
                        }
                        else if (res.data["meta"]) {
                            immediately = false;
                            _this.spritesheetParser(res, generateTextureResource);
                        }
                        else {
                            map.put(res.name, res.data);
                            resData = res.data;
                        }
                        break;
                    default:
                        map.put(res.name, res.data);
                        resData = res.data;
                        break;
                }
                if (immediately) {
                    ele.onComplete && ele.onComplete.call(ele.thisObj, resData);
                    _this.loadNextFile();
                }
            });
        };
        ResourceManager.prototype.spritesheetParser = function (resource, onComplete) {
            var imageResourceName = resource.name + "_image";
            if (!resource.data
                || !resource.data.frames
                || this.loader.resources[imageResourceName]) {
                return;
            }
            var loadOptions = {
                crossOrigin: resource.crossOrigin,
                loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE,
                metadata: resource.metadata["imageMetadata"],
                parentResource: resource,
            };
            var resourcePath = resource.url.replace("json", "png");
            this.loader.add(imageResourceName, resourcePath, loadOptions, function onImageLoad(res) {
                var spritesheet = new PIXI.Spritesheet(res.texture.baseTexture, resource.data, resource.url);
                spritesheet.parse(function () {
                    resource.spritesheet = spritesheet;
                    resource.textures = spritesheet.textures;
                });
                onComplete();
            });
        };
        ResourceManager.prototype.getTextureResource = function (name) {
            return this.mapTextureResources.getValue(name);
        };
        ResourceManager.prototype.getTexture = function (name) {
            return this.mapImages.getValue(name);
        };
        ResourceManager.prototype.getAudio = function (name) {
            return this.mapAudios.getValue(name);
        };
        ResourceManager.prototype.getJson = function (name) {
            return this.mapAny.getValue(name);
        };
        ResourceManager.prototype.createSprite = function (name, xpos, ypos, interactive) {
            if (xpos === void 0) { xpos = 0; }
            if (ypos === void 0) { ypos = 0; }
            if (interactive === void 0) { interactive = false; }
            var sprite = new PIXI.Sprite();
            fw.HashObject.InjectHashCode(sprite);
            var texture = this.mapImages.getValue(name);
            if (texture)
                sprite.texture = texture;
            sprite.interactive = interactive;
            sprite.x = xpos;
            sprite.y = ypos;
            return sprite;
        };
        ResourceManager.prototype.createLabel = function (text, xpos, ypos, size, color, align) {
            if (xpos === void 0) { xpos = 0; }
            if (ypos === void 0) { ypos = 0; }
            if (size === void 0) { size = 27; }
            if (color === void 0) { color = 0xffffff; }
            if (align === void 0) { align = "center"; }
            var font = fw.getDeviceType();
            if (font == fw.DeviceType.iPad)
                font = "STHeitiSC-Medium";
            else if (font == fw.DeviceType.Mac)
                font = "STHeitiSC-Medium";
            else
                font = "Microsoft YaHei";
            var label = new PIXI.Text(text, {
                fontFamily: font,
                fontSize: size,
                fill: color
            });
            fw.HashObject.InjectHashCode(label);
            label.anchor.x = align == "left" ? 0 : (align == "center" ? 0.5 : 1);
            label.anchor.y = 0.5;
            label.x = xpos;
            label.y = ypos;
            return label;
        };
        ResourceManager.prototype.destroyResource = function (name) {
            var map = this.getHashMap(name);
            var res = map.remove(name);
            if (res) {
                if (res instanceof PIXI.Texture) {
                    res.destroy(true);
                    PIXI.Texture.removeFromCache(res);
                }
                else if (res instanceof PIXI.sound.Sound) {
                    PIXI.sound.remove(name);
                }
                else {
                    res["destroy"] && res["destroy"]();
                }
            }
            res = this.loader.resources[name];
            if (res) {
                delete this.loader.resources[name];
                PIXI.Texture.removeFromCache(name);
                PIXI.BaseTexture.removeFromCache(name);
                PIXI.Texture.removeFromCache(res.url);
                PIXI.BaseTexture.removeFromCache(res.url);
                fw.Log.log("destroy " + name + " complete");
            }
            if (name.indexOf(".json") != -1) {
                var textureResource = this.mapTextureResources.getValue(name);
                if (textureResource) {
                    this.mapTextureResources.remove(name);
                    textureResource.destroy();
                    fw.Log.log("destroy TextureResource " + name + " complete");
                    delete this.loader.resources[name + "_image"];
                }
            }
        };
        ResourceManager.prototype.destroy = function () {
            var _this = this;
            this.mapImages.eachKey(function (key) {
                var res = _this.mapImages.remove(key);
                res.destroy(true);
                var succeed = _this.loader.resources[key];
                delete _this.loader.resources[key];
                PIXI.Texture.removeFromCache(key);
                PIXI.BaseTexture.removeFromCache(key);
                succeed && fw.Log.log("destroy " + key + " complete");
            }, this);
            this.mapImages = new fw.HashMap();
            this.mapTextureResources.eachKey(function (key) {
                var textureResource = _this.mapTextureResources.remove(key);
                textureResource.destroy();
                fw.Log.log("destroy TextureResource " + key + " complete");
                delete _this.loader.resources[key + "_image"];
            }, this);
            this.mapTextureResources = new fw.HashMap();
            this.mapAudios.eachKey(function (key) {
                _this.mapAudios.remove(key);
                PIXI.sound.remove(key);
                fw.Log.log("destroy " + key + " complete");
            }, this);
            this.mapAudios = new fw.HashMap();
            PIXI.sound && PIXI.sound.removeAll();
            this.mapAny.eachKey(function (key) {
                var res = _this.mapAny.remove(key);
                res["destroy"] && res["destroy"]();
                fw.Log.log("destroy " + key + " complete");
            }, this);
            this.mapAny = new fw.HashMap();
            this.loadingQueue = [];
            this.isLoading = false;
            this.loader.onError.detachAll();
            this.loader.reset();
            this.loader.destroy();
            this.loader = null;
            ResourceManager._ins = null;
        };
        return ResourceManager;
    }(fw.HashObject));
    fw.ResourceManager = ResourceManager;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var SceneManager;
    (function (SceneManager) {
        var navigator;
        function current() {
            !navigator && (navigator = new fw.SceneNavigator());
            return navigator.currentProps ? navigator.currentProps.content : undefined;
        }
        SceneManager.current = current;
        function setCurrentScene(scene, data, align, resourcePath, hasModal) {
            if (hasModal === void 0) { hasModal = false; }
            !navigator && (navigator = new fw.SceneNavigator());
            return navigator.setCurrentScene(scene, data, align, resourcePath, hasModal);
        }
        SceneManager.setCurrentScene = setCurrentScene;
        function getScene(scene) {
            !navigator && (navigator = new fw.SceneNavigator());
            return navigator.getScene(scene);
        }
        SceneManager.getScene = getScene;
        function destroyAllScene() {
            !navigator && (navigator = new fw.SceneNavigator());
            return navigator.destroyAllScene();
        }
        SceneManager.destroyAllScene = destroyAllScene;
    })(SceneManager = fw.SceneManager || (fw.SceneManager = {}));
})(fw || (fw = {}));
var fw;
(function (fw) {
    var SoundManager;
    (function (SoundManager) {
        function selectEngine() {
            var device = fw.getDeviceType();
            if (device == fw.DeviceType.iPad)
                return new fw.NativeAudioIFrameEngine();
            else {
                if (PIXI.sound)
                    return new fw.WebAudioEngine();
                else
                    return new fw.HTMLAudioEngine();
            }
        }
        function addSound(name, url, isMusic) {
            if (isMusic === void 0) { isMusic = false; }
            !SoundManager.engine && (SoundManager.engine = selectEngine());
            return SoundManager.engine.addSound(name, url, isMusic);
        }
        SoundManager.addSound = addSound;
        function playSound(name, url, loop, isMusic, compatibility) {
            if (url === void 0) { url = ""; }
            if (loop === void 0) { loop = false; }
            if (isMusic === void 0) { isMusic = false; }
            if (compatibility === void 0) { compatibility = true; }
            !SoundManager.engine && (SoundManager.engine = selectEngine());
            return SoundManager.engine.playSound(name, url, loop, isMusic);
        }
        SoundManager.playSound = playSound;
        function setSoundVolume(value) {
            SoundManager.engine && SoundManager.engine.setSoundVolume(value);
        }
        SoundManager.setSoundVolume = setSoundVolume;
        function getSoundVolume() {
            return SoundManager.engine ? SoundManager.engine.getSoundVolume() : 0;
        }
        SoundManager.getSoundVolume = getSoundVolume;
        function setMusicVolume(value) {
            SoundManager.engine && SoundManager.engine.setMusicVolume(value);
        }
        SoundManager.setMusicVolume = setMusicVolume;
        function getMusicVolume() {
            return SoundManager.engine ? SoundManager.engine.getMusicVolume() : 0;
        }
        SoundManager.getMusicVolume = getMusicVolume;
        function stopSound(name) {
            SoundManager.engine && SoundManager.engine.stopSound(name);
        }
        SoundManager.stopSound = stopSound;
        function removeSound(name) {
            SoundManager.engine && SoundManager.engine.removeSound(name);
        }
        SoundManager.removeSound = removeSound;
        function removeAllSound() {
            SoundManager.engine && SoundManager.engine.removeAllSound();
        }
        SoundManager.removeAllSound = removeAllSound;
        function destroy() {
            SoundManager.engine && SoundManager.engine.destroy();
        }
        SoundManager.destroy = destroy;
    })(SoundManager = fw.SoundManager || (fw.SoundManager = {}));
})(fw || (fw = {}));
var fw;
(function (fw) {
    var TextureResource = (function (_super) {
        __extends(TextureResource, _super);
        function TextureResource(source) {
            var _this = _super.call(this) || this;
            if (source instanceof PIXI.loaders.Resource) {
                _this.source = source;
                _this.spritesheet = source.spritesheet;
                _this.textures = source.textures;
            }
            else {
                _this.spritesheet = source;
                _this.textures = source.textures;
            }
            return _this;
        }
        TextureResource.prototype.getTexture = function (name) {
            return this.textures[name];
        };
        TextureResource.prototype.createSprite = function (name, xpos, ypos, interactive) {
            if (xpos === void 0) { xpos = 0; }
            if (ypos === void 0) { ypos = 0; }
            if (interactive === void 0) { interactive = false; }
            var sprite = new PIXI.Sprite(name ? this.textures[name] : undefined);
            fw.HashObject.InjectHashCode(sprite);
            sprite.interactive = interactive;
            sprite.x = xpos;
            sprite.y = ypos;
            return sprite;
        };
        TextureResource.prototype.createButton = function (name, xpos, ypos, clickHandler, thisObj, args) {
            if (xpos === void 0) { xpos = 0; }
            if (ypos === void 0) { ypos = 0; }
            var button = new fw.GButton(this.textures[name]);
            button.x = xpos;
            button.y = ypos;
            button.on("tap", onTouch);
            button.on("click", onTouch);
            function onTouch(evt) {
                if (clickHandler) {
                    if (args)
                        clickHandler.call(thisObj, args);
                    else
                        clickHandler.call(thisObj);
                }
            }
            return button;
        };
        TextureResource.prototype.createProgressBar = function (name, xpos, ypos, width, height) {
            if (xpos === void 0) { xpos = 0; }
            if (ypos === void 0) { ypos = 0; }
            var nameParams = (typeof name == "string") ? { bg: name + "_bg.png", fg: name + "_fg.png" } : name;
            var progressBar = new fw.GProgressBar(this.textures[nameParams.bg], this.textures[nameParams.fg], width, height);
            progressBar.x = xpos;
            progressBar.y = ypos;
            return progressBar;
        };
        TextureResource.prototype.createLabel = function (text, xpos, ypos, size, color, align) {
            if (xpos === void 0) { xpos = 0; }
            if (ypos === void 0) { ypos = 0; }
            if (size === void 0) { size = 27; }
            if (color === void 0) { color = 0xffffff; }
            if (align === void 0) { align = "center"; }
            var font = fw.getDeviceType();
            if (font == fw.DeviceType.iPad)
                font = "STHeitiSC-Medium";
            else if (font == fw.DeviceType.Mac)
                font = "STHeitiSC-Medium";
            else
                font = "Microsoft YaHei";
            var label = new PIXI.Text(text, {
                fontFamily: font,
                fontSize: size,
                fill: color,
                align: align
            });
            fw.HashObject.InjectHashCode(label);
            label.anchor.x = align == "left" ? 0 : (align == "center" ? 0.5 : 1);
            label.anchor.y = 0.5;
            label.x = xpos;
            label.y = ypos;
            return label;
        };
        TextureResource.prototype.createAnimatedSprite = function (animationName, xpos, ypos, loop, onCompleteHandler, thisObj, args) {
            if (xpos === void 0) { xpos = 0; }
            if (ypos === void 0) { ypos = 0; }
            if (loop === void 0) { loop = false; }
            var mc = new PIXI.extras.AnimatedSprite(this.spritesheet.animations[animationName]);
            fw.HashObject.InjectHashCode(mc);
            mc.x = xpos;
            mc.y = ypos;
            mc.animationSpeed = 0.2;
            mc.loop = loop;
            mc.onComplete = function () {
                mc.gotoAndStop(0);
                if (onCompleteHandler) {
                    if (args)
                        onCompleteHandler.call(thisObj, args);
                    else
                        onCompleteHandler.call(thisObj);
                }
            };
            return mc;
        };
        TextureResource.prototype.destroy = function () {
            this.source && this.source.spritesheet && this.source.spritesheet.destroy(true);
            for (var key in this.textures) {
                PIXI.Texture.removeFromCache(this.textures[key]);
            }
            this.textures = null;
        };
        return TextureResource;
    }(fw.HashObject));
    fw.TextureResource = TextureResource;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var TimerManager = (function (_super) {
        __extends(TimerManager, _super);
        function TimerManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TimerManager.addClock = function (clockID, seconds, updateDelay, repeatCount, totalSeconds, speedFactor) {
            if (seconds === void 0) { seconds = 0; }
            if (updateDelay === void 0) { updateDelay = 1000; }
            if (repeatCount === void 0) { repeatCount = 1; }
            if (totalSeconds === void 0) { totalSeconds = -1; }
            if (speedFactor === void 0) { speedFactor = 1; }
            var clock = TimerManager.getClock(clockID);
            if (clock == null) {
                clock = new TimerClock(clockID, updateDelay);
                TimerManager.clockMap[clockID] = clock;
            }
            if (seconds >= 0) {
                TimerManager.start();
                clock.start(seconds, repeatCount, totalSeconds, speedFactor);
            }
            else {
                fw.Log.error(null, "[TimerManager]addClock seconds不允许小于0.");
            }
            return clock;
        };
        TimerManager.removeClock = function (clockID) {
            if (TimerManager.clockMap[clockID]) {
                TimerManager.getClock(clockID).stop();
                delete TimerManager.clockMap[clockID];
            }
        };
        TimerManager.getClock = function (clockID, autoCreate) {
            if (autoCreate === void 0) { autoCreate = false; }
            var clock = TimerManager.clockMap[clockID];
            if (autoCreate && clock == null) {
                clock = new TimerClock(clockID);
                TimerManager.clockMap[clockID] = clock;
            }
            return clock;
        };
        TimerManager.start = function () {
            if (TimerManager.running)
                return;
            TimerManager.lastTime = fw.getTimer();
            PIXI.ticker.shared.start();
            PIXI.ticker.shared.add(TimerManager.tick);
            TimerManager.running = true;
        };
        TimerManager.stop = function (clockID) {
            if (clockID === void 0) { clockID = null; }
            if (clockID == null) {
                if (!TimerManager.running)
                    return;
                PIXI.ticker.shared.remove(TimerManager.tick);
                PIXI.ticker.shared.stop();
                TimerManager.running = false;
            }
            else {
                if (TimerManager.clockMap[clockID])
                    TimerManager.getClock(clockID).stop();
            }
        };
        TimerManager.pause = function (clockID) {
            if (clockID === void 0) { clockID = null; }
            if (clockID == null) {
                if (!TimerManager.running)
                    return;
                PIXI.ticker.shared.remove(TimerManager.tick);
                TimerManager.running = false;
            }
            else {
                if (TimerManager.clockMap[clockID])
                    TimerManager.getClock(clockID).pause();
            }
        };
        TimerManager.resume = function (clockID) {
            if (clockID === void 0) { clockID = null; }
            if (clockID == null) {
                if (TimerManager.running)
                    return;
                PIXI.ticker.shared.add(TimerManager.tick);
                TimerManager.running = true;
                TimerManager.lastTime = fw.getTimer();
            }
            else {
                if (TimerManager.clockMap[clockID])
                    TimerManager.getClock(clockID).resume();
            }
        };
        TimerManager.tick = function (frameDelta) {
            if (!TimerManager.running)
                return;
            var currentTime = fw.getTimer();
            var passedTime = currentTime - TimerManager.lastTime;
            TimerManager.lastTime = currentTime;
            for (var i in TimerManager.clockMap) {
                var clock = TimerManager.clockMap[i];
                if (clock.running) {
                    clock.update(passedTime, TimerManager, TimerManager.checkActive);
                }
            }
        };
        TimerManager.checkActive = function () {
            var activeCount = 0;
            for (var i in TimerManager.clockMap) {
                var clock = TimerManager.clockMap[i];
                activeCount += clock.running ? 1 : 0;
            }
            if (activeCount == 0)
                TimerManager.pause();
            else
                TimerManager.resume();
        };
        TimerManager.clockMap = {};
        TimerManager.lastTime = 0;
        return TimerManager;
    }(fw.HashObject));
    fw.TimerManager = TimerManager;
    var TimerClock = (function () {
        function TimerClock(id, updateDelay) {
            if (updateDelay === void 0) { updateDelay = 1000; }
            this.totalTime = -1000;
            this.m_passedTime = 0;
            this.speedFactor = 1;
            this.repeatCount = 0;
            this.currentCount = 0;
            this.updateDelay = 0;
            this.currentUpdateDelay = 0;
            this.passedUpdateTime = 0;
            this.callBackMap = new fw.HashMap();
            this.id = id;
            this.running = false;
            this.updateDelay = updateDelay;
        }
        TimerClock.prototype.registCallBack = function (thisObject, onComplete, onProgress) {
            this.callBackMap.put(thisObject, { thisObject: thisObject, onComplete: onComplete, onProgress: onProgress });
            if (onProgress != null) {
                onProgress.call(thisObject, this.progress);
            }
            if (onComplete != null) {
                if (this.progress == 1)
                    onComplete.call(thisObject);
            }
        };
        TimerClock.prototype.removeCallBack = function (thisObject) {
            this.callBackMap.remove(thisObject);
        };
        TimerClock.prototype.start = function (seconds, repeatCount, totalSeconds, speedFactor) {
            if (repeatCount === void 0) { repeatCount = 1; }
            if (totalSeconds === void 0) { totalSeconds = -1; }
            if (speedFactor === void 0) { speedFactor = 1; }
            if (this.running)
                this.stop();
            totalSeconds = (totalSeconds > 0) ? totalSeconds : seconds;
            this.totalTime = totalSeconds * 1000;
            this.passedTime = (totalSeconds - seconds) * 1000;
            this.speedFactor = speedFactor;
            this.currentCount = 1;
            this.repeatCount = repeatCount;
            this.currentUpdateDelay = Math.min(this.updateDelay, this.totalTime);
            if (this.totalTime > 0) {
                this.running = true;
            }
            else {
                this.callBackMap.eachValue(this.postComplete, this);
            }
        };
        TimerClock.prototype.pause = function () {
            this.running = false;
        };
        TimerClock.prototype.resume = function () {
            this.running = true;
        };
        TimerClock.prototype.stop = function () {
            this.running = false;
            this.passedUpdateTime = 0;
            this.passedTime = 0;
            this.currentCount = 1;
        };
        TimerClock.prototype.dispose = function () {
            this.stop();
            this.callBackMap.clear();
        };
        TimerClock.prototype.update = function (deltaTime, thisObject, onComplete) {
            if (!this.running)
                return;
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
                    }
                    else {
                        this.passedTime -= this.totalTime;
                    }
                }
            }
        };
        Object.defineProperty(TimerClock.prototype, "leftTime", {
            get: function () {
                return this.totalTime - this.passedTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimerClock.prototype, "leftTimeFormat", {
            get: function () {
                return fw.NumberFormatter.formatTime(this.leftTime);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimerClock.prototype, "passedTime", {
            get: function () {
                return this.m_passedTime;
            },
            set: function (value) {
                this.m_passedTime = Math.min(value, this.totalTime);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimerClock.prototype, "progress", {
            get: function () {
                return this.m_passedTime ? (this.m_passedTime / this.totalTime) : 0;
            },
            enumerable: true,
            configurable: true
        });
        TimerClock.prototype.postProgress = function (value) {
            var func = value.onProgress;
            var thisObject = value.thisObject;
            if (func)
                func.call(thisObject, this.progress);
        };
        TimerClock.prototype.postComplete = function (value) {
            var func = value.onComplete;
            var thisObject = value.thisObject;
            if (func)
                func.call(thisObject);
        };
        return TimerClock;
    }());
    fw.TimerClock = TimerClock;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var BSpline = (function () {
        function BSpline(inputX, inputY, segmentNum, beClosed) {
            if (segmentNum === void 0) { segmentNum = 20; }
            if (beClosed === void 0) { beClosed = false; }
            this.segmentNum = segmentNum;
            this.beClosed = beClosed;
            this.num = Math.min(inputX.length, inputY.length);
            this.inputPos = [];
            for (var i = 0; i < this.num; i++) {
                this.inputPos.push({ x: inputX[i], y: inputY[i] });
            }
            if (beClosed && (inputX[0] != inputX[this.num - 1] || inputY[0] != inputY[this.num - 1])) {
                inputX = inputX.concat();
                inputY = inputY.concat();
                inputX.push(inputX[0]);
                inputY.push(inputY[0]);
                this.inputPos.push({ x: inputX[0], y: inputY[0] });
                this.num++;
            }
            var c2 = beClosed ? this.num - 1 : 1;
            var c3 = beClosed ? 2 : this.num;
            var validX = this.inverse(inputX, this.num, c2, c3);
            var validY = this.inverse(inputY, this.num, c2, c3);
            this.ctrlPos = [];
            for (var i = 0; i < Math.min(validX.length, validY.length); i++) {
                this.ctrlPos.push({ x: validX[i], y: validY[i] });
            }
            this.num = this.num + 2;
            this.subdivisionCurve();
        }
        BSpline.prototype.inverse = function (subValues, num, c2, c3) {
            var esp, maxesp;
            var genValues = subValues.concat();
            genValues.unshift(subValues[c2 - 1]);
            genValues.push(subValues[c3 - 1]);
            do {
                maxesp = 0;
                for (var i = 1; i <= num; i++) {
                    esp = subValues[i - 1] - genValues[i] + (subValues[i - 1] - (genValues[i - 1] + genValues[i + 1]) / 2) / 2;
                    genValues[i] += esp;
                    Math.abs(esp) > maxesp && (maxesp = Math.abs(esp));
                    genValues[0] = genValues[c2];
                    genValues[num + 1] = genValues[c3];
                }
            } while (maxesp > 3);
            return genValues;
        };
        BSpline.prototype.subdivisionCurve = function () {
            if (this.segmentNum < 0)
                return;
            var e1 = new Array(this.segmentNum);
            var e2 = new Array(this.segmentNum);
            var e3 = new Array(this.segmentNum);
            var e4 = new Array(this.segmentNum);
            var x1, x2, x3, x4, y1, y2, y3, y4;
            for (var i = 0; i < this.segmentNum; i++) {
                var t = (i + 1) / this.segmentNum;
                e1[i] = (((3 - t) * t - 3) * t + 1) / 6;
                e2[i] = ((3 * t - 6) * t * t + 4) / 6;
                e3[i] = (((3 - 3 * t) * t + 3) * t + 1) / 6;
                e4[i] = t * t * t / 6;
            }
            x2 = this.ctrlPos[0].x;
            x3 = this.ctrlPos[1].x;
            x4 = this.ctrlPos[2].x;
            y2 = this.ctrlPos[0].y;
            y3 = this.ctrlPos[1].y;
            y4 = this.ctrlPos[2].y;
            this.subdivisionPos = [];
            this.subdivisionPos.push({ x: (x2 + 4 * x3 + x4) / 6, y: (y2 + 4 * y3 + y4) / 6 });
            for (var i = 3; i < this.num; i++) {
                x1 = x2;
                x2 = x3;
                x3 = x4;
                x4 = this.ctrlPos[i].x;
                y1 = y2;
                y2 = y3;
                y3 = y4;
                y4 = this.ctrlPos[i].y;
                for (var j = 0; j < this.segmentNum; j++) {
                    this.subdivisionPos.push({
                        x: e1[j] * x1 + e2[j] * x2 + e3[j] * x3 + e4[j] * x4,
                        y: e1[j] * y1 + e2[j] * y2 + e3[j] * y3 + e4[j] * y4
                    });
                }
            }
        };
        BSpline.prototype.drawCtrlPoint = function (container, circleSize, color) {
            if (circleSize === void 0) { circleSize = 10; }
            if (color === void 0) { color = 0xffffff; }
            var pos = this.inputPos;
            var marksBoard = new PIXI.Graphics();
            container.addChild(marksBoard);
            marksBoard.lineStyle(2, color);
            for (var i = 0; i < (this.beClosed ? pos.length - 1 : pos.length); i++) {
                marksBoard.beginFill(0, 0);
                marksBoard.drawCircle(pos[i].x, pos[i].y, circleSize);
                marksBoard.endFill();
                var labelCount = new PIXI.Text((i + 1).toString(), {
                    fontSize: 20,
                    fill: color
                });
                labelCount.anchor.x = labelCount.anchor.y = 0.5;
                labelCount.x = pos[i].x;
                labelCount.y = pos[i].y;
                marksBoard.addChild(labelCount);
            }
            return marksBoard;
        };
        BSpline.prototype.drawLine = function (board, lineWidth, color) {
            if (lineWidth === void 0) { lineWidth = 4; }
            if (color === void 0) { color = 0xffffff; }
            if (this.segmentNum < 0)
                return;
            board.lineStyle(lineWidth, color);
            board.moveTo(this.subdivisionPos[0].x, this.subdivisionPos[0].y);
            for (var i = 1; i < this.subdivisionPos.length; i++) {
                board.lineTo(this.subdivisionPos[i].x, this.subdivisionPos[i].y);
            }
        };
        BSpline.prototype.getLinePoints = function () {
            return this.subdivisionPos;
        };
        return BSpline;
    }());
    fw.BSpline = BSpline;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var MathUtils;
    (function (MathUtils) {
        function keepRange(min, input, max) {
            return Math.max(Math.min(input, max), min);
        }
        MathUtils.keepRange = keepRange;
        function GetPointDistance(fromX, fromY, toX, toY) {
            return Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY));
        }
        MathUtils.GetPointDistance = GetPointDistance;
        function isContain(point, rect) {
            return point.x > rect.x && point.x < (rect.x + rect.width) && point.y > rect.y && (point.y < rect.y + rect.height);
        }
        MathUtils.isContain = isContain;
        function seedRandom(seed, max, min) {
            if (max === void 0) { max = 1; }
            if (min === void 0) { min = 0; }
            var seed2 = (seed * 9301 + 49297) % 233280;
            var rnd = seed2 / 233280.0;
            rnd = min + rnd * (max - min);
            rnd = rnd * 971 - Math.floor(rnd * 971);
            return rnd;
        }
        MathUtils.seedRandom = seedRandom;
        function ran2deg(value) {
            return 180 / Math.PI * value;
        }
        MathUtils.ran2deg = ran2deg;
        function deg2ran(value) {
            return value / (180 / Math.PI);
        }
        MathUtils.deg2ran = deg2ran;
    })(MathUtils = fw.MathUtils || (fw.MathUtils = {}));
})(fw || (fw = {}));
var fw;
(function (fw) {
    var Vector = (function () {
        function Vector(x, y) {
            this._x = x;
            this._y = y;
        }
        Vector.prototype.getDistance = function (x, y) {
            var a = (this._x - x) * (this._x - x) + (this._y - y) * (this._y - y);
            var l = Math.sqrt(a);
            var w = Math.floor(l);
            if (l - w < 0.00001) {
                return w;
            }
            return l;
        };
        Vector.prototype.getNormal = function () {
            var n = this._x * this._x + this._y * this._y;
            if (n === 1) {
                return this;
            }
            n = Math.sqrt(n);
            if (n < Number.MIN_VALUE) {
                return this;
            }
            n = 1 / n;
            var x = this._x * n;
            var y = this._y * n;
            return new Vector(x, y);
        };
        Vector.prototype.normal = function () {
            return this.getNormal();
        };
        Vector.prototype.add = function (vec) {
            var x = this._x + vec._x;
            var y = this._y + vec._y;
            return new Vector(x, y);
        };
        Vector.prototype.sub = function (vec) {
            var x = this._x - vec._x;
            var y = this._y - vec._y;
            return new Vector(x, y);
        };
        Vector.prototype.multValue = function (value) {
            var x = this._x * value;
            var y = this._y * value;
            return new Vector(x, y);
        };
        Vector.prototype.addValue = function (value) {
            var x = this._x + value;
            var y = this._y + value;
            return new Vector(x, y);
        };
        return Vector;
    }());
    fw.Vector = Vector;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var ParticleLayer = (function (_super) {
        __extends(ParticleLayer, _super);
        function ParticleLayer(designWidth, designHeight, textures, config, touchEmit, type, useParticleContainer, colorListConfig) {
            if (touchEmit === void 0) { touchEmit = true; }
            if (useParticleContainer === void 0) { useParticleContainer = false; }
            var _this = _super.call(this) || this;
            fw.HashObject.InjectHashCode(_this);
            _this.designWidth = designWidth;
            _this.designHeight = designHeight;
            _this.interactive = _this.interactiveChildren = true;
            _this.elapsed = Date.now();
            var container;
            if (useParticleContainer) {
                if (PIXI.particles.ParticleContainer) {
                    container = new PIXI.particles.ParticleContainer();
                    container.setProperties({
                        scale: true,
                        position: true,
                        rotation: true,
                        uvs: true,
                        alpha: true
                    });
                    _this.addChild(container);
                }
                else {
                    container = _this;
                }
            }
            else {
                container = _this;
            }
            if (fw.Config.quality >= 2) {
                _this.emitter = new PIXI.particles.Emitter(container, textures, config);
                if (colorListConfig)
                    _this.emitter.startColor = PIXI.particles.ParticleUtils.createSteppedGradient(colorListConfig.list, colorListConfig.stepColors);
                if (type == "path")
                    _this.emitter.particleConstructor = PIXI.particles.PathParticle;
                else if (type == "anim")
                    _this.emitter.particleConstructor = PIXI.particles.AnimatedParticle;
            }
            if (touchEmit) {
                container.on('pointerup', function (evt) {
                    var pos = evt.data.getLocalPosition(_this);
                    _this.emitParticle(pos.x, pos.y);
                });
            }
            else {
                _this.emitParticle();
            }
            return _this;
        }
        ParticleLayer.prototype.emitParticle = function (x, y) {
            if (!this.emitter)
                return;
            if (!this.timer) {
                this.timer = fw.TimerManager.addClock("ParticleLayer" + fw.HashObject.GetHashCode(this), 9999, 10);
                this.timer.registCallBack(this, undefined, this.update);
            }
            this.emitter.emit = true;
            this.emitter.resetPositionTracking();
            this.emitter.updateOwnerPos(x || this.designWidth / 2, y || this.designHeight / 2);
        };
        ParticleLayer.prototype.update = function () {
            var now = Date.now();
            if (this.emitter)
                this.emitter.update((now - this.elapsed) * 0.001);
            this.elapsed = now;
        };
        ParticleLayer.prototype.destroy = function () {
            if (this.timer) {
                this.timer.removeCallBack(this);
                fw.TimerManager.removeClock("ParticleLayer" + fw.HashObject.GetHashCode(this));
                this.timer = null;
            }
            this.emitter && this.emitter.destroy();
            this.emitter = null;
            this.removeAllListeners();
            this.removeChildren();
            fw.DisplayUtil.removeFromParent(this);
        };
        return ParticleLayer;
    }(PIXI.Container));
    fw.ParticleLayer = ParticleLayer;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var Ease = (function () {
        function Ease() {
        }
        Ease.get = function (amount) {
            if (amount < -1) {
                amount = -1;
            }
            if (amount > 1) {
                amount = 1;
            }
            return function (t) {
                if (amount == 0) {
                    return t;
                }
                if (amount < 0) {
                    return t * (t * -amount + 1 + amount);
                }
                return t * ((2 - t) * amount + (1 - amount));
            };
        };
        Ease.getPowIn = function (pow) {
            return function (t) {
                return Math.pow(t, pow);
            };
        };
        Ease.getPowOut = function (pow) {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            };
        };
        Ease.getPowInOut = function (pow) {
            return function (t) {
                if ((t *= 2) < 1)
                    return 0.5 * Math.pow(t, pow);
                return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            };
        };
        Ease.sineIn = function (t) {
            return 1 - Math.cos(t * Math.PI / 2);
        };
        Ease.sineOut = function (t) {
            return Math.sin(t * Math.PI / 2);
        };
        Ease.sineInOut = function (t) {
            return -0.5 * (Math.cos(Math.PI * t) - 1);
        };
        Ease.getBackIn = function (amount) {
            return function (t) {
                return t * t * ((amount + 1) * t - amount);
            };
        };
        Ease.getBackOut = function (amount) {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            };
        };
        Ease.getBackInOut = function (amount) {
            amount *= 1.525;
            return function (t) {
                if ((t *= 2) < 1)
                    return 0.5 * (t * t * ((amount + 1) * t - amount));
                return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
            };
        };
        Ease.circIn = function (t) {
            return -(Math.sqrt(1 - t * t) - 1);
        };
        Ease.circOut = function (t) {
            return Math.sqrt(1 - (--t) * t);
        };
        Ease.circInOut = function (t) {
            if ((t *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        };
        Ease.bounceIn = function (t) {
            return 1 - Ease.bounceOut(1 - t);
        };
        Ease.bounceOut = function (t) {
            if (t < 1 / 2.75) {
                return (7.5625 * t * t);
            }
            else if (t < 2 / 2.75) {
                return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            }
            else if (t < 2.5 / 2.75) {
                return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            }
            else {
                return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }
        };
        Ease.bounceInOut = function (t) {
            if (t < 0.5)
                return Ease.bounceIn(t * 2) * .5;
            return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        };
        Ease.getElasticIn = function (amplitude, period) {
            var pi2 = Math.PI * 2;
            return function (t) {
                if (t == 0 || t == 1)
                    return t;
                var s = period / pi2 * Math.asin(1 / amplitude);
                return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            };
        };
        Ease.getElasticOut = function (amplitude, period) {
            var pi2 = Math.PI * 2;
            return function (t) {
                if (t == 0 || t == 1)
                    return t;
                var s = period / pi2 * Math.asin(1 / amplitude);
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
            };
        };
        Ease.getElasticInOut = function (amplitude, period) {
            var pi2 = Math.PI * 2;
            return function (t) {
                var s = period / pi2 * Math.asin(1 / amplitude);
                if ((t *= 2) < 1)
                    return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
                return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
            };
        };
        Ease.quadIn = Ease.getPowIn(2);
        Ease.quadOut = Ease.getPowOut(2);
        Ease.quadInOut = Ease.getPowInOut(2);
        Ease.cubicIn = Ease.getPowIn(3);
        Ease.cubicOut = Ease.getPowOut(3);
        Ease.cubicInOut = Ease.getPowInOut(3);
        Ease.quartIn = Ease.getPowIn(4);
        Ease.quartOut = Ease.getPowOut(4);
        Ease.quartInOut = Ease.getPowInOut(4);
        Ease.quintIn = Ease.getPowIn(5);
        Ease.quintOut = Ease.getPowOut(5);
        Ease.quintInOut = Ease.getPowInOut(5);
        Ease.backIn = Ease.getBackIn(1.7);
        Ease.backOut = Ease.getBackOut(1.7);
        Ease.backInOut = Ease.getBackInOut(1.7);
        Ease.elasticIn = Ease.getElasticIn(1, 0.3);
        Ease.elasticOut = Ease.getElasticOut(1, 0.3);
        Ease.elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
        return Ease;
    }());
    fw.Ease = Ease;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var Tween = (function (_super) {
        __extends(Tween, _super);
        function Tween(target, props, pluginData) {
            var _this = _super.call(this) || this;
            _this._target = null;
            _this._useTicks = false;
            _this.ignoreGlobalPause = false;
            _this.loop = false;
            _this.pluginData = null;
            _this._steps = [];
            _this.paused = false;
            _this.duration = 0;
            _this._prevPos = -1;
            _this.position = NaN;
            _this._prevPosition = 0;
            _this._stepPosition = 0;
            _this.passive = false;
            if (fw.Config.quality <= 0) {
                props = props || {};
                props.paused = true;
            }
            _this.initialize(target, props, pluginData);
            return _this;
        }
        Tween.get = function (target, props, pluginData, override) {
            if (pluginData === void 0) { pluginData = null; }
            if (override === void 0) { override = false; }
            if (override) {
                Tween.removeTweens(target);
            }
            return new Tween(target, props, pluginData);
        };
        Tween.removeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        };
        Tween.pauseTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                }
            }
        };
        Tween.resumeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = false;
                }
            }
        };
        Tween.tick = function (delta, paused) {
            if (paused === void 0) { paused = false; }
            var timeNow = fw.getTimer();
            var deltaTime = timeNow - Tween._lastTime;
            Tween._lastTime = timeNow;
            var tweens = Tween._tweens.concat();
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.$tick(tween._useTicks ? 1 : deltaTime);
            }
            return false;
        };
        Tween._register = function (tween, value) {
            var target = tween._target;
            var tweens = Tween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
                if (!Tween._inited) {
                    Tween._lastTime = fw.getTimer();
                    PIXI.ticker.shared.add(Tween.tick);
                    Tween._inited = true;
                }
            }
            else {
                if (target) {
                    target.tween_count--;
                }
                var i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        return;
                    }
                }
            }
        };
        Tween.removeAllTweens = function () {
            var tweens = Tween._tweens;
            for (var i = 0, l = tweens.length; i < l; i++) {
                var tween = tweens[i];
                tween.paused = true;
                tween._target.tween_count = 0;
            }
            tweens.length = 0;
            if (this._inited) {
                PIXI.ticker.shared.remove(Tween.tick);
                this._inited = false;
            }
        };
        Tween.prototype.initialize = function (target, props, pluginData) {
            this._target = target;
            if (props) {
                this._useTicks = props.useTicks;
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                props.onChange && this.addListener("change", props.onChange, props.onChangeObj);
                if (props.override) {
                    Tween.removeTweens(target);
                }
            }
            this.pluginData = pluginData || {};
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            if (props && props.paused) {
                this.paused = true;
            }
            else {
                Tween._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position, Tween.NONE);
            }
        };
        Tween.prototype.setPosition = function (value, actionsMode) {
            if (actionsMode === void 0) { actionsMode = 1; }
            if (value < 0) {
                value = 0;
            }
            var t = value;
            var end = false;
            if (t >= this.duration) {
                if (this.loop) {
                    var newTime = t % this.duration;
                    if (t > 0 && newTime === 0) {
                        t = this.duration;
                    }
                    else {
                        t = newTime;
                    }
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }
            if (end) {
                this.setPaused(true);
            }
            var prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;
            if (this._target) {
                if (this._steps.length > 0) {
                    var l = this._steps.length;
                    var stepIndex = -1;
                    for (var i = 0; i < l; i++) {
                        if (this._steps[i].type == "step") {
                            stepIndex = i;
                            if (this._steps[i].t <= t && this._steps[i].t + this._steps[i].d >= t) {
                                break;
                            }
                        }
                    }
                    for (var i = 0; i < l; i++) {
                        if (this._steps[i].type == "action") {
                            if (actionsMode != 0) {
                                if (this._useTicks) {
                                    this._runAction(this._steps[i], t, t);
                                }
                                else if (actionsMode == 1 && t < prevPos) {
                                    if (prevPos != this.duration) {
                                        this._runAction(this._steps[i], prevPos, this.duration);
                                    }
                                    this._runAction(this._steps[i], 0, t, true);
                                }
                                else {
                                    this._runAction(this._steps[i], prevPos, t);
                                }
                            }
                        }
                        else if (this._steps[i].type == "step") {
                            if (stepIndex == i) {
                                var step = this._steps[stepIndex];
                                this._updateTargetProps(step, Math.min((this._stepPosition = t - step.t) / step.d, 1));
                            }
                        }
                    }
                }
            }
            this.emit("change");
            return end;
        };
        Tween.prototype._runAction = function (action, startPos, endPos, includeStart) {
            if (includeStart === void 0) { includeStart = false; }
            var sPos = startPos;
            var ePos = endPos;
            if (startPos > endPos) {
                sPos = endPos;
                ePos = startPos;
            }
            var pos = action.t;
            if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                action.f.apply(action.o, action.p);
            }
        };
        Tween.prototype._updateTargetProps = function (step, ratio) {
            var p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            }
            else {
                this.passive = !!step.v;
                if (this.passive) {
                    return;
                }
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }
            for (var n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                    v = ratio == 1 ? v1 : v0;
                }
                else {
                    v = v0 + (v1 - v0) * ratio;
                }
                var ignore = false;
                if (arr = Tween._plugins[n]) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == Tween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    this._target[n] = v;
                }
            }
        };
        Tween.prototype.setPaused = function (value) {
            if (this.paused == value) {
                return this;
            }
            this.paused = value;
            Tween._register(this, !value);
            return this;
        };
        Tween.prototype._cloneProps = function (props) {
            var o = {};
            for (var n in props) {
                o[n] = props[n];
            }
            return o;
        };
        Tween.prototype._addStep = function (o) {
            if (o.d > 0) {
                o.type = "step";
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        };
        Tween.prototype._appendQueueProps = function (o) {
            var arr, oldValue, i, l, injectProps;
            for (var n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this._target[n];
                    if (arr = Tween._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                }
                else {
                    oldValue = this._curQueueProps[n];
                }
            }
            for (var n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = Tween._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(this, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        };
        Tween.prototype._addAction = function (o) {
            o.t = this.duration;
            o.type = "action";
            this._steps.push(o);
            return this;
        };
        Tween.prototype._set = function (props, o) {
            for (var n in props) {
                o[n] = props[n];
            }
        };
        Tween.prototype.wait = function (duration, passive) {
            if (duration == null || duration <= 0) {
                return this;
            }
            var o = this._cloneProps(this._curQueueProps);
            return this._addStep({ d: duration, p0: o, p1: o, v: passive });
        };
        Tween.prototype.to = function (props, duration, ease) {
            if (!duration || isNaN(duration) || duration < 0) {
                duration = 0;
            }
            this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
            return this.set(props);
        };
        Tween.prototype.call = function (callback, thisObj, params) {
            if (thisObj === void 0) { thisObj = undefined; }
            if (params === void 0) { params = []; }
            return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
        };
        Tween.prototype.set = function (props, target) {
            if (target === void 0) { target = null; }
            this._appendQueueProps(props);
            return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
        };
        Tween.prototype.play = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [false]);
        };
        Tween.prototype.pause = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [true]);
        };
        Tween.prototype.$tick = function (delta) {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        };
        Tween.NONE = 0;
        Tween.LOOP = 1;
        Tween.REVERSE = 2;
        Tween._tweens = [];
        Tween.IGNORE = {};
        Tween._plugins = {};
        Tween._inited = false;
        Tween._lastTime = 0;
        return Tween;
    }(PIXI.utils.EventEmitter));
    fw.Tween = Tween;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var DisplayUtil;
    (function (DisplayUtil) {
        function getGlobalBounds(target) {
            var bound = new PIXI.Rectangle();
            var targetBound = target.getLocalBounds();
            var globalPointTl = target.getGlobalPosition(new PIXI.Point(0, 0));
            var globalPointRb = target.getGlobalPosition(new PIXI.Point(targetBound.width, targetBound.height));
            bound.x = globalPointTl.x;
            bound.y = globalPointTl.y;
            bound.width = globalPointRb.x - globalPointTl.x;
            bound.height = globalPointRb.y - globalPointTl.y;
            return bound;
        }
        DisplayUtil.getGlobalBounds = getGlobalBounds;
        function fillCenter(target, spaceWidth, spaceHeight, intact) {
            if (intact === void 0) { intact = true; }
            var tarWidth = target["designWidth"] ? target["designWidth"] : target.width;
            var tarHeight = target["designHeight"] ? target["designHeight"] : target.height;
            var widthRatio = spaceWidth / tarWidth;
            var heightRatio = spaceHeight / tarHeight;
            var scale = intact ? Math.min(widthRatio, heightRatio) : Math.max(widthRatio, heightRatio);
            target.setTransform(0, 0, scale, scale);
            target.x = (spaceWidth - tarWidth) >> 1;
            target.y = (spaceHeight - tarHeight) >> 1;
        }
        DisplayUtil.fillCenter = fillCenter;
        function fillScale(target, spaceWidth, spaceHeight) {
            var tarWidth = target["designWidth"] ? target["designWidth"] : target.width;
            var tarHeight = target["designHeight"] ? target["designHeight"] : target.height;
            var widthRatio = spaceWidth / tarWidth;
            var heightRatio = spaceHeight / tarHeight;
            target.setTransform(0, 0, widthRatio, heightRatio);
        }
        DisplayUtil.fillScale = fillScale;
        function removeFromParent(child) {
            child && child.parent && child.parent.removeChild(child);
        }
        DisplayUtil.removeFromParent = removeFromParent;
        function pointInRect(point, rect) {
            return point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height;
        }
        DisplayUtil.pointInRect = pointInRect;
        function addChildBefore(child, displayObj) {
            return displayObj.parent.addChildAt(child, displayObj.parent.getChildIndex(displayObj));
        }
        DisplayUtil.addChildBefore = addChildBefore;
        function addChildAfter(child, displayObj) {
            return displayObj.parent.addChildAt(child, displayObj.parent.getChildIndex(displayObj) + 1);
        }
        DisplayUtil.addChildAfter = addChildAfter;
    })(DisplayUtil = fw.DisplayUtil || (fw.DisplayUtil = {}));
})(fw || (fw = {}));
var fw;
(function (fw) {
    var Log;
    (function (Log) {
        var win = window;
        function log() {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            if (fw.Config.isDebug) {
                if (win.logView)
                    win.logView.log(formatMessage("[GameLayer]", params));
                else
                    console.log(formatMessage("[GameLayer]", params));
                win.logOnClient && win.logOnClient("[GameLayer]L", params.join(","));
            }
        }
        Log.log = log;
        function error() {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            if (fw.Config.isDebug) {
                if (win.logView)
                    win.logView.error(formatMessage("[GameLayer]", params));
                else
                    console.error(formatMessage("[GameLayer]", params));
                win.logOnClient && win.logOnClient("[GameLayer]E", params.join(","));
            }
        }
        Log.error = error;
        function warn() {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            if (fw.Config.isDebug) {
                if (win.logView)
                    win.logView.warn(formatMessage("[GameLayer]", params));
                else
                    console.warn(formatMessage("[GameLayer]", params));
                win.logOnClient && win.logOnClient("[GameLayer]W", params.join(","));
            }
        }
        Log.warn = warn;
        function formatMessage(sender, messages) {
            var rtn = "";
            if (sender == null)
                rtn += "null ";
            else if (sender == undefined)
                rtn += "undefined ";
            else if (typeof sender == "string")
                rtn += (sender + " ");
            else if (typeof sender == "object" && sender["__class__"])
                rtn += ("[" + sender['__class__'] + "] ");
            else if (sender["toString"])
                rtn += (sender.toString() + " ");
            else
                rtn += (sender + " ");
            if (messages && messages.length) {
                rtn += messages.join(",");
            }
            return rtn;
        }
    })(Log = fw.Log || (fw.Log = {}));
})(fw || (fw = {}));
var fw;
(function (fw) {
    var TouchMoveCtrl = (function () {
        function TouchMoveCtrl(target) {
            this.touchShake = 3;
            this.beginX = 0;
            this.beginY = 0;
            this.isTouchDown = false;
            this.target = target;
            target.interactive = true;
            this.target.addListener("pointerdown", this.onTouchScroll, this);
            this.target.addListener("pointermove", this.onTouchScroll, this);
            this.target.addListener("pointerup", this.onTouchScroll, this);
            this.target.addListener("pointerupoutside", this.onTouchScroll, this);
        }
        TouchMoveCtrl.prototype.onTouchScroll = function (evt) {
            if (evt.type == "pointerdown") {
                this.isTouchDown = true;
                if (this.bindBeginProp && this.bindBeginProp.func.length == 0)
                    this.bindBeginProp.func.call(this.bindBeginProp.target);
                else if (this.bindBeginProp)
                    this.bindBeginProp.func.call(this.bindBeginProp.target, evt);
                this.beginPoint = evt.data.getLocalPosition(this.target.parent).clone();
                if (this.bindXProp)
                    this.beginX = this.bindXProp.target[this.bindXProp.prop];
                if (this.bindYProp)
                    this.beginY = this.bindYProp.target[this.bindYProp.prop];
                if (this.bindXYProp) {
                    var begin = this.bindXYProp.getfunc.call(this.bindXYProp.target);
                    this.beginX = begin.x;
                    this.beginY = begin.y;
                }
            }
            else if (this.beginPoint && (evt.type == "pointermove" || evt.type == "pointerup" || evt.type == "pointerupoutside")) {
                if (!this.isTouchDown)
                    return;
                this.nowPoint = evt.data.getLocalPosition(this.target.parent).clone();
                if (this.touchShake > 0 && evt.type == "pointermove" &&
                    (this.nowPoint.x - this.beginPoint.x < this.touchShake && this.nowPoint.x - this.beginPoint.x > -this.touchShake ||
                        this.nowPoint.y - this.beginPoint.y < this.touchShake && this.nowPoint.y - this.beginPoint.y > -this.touchShake))
                    return;
                if (this.bindXProp)
                    this.bindXProp.target[this.bindXProp.prop] = this.beginX + (this.nowPoint.x - this.beginPoint.x);
                if (this.bindYProp) {
                    this.bindYProp.target[this.bindYProp.prop] = this.beginY + (this.nowPoint.y - this.beginPoint.y);
                }
                if (this.bindXYProp)
                    this.bindXYProp.setfunc.call(this.bindXYProp.target, this.beginX + (this.nowPoint.x - this.beginPoint.x), this.beginY + (this.nowPoint.y - this.beginPoint.y));
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
        };
        TouchMoveCtrl.prototype.bindXChange = function (target, prop) {
            if (typeof (target[prop]) != "number") {
                fw.Log.error(this, "bind property is not number type!!!");
                return;
            }
            this.bindXProp = { target: target, prop: prop };
        };
        TouchMoveCtrl.prototype.bindYChange = function (target, prop) {
            if (typeof (target[prop]) != "number") {
                fw.Log.error(this, "bind property is not number type!!!");
                return;
            }
            this.bindYProp = { target: target, prop: prop };
        };
        TouchMoveCtrl.prototype.bindMoveBeginFunc = function (target, func) {
            this.bindBeginProp = { target: target, func: func };
        };
        TouchMoveCtrl.prototype.bindXYChange = function (target, getfunc, setfunc) {
            this.bindXYProp = { target: target, getfunc: getfunc, setfunc: setfunc };
        };
        TouchMoveCtrl.prototype.bindMoveEndFunc = function (target, func) {
            this.bindEndProp = { target: target, func: func };
        };
        TouchMoveCtrl.prototype.destroy = function () {
            this.target.removeListener("pointerdown", this.onTouchScroll, this);
            this.target.removeListener("pointermove", this.onTouchScroll, this);
            this.target.removeListener("pointerup", this.onTouchScroll, this);
            this.target.removeListener("pointerupoutside", this.onTouchScroll, this);
        };
        return TouchMoveCtrl;
    }());
    fw.TouchMoveCtrl = TouchMoveCtrl;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var MouseMoveCtrl = (function (_super) {
        __extends(MouseMoveCtrl, _super);
        function MouseMoveCtrl(target) {
            var _this = _super.call(this, target) || this;
            _this.touchShake = 0;
            return _this;
        }
        MouseMoveCtrl.prototype.onTouchScroll = function (evt) {
            if (evt.type == "pointerdown") {
                this.isTouchDown = true;
                if (this.bindBeginProp && this.bindBeginProp.func.length == 0)
                    this.bindBeginProp.func.call(this.bindBeginProp.target);
                else if (this.bindBeginProp)
                    this.bindBeginProp.func.call(this.bindBeginProp.target, evt);
                this.beginPoint = evt.data.getLocalPosition(this.target.parent).clone();
            }
            else if (evt.type == "pointermove" || evt.type == "pointerup" || evt.type == "pointerupoutside") {
                this.nowPoint = evt.data.getLocalPosition(this.target.parent).clone();
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
        };
        return MouseMoveCtrl;
    }(fw.TouchMoveCtrl));
    fw.MouseMoveCtrl = MouseMoveCtrl;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var NumberFormatter = (function () {
        function NumberFormatter() {
        }
        Object.defineProperty(NumberFormatter, "locale", {
            get: function () {
                return NumberFormatter.m_locale;
            },
            set: function (value) {
                NumberFormatter.m_locale = value;
            },
            enumerable: true,
            configurable: true
        });
        NumberFormatter.format = function (number, decimals, siStyle) {
            if (decimals === void 0) { decimals = 0; }
            if (siStyle === void 0) { siStyle = false; }
            var i = 0;
            var inc = Math.pow(10, decimals);
            var str = (Math.round(inc * number) / inc);
            var hasSep = str.indexOf(".") == -1, sep = hasSep ? str.length : str.indexOf(".");
            var ret = (hasSep && !decimals ? "" : (siStyle ? "," : ".")) + str.substr(sep + 1);
            if (decimals) {
                for (var j = 0; j <= decimals - (str.length - (hasSep ? sep - 1 : sep)); j++)
                    ret += "0";
            }
            while (i + 3 < (str.substr(0, 1) == "-" ? sep - 1 : sep))
                ret = (siStyle ? "." : ",") + str.substr(sep - (i += 3), 3) + ret;
            return str.substr(0, sep - i) + ret;
        };
        NumberFormatter.formatRound = function (value) {
            if (value == null)
                return "0";
            value = value;
            if (NumberFormatter.locale == "en_US" || NumberFormatter.locale == "vi_VN") {
                return NumberFormatter.formatEngNumber(value);
            }
            else {
                var localeStrings = [];
                switch (NumberFormatter.locale) {
                    case "zh_CN":
                        localeStrings = ["亿", "万"];
                        break;
                    case "zh_TW":
                        localeStrings = ["億", "萬"];
                        break;
                    case "ja_JP":
                        localeStrings = ["億", "万"];
                        break;
                    case "ko_KR":
                        localeStrings = ["억", "만"];
                        break;
                }
                if (localeStrings.length > 0) {
                    if (value >= 100000000)
                        return Math.floor(value / 100000000) + localeStrings[0];
                    else if (value >= 100000)
                        return Math.floor(value / 10000) + localeStrings[1];
                }
            }
            return value.toString();
        };
        NumberFormatter.formatTime = function (time, reserveSecond, reserveMS) {
            if (reserveSecond === void 0) { reserveSecond = true; }
            if (reserveMS === void 0) { reserveMS = false; }
            if (isNaN(time) || time <= 0)
                return "00:00";
            reserveMS = reserveSecond && reserveMS;
            var ms = (time % 1000);
            time = Math.floor(time / 1000);
            var hour = Math.floor(time / 3600);
            time -= hour * 3600;
            var min = Math.floor(time / 60);
            var sec = time % 60;
            var h = (hour > 0) ? (((hour < 10) ? ("0" + hour) : hour)) : "";
            var m = (min < 10) ? ("0" + min) : min;
            var s = (sec < 10) ? ("0" + sec) : sec;
            var result = (hour > 0 ? (h + ":") : "") + m;
            if (reserveSecond)
                result += ":" + s;
            if (reserveMS)
                result += ":" + ((ms < 10) ? ("0" + ms) : ms);
            return result;
        };
        NumberFormatter.formatEngNumber = function (number) {
            var str;
            var num;
            number = number;
            if (number >= 1000000000) {
                num = number / 1000000000;
                str = (Math.floor(num / 0.01) * 0.01).toFixed(2);
                return NumberFormatter.formatEndingZero(str) + "b";
            }
            else if (number >= 1000000) {
                num = number / 1000000;
                str = (Math.floor(num / 0.01) * 0.01).toFixed(2);
                return NumberFormatter.formatEndingZero(str) + "m";
            }
            else if (number >= 1000) {
                num = number / 1000;
                str = (Math.floor(num / 0.01) * 0.01).toFixed(2);
                return NumberFormatter.formatEndingZero(str) + "k";
            }
            else {
                return number + "";
            }
        };
        NumberFormatter.formatEndingZero = function (c) {
            if (NumberFormatter.endWith(c, "00")) {
                return c.substring(0, c.length - 3);
            }
            else if (NumberFormatter.endWith(c, "0")) {
                return c.substring(0, c.length - 1);
            }
            return c;
        };
        NumberFormatter.endWith = function (c, suffix) {
            return (suffix == c.substring(c.length - suffix.length));
        };
        NumberFormatter.m_locale = "zh_CN";
        return NumberFormatter;
    }());
    fw.NumberFormatter = NumberFormatter;
})(fw || (fw = {}));
var fw;
(function (fw) {
    var TexturesUtil;
    (function (TexturesUtil) {
        function parseSpritesheet(jsPath, imgTexture, onComplete, thisObj) {
            require([jsPath], function (jsonMap) {
                var spritesheet = new PIXI.Spritesheet(imgTexture.baseTexture, jsonMap, jsPath);
                spritesheet.parse(function () {
                    var textureResource = new fw.TextureResource(spritesheet);
                    onComplete.call(thisObj, textureResource);
                });
            });
        }
        TexturesUtil.parseSpritesheet = parseSpritesheet;
    })(TexturesUtil = fw.TexturesUtil || (fw.TexturesUtil = {}));
})(fw || (fw = {}));
//# sourceMappingURL=fishing.all.js.map