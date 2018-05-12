import ptSelector from './pt_selector';
import ptCanedittable from './pt_canEditTable';

const ptComponents = {
    ptSelector,
    ptCanedittable
};

const install = function(Vue, opts = {}) {
    Vue.component(ptSelector.name, ptSelector);
    Vue.component(ptCanedittable.name, ptCanedittable);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default Object.assign(ptComponents, {install});
