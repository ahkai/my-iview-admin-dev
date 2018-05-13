import ptSelector from './pt_selector';
import ptCanedittable from './pt_canEditTable';
import ptSwitchtab from './pt-switchtab';

const ptComponents = {
    ptSelector,
    ptCanedittable,
    ptSwitchtab
};

const install = function(Vue, opts = {}) {
    Vue.component(ptSelector.name, ptSelector);
    Vue.component(ptCanedittable.name, ptCanedittable);
    Vue.component(ptSwitchtab.name, ptSwitchtab);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default Object.assign(ptComponents, {install});
