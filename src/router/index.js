import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect:'/sysCenter/roleManagement',
        },
        {
            path: '/',
            component: () => import('../components/common/Whole.vue'),
            meta: {
                title: '整体页面布局'
            },
            children: [



                {
                    path: '/sysCenter',
                    component: () => import('../page/sysCenter/index.vue'),
                    meta: {
                        title: '系统管理'
                    },
                    redirect:'/sysCenter/roleManagement',
                    children:[
                        {
                            path: 'roleManagement',
                            component: () => import('../page/sysCenter/roleManagement.vue'),
                            meta: {
                                title: '角色权限管理'
                            }
                        },
                        {
                            path: 'accountManagement',
                            component: () => import('../page/sysCenter/accountManagement.vue'),
                            meta: {
                                title: '账户管理'
                            }
                        },
    
                    ]
                },



                {
                    path: '/404',
                    component: () => import('../page/404.vue'),
                    meta: {
                        title: '404'
                    }
                },
                {
                    path: '/403',
                    component: () => import('../page/403.vue'),
                    meta: {
                        title: '403'
                    }
                },
            ]
        },
        {
            // 登录页面
            path: '/login',
            component: () => import('../page/Login.vue'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});