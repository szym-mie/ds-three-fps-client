import { PerspectiveCamera, Vector3 } from "three";

export default class Camera {
    constructor (renderer) {
        const width = renderer.domElement.width;
        const height = renderer.domElement.height;

        this.camera = new PerspectiveCamera(75, width/height, 0.01, 100);

        this.viewport(renderer);

        window.addEventListener("resize", () => {
            this.viewport(renderer)
        }, false);
    }

    viewport (renderer) {
        this.camera.aspect = renderer.domElement.width / renderer.domElement.height;
        this.camera.updateProjectionMatrix();
    }
}