let Alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`
Alphabet += `abcdefghijklmnopqrstuvwxyz`


Alphabet = Array.from(Alphabet)

let result = {}
let fcDims = {
    w: 18,
    h: 18,
}
let font_canvas = document.querySelector('.font_canvas')

var ctx = font_canvas.getContext("2d");

font_canvas.width = fcDims.w
font_canvas.height = fcDims.h
let x = 5
let y = 15

let myFont = new FontFace(
    "VT323",
    "url('./VT323-Regular.ttf')"
);

myFont.load().then((font) => {
    Alphabet.forEach(l => {
    
        result[l] = []
    
        var fsz = 25
        document.fonts.add(font);
        ctx.font = `${fsz}px VT323`;
        ctx.fillStyle = "#000"
        ctx.fillRect(0, 0, fcDims.w, fcDims.h);
    
        ctx.fillStyle = "#fff"
    
        ctx.fontWeight = 'bold';
    
        let _textMetrics = ctx.measureText(l);
    
        
    
        ctx.fillText(`${l}`, x, y);
    
        ctx.strokeStyle = "red"
        ctx.strokeWidth = "1px"
    
        ctx.beginPath();
        ctx.moveTo(
            x - _textMetrics.actualBoundingBoxLeft,
            y - _textMetrics.actualBoundingBoxAscent
        );
        ctx.lineTo(
            x + _textMetrics.actualBoundingBoxRight,
            y - _textMetrics.actualBoundingBoxAscent
        );
        ctx.lineTo(
            x + _textMetrics.actualBoundingBoxRight,
            y + _textMetrics.actualBoundingBoxDescent
        );
        ctx.lineTo(
            x - _textMetrics.actualBoundingBoxLeft,
            y + _textMetrics.actualBoundingBoxDescent
        );
        ctx.closePath()
        // ctx.stroke()
    
        let __x = x - _textMetrics.actualBoundingBoxLeft
        let __y = y - _textMetrics.actualBoundingBoxAscent
        let __w = (x + _textMetrics.actualBoundingBoxRight) - (x -_textMetrics.actualBoundingBoxLeft)
        let __h = Math.abs((y - _textMetrics.actualBoundingBoxAscent) - (y + _textMetrics.actualBoundingBoxDescent))
    
        let imgData = ctx.getImageData(__x,__y,__w,__h)
    
        for (var i = 0; i < imgData.data.length; i += 4) {
    
            let count = imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]
            let colour = 0
            if (count > 383) colour = 255
    
            imgData.data[i] = colour
            imgData.data[i + 1] = colour
            imgData.data[i + 2] = colour
            imgData.data[i + 3] = 255
    
            result[l].push(imgData.data[i])
        }
    
    
    })
    
    
    
    let lettersReady = {}
    
    
    for (const key in result) {
        let r = result[key]
        lettersReady[key] = []
        let _textMetrics = ctx.measureText(key);
    
        for (let i = 0; i < r.length; i++) {
            if (r[i] > 0) {
                r[i] = 1
            }
    
            while (r.length) {
                let _w = (x + _textMetrics.actualBoundingBoxRight) - (x -_textMetrics.actualBoundingBoxLeft)
                let nestedArr = r.splice(0, _w)
                for (let j = 0; j < nestedArr.length; j++) {
                    if (nestedArr[j] > 0) {
                        nestedArr[j] = 1
                    }
                }
                lettersReady[key].push(nestedArr);
            }
        }
    
    }
    
    console.log(lettersReady);
})