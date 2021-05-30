import { TileTypes } from "./TileTypes";

export default class EditorView {
    constructor(map, width) {
        this.map = map;
        this.width = width;
        // this.original_width = width;

        this.view_offset = [0, 0];
        this.move_offset = [0, 0];
        this.mouse_pos = [0, 0]

        this.dom = document.createElement("canvas");

        this.dom.width = this.map.cols * width;
        this.dom.height = this.map.rows * width;

        this.ctx = this.dom.getContext("2d");
        this.ctx.font = "10px monospace";

        this.tile_type = 0;

        this.tile_selected = 0;

        this.colors = {
            bg: "#e8d8d0",
            fg: "#282010"
        }

        this.advice = {
            sT: 0,
            lines: [],
            dim: [0, 0],
            pos: [0, 0]
        }

        this.modes = {
            inside: false, // is mouse over canvas.
            mouse: false, // is mouse drawing.
            shift: false, // is mouse dragging.
            alt: false
        };

        this.T = 0;

        this.render();
    }

    event_attach () {
        window.onkeydown = this.keydown_event.bind(this);
        window.onkeyup = this.keyup_event.bind(this);
        window.onresize = () => { this.viewport.call(this, this.dom.clientWidth, this.dom.clientHeight); };

        this.dom.onmousedown = this.mousedown_event.bind(this);
        this.dom.onmouseup = this.mouseup_event.bind(this);
        this.dom.onmousemove = this.mousemove_event.bind(this);
        this.dom.onmouseover = this.mouseenter_event.bind(this);
        this.dom.onmouseout = this.mouseleave_event.bind(this);
    }

    tile_select (x, y) {
        const rx = x - this.view_offset[0];
        const ry = y - this.view_offset[1];

        const w = this.width;

        return this.map.pos(Math.floor(rx / w), Math.floor(ry / w));
    }

    keydown_event (ev) {
        console.log(ev.key);
        switch (ev.key) {
            case 'ArrowLeft':
                console.log("tile left");
                this.tile_type -= this.tile_type > 0 ? 1 : -255;
                this.show_tile_type_change();
                break;

            case 'ArrowRight':
                console.log("tile right");
                this.tile_type += this.tile_type < 255 ? 1 : -255;
                this.show_tile_type_change();
                break;

            case '=':
            case '+':
                this.zoom(1.1);
                break;

            case '-':
                this.zoom(0.9);
                break;

            case 'c':
                this.center();
                break;

            case 'w':
                this.tile_type = 128;
                this.show_tile_type_change();
                break;

            case 'e':
                this.tile_type = 0;
                this.show_tile_type_change();
                break;

            case 'h':
                this.show_help();
                break;
            case 'Shift':
                this.modes.shift = true;
                this.dom.className = "grab";
                break;
            case 'Alt':
                this.modes.alt = true;
                break;
            default:
                break;
        }
    }

    keyup_event (ev) {
        switch (ev.key) {
            case 'Shift':
                this.modes.shift = false;
                this.dom.className = "";
                break;
            case 'Alt':
                this.modes.alt = false;
                break;
            default:
                break;
        }
    }

    mousedown_event (ev) {
        this.modes.mouse = true;
        this.move_offset[0] = ev.offsetX;
        this.move_offset[1] = ev.offsetY;
        const new_clicked = this.tile_select(ev.offsetX, ev.offsetY);
        if (!this.modes.shift) {
            this.map.change(new_clicked, this.tile_type);
        }
    }

    mouseup_event () {
        this.modes.mouse = false;
    }

    mousemove_event (ev) {
        this.mouse_pos[0] = ev.offsetX;
        this.mouse_pos[1] = ev.offsetY;
        this.advice.pos[0] = ev.offsetX + 10;
        this.advice.pos[1] = ev.offsetY + 10;
        const new_selected = this.tile_select(ev.offsetX, ev.offsetY);
        if (new_selected !== this.tile_selected) {
            this.tile_selected = new_selected;
            this.show_tile_type();
            if (this.modes.mouse && !this.modes.shift && !this.modes.alt) {
                this.map.change(new_selected, this.tile_type);
            }
        }

        if (this.modes.mouse && this.modes.shift) {
            this.view_offset[0] += ev.movementX;
            this.view_offset[1] += ev.movementY;
        }
    }

    mouseenter_event () {
        this.modes.inside = true;
    }

    mouseleave_event () {
        this.modes.inside = false;
    }

    zoom (scale) {
        const real = 1 - scale;

        this.width *= scale;

        this.view_offset[0] += real*this.width*this.map.cols/2;
        this.view_offset[1] += real*this.width*this.map.rows/2;
    }

    center () {
        const hx = this.dom.width/2;
        const hy = this.dom.height/2;
        this.view_offset[0] = Math.floor(hx - this.width * this.map.cols / 2);
        this.view_offset[1] = Math.floor(hy - this.width * this.map.rows / 2);
    }

    show_tile_type () {
        const sel = this.tile_selected;
        if (sel === -1)
            this.set_advice("POS: <out of map>", 60000);
        else {
            const col = this.tile_selected%this.map.cols;
            const row = Math.floor(this.tile_selected/this.map.rows);
            this.set_advice(
                `POS: ${sel}\nX: ${col} Y: ${row}\nTYPE: ${TileTypes.editor_find(this.map.at(sel)).name}`, 60000);
        }
    }

    show_tile_type_change () {
        const id = this.tile_type;
        const tile = TileTypes.editor_find(id);
        const name = tile === undefined ? "<empty slot>" : tile.name;
        this.set_advice(`USING TYPE: ${name}\n            ID: ${id}`, 5000);
    }

    show_help () {
        this.set_advice("HELP\n\n" +
            "[left] - tile type decrease\n" +
            "[right] - tile type increase\n" +
            "[w] - select wall tiles\n" +
            "[e] - select empty tile\n" +
            "[+] - zoom in\n" +
            "[-] - zoom out\n" +
            "[c] - center view on the map\n" +
            "hold mouse to draw\n" +
            "hold mouse with [shift] to move", 10000);
    }

    set_advice (text, duration) {
        this.advice.lines = text.split('\n');
        this.advice.dim[0] = Math.max(...this.advice.lines.map(line => line.length)) * 6 + 10;
        this.advice.dim[1] = this.advice.lines.length * 10 + 10;
        this.advice.sT = this.T + duration;
    }

    draw_tiles () {
        const w = this.width;

        const vx = -this.view_offset[0];
        const vy = -this.view_offset[1];

        const sc = Math.max(Math.floor(vx / this.width), 0);
        const sr = Math.max(Math.floor(vy / this.width), 0);
        const ec = Math.min(Math.floor((vx + this.dom.width) / this.width), this.map.cols);
        const er = Math.min(Math.floor((vy + this.dom.height) / this.width), this.map.rows);


        this.ctx.save();

        const ox = this.view_offset[0];
        const oy = this.view_offset[1];

        for (let col = 0; col < this.map.cols; col++) {
            if (col >= sc && col <= ec) {
                const sx = ox + col * w;
                for (let row = 0; row < this.map.rows; row++) {
                    if (row >= sr && row <= er) {
                        const id = this.map.at_coord(col, row);
                        if (id !== undefined) {
                            this.ctx.fillStyle = TileTypes.editor_find(id).color;
                            this.ctx.fillRect(sx, oy + row*w, w, w);
                        }
                    }
                }
            }
        }

        this.ctx.restore();
    }

    draw_grid () {
        if (this.dom.width / this.width < 200) {
            const w = this.width;

            const ox = this.view_offset[0] % w;
            const oy = this.view_offset[1] % w;

            const lc = Math.floor(this.dom.width / w) + 2;
            const lr = Math.floor(this.dom.height / w) + 2;

            const cx = this.dom.width+w*2;
            const cy = this.dom.height+w*2;


            this.ctx.save();

            const opacity = Math.floor(this.width*2).toString(16).padStart(2, '0');

            this.ctx.strokeStyle = `#252015${opacity}`;

            this.ctx.translate(ox-w, oy-w);

            for (let col = 0; col <= lc; col++) {
                const x = col*w;
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, cy);
            }

            for (let row = 0; row <= lr; row++) {
                const y = row*w;
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(cx, y);
            }

            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    draw_symbols () {
        const ox = this.view_offset[0];
        const oy = this.view_offset[1];

        this.ctx.save();

        // zero coord

        this.ctx.strokeStyle = "#af4540";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(ox-15, oy);
        this.ctx.lineTo(ox, oy+15);
        this.ctx.lineTo(ox+15, oy);
        this.ctx.lineTo(ox, oy-15);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();

        // line to move start

        if (this.modes.mouse) {
            this.ctx.save();

            const dx = this.mouse_pos[0] - this.move_offset[0];
            const dy = this.mouse_pos[1] - this.move_offset[1];

            const ds = Math.sqrt(dx**2 + dy**2);

            const segs = Math.floor(ds/20);

            const ix = dx/segs;
            const iy = dy/segs;

            const hx = ix/2;
            const hy = iy/2;

            this.ctx.translate(this.move_offset[0], this.move_offset[1]);
            this.ctx.beginPath();

            for (let s = 0; s < segs; s++) {
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(hx, hy);
                this.ctx.translate(ix, iy);
            }

            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    draw_advice () {
        if (this.T <= this.advice.sT) {
            this.ctx.save();

            const [x, y] = this.advice.pos;
            const [u, v] = this.advice.dim;

            this.ctx.fillStyle = this.colors.bg;
            this.ctx.strokeStyle = this.colors.fg;

            this.ctx.fillRect(x, y, u, v);
            this.ctx.strokeRect(x, y, u, v);

            const tx = x + 5;
            const ty = y + 12;
            const lines = this.advice.lines;
            const l = this.advice.lines.length;

            this.ctx.fillStyle = this.colors.fg;
            for (let j = 0; j < l; j++) this.ctx.fillText(lines[j], tx, ty + j * 10);

            this.ctx.restore();
        }
    }

    clear () {
        this.ctx.clearRect(0, 0, this.dom.width, this.dom.height);
    }

    viewport (w, h) {
        this.dom.width = w;
        this.dom.height = h;
    }

    render(T=0) {
        this.T = T;

        this.clear();
        this.draw_tiles();
        this.draw_grid();
        this.draw_symbols();
        this.draw_advice();

        requestAnimationFrame(this.render.bind(this));
    }
}