import {
    Vector3,
    MathUtils,
    Color,
    InstancedBufferAttribute
} from 'three'

import {
    letters
} from './lettersPixel'

import tinycolor from 'tinycolor2'

import {
    constants
} from './constants'
import STATE from './State';


function setHexData(o, dummy, pos, idx) {

    // debugger
    dummy.position.copy(pos);
    dummy.updateMatrix();
    o.setMatrixAt(idx, dummy.matrix);

}

const colorsArray = [
    '#8A9A5B',
    '#ffb700',
    '#7393B3',
    '#F88379'
]

// for (let i = 0; i < 5; i++) {
//     let color = tinycolor('#186691').lighten(i * 2).toHexString()
//     let colorA = tinycolor('#ffb700').darken(i * 2).toHexString()
//     colorsArray.push(color)
//     colorsArray.push(colorA)
// }


let unifroms = {
    idx: [],
    colors: [],
    pos: [],
    delay: []
}

export const writeLetter = (o, singLett, dummy, state, bounds) => {

    let _state = state
    let _hexRad = _state.hexRadius

    let _counter = 0

    let wx = Math.sqrt(3) * _hexRad + 0.1
    let wy = 2 * _hexRad
    let _singLett = singLett
    let _bounds = bounds

    if (_singLett == " ") {
        _singLett = "space"
    }
    let _letterGrid = letters[_singLett]

    let forX = 0
    let forY = 0
    let forYMax = _letterGrid[0].length

    let lttSz = {
        w: forYMax * wx,
        h: _letterGrid.length * wy
    }
    let aPosXY = []
    let aColor = []
    for (let x = forX; x < _letterGrid.length; x++) {

        for (let y = forY; y < forYMax; y++) {
            let dy = wy * x
            let dx = wx * y

            if (x % 2) {
                dx -= wx / 2
            }

            let _x = dx
            _x += _bounds.offset + (_bounds.gap * 2 * _bounds.index)
            _x -= _bounds.fw / 2

            let _y = 0
            _y -= dy
            _y += lttSz.h
            let c = new Vector3(_x, _y, 0)
            if (_letterGrid[x][y]) {
                setHexData(o, dummy, c, _counter);
                aPosXY.push(c.x, c.y);
                let index = MathUtils.randInt(0, colorsArray.length - 1)

                let cc = tinycolor(colorsArray[index]).darken(x + Math.random() * 8).toHexString()
                cc = new Color(cc)
                aColor.push(cc.r, cc.b, cc.g);
                // _uniforms.delay.push(x + y)
                o.setColorAt(_counter, cc)

                o.instanceColor.needsUpdate
                _counter++
            }



        }

    }

    o.geometry.setAttribute(
        "aPosXY",
        new InstancedBufferAttribute(new Float32Array(aPosXY), 2)
    );

    o.geometry.setAttribute(
        "aColor",
        new InstancedBufferAttribute(new Float32Array(aColor), 3)
    );

    var animation = function () {
        return new Promise(function (resolve) {
            var anim = function () {
                o.material.hexUniforms.time.value = STATE.time;
                o.material.hexUniforms.assTime.value += 0.1
                window.requestAnimationFrame(anim)
                if (o.material.hexUniforms.assTime.value >= 1) {
                    o.material.hexUniforms.assTime.value = 1
                    window.cancelAnimationFrame(anim)
                    resolve()
                }
            }
            anim()
        })
    }

    STATE.addAnimation(animation)

    return true



}