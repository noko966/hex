import {
    InstancedMesh,
} from 'three'

import {
    constants 
} from './constants'

export const  createHexInstance = (geom, mat) => {
    let instance = new InstancedMesh(geom, mat, constants.txtGridSize);
    instance.castShadow = true;
    instance.receiveShadow = true;
    return instance
}