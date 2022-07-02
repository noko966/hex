import {
    Vector3,
    MathUtils,
    Color
} from 'three'

import {
    letters
} from './letters'

import {
    constants
} from './constants'


function setHexData(o, dummy, pos, idx) {

    // debugger
    dummy.position.copy(pos);
    dummy.updateMatrix();
    o.setMatrixAt(idx, dummy.matrix);

}


export const writeLine = (o, singLett, dummy, uniforms, counter, state, bounds) => {
    const colorsArray = [
        new Color(0x186691),
        new Color(0x9bd8ff),
        new Color(0xffb700),
        new Color(0x555555),
    ]
    let _uniforms = uniforms
    let _state = state
    let _hexRad = _state.hexRadius

    let _counter = counter

    let wx = Math.sqrt(3) * _hexRad + 0.1
    let wy = 2 * _hexRad
    let _singLett = singLett
    let _bounds = bounds

    if (_singLett == " ") {
        _singLett = "space"
    }
    let _letterGrid = letters[_singLett]

    let forX = 0
    let forY = (constants.y - _bounds.pYLen) / 2
    let forYMax = _bounds.pYLen

    let lttSz = {
        w: _bounds.pYLen * _hexRad,
        h: constants.x * _hexRad
    }
    for (let x = forX; x < _letterGrid.length; x++) {
        for (let y = forY; y < forYMax; y++) {

            let dy = wy * x
            let dx = wx * y

            if (x % 2) {
                dx -= wx / 2
            }

            let _x = dx
            _x += _bounds.index * constants.y * _hexRad * _bounds.gap
            _x -= _bounds.fw / 2
            let _y = -dy
            _y += lttSz.h / 2
            let c = new Vector3(_x, _y, 0)
            if (_letterGrid[x][y]) {
                setHexData(o, dummy, c, _counter);
                _uniforms.pos.push(c.x, c.y);

                let index = MathUtils.randInt(0, colorsArray.length - 1)
                let cc = colorsArray[index]
                o.setColorAt(_counter, cc)
                _uniforms.colors.push(cc.r, cc.b, cc.g);
                _uniforms.delay.push(x + y)

                o.instanceColor.needsUpdate
                _counter++
            }



        }

    }


    return _state.assemble = true



}