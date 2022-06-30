import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import waterVertexShader from './shaders/fire/vertex.glsl'
import waterFragmentShader from './shaders/fire/fragment.glsl'



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
const subs = 512;

/**
 * Lights
 */

let light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(0, 50, 20);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 250;

let camSize = 10;
light.shadow.camera.left = -camSize;
light.shadow.camera.bottom = -camSize;
light.shadow.camera.right = camSize;
light.shadow.camera.top = camSize;

scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Geometry


let circleCount = 5;
let instCount = ((circleCount * (circleCount + 1)) / 2) * 6 + 1;
let g = new THREE.CylinderBufferGeometry(0.5, 0.5, 0.1, 6);
g.rotateX(Math.PI * 0.5);
let m = new THREE.MeshStandardMaterial({
    // color: 0x222244,
    roughness: 0.75,
    metalness: 0.25,
});


let o = new THREE.InstancedMesh(g, m, instCount);
// let o = new THREE.Mesh(g, m);

// o.castShadow = true;
// o.receiveShadow = true;

let dummy = new THREE.Object3D();


scene.add(o)

//Color
debugObject.debthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'

const centerHexColor = new THREE.Color(0xffffff)

const colorsArray = [
    new THREE.Color(0x186691),
    new THREE.Color(0x9bd8ff),
    new THREE.Color(0xffb700),
    new THREE.Color(0x555555),
]


let unit = Math.sqrt(3) * 0.5 * 1.09
let angle = Math.PI / 3
let axis = new THREE.Vector3(0, 0, 1)

let axisVector = new THREE.Vector3(0, -unit, 0)
let sideVector = new THREE.Vector3(0, unit, 0).applyAxisAngle(axis, -angle)
let vec3 = new THREE.Vector3(); // temp vector
let counter = 0

for (let seg = 0; seg < 6; seg++) {
    for (let ax = 1; ax <= circleCount; ax++) {
        for (let sd = 0; sd < ax; sd++) {

            vec3.copy(axisVector)
                .multiplyScalar(ax)
                .addScaledVector(sideVector, sd)
                .applyAxisAngle(axis, (angle * seg) + (Math.PI / 6));

            setHexData(o, dummy, vec3, counter);
            let index = THREE.MathUtils.randInt(0, colorsArray.length - 1);
            o.setColorAt(counter, colorsArray[index])
            o.instanceColor.needsUpdate

            counter++;
        }
    }
}

setHexData(o, dummy, new THREE.Vector3(), counter);
o.setColorAt(counter, centerHexColor)



function setHexData(o, dummy, pos, idx) {

    // debugger
    dummy.position.copy(pos);
    dummy.updateMatrix();
    o.setMatrixAt(idx, dummy.matrix);

}



//debug
// gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')

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
camera.position.set(0, 0, 7)
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

/**
 * Animate
 */
const clock = new THREE.Clock()
let mat4 = new THREE.Matrix4();

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, mat4);
        mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);
        // dummy.position.z = Math.sin(elapsedTime * 0.5) * 0.125;
        dummy.rotation.set(
            Math.cos(i + elapsedTime) * Math.PI * 0.0625,
            Math.sin(i - elapsedTime) * Math.PI * 0.0625,
            0
          );
        dummy.updateMatrix();
        o.setMatrixAt(i, dummy.matrix);
    }
    o.instanceMatrix.needsUpdate = true;

    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()