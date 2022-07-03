import {
    InstancedMesh,
    MeshStandardMaterial,
    CylinderBufferGeometry,
    InstancedBufferAttribute
} from 'three'

import {
    constants
} from './constants'

import {
    shaders
} from './shaders'

import STATE from './State'


export const createHexInstance = () => {
    let hexUniforms = {
        time: {
            value: 0
        },
        assTime: {
            value: 0
        },
        pos: []
    };
    let _material = new MeshStandardMaterial({
        roughness: 0.75,
        metalness: 0.25,
    });
    _material.hexUniforms = hexUniforms

    let _materialComp = shaders(_material)
    let _geometry = new CylinderBufferGeometry(STATE.hexRadius, STATE.hexRadius, STATE.hexHeight, 6);
    _geometry.rotateX(Math.PI * 0.5);

    

    // g.setAttribute(
    //     "aColor",
    //     new InstancedBufferAttribute(new Float32Array(unifroms.colors), 6)
    // );

    // g.setAttribute(
    //     "aIndex",
    //     new InstancedBufferAttribute(new Float32Array(unifroms.idx), 1)
    // );

    // g.setAttribute(
    //     "aDelay",
    //     new InstancedBufferAttribute(new Float32Array(unifroms.delay), 1)
    // );

    

    let instance = new InstancedMesh(_geometry, _materialComp, constants.txtGridSize);
    instance.castShadow = true;
    instance.receiveShadow = true;

    STATE.addLetter(instance)

    return instance
}