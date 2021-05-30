export default class MapObject {
    constructor (scene, obj) {
        this.obj = obj; // this could be a mesh or a light etc.
        this.scene = scene;
    }

    add () {
        this.scene.add(this.obj);
    }

    move (vec) {
        this.obj.position.copy(vec);
    }

    clone () {
        return new MapObject(this.scene, this.obj.clone());
    }

    tick(t, _) {
        // do nothing by default.
    }
}