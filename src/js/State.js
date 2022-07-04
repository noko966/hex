import {
    Clock
} from 'three'

class State {
    constructor(){
        this.letters = new Array()
        this.hexRadius = 1.2
        this.hexHeight = 3
        this.animations = []
        this.clock = new Clock()
    }
    
    addLetter(letter) {
        this.letters.push(letter);
    }

    addAnimation(animation){
        this.animations.push(animation);
    }

    play(){
        this.time = this.clock.getElapsedTime()
    }


}

const STATE = new State()

export default STATE