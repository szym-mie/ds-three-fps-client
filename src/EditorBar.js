import MapStorage from "./MapStorage";

export default class EditorBar {
    constructor (map) {
        this.map = map;

        this.dom = {
            load: this._button_dom("load", this.open_level_load),
            save: this._button_dom("save", this.level_save),
            test: this._button_dom("test", this.level_test),
            name: this._text_input_dom("map name", "name"),
            resize: this._button_dom("resize", this.level_resize),
            cols: this._number_input_dom("10", "cols"),
            rows: this._number_input_dom("10", "rows"),
            status: this._button_dom("status ≡", this.show_status),
            display: this._display_dom(),
            maps: this._maps_dom()
        };

        this.params = {
            name: null,
            status_msg: [{ type: "note", msg: "<b>welcome to the editor</b>\n\nif you don't know something\nyou can press <b>[h]</b> for help.\n\nclick <b>status</b> to hide this display.\n"}],
            maps: [],
            init: false,
            cols: 10,
            rows: 10
        }

        this.maps = new MapStorage("");

        this.show_status();
    }

    open_level_load () {
        this.params.init = false;
        const is_shown = this.show_maps();
        if (is_shown) {
            this.maps.list(this.add_status.bind(this), function (maps) {
                console.log("list");
                this.params.maps = maps;
                this.params.init = true;
                this.update_maps();
            }.bind(this));
        }
    }

    level_load (name) {
        this.show_maps();
        this.maps.pullByName(name, this.add_status.bind(this), function (map) {
            console.log(map); 
            this.map.from(map); 
            console.log(this, this.map); 
        }.bind(this));
    }

    level_save () {
        this.map.name = this.params.name;
        this.maps.push(this.add_status.bind(this), this.map);
    }

    level_test () {
        console.log(this.map);
        if (this.map.name.length === 0) {
            this.add_status("saving before playing", "warn");
            this.map.name = this.params.name;
            this.maps.push(this.nav_game.bind(this), this.map);
        } else {
            this.nav_game()
        }
    }

    nav_game () {
        window.location = `/game?map=${this.map.name}`;
    }

    level_resize () {
        this.map.resize(this.params.cols, this.params.rows);
        console.log(this.map);
    }

    show_maps () {
        if (this.dom.maps.className === "maps_hide") {
            console.log("show");
            this.update_maps();
            this.dom.maps.className = "maps";
            return true;
        } else {
            console.log("hide");
            this.dom.maps.className = "maps_hide";
            return false;
        }
    }

    show_status () {
        if (this.dom.display.className === "display_hide") {
            console.log("show");
            this.update_status();
            this.dom.display.className = "display";
        } else {
            console.log("hide");
            this.dom.display.className = "display_hide";
        }
    }

    update_maps () {
        let nodes = [];
        if (this.params.init) {
            for (const {name, updated} of this.params.maps) {
                const date = new Date(updated);
                const entry = document.createElement("pre");
                entry.className = "map_entry";
                entry.onclick = (_) => this.level_load.call(this, name);
                entry.innerText = `${name} - updated ${date.toUTCString()}`;
                nodes.push(entry);
            }
        } else {
            const header = document.createElement("h3");
            header.innerText = "loading...";
            nodes.push(header);
        }
        this.dom.maps.innerHTML = "";
        for (const node of nodes) {
            this.dom.maps.appendChild(node);
        }
    }

    update_status () {
        let text = "";
        for (const {type, msg} of this.params.status_msg)
            text += `<em type=\"${type}\">${msg}</em>\n`;
        text += "<em type=\"note\">\n--- END OF MESSAGES ---</em>";
        this.dom.display.innerHTML = text;
    }

    add_status (msg, type="note") {
        this.params.status_msg.push({ type: type, msg: msg });
        this.update_status();
    }

    _button_dom (text, action) {
        const elem = document.createElement("button");
        elem.className = "action";
        elem.innerText = text;
        elem.addEventListener("click", action.bind(this));
        return elem;
    }

    _text_input_dom (placeholder, prop, max_length=80) {
        const elem = document.createElement("input");
        elem.className = "action";
        elem.type = "text";
        elem.value = "";
        elem.placeholder = placeholder;
        elem.maxLength = max_length;
        elem.addEventListener("input", function (ev) {
           this.params[prop] = ev.target.value;
        }.bind(this));
        return elem;
    }

    _number_input_dom (value, prop, max=256, min=0) {
        const elem = document.createElement("input");
        elem.className = "action";
        elem.type = "text";
        elem.value = value;
        elem.addEventListener("input", function (ev) {
            console.log(prop);
            const text = ev.target.value;
            try {
                const num = text.match(/\d+/)[0];
                this.params[prop] = parseInt(isNaN(num) ? min : num);
            } catch {
                this.params[prop] = 0;
            }
        }.bind(this));
        return elem;
    }

    _display_dom () {
        const elem = document.createElement("pre");
        elem.className = "display_hide";
        return elem;
    }

    _maps_dom () {
        const elem = document.createElement("div");
        elem.className = "maps_hide";
        return elem;
    }
}