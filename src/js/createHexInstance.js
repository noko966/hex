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

    let count = _geometry.getAttribute('position').count
    const barycentric = []
    for (let i = 0; i < count; i++) {
        const even = i % 2 === 0;
        const Q = 0;
        if (even) {
            barycentric.push(
                0, 0, 1,
                0, 1, 0,
                1, 0, Q
            );
        } else {
            barycentric.push(
                0, 1, 0,
                0, 0, 1,
                1, 0, Q
            );
        }
    }


    _geometry.setAttribute('aBarycentric',
        new InstancedBufferAttribute(new Float32Array(barycentric), 3)
    )

    _geometry.rotateX(Math.PI * 0.5);


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

    instance.rotation.set(0, Math.random() * 10, 0)

    STATE.addLetter(instance)

    return instance
}