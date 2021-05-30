export const TileTypes = {
    editor: {
        0:   { name: "empty", color: "#d0c8c0" },
        1:   { name: "p_start", color: "#e04040" },
        2:   { name: "i_door_hori", color: "#c0a850" },
        3:   { name: "i_door_vert", color: "#c0a850" },
        4:   { name: "o_door_hori", color: "#608040" },
        5:   { name: "o_door_vert", color: "#608040" },
        6:   { name: "e_door_hori", color: "#606040" },
        7:   { name: "e_door_vert", color: "#606040" },
        8:   { name: "ceil_light", color: "#56c025" },
        9:   { name: "flood_light", color: "#369025" },
        10:  { name: "alarm_light", color: "#166025" },
        16:  { name: "light_enemy", color: "#d98080" },
        24:  { name: "small_treasure", color: "#2020b9" },
        32:  { name: "ammobox", color: "#901020"},
        128: { name: "i_rock_wall", color: "#583030" },
        129: { name: "i_metal_wall", color: "#785050" },
        130: { name: "o_planks_wall", color: "#305830" },
        131: { name: "o_marble_wall", color: "#507850" },
        132: { name: "i_red_wall", color: "#986060" },
        133: { name: "i_chip_wall", color: "#983030"},
        134: { name: "i_pipe_wall", color: "#584848"},
        254: { name: "e_term_wall", color: "#404040" },
        255: { name: "e_exit_wall", color: "#606060" }
    },

    game: {
        // 0:   "empty",
        // 1:   "p_start",
        // 2:   "i_door_hori",
        // 3:   "i_door_vert",
        // 4:   "o_door_hori",
        // 5:   "o_door_vert",
        // 6:   "e_door_hori",
        // 7:   "e_door_vert",
        // 8:   "ceil_light",
        // 9:   "flood_light",
        // 10:  "alarm_light",
        // 16:  "light_enemy",
        // 24:  "small_treasure",
        128: "i_rock_wall",
        129: "i_metal_wall",
        130: "o_planks_wall",
        131: "o_marble_wall",
        132: "i_red_wall",
        133: "i_chip_wall",
        134: "i_pipe_wall",
        // 254: "e_term_wall",
        // 255: "e_exit_wall"
    },

    editor_find (id) {
        return this.editor[id];
    }
}