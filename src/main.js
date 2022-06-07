import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import VueResource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import echarts from 'echarts';

import './assets/css/main.css';
import 'babel-polyfill';
import common from '@/utils/common'
import googleCode from '@/components/googleCode/googleCode'



Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
Vue.prototype.$axios = axios;
Vue.prototype.$common = common

Vue.use(VueResource);
Vue.use(ElementUI);
Vue.use(ViewUI);
Vue.component('googleCode',googleCode);
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 后台管理系统`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
