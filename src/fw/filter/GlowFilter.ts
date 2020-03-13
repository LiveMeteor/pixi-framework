/**
 * GlowFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/12756-glow-filter/?hl=mishaa#entry73578
 * http://codepen.io/mishaa/pen/raKzrm<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glow.png)
 *
 * @class
 *
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-glow|@pixi/filter-glow}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 * @param {number} [distance=10] The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
 * @param {number} [outerStrength=4] The strength of the glow outward from the edge of the sprite.
 * @param {number} [innerStrength=0] The strength of the glow inward from the edge of the sprite.
 * @param {number} [color=0xffffff] The color of the glow.
 * @param {number} [quality=0.1] A number between 0 and 1 that describes the quality of the glow.
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter(15, 2, 1, 0xFF0000, 0.5)
 *  ];
 */

namespace fw {
    export class GlowFilter extends PIXI.Filter<any> {

        private static vert = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        
        uniform mat3 projectionMatrix;
        
        varying vec2 vTextureCoord;
        
        void main(void)
        {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }`;

        private static frag = `
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        
        uniform sampler2D uSampler;
        
        uniform float distance;
        uniform float outerStrength;
        uniform float innerStrength;
        uniform vec4 glowColor;
        uniform vec4 filterArea;
        uniform vec4 filterClamp;
        const float PI = 3.14159265358979323846264;
        
        void main(void) {
            vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);
            vec4 ownColor = texture2D(uSampler, vTextureCoord);
            vec4 curColor;
            float totalAlpha = 0.0;
            float maxTotalAlpha = 0.0;
            float cosAngle;
            float sinAngle;
            vec2 displaced;
            for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {
               cosAngle = cos(angle);
               sinAngle = sin(angle);
               for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {
                   displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;
                   displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;
                   curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));
                   totalAlpha += (distance - curDistance) * curColor.a;
                   maxTotalAlpha += (distance - curDistance);
               }
            }
            maxTotalAlpha = max(maxTotalAlpha, 0.0001);
        
            ownColor.a = max(ownColor.a, 0.0001);
            ownColor.rgb = ownColor.rgb / ownColor.a;
            float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);
            float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;
            float resultAlpha = (ownColor.a + outerGlowAlpha);
            gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);
        }`;

        constructor(distance = 10, outerStrength = 4, innerStrength = 0, color = 0xffffff, quality = 0.1) {
            super(GlowFilter.vert, GlowFilter.frag
                .replace(/%QUALITY_DIST%/gi, '' + (1 / quality / distance).toFixed(7))
                .replace(/%DIST%/gi, '' + distance.toFixed(7)));

            this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);
            this.distance = distance;
            this.color = color;
            this.outerStrength = outerStrength;
            this.innerStrength = innerStrength;
        }

        /**
         * The color of the glow.
         * @member {number}
         * @default 0xFFFFFF
         */
        get color() {
            return PIXI.utils.rgb2hex(this.uniforms.glowColor);
        }
        set color(value) {
            PIXI.utils.hex2rgb(value, this.uniforms.glowColor);
        }

        /**
         * The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
         * @member {number}
         * @default 10
         */
        get distance() {
            return this.uniforms.distance;
        }
        set distance(value) {
            this.uniforms.distance = value;
        }

        /**
         * The strength of the glow outward from the edge of the sprite.
         * @member {number}
         * @default 4
         */
        get outerStrength() {
            return this.uniforms.outerStrength;
        }
        set outerStrength(value) {
            this.uniforms.outerStrength = value;
        }

        /**
         * The strength of the glow inward from the edge of the sprite.
         * @member {number}
         * @default 0
         */
        get innerStrength() {
            return this.uniforms.innerStrength;
        }
        set innerStrength(value) {
            this.uniforms.innerStrength = value;
        }
    }
}