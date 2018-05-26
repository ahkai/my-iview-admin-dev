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
        meta: {keepAlive: false},
        children: [
            { path: 'gw_monitor', title: 'API网关监控', name: 'gw_monitor', component: () => import('@/views/apigateway/gw_monitor.vue') },
            { path: 'gw_service_switch', title: '服务状态开关', name: 'gw_service_switch', component: () => import('@/views/apigateway/gw_service_switch.vue') },
            { path: 'gw_select_app', title: '前端公共组件', name: 'gw_select_app', component: () => import('@/views/apigateway/gw_select_app.vue') },
            { path: 'gw_service_level', title: '服务分类管理', name: 'gw_service_level', component: () => import('@/views/apigateway/gw_service_level.vue') },
            { path: 'gw_service_config', title: '服务配置管理', name: 'gw_service_config', component: () => import('@/views/apigateway/gw_service_config.vue') }
        ]
    },
    {
        path: '/',
        redirect: '/overview',
        name: 'demo',
        component: () => import('@/views/db_components/demo.vue'),
        children: [
            {path: 'overview', title: '概览视图', name: '0', component: () => import('@/views/db_components/overview.vue')},
            {path: 'dbinfo', title: '基础信息', name: '1-1', component: () => import('@/views/db_components/dbinfo.vue')},
            {path: 'parameter', title: '参数', name: '1-2', component: () => import('@/views/db_components/parameter.vue')},
            {path: 'userinfo', title: '用户信息', name: '1-3', component: () => import('@/views/db_components/userinfo.vue')},
            {path: 'tablespace', title: '表空间信息', name: '1-4', component: () => import('@/views/db_components/tablespace.vue')},
            {path: 'asminfo', title: 'ASM信息', name: '1-5', component: () => import('@/views/db_components/asminfo.vue')},
            {path: 'redolog', title: '重做日志', name: '1-6', component: () => import('@/views/db_components/redolog.vue')},
            {path: 'jobs', title: '作业', name: '1-7', component: () => import('@/views/db_components/jobs.vue')},
            {path: 'directory', title: '目录', name: '1-8', component: () => import('@/views/db_components/directory.vue')},
            {path: 'dblink', title: 'DBLink', name: '1-9', component: () => import('@/views/db_components/dblink.vue')},
            {path: 'sessions', title: '活动进程', name: '2-1', component: () => import('@/views/db_components/sessions.vue')},
            {path: 'events', title: '等待事件', name: '2-2', component: () => import('@/views/db_components/events.vue')},
            {path: 'inststat', title: '实例状态', name: '2-3', component: () => import('@/views/db_components/inststat.vue')},
            {path: 'crsstat', title: '集群状态', name: '2-4', component: () => import('@/views/db_components/crsstat.vue')},
            {path: 'listener', title: '监听状态', name: '2-5', component: () => import('@/views/db_components/listener.vue')},
            {path: 'topsql', title: 'TOPSQL', name: '2-6', component: () => import('@/views/db_components/topsql.vue')},
            {path: 'topevent', title: 'TOPEVENT', name: '2-7', component: () => import('@/views/db_components/topevent.vue')},
            {path: 'arsenal', title: 'ARSENAL', name: '2-8', component: () => import('@/views/db_components/arsenal.vue')},
            {path: 'dbalert', title: '实例日志', name: '3-1', component: () => import('@/views/db_components/dbalert.vue')},
            {path: 'crsalert', title: '集群日志', name: '3-2', component: () => import('@/views/db_components/crsalert.vue')},
            {path: 'asmalert', title: 'ASM日志', name: '3-3', component: () => import('@/views/db_components/asmalert.vue')},
            {path: 'cssdlog', title: 'CCSD日志', name: '3-4', component: () => import('@/views/db_components/cssdlog.vue')},
            {path: 'crsdlog', title: '集群日志', name: '3-5', component: () => import('@/views/db_components/crsdlog.vue')},
            {path: 'emergency', title: '应急预案', name: '4-1', component: () => import('@/views/db_components/emergency.vue')},
            {path: 'awrrpt', title: 'AWR报告', name: '5-1', component: () => import('@/views/db_components/awrrpt.vue')},
            {path: 'ashrpt', title: 'ASH报告', name: '5-2', component: () => import('@/views/db_components/ashrpt.vue')},
            {path: 'awrsqlrpt', title: 'SQL报告', name: '5-3', component: () => import('@/views/db_components/awrsqlrpt.vue')},
            {path: 'awrdiffrpt', title: 'AWR对比报告', name: '5-4', component: () => import('@/views/db_components/awrdiffrpt.vue')},
            {path: 'sqlripper', title: 'SQL语句分析', name: '5-5', component: () => import('@/views/db_components/sqlripper.vue')},
            {path: 'dailycheck', title: '健康检查', name: '6-1', component: () => import('@/views/db_components/dailycheck.vue')},
            {path: 'normcheck', title: '合规检查', name: '6-2', component: () => import('@/views/db_components/normcheck.vue')},
            {path: 'osbaseinfo', title: '基础信息', name: '7-1', component: () => import('@/views/db_components/osbaseinfo.vue')},
            {path: 'sandisk', title: 'SAN存储盘', name: '7-2', component: () => import('@/views/db_components/sandisk.vue')},
            {path: 'ostopses', title: 'TOP进程', name: '7-3', component: () => import('@/views/db_components/ostopses.vue')}
        ]
    }

];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,

];
