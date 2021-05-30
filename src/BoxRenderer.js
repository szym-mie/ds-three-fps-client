import {
    Mesh,
    InstancedMesh,
    MeshStandardMaterial,
    TextureLoader,
    RepeatWrapping,
    PCFSoftShadowMap,
    BoxGeometry,
    BufferGeometry,
    BufferAttribute,
    Matrix4,
    Vector3,
    AmbientLight,
    DirectionalLight,
    WebGLRenderer
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { TileTypes } from "./TileTypes";
import MapObject from "./MapObject";
import CeilLight from "./CeilLight";
import AlarmLight from "./AlarmLight";
import Player from "./Player";
import Camera from "./Camera";
import Treasure from "./Treasure";
import Ammobox from "./Ammobox";
import ModelManager from "./ModelManager";
import LightEnemy from "./LightEnemy";
import CarbineWeapon from "./CarbineWeapon";

export default class BoxRenderer {
    constructor (scene, map, dom) {
        this.dom = dom;
        this.scene = scene;
        this.map = map;

        this.pre = this.map.walls();

        this.renderer = new WebGLRenderer({
            antialias: true
        });

        this.composer = new EffectComposer( this.renderer );

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;

        this.renderer.setClearColor(0xffffff);

        this.dom.appendChild(this.renderer.domElement);
        this.viewport();
        this.renderer.domElement.onclick = () => { this.renderer.domElement.requestPointerLock() };

        document.addEventListener("DOMContentLoaded", () => {
            this.viewport();
        }, false);

        window.addEventListener("resize", () => {
            this.viewport();
        }, false);


        this.box_geom = new BufferGeometry();
        this.box_geom.setAttribute("position", new BufferAttribute(
            new Float32Array([
                1, -1, -1, 1, 1, 1, 1, -1, 1,
                -1, -1, 1, -1, 1, -1, -1, -1, -1,
                -1, -1, -1, 1, 1, -1, 1, -1, -1,
                1, -1, 1, -1, 1, 1, -1, -1, 1,
                1, -1, -1, 1, 1, -1, 1, 1, 1,
                -1, -1, 1, -1, 1, 1, -1, 1, -1,
                -1, -1, -1, -1, 1, -1, 1, 1, -1,
                1, -1, 1, 1, 1, 1, -1, 1, 1
            ]), 3
        ));
        this.box_geom.setAttribute("normal", new BufferAttribute(
            new Float32Array([
                1, 0, 0, 1, 0, 0, 1, 0, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0,
                0, 0, -1, 0, 0, -1, 0, 0, -1,
                0, 0, 1, 0, 0, 1, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 1, 0, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0,
                0, 0, -1, 0, 0, -1, 0, 0, -1,
                0, 0, 1, 0, 0, 1, 0, 0, 1
            ]), 3
        ));
        this.box_geom.setAttribute("uv", new BufferAttribute(
            new Float32Array([
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1, 0, 0,
                1, 0, 1, 1, 0, 1,
                1, 0, 1, 1, 0, 1,
                1, 0, 1, 1, 0, 1,
                1, 0, 1, 1, 0, 1
            ]), 2
        ));

        this.tex_loader = new TextureLoader();

        this.no_tex = {
            diff: this.tex_loader.load("http://localhost:8080/texs/no_tex_diff.jpg"),
            norm: this.tex_loader.load("http://localhost:8080/texs/no_tex_norm.jpg"),
            ao: this.tex_loader.load("http://localhost:8080/texs/no_tex_ao.jpg"),
            emsv: this.tex_loader.load("http://localhost:8080/texs/no_tex_emsv.jpg")
        };

        this.textures = [];
        for (let i = 0; i < 256; i++) {
            const type = TileTypes.game[i];
            if (type === undefined)
                this.textures.push(this.no_tex);
            else
                this.textures.push({
                    diff: this.tex_loader.load("http://localhost:8080/texs/" + type + "_diff.jpg"),
                    norm: this.tex_loader.load("http://localhost:8080/texs/" + type + "_norm.jpg"),
                    ao: this.tex_loader.load("http://localhost:8080/texs/" + type + "_ao.jpg"),
                    emsv: this.tex_loader.load("http://localhost:8080/texs/" + type + "_emsv.jpg")
                });
        }

        this.textures[256] = {
            diff: this.tex_loader.load("http://localhost:8080/texs/floor_diff.jpg"),
            norm: this.tex_loader.load("http://localhost:8080/texs/floor_norm.jpg"),
            ao: this.tex_loader.load("http://localhost:8080/texs/floor_ao.jpg")
        };

        this.textures[256].diff.repeat.set(10, 10);
        this.textures[256].diff.wrapS = RepeatWrapping;
        this.textures[256].diff.wrapT = RepeatWrapping;

        this.textures[256].norm.repeat.set(10, 10);
        this.textures[256].norm.wrapS = RepeatWrapping;
        this.textures[256].norm.wrapT = RepeatWrapping;

        this.textures[256].ao.repeat.set(10, 10);
        this.textures[256].ao.wrapS = RepeatWrapping;
        this.textures[256].ao.wrapT = RepeatWrapping;

        this.textures[257] = {
            diff: this.tex_loader.load("http://localhost:8080/texs/ceil_diff.jpg"),
            norm: this.tex_loader.load("http://localhost:8080/texs/ceil_norm.jpg"),
            ao: this.tex_loader.load("http://localhost:8080/texs/ceil_ao.jpg")
        };

        this.textures[257].diff.repeat.set(10, 10);
        this.textures[257].diff.wrapS = RepeatWrapping;
        this.textures[257].diff.wrapT = RepeatWrapping;

        this.textures[257].norm.repeat.set(10, 10);
        this.textures[257].norm.wrapS = RepeatWrapping;
        this.textures[257].norm.wrapT = RepeatWrapping;

        this.textures[257].ao.repeat.set(10, 10);
        this.textures[257].ao.wrapS = RepeatWrapping;
        this.textures[257].ao.wrapT = RepeatWrapping;

        this.floor = new Mesh(
            new BoxGeometry(this.map.cols*2, 1, this.map.rows*2),
            new MeshStandardMaterial({
                map: this.textures[256].diff,
                normalMap: this.textures[256].norm,
                aoMap: this.textures[256].ao })
        );
        this.ceil = new Mesh(
            new BoxGeometry(this.map.cols*2, 1, this.map.rows*2),
            new MeshStandardMaterial({
                map: this.textures[257].diff,
                normalMap: this.textures[257].norm,
                aoMap: this.textures[257].ao })
        );

        // object init.
        this.objects = {};

        this.protos = {};

        const fallback = tex => tex !== undefined ? tex : this.no_tex

        this.boxes = [];
        for (let i = 128; i < 256; i++) {
            const box = new InstancedMesh(this.box_geom, new MeshStandardMaterial({
                map: this.textures[i].diff,
                normalMap: this.textures[i].norm,
                aoMap: fallback(this.textures[i].ao),
                emissive: 0xffffff,
                emissiveIntensity: 3,
                emissiveMap: fallback(this.textures[i].emsv) }),
                this.pre[i] === undefined ? 0 : this.pre[i].length);
            box.castShadow = true;
            box.receiveShadow = true;
            this.boxes.push(box);
            // scene.add(box);
        }

        console.log(this.textures);
        console.log(this.boxes);

        this.floor.position.y-=1.5;
        this.floor.position.x += this.map.cols;
        this.floor.position.z += this.map.rows;
        //this.floor.rotation.x = -Math.PI / 2;
        this.floor.receiveShadow = true;
        this.floor.castShadow = true;

        this.ceil.position.y+=1.5;
        this.ceil.position.x += this.map.cols;
        this.ceil.position.z += this.map.rows;
        //this.ceil.rotation.x = Math.PI / 2;
        this.ceil.receiveShadow = true;
        this.ceil.castShadow = true;

        this.scene.add(this.floor);
        this.scene.add(this.ceil);
        for (const box of this.boxes) {
            this.scene.add(box);
        }

        this.sun = new DirectionalLight(0xe0e0ff, 1);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.width = 2048;
        this.sun.shadow.mapSize.height = 2048;
        this.sun.shadow.camera.left = -100;
        this.sun.shadow.camera.right = 100;
        this.sun.shadow.camera.bottom = -100;
        this.sun.shadow.camera.top = 100;
        this.sun.shadow.camera.near = 50;
        this.sun.shadow.camera.far = 1000;
        this.sun.shadow.bias = 0.001;

        this.sun.position.set(50, 50, 50);
        this.ambient = new AmbientLight(0xefefff, .1);

        this.scene.add(this.sun);
        this.scene.add(this.ambient);

        this.camera = new Camera(this.renderer);
        this.player = new Player(scene, map, this.camera.camera, 0, 1);

        this.T = 0;
        this.dT = 0;

        this.model_man = new ModelManager(() => { console.log("load complete", this.player); this.object_init(); });
        this.model_man.add("ammobox", "http://localhost:8080/mdls/ammobox.glb");
        this.model_man.add("treasure", "http://localhost:8080/mdls/treasure.glb");
        this.model_man.add("light_enemy", "http://localhost:8080/mdls/plane.glb");
        this.model_man.add("carbine_hand", "http://localhost:8080/mdls/carbine_hand.glb");
        this.model_man.load();
    }

    time() {
        const now = performance.now();
        const delta = now - this.T;
        this.T = now;
        this.dT = delta;
    }

    object_init() {
        this.protos = {
            8:   new CeilLight(this.scene, 0xf0f0c0, 1, 5, Math.PI / 3, .5, .5),
            9:   new CeilLight(this.scene, 0xdde0e8, 3, 50, Math.PI / 2.2, .2, .4),
            10:  new AlarmLight(this.scene, 0xd01010, 2),
            16:  new LightEnemy(this.scene, this.player, this.map, this.model_man, 1, 1),
            24:  new Treasure(this.scene, this.model_man),
            32:  new Ammobox(this.scene, this.model_man),
        };

        for (let i = 2; i < 128; i++) {
            if (this.protos[i] !== undefined && this.pre[i] !== undefined) {
                this.objects[i] = [];
                const pre_len = this.pre[i].length;
                const pre = this.pre[i];
                for (let j = 0; j < pre_len; j++) {
                    const [x, y] = this.map.coord(pre[j]);
                    const clone = this.protos[i].clone();
                    clone.move(new Vector3(x*2+1, .9, y*2+1));
                    clone.add();
                    this.objects[i].push(clone);
                }
            }
        }

        this.player.weapon = new CarbineWeapon(this.scene, this.objects, this.player, new Vector3(0.05,-0.05,-.15), this.model_man);

        this.scene.add(this.player.weapon.off);
        setTimeout(() => { this.player.reload(); this.loading_end(); }, 500);
    }

    loading_end() {
        try {
            const lscr = document.getElementById("loading_screen");
            lscr.children[0].innerText = "finalizing...";
            lscr.style.display = "none";
        } catch {}
    }

    viewport () {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    render (scene, camera) {
        // object render (lights cannot be instanced, nor animated models) but can be ticked.
        this.time();
        const T = this.T;
        const dT = this.dT;

        for (let i = 1; i < 128; i++) {
            if (this.pre[i] !== undefined) {
                try {
                    for (const obj of this.objects[i]) obj.tick(T, dT);
                } catch {}
            }
        }

        // instanced wall render

        const mat = new Matrix4();

        for (let i = 128; i < 256; i++) {
            if (this.pre[i] !== undefined) {
                const pre = this.pre[i];
                const pre_len = pre.length;
                for (let j = 0; j < pre_len; j++) {
                    const [x, y] = this.map.coord(pre[j]);
                    mat.makeTranslation(x*2+1, 0, y*2+1);
                    this.boxes[i-128].setMatrixAt(j, mat);
                }
            }
        }

        this.player.tick(T, dT);
        this.renderer.render(scene, camera);
    }
}