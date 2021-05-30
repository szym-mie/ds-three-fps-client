import MapEntity from "./MapEntity";
import Animator from "./Animator";
import {SkeletonUtils} from "three/examples/jsm/utils/SkeletonUtils";
import {LoopOnce, Vector3} from "three";
import MuzzleParticles from "./MuzzleParticles";

export default class LightEnemy extends MapEntity {
    constructor(scene, target, map, model_manager, x, y) {
        super(scene, map, SkeletonUtils.clone(model_manager.models["light_enemy"]), x, y, .2);
        this.model_manager = model_manager;

        this.target = target;

        this.particles = new MuzzleParticles(this.scene, new Vector3(0, -.03, -.5));
        this.animator = new Animator(
            this.obj,
            model_manager.animations["light_enemy"]);

        this.salov_on = false;
        this.salvo_cooldown = 2;
        this.salvo_rounds = 6;

        this.update_mesh();
        this.obj.updateMatrixWorld();
        this.animator.replace("idle");
        setTimeout(() => {this.animator.fade("idle", "walk", 2)}, 10000);
        setTimeout(() => {this.animator.fade("walk", "idle", 2)}, 15000);
        this.animator.mixer.update(Math.random()*10);

        this.animator.loop("death", LoopOnce);
        this.animator.loop("wound", LoopOnce);
        this.animator.loop("fire", LoopOnce);
        this.hp = 20;
        this.state = "idle";
        this.state_duration = 0;
        this.state_time_start = 0;
    }

    clone() {
        return new LightEnemy(this.scene, this.target, this.map, this.model_manager,
            this.position[0], this.position[1]);
    }

    move(vec) {
        this.position[0] = vec.x;
        this.position[1] = vec.z;
        this.obj.position.copy(new Vector3(vec.x, vec.y-.9, vec.z));
    }

    tick(t, dt) {
        this.animator.update(dt);
        this.particles.update();
        this.do_action(t);
        super.tick(t);
        // this.think(t);
    }

    think(t) {
        const chance = Math.random()>.99;
        if (chance && this.state === "idle") {
            const action = Math.floor(Math.random()*16);
            switch (action) {
                case 0:
                case 1:
                case 2:
                case 3:
                    this.scan_begin();
                    break;
                case 4:
                case 5:
                    this.turn_left_begin();
                    break;
                case 6:
                case 7:
                    this.turn_right_begin();
                    break;
                case 8:
                case 9:
                    this.fly_begin();
                    break;
                default:
                    break;
            }
            this.state_time_start = t;
        }
        if (this.state_time_start+this.state_duration < t) this.idle();
    }

    do_action(t) {
        console.log(this.state)
        switch (this.state) {
            case "idle":
                break;
            case "scan":
                this.scan(t);
                break;
            case "turn_left":
                this.turn_left(t);
                break;
            case "turn_right":
                this.turn_right(t);
                break;
            case "fly":
                this.fly(t);
                break;
            case "track":
                console.log("- tracking");
                this.track();
                break;
            default:
                break;
        }
    }

    idle(t) {
        this.animator.replace("idle");
        this.state = "idle";
    }

    scan_begin() {
        this.state = "scan";
        this.state_duration = 120;
    }

    scan(t) {
        this.direction = t - this.state_time_start/60*Math.PI;
    }

    turn_left_begin() {
        this.state = "turn_left";
        this.state_duration = 60;
    }

    turn_left(t) {
        this.direction -= Math.PI/120;
    }

    turn_right_begin() {
        this.state = "turn_right";
        this.state_duration = 60;
    }

    turn_right(t) {
        this.direction += Math.PI/120;
    }

    fly_begin() {
        const center_pos = this.map.pos(
            Math.floor(this.position[0] / 2),
            Math.floor(this.position[1] / 2));

        if (this.map.neighbours(center_pos).all(t => t < 64)) {
            this.state = "walk";
            this.animator.fade("idle", "walk", .2);
            this.state_duration = 30;
        }
    }

    fly(t) {
        // this.direction;
        // this.position
    }

    track_begin() {
        this.state = "track";
        this.state_duration = 600;
    }

    track() {
        const dx = this.target.position[0] - this.position[0]
        const dy = this.target.position[1] - this.position[1];

        const range = Math.sqrt(dx*dx + dy*dy);

        const target_dir = Math.atan2(dx, -dy);
        const norm_dir = this.direction % (Math.PI*2);
        const plane_dir = norm_dir < Math.PI ? norm_dir : -Math.PI*2 + norm_dir;

        this.direction += Math.min((-target_dir - plane_dir)/8, 0.05);

        this.shoot();

        if (range > 2) {
            super.walk(range > 4, Math.PI);
        }

        if (range < 4 && range > 3.5) {
            this.start_shoot();
        }
    }

    wound(dmg) {
        if (this.hp > 0) {
            this.hp-=dmg;
            if (this.hp <= 0) {
                this.animator.stop_all();
                this.animator.clamp("death");
                this.animator.play("death");
                this.animator.replace("death");
                this.state = "dead";
                this.state_duration = 784000;
            } else {
                this.track_begin();
                this.animator.play("wound");
                this.animator.action_weight("wound", 1);
            }
        }
    }

    start_shoot() {
        this.salov_on = true;
        this.animator.play("fire");
    }

    shoot() {
        if (this.salov_on) {
            if (!this.salvo_cooldown--) {
                this.particles.spawn(this);
                this.salvo_cooldown = 2;
                if (!this.salvo_rounds--) {
                    this.salvo_rounds = 6;
                    this.salov_on = false;
                }
            }
        }
    }
}