import {Ray, Raycaster, Vector3} from "three";

export default class Weapon {
    constructor(scene, objects, entity) {
        this.scene = scene;
        this.inter = [];
        this.objects = objects;
        this.entity = entity;
        this.raycaster = new Raycaster();

        console.log(objects);

        this.scene.traverse(
            function( child ) {
                if (child.type === "Mesh" || child.type === "SkinnedMesh" || child.type === "Group") this.inter.push(child); }.bind(this));

        for (const obj of this.inter) {
            console.log(obj);
            obj.traverse( function (child) { child.layers.mask = 1; } );
        }
    }

    shoot() {
        const pos = new Vector3();
        const dir = new Vector3();

        this.entity.obj.getWorldPosition(pos);
        this.entity.obj.getWorldDirection(dir);

        this.raycaster.ray = new Ray(pos, dir);

        console.log(this.inter);

        const hit = this.raycaster.intersectObjects(this.inter, false)[0];

        console.log(hit);

        let entity = undefined;
        if (hit) {
            for (const oid in this.objects) {
                for (const obj of this.objects[oid]) {
                    console.log(obj.obj.id);
                    obj.obj.traverse(function (child) { if (child.id === hit.object.id) entity = obj; })

                }}
        }

        return entity;
    }
}