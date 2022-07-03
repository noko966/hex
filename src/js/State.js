class State {
    constructor(){
        this.letters = new Array()
        this.hexRadius = 1.2
        this.hexHeight = 3
    }
    
    addLetter(letter) {
        this.letters.push(letter);
    }
}

const STATE = new State()

export default STATE