import {Group, Quaternion, Sprite, SpriteMaterial, TextureLoader, Vector3} from "three";

export default class MuzzleParticles {
    constructor(scene, offset) {

        this.scene = scene;
        this.group = new Group();
        this.scene.add(this.group);

        this.offset = offset;
        const texture_loader = new TextureLoader();
        this.fire_tex = texture_loader.load("/texs/fire1.png");
        this.smoke_tex = texture_loader.load("/texs/smoke1.png");

        this.fire_mat = new SpriteMaterial({map: this.fire_tex, transparent: true});
        this.fire = new Sprite(this.fire_mat);

        this.group.add(this.fire);

        this.smoke_mat = new SpriteMaterial({map: this.smoke_tex, transparent: true, opacity: 0});
        this.smokes = [];

        this.salvo_sprites = 2;
    }

    spawn(weapon) {
        const smoke = {
            time: 0,
            velocity: weapon.obj.getWorldDirection(),
            group: new Group(),
            randoms: []
        }

        this.group.add(smoke.group);

        const real = new Vector3();
        const quat = new Quaternion();

        weapon.obj.getWorldPosition(real);
        weapon.obj.getWorldQuaternion(quat);

        const direct_offset = this.offset.clone().applyQuaternion(quat);
        real.add(direct_offset);

        for (let i = 0; i < this.salvo_sprites; i++) {
            const sprite = new Sprite(this.smoke_mat.clone());
            sprite.scale.set(.5, .5 ,1);
            sprite.position.copy(real);
            smoke.group.add(sprite);

            smoke.randoms.push(Math.random()*.5+.5);
        }

        this.fire.material.opacity = 0;

        this.fire.position.copy(real);
        this.fire.material.rotation = Math.random() * 3;
        this.fire.scale.set(.5, .5 ,1);

        this.smokes.push(smoke);
    }

    update() {
        this.fire.material.opacity = Math.min(...this.smokes.map(smoke => smoke.time)) < 1 ? .5 : 0;
        for (const smoke of this.smokes) {
            for (let i = 0; i < this.salvo_sprites; i++) {
                const sprite = smoke.group.children[i];
                const random = smoke.randoms[i];

                smoke.velocity.multiplyScalar(.9);
                const velocity = smoke.velocity.clone().multiplyScalar((i+1)/this.salvo_sprites*.5);

                sprite.position.sub(velocity);
                sprite.material.opacity = Math.max((20-smoke.time)/50, 0);
                sprite.material.rotation += random*(30-smoke.time)*.02;
                const scale_time = smoke.time/60+.5;
                sprite.scale.set(.5+scale_time, .5+scale_time ,1);
            }
            if (smoke.time++ > 30) {
                const unused = this.smokes.shift();
                this.group.remove(unused.group);

                for (const sprite of unused.group.children) {
                    sprite.material.dispose();
                }
            }
        }
    }
}