import {Object3D} from "three";

export default class FireParticles extends Object3D {
    constructor(delay, loop) {
        super();

        this.delay = delay;
        this.loop = loop;
        this.d = 0;
    }

    spawn() {

    }
}