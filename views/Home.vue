<template>
    <el-container>
        <el-header>
            欢迎{{uname}}来到管理后台
            <span @click="logout()">退出</span>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-button type="primary" icon="el-icon-circle-plus-outline" style="margin-top: 5px;"
                           @click="adddir"></el-button>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"
                         ref="tree" @node-contextmenu="rightKey" :default-expand-all="true">

                     <span class="custom-tree-node" slot-scope="{ node, data }">
        <span v-show="data.type==1">目录--</span>
        <span v-show="data.type==0">文件--</span>
        <span v-show="data.edit==0" @dblclick="changeEdit(data)" v-if="data.type==1">
            {{ data.label }}
        </span>
        <router-link v-if="data.type==0" v-show="data.edit==0"
                     :to="'/tudo/'+data.id+'/'+data.uid">{{ data.label }}</router-link>

        <input type="text" v-model="data.label" v-show="data.edit==1" @blur="changeEdit(data)" v-focus>
      </span>
                </el-tree>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>

        <div class="menu" :style="{left:left,top:top,display:display}" @mouseleave="out()">
            <div @click="del">删除</div>
            <div @click="createDir" v-show="optdisplay">新建目录</div>
            <div @click="createFile" v-show="optdisplay">新建文件</div>
            <div @click="changeEdit">重命名</div>

        </div>
    </el-container>
</template>

<script>
    export default {
        created() {
            function tree(data, pid) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].pid == pid) {
                        var obj = {};
                        obj.label = data[i].name;
                        obj.id = data[i].id;
                        obj.pid = data[i].pid;
                        obj.uid = data[i].uid;
                        obj.edit = data[i].edit;
                        obj.type = data[i].type;
                        obj.children = (tree(data, data[i].id))
                        arr.push(obj);
                    }
                }
                return arr;
            }

            ajax({
                url: "/ajax/selectdir",
                data: {uid: sessionStorage["uid"]},
                dataType: "json",
                success: (e) => {
                    this.data = tree(e, 0);
                }
            })
        },

        data() {
            return {
                uname: sessionStorage["uname"],
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                left: 0,
                top: 0,
                display: "none",
                currentData: null,
                currentNode: null,
                num: 0,
                optdisplay: true
            }

        },
        methods: {
            // 递归找子id

            getid(data) {
                var arr = [];
                var obj = {id: data.id, type: data.type};
                if(data.children) {
                    for (var i = 0; i < data.children.length; i++) {
                        arr = arr.concat(this.getid(data.children[i]))
                    }
                }
                arr = arr.concat(obj)
                return arr;
            },


            //修改数据
            changeEdit(obj) {
                var obj = obj.id ? obj : this.currentData
                if (obj.edit == 0) {
                    obj.edit = 1
                } else {
                    obj.edit = 0
                    ajax({
                        url: "/ajax/dirupdate",
                        data: {id: obj.id, attr: "name", val: obj.label},
                        success: (e) => {
                            if (e == "ok") {
                                this.$message('修改成功');
                            }
                        }
                    })
                }
            },
            //删除数据
            del() {

                var ids=(this.getid(this.currentData))
                ajax({
                    url:"/ajax/deleteDir",
                    data:{ids:JSON.stringify(ids)},
                    success:(e)=>{
                        if(e=="ok"){
                                this.$router.push("/")
                        }
                    }
                })

                var node = this.currentNode;
                var data = this.currentData;
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
                this.display = "none"
            },
            //创建目录
            createDir() {
                var obj = {};
                this.num++;
                obj.label = "新建目录" + this.num;
                obj.type = 1
                obj.uid = sessionStorage["uid"]
                obj.pid = this.currentData.id
                obj.edit = 0
                ajax({
                    url: "/ajax/adddir",
                    data: {name: obj.label, type: obj.type, uid: obj.uid, pid: obj.pid, edit: obj.edit},
                    success: (e) => {
                        if (e) {
                            obj.id = e;
                            if (!this.currentData.children) {
                                this.$set(this.currentData, "children", [])
                            }

                            this.currentData.children.push(obj)
                        }
                    }
                })


            },
            //创建文件
            createFile() {
                if (!this.currentData.children) {
                    this.$set(this.currentData, "children", [])
                }
                var obj = {};
                this.num++;
                obj.label = "新建文件" + this.num;
                obj.type = 0
                obj.edit = 0
                obj.pid = this.currentData.id
                obj.uid = sessionStorage["uid"]
                ajax({
                    url: "/ajax/adddir",
                    data: {name: obj.label, type: obj.type, uid: obj.uid, pid: obj.pid, edit: obj.edit},
                    success: (e) => {
                        if (e) {
                            obj.id = e;
                            if (!this.currentData.children) {
                                this.$set(this.currentData, "children", [])
                            }

                            this.currentData.children.push(obj)
                        }
                    }
                })

            },
            //右键
            rightKey(e, data, node) {
                if (data.type == 1) {
                    this.optdisplay = true
                } else {
                    this.optdisplay = false
                }
                this.left = e.clientX + "px";
                this.top = e.clientY + "px";
                this.display = "block"
                this.currentData = data;
                this.currentNode = node;
                console.log(this.currentData);

            },
            //离开事件
            out(e) {
                this.display = "none"
            },
            //添加目录
            adddir() {

                this.num++
                var obj = {}
                obj.label = "新建目录" + this.num;
                obj.type = 1
                obj.uid = sessionStorage["uid"]
                obj.pid = 0
                obj.edit = 0
                ajax({
                    url: "/ajax/adddir",
                    data: {name: obj.label, type: obj.type, uid: obj.uid, pid: obj.pid, edit: obj.edit},
                    success: (e) => {
                        if (e) {
                            obj.id = e;
                            this.data.push(obj);
                        }
                    }
                })

            },
            logout() {
                sessionStorage.removeItem("uname")
                sessionStorage.removeItem("uid")
                this.$router.push("/login")
            },
            handleNodeClick(data) {
                console.log(data);
            }
        }
    }
</script>
<style scoped>
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        width: 30vw;
        height: 100vh;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
    }

    .el-tree {
        background: none;
    }

    .el-container:nth-child(7) .el-aside {
    }

    .menu {
        width: 150px;
        height: auto;
        padding: 5px;
        border-radius: 3px;
        box-shadow: 0 0 3px #888;
        background: #d9d9d9;
        position: absolute;
        left: 0;
        top: 0;

    }
</style>
