import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import waterVertexShader from './shaders/fire/vertex.glsl'
import waterFragmentShader from './shaders/fire/fragment.glsl'


import perlinNoise3d from 'perlin-noise-3d'

import STATE from './js/State'


import {
    writeLetter
} from './js/writeLetter'
import {
    createHexInstance
} from './js/createHexInstance'
import {
    constants
} from './js/constants'
import {
    shaders
} from './js/shaders'

import {
    letters
} from './js/lettersPixel'


let state = {
    assemble: false,
    hexRadius: 1.3,
    gap: 1.5,
}

const hexHeight = 2

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
// scene.add(ax)

let light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(0, 1, 3);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
// light.frustumCulled = false

let camSize = 10;
light.shadow.camera.left = -camSize;
light.shadow.camera.bottom = -camSize;
light.shadow.camera.right = camSize;
light.shadow.camera.top = camSize;

scene.add(light)
scene.add(new THREE.AmbientLight(0xffffff, 0.5))

// Geometry





//Color
debugObject.debthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'


let sentence = "ABC 123"

let hexInstancesArray = []
let fullWidth = 0
let _dx = [0]

for (let j = 0; j < sentence.length; j++) {
    let letter = sentence[j]
    if(letter === ' ') {
        letter = 'space'
    }
    fullWidth += letters[letter][0].length * (Math.sqrt(3) * state.hexRadius + 0.1)
    _dx.push(fullWidth)
}
for (let i = 0; i < sentence.length; i++) {
    let letter = sentence[i]
    if(letter === ' ') {
        letter = 'space'
    }
    let _im = createHexInstance();

    hexInstancesArray.push(_im)
    let dummy = new THREE.Object3D();
    scene.add(hexInstancesArray[i])

    let bounds = {
        offset: _dx[i],
        index: i,
        gap: state.gap,
        fw: fullWidth
    }

    writeLetter(_im, sentence[i], dummy, state, bounds)
}






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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, -5, 70)
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

let mat4 = new THREE.Matrix4();


const tick = () => {
    STATE.play()
    let t = STATE.time

    // Update controls
    controls.update()

    hexInstancesArray.forEach(i => {
        // i.rotation.y = Math.sin(t)
        i.instanceMatrix.needsUpdate = true
        
    })


    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('click', ()=> {
    STATE.animations.reduce((prev, cur) => {
        return prev.then(cur)
    }, Promise.resolve(1))
})















