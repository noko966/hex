
let chunkNoise = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
vec3 Pi0 = floor(P); // Integer part for indexing
vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
Pi0 = mod(Pi0, 289.0);
Pi1 = mod(Pi1, 289.0);
vec3 Pf0 = fract(P); // Fractional part for interpolation
vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
vec4 iy = vec4(Pi0.yy, Pi1.yy);
vec4 iz0 = Pi0.zzzz;
vec4 iz1 = Pi1.zzzz;
vec4 ixy = permute(permute(ix) + iy);
vec4 ixy0 = permute(ixy + iz0);
vec4 ixy1 = permute(ixy + iz1);
vec4 gx0 = ixy0 / 7.0;
vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
gx0 = fract(gx0);
vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
vec4 sz0 = step(gz0, vec4(0.0));
gx0 -= sz0 * (step(0.0, gx0) - 0.5);
gy0 -= sz0 * (step(0.0, gy0) - 0.5);
vec4 gx1 = ixy1 / 7.0;
vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
gx1 = fract(gx1);
vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
vec4 sz1 = step(gz1, vec4(0.0));
gx1 -= sz1 * (step(0.0, gx1) - 0.5);
gy1 -= sz1 * (step(0.0, gy1) - 0.5);
vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
g000 *= norm0.x;
g010 *= norm0.y;
g100 *= norm0.z;
g110 *= norm0.w;
vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
g001 *= norm1.x;
g011 *= norm1.y;
g101 *= norm1.z;
g111 *= norm1.w;
float n000 = dot(g000, Pf0);
float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
float n111 = dot(g111, Pf1);
vec3 fade_xyz = fade(Pf0);
vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
return 2.2 * n_xyz;
}`

export const shaders = (mat) => {
    mat.onBeforeCompile = (shader) => {
        shader.uniforms.time = mat.hexUniforms.time;
        shader.uniforms.assTime = mat.hexUniforms.assTime;
        shader.vertexShader = `
uniform float time;
uniform float assTime;
attribute vec3 aColor;
attribute float aIndex;
attribute vec2 aPosXY;
attribute vec3 aBarycentric;
varying vec3 vBarycentric;

attribute float aDelay;

attribute vec2 colorPhase;
varying vec3 vPos;
varying vec3 vInstColor;
varying float vInstIndex;
varying vec2 vColorPhase;
float bounceOut(float t) {
    const float a = 4.0 / 11.0;
    const float b = 8.0 / 11.0;
    const float c = 9.0 / 10.0;
  
    const float ca = 4356.0 / 361.0;
    const float cb = 35442.0 / 1805.0;
    const float cc = 16061.0 / 1805.0;
  
    float t2 = t * t;
  
    return t < a
      ? 7.5625 * t2
      : t < b
        ? 9.075 * t2 - 9.9 * t + 3.4
        : t < c
          ? ca * t2 - cb * t + cc
          : 10.8 * t * t - 20.52 * t + 10.72;
}
${chunkNoise}
${shader.vertexShader.replace(
'#include <begin_vertex>',
`#include <begin_vertex>
vPos = vec3(transformed);
vInstColor = vec3(aColor);
vInstIndex = aIndex;
float noise = cnoise(vec3(aPosXY.x, aPosXY.y, time * 0.5));

float noiseStatic = cnoise(vec3(aPosXY.x, aPosXY.y, 0.0));




vec3 source = vec3(transformed);
// source.y += abs(noiseStatic) * 10000.0;
source.z += abs(noiseStatic) * 10000.0;

// attribute float aDelay;

vec3 target = transformed;

float tt =  bounceOut(assTime);
// float tt = assTime;
// float tt = pow(assTime, 9.0);
vec3 pp = source * (1.0 - tt) - target * (1.0 - tt);
transformed.z -= noise * 2.0;
transformed -= pp;

vBarycentric = aBarycentric;
`
)}`

shader.fragmentShader = `
uniform float time;
varying vec3 vPos;
varying vec3 vInstColor;

varying vec3 vBarycentric;

float aastep (float threshold, float dist) {
    float afwidth = fwidth(dist) * 0.5;
    return smoothstep(threshold - afwidth, threshold + afwidth, dist);
}

vec4 getStyledWireframe (vec3 barycentric) {
    // this will be our signed distance for the wireframe edge
    float d = min(min(barycentric.x, barycentric.y), barycentric.z);
  
    // for dashed rendering, we can use this to get the 0 .. 1 value of the line length
    float positionAlong = max(barycentric.x, barycentric.y);
    if (barycentric.y < barycentric.x && barycentric.y < barycentric.z) {
      positionAlong = 1.0 - positionAlong;
    }
  
    // the thickness of the stroke
    float computedThickness = 0.005;
  
    float edge = 1.0 - aastep(computedThickness, d);
    // now compute the final color of the mesh
    vec4 outColor = vec4(0.0);

    vec3 fill = vec3(0.8);
    vec3 stroke = vec3(0.1);

    vec3 mainStroke = mix(fill, stroke, edge);
    outColor.a = 1.0;
    outColor.rgb = mainStroke;


    return outColor;
  }

${shader.fragmentShader.replace(
'#include <dithering_fragment>',
`
    #include <dithering_fragment>
    vec3 color = gl_FragColor.rgb;
    // float a = smoothstep(0.015, 0.02 + (1. - time) * 0.03, abs(vPos.z));
    float a = step(1.2, abs(vPos.z));
    vec3 neon = vec3(0.0, 0.0, abs(sin(time)));
    neon =  mix(neon, gl_FragColor.rgb, 0.8 );
    // vec2 neon2 =  step(0.5, abs(vPos.xy));
    gl_FragColor.rgb = mix(neon, gl_FragColor.rgb, a );
    // gl_FragColor += getStyledWireframe(vBarycentric) * 0.1;
`
)}`

    };

    return mat
}