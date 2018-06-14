import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from '@/components/login'
import Reg from '@/components/reg'
import Tudo from '@/components/tudo'
Vue.use(Router)

var router= new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter(to,from,next){
         if(!sessionStorage["uname"]){
             next("/login")
         }else{
             next();
         }
      },
      children:[
          {
            path:"",
            component: Tudo,
          }
      ]
    },
      {
        path:"/login",
        component: Login
      },
      {
        path:"/reg",
        component: Reg
      },
      {
        path:"*",
        redirect:"/"
      }
  ]
})

export default router
