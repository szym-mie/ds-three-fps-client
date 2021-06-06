import MapEntity from "./MapEntity";
import {Object3D} from "three";

export default class Player extends MapEntity {
    constructor(scene, map, camera, x, y) {
        super(scene, map, camera, x, y, .3);
        this.keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            r: false,
            Shift: false,
            ' ': false
        };
        this.movements = {
            w: Math.PI,
            s: 0,
            a: Math.PI*3/2,
            d: Math.PI/2,
        };

        this.pitch = 0;

        this.weapon = undefined;

        window.addEventListener("keydown", this.keydown_event.bind(this));
        window.addEventListener("keyup", this.keyup_event.bind(this));
        window.addEventListener("mousemove", this.mousemove_event.bind(this));

        this.hp = 100;
        this.ammo = 120;
        this.mag = 0;
        this.busy = ""; // "" no busy
        this.view = new Object3D();
    }

    keydown_event(ev) {
        const k = ev.key;
        if (k in this.keys) {
            if (['w', 's', 'a', 'd'].includes(k)) {
                const none = !(this.keys.w || this.keys.s || this.keys.a || this.keys.d);
                if (none && !this.keys[k] && !this.busy) this.weapon.walk();
            }
            if (k === 'r') {
                this.reload();
            }
            this.keys[k] = true;
        }
    }

    keyup_event(ev) {
        const k = ev.key;
        if (k in this.keys) {
            this.keys[k] = false;
            if (['w', 's', 'a', 'd'].includes(k)) {
                const none = !(this.keys.w || this.keys.s || this.keys.a || this.keys.d);
                if (none && this.weapon && !this.busy) this.weapon.raise();
            }
        }
    }

    mousemove_event(ev) {
        const x = ev.movementX;
        const y = ev.movementY;
        this.direction -= x/300;
        this.pitch = Math.min(Math.max(this.pitch - y/300, -Math.PI / 2.1), Math.PI / 2.1);
    }

    tick(t, dt) {
        const main = !(this.keys.w && this.keys.s);
        const strafe = !(this.keys.a && this.keys.d);
        const none = !(this.keys.w || this.keys.s || this.keys.a || this.keys.d);
        const all = main || strafe;

        let avg_direction = 0;

        if (main && this.keys.w) avg_direction += this.movements.w;
        if (main && this.keys.s) avg_direction += this.movements.s;

        if (strafe && this.keys.a) avg_direction += this.movements.a;
        if (strafe && this.keys.d) avg_direction += this.movements.d;

        if (this.keys.a && this.keys.s) {
            console.log("A&S");
            avg_direction = Math.PI*7/2;
        }

        if (this.keys[" "] && !this.weapon.cooldown) {
            this.shoot();
        }

        const len = ((this.keys.w || this.keys.s) + (this.keys.a || this.keys.d));
        avg_direction /= isNaN(len) ? 1 : len;

        if (!(none && all)) this.walk(!this.keys.Shift, avg_direction);

        super.tick(t);

        if (this.weapon) {
            this.weapon.update(dt);
        }
    }

    update_mesh() {
        this.obj.position.x = this.position[0];
        this.obj.position.z = this.position[1];

        this.view.position.x = -Math.sin(this.direction) + this.position[0];
        this.view.position.z = -Math.cos(this.direction) + this.position[1];
        this.view.position.y = Math.tan(this.pitch);

        this.obj.lookAt(this.view.position);

        if (this.weapon) {
            this.weapon.off.position.x = this.position[0];
            this.weapon.off.position.z = this.position[1];
            this.weapon.off.position.y = 0;

            this.weapon.off.quaternion.slerp(this.obj.quaternion, .5);
        }
    }

    shoot() {
        if (this.mag && !this.busy) {
            this.weapon.shoot();
            this.mag--;
            this.pitch += Math.random() * .02 + .04;
            this.direction += -Math.random() * .01 - .01;
        }
    }

    wound() {
        const dmg = Math.floor(Math.random() * 5);
        this.hp -= dmg;
    }

    reload() {
        this.weapon.finished(function (e) {
            if (e.action._clip.name === this.busy) this.unbusy(); }.bind(this));
        if (this.ammo && this.mag < 20) {
            if (this.mag) {
                this.busy = "reload_loaded";
                this.mag = this.ammo > 20 ? 21 : this.ammo;
                this.weapon.reload_loaded();
            } else {
                this.busy = "reload_empty";
                this.mag = this.ammo > 20 ? 20 : this.ammo;
                this.weapon.reload_empty();
            }
            this.ammo -= this.ammo > 20 ? 20 : this.ammo;
        }
    }

    unbusy() {
        this.busy = "";
        if (this.keys.w || this.keys.s || this.keys.a || this.keys.d) {
            this.weapon.walk();
        } else {
            this.weapon.stand();
        }
    }
}