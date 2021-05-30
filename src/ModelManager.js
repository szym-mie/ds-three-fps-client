import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {LoadingManager} from "three";

export default class ModelManager {
    constructor(complete) {
        this.complete = complete;
        this.urls = {};
        this.models = {};
        this.animations = {};
    }

    add(name, url) {
        this.urls[name] = url;
    }

    load() {
        const manager = new LoadingManager(
            () => { console.log("internal manager load complete"); this.complete(); });
        const loader = new GLTFLoader(manager);
        for (const name in this.urls) {
            const url = this.urls[name];
            loader.load(url, gltf => {
                gltf.scene.traverse(o => {
                    o.frustumCulled = false;
                })
                this.models[name] = gltf.scene;
                console.log(gltf.animations);
                this.animations[name] = gltf.animations;
            });
        }
    }
}