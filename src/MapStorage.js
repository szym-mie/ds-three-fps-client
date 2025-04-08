import ServerConnection from "./ServerConnection";
import Map from "./Map";

export default class MapStorage {
    constructor (server="") {
        this.source = new ServerConnection(server + "/maps/");
    }

    list (msg=(_msg, _type) => {}, maps=(_maps) => {}) {
        this.source.send(
            "list",
            {},
            obj => {
                console.log(obj);
                maps(obj);
            },
            err => {
                msg(
                    "<b>Listing maps failed - here's why:</b>\n" + err,
                    "error");
            });
    }

    push (msg=(_msg, _type) => {}, e_map) {
        this.source.send(
            "push",
            e_map.encode(),
            obj => {
                msg(
                    "<b>Saved \'" + obj.name + "\' map successfully.</b>\n",
                    "note");
            },
            err => {
                msg(
                    "<b>Saving \'" + e_map.name + "\' map failed - here's why:</b>\n" + err,
                    "error");
            });
    }

    pullLatest (msg=(_msg, _type) => {}, map=(_map) => {}) {
        this.source.send(
            "pull",
            {},
            obj => {
                const map_obj = new Map("", 0, 0);
                map_obj.decode(obj);
                console.log(map_obj);
                map(map_obj);
                msg(
                    "<b>Loaded \'" + map_obj.name + "\' map successfully.</b>\n",
                    "note");
            },
            err => {
                msg(
                    "<b>Loading latest map failed - here's why:</b>\n" + err,
                    "error");
            });
    }

    pullByName (name, msg=(_msg, _type) => {}, map=(_map) => {}) {
        this.source.send(
            "pull/" + name,
            {},
            obj => {
                const map_obj = new Map("", 0, 0);
                map_obj.decode(obj);
                console.log(map_obj);
                map(map_obj);
                msg(
                    "<b>Loaded \'" + map_obj.name + "\' map successfully.</b>\n",
                    "note");
            },
            err => {
                msg(
                    "<b>Loading \'" + name + "\' map failed - here's why:</b>\n" + err,
                    "error");
            });
    }
}