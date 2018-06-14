<template>
    <el-container>
        <el-header>
            欢迎{{uname}}来到管理后台
            <span @click="logout()">退出</span>
        </el-header>
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {

        data(){
            return {
                uname:sessionStorage["uname"]
            }
        },
        methods:{
            logout(){
                sessionStorage.removeItem("uname")
                sessionStorage.removeItem("uid")
                this.$router.push("/login")
            }
        }
    }
</script>
<style scoped>
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        width: 30vw;
        height: 100vh;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
</style>
