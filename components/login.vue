<template>
     <form>
    <h3 style="text-align:center;padding:0;margin:0">登录页</h3>{{message}}
  <div class="form-group">
    <label for="user">用户名</label>
    <input type="text" class="form-control" id="user" placeholder="用户名" name="uname" v-model="uname" autocomplete="off">
  </div>
  <!--
      页面加载速度慢

  -->
  <div class="form-group">
    <label for="pass">密码</label>
    <input type="password" class="form-control" id="pass"  name="pass" v-model="pass" autocomplete="off">
  </div>

  <button type="button" class="btn btn-default" @click="submit">Submit</button>
    没有密码？请点击 <router-link to="/reg">这里</router-link>
</form>
  </template>

<script>
export  default {
    data(){
      return {
          uname:"",
          pass:"",
          message:""
      }
    },
    methods:{

        submit(){
          var params="uname="+this.uname+"&pass="+this.pass
            ajax({
              url:"/ajax/checkLogin",
              data:params,
              type:"post",
              dataType:"json",
              success:(e)=>{
                  if(e.message=="ok"){
                    sessionStorage["uname"]=e.uname;
                    sessionStorage["uid"]=e.uid;
                    this.$router.push("/")
                  }else{
                      this.uname=""
                      this.pass=""
                      this.message="用户名或密码出错"
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