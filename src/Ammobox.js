import MapObject from "./MapObject";
import {Vector3} from "three";

export default class Ammobox extends MapObject {
    constructor(scene, model_manager) {
        super(scene, model_manager.models["ammobox"].clone());
        this.model_manager = model_manager;
    }

    move(vec) {
        super.move(new Vector3(vec.x, vec.y-1.9, vec.z));
    }

    clone() {
        return new Ammobox(this.scene, this.model_manager);
    }
}