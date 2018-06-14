<template>
     <form>
    <h3 style="text-align:center;padding:0;margin:0">注册页</h3>{{message}}
  <div class="form-group">
    <label for="user">用户名</label>
    <input type="text" class="form-control" id="user" placeholder="用户名" name="uname" v-model="uname" @blur="check">
  </div>
  <!--
      页面加载速度慢

  -->
  <div class="form-group">
    <label for="pass">密码</label>
    <input type="password" class="form-control" id="pass"  name="pass" v-model="pass">
  </div>
       <div class="form-group">
    <label for="pass1">确认密码</label>
    <input type="password" class="form-control" id="pass1"  name="pass1" v-model="pass1">
  </div>

  <button type="button" class="btn btn-default" @click="submit">Submit</button>

    已有用户？请<router-link to="/login">登陆</router-link>
</form>
  </template>

<script>
  import "@/assets/js/ajax.js"
export  default {
    data(){
      return {
          uname:"",
          pass:"",
          pass1:"",
          message:""
      }
    },
    methods:{
        submit(){
           if(this.uname==""){
               this.message="用户名不能为空"
               return;
           }else if(this.pass==""){
               this.message="密码不能为空"
                return;
           }else if(this.pass!=this.pass1){
               this.message="密码要一致"
                return;
           }else if(this.message=="用户名存在"){
               return;
           }

           this.message="";

           ajax({
               url:"/ajax/adduser",
               data:{uname:this.uname,pass:this.pass,pass1:this.pass1},
               type:"post",
               success:(e)=>{
                   if(e=="ok"){
                       this.$router.push("/login")
                   }else{
                       this.message="注册失败";
                       this.uname="";
                       this.pass="";
                       this.pass1="";
                   }
               }
           })
        },
        check(){
            ajax({
                url:"/ajax/checkUser",
                data:"uname="+this.uname,
                success:(e)=>{
                    if(e=="ok"){
                        this.message=""
                    }else{
                        this.message="用户名存在"
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
 form{
            width:300px;
            height: 240px;
            position: fixed;
            left:0;top:0;right:0;bottom:0;
            margin:auto;
            border:1px solid #666;
            padding:10px;
            border-radius: 5px;

        }
</style>