<template>
  <div class="h-screen bg-gradient-to-b from-blue-200 to-white flex justify-center items-center">
    <!-- 登录模块 -->
    <div class="flex flex-col justify-between items-center gap-7 p-6 bg-white rounded-lg" v-if="isLogin">
      <div class="font-bold">登录</div>
      <t-input placeholder="请输入手机号"
               v-model="userData.phoneNumber"
               :status="isPhoneNumber ? 'default' : 'error'"
               :tips="isPhoneNumber ? '' : '请输入正确手机号'"
               @blur="checkPhoneNumber">
        <template #prefix-icon>
          <User1Icon />
        </template>
      </t-input>
      <t-input type="password" placeholder="请输入密码"
               v-model="userData.password">
        <template #prefix-icon>
          <LockOnIcon />
        </template>
      </t-input>
      <div class="flex flex-col item-center">
        <t-button block theme="primary" variant="base" @click="onLogin">登录</t-button>
        <t-button style="font-size: 12px" variant="text" @click="toRegister">没有账号？<t-link style="font-size: 12px" theme="primary" hover="color" >去注册></t-link></t-button>
      </div>
    </div>
    <!--  注册模块  -->
    <div class="flex flex-col flex-start justify-between items-center gap-7 p-6 bg-white rounded-lg" v-else>
      <div class="font-bold">注册</div>
      <div class="flex">
        <up-load-avatar  @fileSelect="handleFileSelected"></up-load-avatar>
      </div>
      <t-input placeholder="昵称" v-model="userData.nickName"></t-input>
      <t-input placeholder="请输入手机号" v-model="userData.phoneNumber" :status="isPhoneNumber ? 'default' : 'error'" :tips="isPhoneNumber ? '' : '请输入正确手机号'" @blur="checkPhoneNumber">
        <template #prefix-icon>
          <User1Icon />
        </template>
      </t-input>
      <t-input placeholder="获取验证码" v-model="checkCode" class="pr-0" style="padding-right: 0">
        <template #prefix-icon>
          <UserSafetyIcon />
        </template>
        <template #suffix>
          <t-button class="w-20 h-full flex-center" @click="getCheckCode">获取验证码</t-button>
        </template>
      </t-input>
      <t-input type="password" placeholder="请输入密码" v-model="userData.password" :status="isValidPassWord ? 'default' : 'error'" :tips="isValidPassWord ? '' : '密码必须为8位以上包含数字，大小写字母，特殊字符'" @blur="checkPassWord">
        <template #prefix-icon>
          <LockOnIcon />
        </template>
      </t-input>
      <t-input type="password" placeholder="确认密码" v-model="ensurePassWord" :status="isSame ? 'default' : 'error'" :tips="isSame ? '' : '两次密码必须相同'">
        <template #prefix-icon>
          <LockOnIcon />
        </template>
      </t-input>
      <t-button block theme="primary" variant="base" @click="register">注册</t-button>
      <t-button block theme="primary" variant="base" @click="toLogin">去登录</t-button>
    </div>
  </div>

</template>

<script setup lang="ts">
import { User1Icon, LockOnIcon, UserSafetyIcon } from 'tdesign-icons-vue-next'
import useUserStore from "../stores/useUserStore"
import { reactive } from "vue";
import {MessagePlugin} from "tdesign-vue-next";
const useStore = useUserStore()
const userData = reactive({
  phoneNumber: '',
  password: '',
  avatarUrl: '',
  nickName: '',
  token: ''
})
/*登录操作部分**/
const isPhoneNumber = ref<boolean>(true)
const isValidPassWord = ref<boolean>(true)
const isLogin = ref<boolean>(true)

function checkPhoneNumber() {
  isPhoneNumber.value = /^1[3456789]\d{9}$/.test(userData.phoneNumber)
}

function checkPassWord() {
  isValidPassWord.value = /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/.test(userData.password)
}

const router = useRouter()
const onLogin = async() => {
  if(!isPhoneNumber.value || userData.phoneNumber === '') {
    return
  }
  if(!isValidPassWord.value || userData.password === '') {
    return
  }
  await useStore.login(userData)
  if(!useStore.canLogin) {
    MessagePlugin.error('手机号或密码不正确')
    return
  }
  if (!useStore.isAdmin)
    router.push({ path: `/normalUser`, query: { token: useStore.token} })
  else
    router.push({path: `/userList`})
}

// 去注册模块
function toRegister() {
  isLogin.value = false
  userData.phoneNumber = ''
  userData.password = ''
}

/*注册模块*/
const ensurePassWord = ref<string>('')
const isSame  = computed(() => ensurePassWord.value === userData.password)
const trueCheckCode = ref<string>('')
const checkCode = ref<string>('')

function getCheckCode() {
  trueCheckCode.value = Math.floor(Math.random() * 1000000).toString()
  console.log(Math.floor(Math.random() * 1000000))
}

//选择头像
function handleFileSelected(base64 : string) {
  userData.avatarUrl = base64
}

function register() {
  if (!isPhoneNumber.value)
    return
  if (!isValidPassWord.value)
    return
  if(!isSame.value)
    return
  if (trueCheckCode.value !== checkCode.value) {
    MessagePlugin.error('验证码不正确，请重试！')
    return
  }
  userData.token = generateRandomString(10)
  const userList = JSON.parse(localStorage.getItem('userList') || '[]')
  userList.push(userData)
  localStorage.setItem('userList', JSON.stringify(userList))
  MessagePlugin.success('注册成功，请登录')
}

//去登录模块
function toLogin() {
  isLogin.value = true
  userData.phoneNumber = ''
  userData.password = ''
}

// 功能函数模仿生成token
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}
</script>

<style scoped>

</style>
