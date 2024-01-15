import { defineNuxtRouteMiddleware } from "nuxt/app";
import useUserStore from "../stores/useUserStore";
export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore()
    // 如果不是管理员又想访问这个页面就跳转至登录页面
    if(!userStore.isAdmin && to.path === '/userList') {
        return navigateTo('/')
    }
})
