import Weapon from "./Weapon";
import Animator from "./Animator";
import {Group, LoopOnce, Vector3} from "three";
import MuzzleParticles from "./MuzzleParticles";

export default class CarbineWeapon extends Weapon {
    constructor(scene, objects, entity, offset, model_manager) {
        super(scene, objects, entity);

        this.obj = model_manager.models["carbine_hand"];
        this.obj.scale.multiplyScalar(.1);

        this.off = new Group();
        this.off.add(this.obj);
        this.obj.position.copy(offset);

        this.particles = new MuzzleParticles(this.entity.scene, new Vector3(.05, 0, -.2));
        this.animator = new Animator(this.obj, model_manager.animations["carbine_hand"]);
        console.log(model_manager.animations["carbine_hand"]);

        this.animator.replace("idle");
        this.animator.loop("shoot", LoopOnce, 1);

        this.cooldown = 0;

        console.log(this.animator.actions);

        this.animator.loop("reload_loaded", LoopOnce, 1);
        this.animator.loop("reload_empty", LoopOnce, 1);
    }

    raise() {
        this.animator.fade("walk", "idle", .2);
    }

    stand() {
        this.animator.fade("idle", "idle", .2);
    }

    walk() {
        this.animator.fade("idle", "walk", .2);
    }

    shoot() {
        if (!this.cooldown) {
            this.animator.play("shoot");
            this.animator.action_weight("shoot", 1);
            this.particles.spawn(this);
            this.cooldown = 5;

            const ent = super.shoot();
            try {
                ent.wound(5);
            } catch {}
        }
    }

    finished(cb) {
        this.animator.finished(cb);
    }

    reload_loaded() {
        this.animator.play("reload_loaded");
        this.animator.replace("reload_loaded");
        console.log("reload_loaded");
    }

    reload_empty() {
        this.animator.play("reload_empty");
        this.animator.replace("reload_empty");
        console.log("reload_empty");
    }

    update(dT) {
        if (this.cooldown) this.cooldown--;
        this.animator.update(dT);
        this.particles.update();
    }
}