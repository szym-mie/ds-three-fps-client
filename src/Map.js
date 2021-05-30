export default class Map {
    constructor (name, cols, rows) {
        this.name = "";
        this.cols = cols;
        this.rows = rows;

        this.tiles = new Uint8Array(this.cols * this.rows);
    }

    encode () {
        return {
            name: this.name.replaceAll(/:;!@#\$%\^&\*\?<>/g, ' '),
            cols: this.cols,
            rows: this.rows,
            tiles: [...this.tiles]
        }
    }

    decode (json) {
        this.name = json.name;
        this.cols = json.cols;
        this.rows = json.rows;
        this.tiles = new Uint8Array(json.tiles);
    }

    at (pos) {
        return this.tiles[pos];
    }

    pos (x, y) {
        if (x < 0 || y < 0 || x >= this.cols || y >= this.rows)
            return -1;
        else
            return y * this.cols + x;
    }

    coord (pos) {
        return [pos%this.cols, Math.floor(pos/this.cols)];
    }

    at_coord (x, y) {
        const p = this.pos(x, y);
        return p === -1 ? undefined : this.tiles[p];
    }

    adjacent(pos) {
        const col = this.cols;
        return [
            pos - col,
            pos - 1,
            pos + 1,
            pos + col
        ];
    }

    neighbours(pos) {
        const col = this.cols;
        return [
            pos - col - 1,
            pos - col,
            pos - col + 1,
            pos - 1,
            pos + 1,
            pos + col - 1,
            pos + col,
            pos + col + 1
        ];
    }

    resize (c, r) {
        const old_tiles = this.tiles.slice();

        const w = Math.min(c, this.cols);
        const h = Math.min(r, this.rows);

        this.tiles = new Uint8Array(c * r);

        for (let x = 0; x < w; x++) { for (let y = 0; y < h; y++) {
            const old_pos = x + y * w;
            const new_pos = x + y * c;
            this.tiles[new_pos] = old_tiles[old_pos];
        }}

        this.cols = c;
        this.rows = r;
    }

    change (id, tile) {
        this.tiles[id] = tile;
    }

    from (map) {
        this.name = map.name;
        this.rows = map.rows;
        this.cols = map.cols;
        this.tiles = map.tiles;
    }

    walls () {
        const types = Array(256).fill(undefined);
        const length = this.cols * this.rows;

        for (let i = 0; i < length; i++) {
            const type = this.tiles[i];
            try {
                types[type].push(i);
            } catch {
                types[type] = [i];
            }
        }

        return types;
    }
}