
import {
    CircleGeometry,
    ShaderMaterial,
    MeshStandardMaterial,
    Mesh,
    Vector3,
    DoubleSide
} from 'three'


const vertexShader = `
varying vec3 vUv; 

void main() {
  vUv = position; 
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}
  `
;

const fragmentShader = `
varying vec3 vUv;

void main() {
vec3 color = vec3(0.2);
gl_FragColor = vec4(color, 1.0);
}
  `
;

export class Background {
    
    constructor(scene,cameraDistance){
        this.uniforms = {
            uTime: {value: 0},
        }
        this.cameraDistance = cameraDistance
        this.dims = 10
        this.radius = this.cameraDistance / this.dims
        this.scene = scene
        this.geometry = new CircleGeometry( this.radius, 6 )
        this.geometry.rotateZ(Math.PI * 0.5);
        this.material = new ShaderMaterial({
            vertexShader:vertexShader,
            fragmentShader:fragmentShader,
            uniforms: this.uniforms
        } )

        

        // this.material = new MeshStandardMaterial({
        //     color: 0xffb700,
        //     side: DoubleSide
        // } )
        this.tiles = []

        this.init()

    }

    init(){
        this.drawGrid()
    }

    createSingleHex(){
        let tile = new Mesh( this.geometry, this.material );
        return tile
    }

    drawGrid(){
        let wx = Math.sqrt(3) * this.radius + (this.radius * 0.4)
        let wy = 2 * this.radius
        this.size = {
            w: this.dims * wx,
            h: this.dims * wy,
        }
        let dims = this.dims
        for (let x = 0; x < dims; x++) {
            this.tiles[x] = []
            for (let y = 0; y < dims; y++) {
                this.tiles[x].push(this.createSingleHex())
                let dy = wy * x
                let dx = wx * y
    
                if (x % 2) {
                    dx -= wx / 2
                }

                let _x = dx
                let _y = 0
                _y -= dy

                _x -= this.size.w / 2
                _y += this.size.h / 2

    
                this.tiles[x][y].position.set(_x,_y, 3)

                this.scene.add(this.tiles[x][y])
            }
        }

        console.log(this.scene);
    }
}