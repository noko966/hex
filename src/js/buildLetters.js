let Alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`
Alphabet += `abcdefghijklmnopqrstuvwxyz`

Alphabet = Array.from(Alphabet)

let result = {}

Alphabet.forEach(l => {
    result[l] = []
    ctx.font = `${fsz}px Arial`;
    ctx.fillStyle = "red"
    ctx.fillRect(0, 0, fcDims.w, fcDims.h);
    ctx.fillStyle = "white"
    ctx.textAlign = "center";
    ctx.lineHeight = fcDims.h;
    ctx.fontWeight = 'bold';


    ctx.fillText(`${l}`, fcDims.w / 2, fcDims.h / 2 + fsz * 0.3, fcDims.w);
    let imgData = ctx.getImageData(0, 0, fcDims.w, fcDims.h)

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

    for (let i = 0; i < r.length; i++) {
        if (r[i] > 0) {
            r[i] = 1
        }

        while (r.length) {
            let nestedArr = r.splice(0, fcDims.w)
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