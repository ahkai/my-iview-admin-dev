import ptSelector from './pt-selector/pt_selector';

const ptComponents = {
    ptSelector
};

const install = function(Vue, opts = {}) {
    Vue.component(ptSelector.name, ptSelector);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default Object.assign(ptComponents, {install});
