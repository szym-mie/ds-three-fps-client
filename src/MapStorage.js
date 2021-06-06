import ServerConnection from "./ServerConnection";
import Map from "./Map";

export default class MapStorage {
    constructor (server="") {
        this.source = new ServerConnection(server + "/maps/");
    }

    // list (msg=(/* msg, type */) => {}, search="", limit=50) {
    //     this.source.send(
    //         "list",
    //         {
    //             search: search,
    //             limit: limit,
    //             off: 0
    //         },
    //         obj => {
    //             this.maps = obj.map(elem => new Map("", 0, 0).decode(elem));
    //         },
    //         err => {
    //             msg(
    //                 "<b>Listing maps failed - here's why:</b>\n" + err,
    //                 "error");
    //         });
    // }

    push (msg=(/* msg, type */) => {}, e_map) {
        console.log(e_map.encode());
        this.source.send(
            "push",
            e_map.encode(),
            obj => {
                msg(
                    "<b>Saved \'" + obj.text + "\' map successfully.<b>\n",
                    "note");
            },
            err => {
                msg(
                    "<b>Saving \'" + e_map.name + "\' map failed - here's why:</b>\n" + err,
                    "error");
            });
    }

    pull (msg=(/* msg, type */) => {}, map=(/* map */) => {}) {
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
                    "<b>Loading \'" + name + "\' map failed - here's why:</b>\n" + err,
                    "error");
            });
    }
}