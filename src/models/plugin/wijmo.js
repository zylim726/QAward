// src/plugins/wijmo-plugin.js
import { registerCore } from "@mescius/wijmo.vue2.core";
import { registerGrid } from "@mescius/wijmo.vue2.grid";
import { registerInput } from "@mescius/wijmo.vue2.input";
import { registerGridFilter } from "@mescius/wijmo.vue2.grid.filter";

const WijmoPlugin = {
    install(Vue) {
        registerCore(Vue);
        registerGrid(Vue);
        registerInput(Vue);
        registerGridFilter(Vue);
    },
};

export default WijmoPlugin;
