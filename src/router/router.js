import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/apigateway/gw_welcome.vue') },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/mytest',
        icon: 'android-checkbox',
        title: '平台网关管理',
        name: 'My Founction',
        component: Main,
        children: [
            { path: 'gw_monitor', title: 'API网关监控', name: 'gw_monitor', component: () => import('@/views/apigateway/gw_monitor.vue') },
            { path: 'gw_service_switch', title: '服务状态开关', name: 'gw_service_switch', component: () => import('@/views/apigateway/gw_service_switch.vue') },
            { path: 'gw_select_app', title: '前端公共组件', name: 'gw_select_app', component: () => import('@/views/apigateway/gw_select_app.vue') },
            { path: 'gw_service_level', title: '服务分类管理', name: 'gw_service_level', component: () => import('@/views/apigateway/gw_service_level.vue') },
            { path: 'gw_service_config', title: '服务配置管理', name: 'gw_service_config', component: () => import('@/views/apigateway/gw_service_config.vue') }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,

];
