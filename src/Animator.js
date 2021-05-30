import {AnimationMixer} from "three";

export default class Animator {
    constructor(obj, animations) {
        this.obj = obj;
        this.animations = animations;
        this.actions = {};

        this.mixer = new AnimationMixer(this.obj);
        this.finished_registered = false;

        for (const clip of this.animations) {
            const name = clip.name;
            this.actions[name] = this.mixer.clipAction(clip);
        }

        for (const name in this.actions) {
            this.action_weight(name, 0);
            this.play(name);
        }
    }

    play(name) {
        this.actions[name].reset().play();
    }

    stop(name) {
        this.actions[name].stop();
    }

    stop_all() {
        this.mixer.stopAllAction();
    }

    action_weight(name, weight) {
        const action = this.actions[name];
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }

    replace(name) {
        for (const n in this.actions) {
            if (name === n) this.action_weight(n, 1);
            else this.action_weight(n, 0);
        }
    }

    finished(cb) {
        if (!this.finished_registered) {
            this.mixer.addEventListener("finished", cb);
            this.finished_registered = true;
        }
    }

    fade(s_name, e_name, time) {
        this.action_weight(s_name, 1);
        this.action_weight(e_name, 1);

        const s_action = this.actions[s_name];
        const e_action = this.actions[e_name];

        e_action.time = 0;
        s_action.crossFadeTo(e_action, time);
    }

    loop(name, loop, rep) {
        this.actions[name].setLoop(loop, rep);
    }

    clamp(name) {
        this.actions[name].clampWhenFinished = true;
    }

    update(dT) {
        this.mixer.update(dT/1000);
    }
}