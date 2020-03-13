/// <reference path = "../fw.ts" /> 
namespace fw {
        export interface SoundProps {
            name: string;
            url: string;
            content?: any;
            isMusic: boolean;
        }
        
        export interface SoundEngine {
            addSound(name:string, url:string, isMusic:boolean): any;
            playSound(name:string, url:string, loop: boolean, isMusic:boolean): any;
            setSoundVolume(value: number): void;
            getSoundVolume(): number;
            setMusicVolume(value: number): void;
            getMusicVolume(): number;
            stopSound(name: string): void;
            removeSound(name: string): void;
            removeAllSound(): void;
            destroy(): void
        }
        
        export namespace SoundManager {
        
            export let engine: SoundEngine;
        
            function selectEngine(): SoundEngine {
                const device = getDeviceType();
                if (device == DeviceType.iPad)
                    return new NativeAudioIFrameEngine();
                else {
                    if (PIXI.sound)
                        return new WebAudioEngine();
                    else
                        return new HTMLAudioEngine();
                }
            }
        
            export function addSound(name:string, url:string, isMusic:boolean = false): SoundProps
            {
                !engine && (engine = selectEngine());
                return engine.addSound(name, url, isMusic);
            }
        
            export function playSound(name:string, url:string = "", loop: boolean = false, isMusic:boolean = false, compatibility: boolean = true): void
            {
                !engine && (engine = selectEngine());
                return engine.playSound(name, url, loop, isMusic);
            }
        
            export function setSoundVolume(value: number): void {
                engine && engine.setSoundVolume(value);
            }
        
            export function getSoundVolume(): number {
                return engine ? engine.getSoundVolume() : 0;
            }
        
            export function setMusicVolume(value: number): void {
                engine && engine.setMusicVolume(value);
            }
        
            export function getMusicVolume(): number {
                return engine ? engine.getMusicVolume() : 0;
            }
        
            export function stopSound(name: string): void {
                engine && engine.stopSound(name);
            }
        
            export function removeSound(name: string): void {
                engine && engine.removeSound(name);
            }
        
            export function removeAllSound(): void {
                engine && engine.removeAllSound();
            }
        
            export function destroy(): void {
                engine && engine.destroy();
            }
        }
        
    }
    
    
    