import MapObject from "./MapObject";
import { Object3D, SpotLight } from "three";

export default class CeilLight extends MapObject {
    constructor (scene, color=0xf8f0d0, intensity=1, distance=5,
                 angle=(Math.PI/3), penumbra=0, decay=1, quality=2) {
        super(scene, new SpotLight(color, intensity, distance, angle, penumbra, decay));
        this.target = new Object3D();

        this.obj.castShadow = true;
        const multiplier = Math.min(quality ? 2**(quality-1) : 0, 8)
        this.obj.shadow.mapSize.width = 256*multiplier;
        this.obj.shadow.mapSize.height = 256*multiplier;
        this.t_offset = Math.random();
        this.x_scale = Math.random()*.2;
        this.y_scale = Math.random()*.2;
        this.quality = quality;
    }

    add () {
        super.add();
        this.scene.add(this.target);
        this.obj.target = this.target;
    }

    clone () {
        return new CeilLight(this.scene, this.obj.color, this.obj.intensity, this.obj.distance, this.obj.angle, this.obj.penumbra, this.obj.decay, this.quality);
    }

    move (vec) {
        this.obj.position.copy(vec);
        this.target.position.copy(vec);
        this.target.position.y--;
    }

    tick(t, _) {
        const r = t/1000 + this.t_offset;
        this.target.position.x = this.obj.position.x + Math.sin(r)*this.x_scale;
        this.target.position.z = this.obj.position.z + Math.cos(r)*this.y_scale;
    }
}