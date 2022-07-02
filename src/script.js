import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import waterVertexShader from './shaders/fire/vertex.glsl'
import waterFragmentShader from './shaders/fire/fragment.glsl'


import perlinNoise3d from 'perlin-noise-3d'


import {
    writeLine
} from './js/writeLine'
import {
    createHexInstance
} from './js/createHexInstance'
import {
    constants
} from './js/constants'
import {
    shaders
} from './js/shaders'


let state = {
    assemble: false,
    hexRadius: 0.8,
    gap: 1.5,
}

let counter = 0
const hexHeight = 1

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 340
})
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

let ax = new THREE.AxesHelper(50)
scene.add(ax)

let light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(0, 50, 20);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 250;

let camSize = 10;
light.shadow.camera.left = -camSize;
light.shadow.camera.bottom = -camSize;
light.shadow.camera.right = camSize;
light.shadow.camera.top = camSize;

scene.add(light)
scene.add(new THREE.AmbientLight(0xffffff, 0.5))

// Geometry

let g = new THREE.CylinderBufferGeometry(state.hexRadius, state.hexRadius, hexHeight, 6);
g.rotateX(Math.PI * 0.5);


let hexUniforms = {
    time: {
        value: 0
    },
    assTime: {
        value: 0
    }
};

let m = new THREE.MeshStandardMaterial({
    roughness: 0.75,
    metalness: 0.25,
});

let mat = shaders(m, hexUniforms)

//Color
debugObject.debthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'


let unifroms = {
    idx: [],
    colors: [],
    pos: [],
    delay: []
}

let sentence = "Aa Bb Cc"

let hexInstancesArray = []
let fullWidth = constants.x * state.hexRadius * sentence.length

for (let i = 0; i < sentence.length; i++) {
    let letter = sentence[i]
    let _im = createHexInstance(g, m);
    _im.userData = {}
    _im.userData.delay = []
    
    hexInstancesArray.push(_im)
    let dummy = new THREE.Object3D();
    scene.add(hexInstancesArray[i])
    let _c = constants.y
    if (['i', 'I', 'l'].includes(letter)) {
        _c -= 4
    } else if ([
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
            "n", "o", "p", "q", "r", "s", "t", "u", "v",  "x", "y", "z"
        ].includes(letter)) {
        _c -= 2
    } else if ([
        " "
    ].includes(letter)) {
        _c = 2
}

    let bounds = {
        pYLen: _c,
        index: i,
        gap: state.gap,
        fw: fullWidth
    }

    writeLine(_im, sentence[i], dummy, unifroms, counter, state, bounds)
}



g.setAttribute(
    "aColor",
    new THREE.InstancedBufferAttribute(new Float32Array(unifroms.colors), 3)
);

g.setAttribute(
    "aIndex",
    new THREE.InstancedBufferAttribute(new Float32Array(unifroms.idx), 1)
);

g.setAttribute(
    "aDelay",
    new THREE.InstancedBufferAttribute(new Float32Array(unifroms.delay), 1)
);

g.setAttribute(
    "aPosXY",
    new THREE.InstancedBufferAttribute(new Float32Array(unifroms.pos), 2)
);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 30)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock()
let mat4 = new THREE.Matrix4();


const tick = () => {
    const t = clock.getElapsedTime()
    hexUniforms.time.value = t;

    // Update controls
    controls.update()
    if (state.assemble) {
        hexUniforms.assTime.value += 0.01
        if(hexUniforms.assTime.value > 1){
            hexUniforms.assTime.value = 1
        }
    }

    hexInstancesArray.forEach(i => {
        i.instanceMatrix.needsUpdate = true
    })


    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()



let font_canvas = document.querySelector('.font_canvas')
let fcDims = {
    w: 14,
    h: 20,
}
font_canvas.width = fcDims.w
font_canvas.height = fcDims.h
var ctx = font_canvas.getContext("2d");
var fsz = fcDims.w * 1.3


