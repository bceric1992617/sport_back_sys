<template>
<div>
    <el-aside>
        <SideMenu :items="items"></SideMenu>
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
</div>
</template>

<script>
import SideMenu from '@/components/sidemenu/SideMenu';
export default {
    components: {
        SideMenu
    },
    data() {
        return {
            items: [
                {
                    index: 'roleManagement',
                    title: '角色权限管理'
                },
                {
                    index: 'accountManagement',
                    title: '账户管理'
                },
            ]
        }
    },
};
</script>

<style>
</style>
