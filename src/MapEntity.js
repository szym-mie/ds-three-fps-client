export default class MapEntity {
    constructor(scene, map, obj, x, y, speed, direction=0, radius=0.3) {
        this.scene = scene;
        this.map = map;
        this.obj = obj;
        this.radius = radius*2;
        this.direction = direction;
        this.position = [x*2+1, y*2+1];
        this.velocity = [0, 0];
        this.speed = speed;
        this.passable = false;
    }

    add() {
        this.scene.add(this.obj);
    }

    clone() {
        return new MapEntity(
            this.scene,
            this.map,
            this.obj,
            this.position[0], this.position[1],
            this.speed,
            this.direction,
            this.radius);
    }

    move(vec) {
        this.position[0] = vec.x;
        this.position[1] = vec.z;
        this.obj.position.copy(vec);
    }

    walk(sprint, angle_offset=0) {
        const multiplier = sprint ? this.speed : 0.5 * this.speed;
        const [vx, vy] = this.velocity;
        const tx = Math.sin(this.direction+angle_offset) * multiplier;
        const ty = Math.cos(this.direction+angle_offset) * multiplier;

        this.velocity[0] += (tx - vx) / 5;
        this.velocity[1] += (ty - vy) / 5;
    }

    tick(t, _) {
        this.wall_collide();
        this.calculate_frame();
        this.update_mesh();
    }

    calculate_frame() {
        this.velocity[0] *= .85;
        this.velocity[1] *= .85;

        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
    }

    wall_collide() {
        const center_pos = this.map.pos(
            Math.floor(this.position[0] / 2),
            Math.floor(this.position[1] / 2));

        const frac_x = this.position[0] % 2;
        const frac_y = this.position[1] % 2;

        const collide_n = frac_y - this.radius < 0;
        const collide_s = frac_y + this.radius > 2;
        const collide_e = frac_x + this.radius > 2;
        const collide_w = frac_x - this.radius < 0;

        // console.log(collide_n, collide_s, collide_e, collide_w);

        const adjacent = this.map.adjacent(center_pos);

        if (this.map.at(adjacent[0]) > 127 && collide_n && this.velocity[1] < 0) this.velocity[1] = 0;
        if (this.map.at(adjacent[3]) > 127 && collide_s && this.velocity[1] > 0) this.velocity[1] = 0;
        if (this.map.at(adjacent[1]) > 127 && collide_w && this.velocity[0] < 0) this.velocity[0] = 0;
        if (this.map.at(adjacent[2]) > 127 && collide_e && this.velocity[0] > 0) this.velocity[0] = 0;
    }

    update_mesh() {
        this.obj.position.x = this.position[0];
        this.obj.position.z = this.position[1];

        this.obj.rotation.y = this.direction;
    }
}