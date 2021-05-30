import CeilLight from "./CeilLight";

export default class AlarmLight extends CeilLight {
    constructor(scene, color, rot_speed) {
        super(scene, color, .5, 40);

        this.rotation_speed = rot_speed;
        this.c_radius = 100;
    }

    clone() {
        return new AlarmLight(this.scene, this.obj.color, this.rotation_speed);
    }

    tick(t, _) {
        const r = t*this.rotation_speed/1000;
        this.target.position.x = this.obj.position.x + Math.sin(r)*this.c_radius;
        this.target.position.z = this.obj.position.z + Math.cos(r)*this.c_radius;
    }
}