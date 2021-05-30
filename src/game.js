import BoxRenderer from "./BoxRenderer";
import MapStorage from "./MapStorage";
import Map from "./Map";
import {Scene, Vector2} from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
require("./game.css");

const map = new Map("", 10, 10);
map.tiles = new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 131, 130, 130,
    0, 0, 128, 0, 0, 0, 0, 0, 8, 130,
    0, 0, 128, 0, 0, 0, 0, 24, 0, 131,
    0, 0, 128, 0, 0, 9, 32, 24, 0, 0,
    0, 0, 128, 0, 132, 0, 0, 16, 0, 0,
    0, 0, 128, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 128, 131, 130, 130, 131, 0, 0, 0,
    0, 0, 0, 10, 0, 32, 0, 10, 0, 0,
    0, 0, 0, 0, 0, 10, 0, 0, 129, 0,
    0, 0, 134, 133, 133, 132, 134, 0, 129, 0
]);
const dom_root = document.body;

const scene = new Scene();
const renderer = new BoxRenderer(scene, map, dom_root);

const render_pass = new RenderPass(scene, renderer.camera.camera);
const bloom_pass = new UnrealBloomPass(
    new Vector2( window.innerWidth, window.innerHeight ),
    0.5, 0.5, 0.85);
const bokeh_pass = new BokehPass(scene, renderer.camera.camera, {
    focus: 1,
    aperture: 0.025,
    maxblur: 0.0025,
    width: window.innerWidth,
    height: window.innerHeight });
renderer.composer.addPass(render_pass);
//renderer.composer.addPass(bloom_pass);
//renderer.composer.addPass(bokeh_pass);

render();

function render() {
    renderer.render(scene, renderer.camera.camera);
    renderer.composer.render();

    requestAnimationFrame(render);
}

// const maps = new MapStorage("localhost");
// maps.pull(() => {}, m => {
//     const dom_root = document.body;
//
//     const scene = new Scene();
//     const renderer = new BoxRenderer(scene, map, dom_root);
//
//     const render_pass = new RenderPass(scene, renderer.camera.camera);
//     const bloom_pass = new UnrealBloomPass(
//         new Vector2( window.innerWidth, window.innerHeight ),
//         0.5, 0.5, 0.85);
//     const bokeh_pass = new BokehPass(scene, renderer.camera.camera, {
//         focus: 1,
//         aperture: 0.025,
//         maxblur: 0.0025,
//         width: window.innerWidth,
//         height: window.innerHeight });
//     renderer.composer.addPass(render_pass);
//     //renderer.composer.addPass(bloom_pass);
//     //renderer.composer.addPass(bokeh_pass);
//
//     render();
//
//     function render() {
//         renderer.render(scene, renderer.camera.camera);
//         renderer.composer.render();
//
//         requestAnimationFrame(render);
//     }
// });
