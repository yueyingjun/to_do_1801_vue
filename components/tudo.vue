<template>
    <div class="box">
        <nav>
            欢迎 {{uname}} 登陆
            <span @click="logout">退出</span>
        </nav>
        <div class="input">
            <input type="text" v-model="val" placeholder="请输入内容" @keydown.13="add">
        </div>
        <div class="btns">
            <input type="button" value="全部" :class="{check:status=='all'}" @click="chanegStatus('all')">
            <input type="button" value="已完成" :class="{check:status=='1'}" @click="chanegStatus('1')">
            <input type="button" value="未完成" :class="{check:status=='0'}" @click="chanegStatus('0')">
        </div>
        <ul class="list-box">
            <li class="list" v-for="item in result">
                <div class="check" :class="{red:item.state==1}" @click="changeState(item)"></div>
                <div class="con" v-show="item.edit==0" @dblclick="changeEdit(item)">{{item.val}}</div>
                <input type="text" v-model="item.val" v-show="item.edit==1" @blur="changeEdit(item)">
                <div class="del" @click="del(item.id)">  X </div>
            </li>
        </ul>

    </div>
</template>
<script>
export default {
    data(){
        return {
            val:"",
            all:[],
            status:"all",
            uname:"",
            uid:"",
            left:0,
            top:0,
            display:"none"
        }
    },
    computed:{
        result(){
            return this.all.filter( (item)=> {
                if(this.status=="all"){
                    return item;
}else if(item.state==this.status){
                    return item;
                }
            })
        }
    },
    mounted(){

             this.uname=sessionStorage["uname"]
             this.uid=sessionStorage["uid"]
            var xml1=new XMLHttpRequest();
            xml1.onload= ()=> {
                this.all=JSON.parse(xml1.response)
            }
            xml1.open("get","/ajax/select?uid="+this.uid)
            xml1.send();


        },
    methods:{

        logout(){
           sessionStorage.removeItem("uname")
           sessionStorage.removeItem("uid")
           this.$router.push("/login");
        },
        chanegStatus(status){
            this.status=status
        },
        changeEdit(obj){
            if(obj.edit==0){
                obj.edit=1
            }else{

            var state=obj.val;
            var params="attr=val&id="+obj.id+"&val="+state;
            fetch("/ajax/update?"+params).then(function (e) {
              return e.text();
            }).then((e)=>{
                if(e=="ok"){
                   obj.edit=0
                }
            })

            }

        },

        add(){
           var obj={}
           obj.val=this.val;
           obj.state=0;
           obj.edit=0

           //对列的方式
           fetch("/ajax/add?val="+this.val+"&uid="+this.uid).then(function (e) {
              return e.text()
           }).then((e)=>{
                if(e=="ok") {
                    this.all.push(obj);
                    this.val = ""
                    console.log(this.all)
                }
           })

        },
        del(id){

            fetch("/ajax/del?id="+id).then(function (e) {
             return e.text();
            }).then((e)=>{
                if(e=="ok"){
                    this.all=this.all.filter(function (item) {
                if(item.id!=id){
                    return item
                }
            })
                }
            })

        },
        changeState(obj){
            //1. 改数据库
            var state=obj.state==0?1:0;
            var params="attr=state&id="+obj.id+"&val="+state;
            fetch("/ajax/update?"+params).then(function (e) {
              return e.text();
            }).then((e)=>{
                if(e=="ok"){
                    obj.state=state;
                }
            })





        }
    }
}
</script>
<style scoped>
    .menu{
        width:200px;height:200px;
        border:1px solid red;
        position: absolute;
    }
    nav{
      width:400px;height:30px;
        text-align: center;

    }
.check{
    color:red;
}
.red{
    background: red;
}
.box{
    width:400px;margin:auto;
}
.input{
    width:100%;height:30px;border:1px solid #ccc;
    border-radius: 5px;
}
.input input{
    border:none;padding:0;margin:0;
    width:100%;height:100%;
    border-radius: 5px;
}
.input input:focus{
    outline: none;
    box-shadow: 0 0 5px #000;
}
.btns{
    width:100%;height: 40px;
    margin-top:5px;
}
    .btns input{
        float:right;margin:0 5px;
    }

    ul,li{
        margin:0;padding:0;list-style: none;

    }
    .list-box{
        width:100%;
    }
    .list-box .list{
        width:100%;height:30px;
        border-bottom: 1px solid #ccc;
    }
    .list div{
        float:left;
    }
    .list div:nth-last-child(1){
        float:right;
    }
    .list .check{
        width:14px;height:14px;
        border:1px solid #777;
        border-radius: 50%;
        margin-top:8px;cursor: pointer;
    }
    .list .con{
        line-height: 30px;
        margin-left:10px;
    }
    .list .del{
       cursor: pointer;
        line-height: 30px;
    }
</style>