require("./editor.css");

// JS

import EditorView from "./EditorView";
import EditorBar from "./EditorBar";
import Map from "./Map";

const map = new Map("NEWMAP", 10, 10);

const bar = new EditorBar(map);
const view = new EditorView(map, 100);

console.log(view);
console.log(bar);

const dom_view = document.getElementById("view");
dom_view
    .append(view.dom);

view.viewport(dom_view.clientWidth, dom_view.clientHeight);
view.center();
view.event_attach(dom_view);

const dom_bar = document.getElementById("bar");
dom_bar
    .append(...Object.values(bar.dom));
