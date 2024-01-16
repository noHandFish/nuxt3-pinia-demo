<template>
  <div class="h-screen w-full  bg-gray-100 flex flex-col">
    <!--  头部个人信息卡片  -->
    <div class="h-40 flex items-center justify-between bg-white m-4 rounded">
      <div class="w-65 h-40 flex items-center">
        <t-image :src="pageData.avatarUrl" class="w-32 h-32 m-4" shape="round" fit="cover"></t-image>
        <div class="h-32 flex flex-col justify-between">
          <div class="font-bold text-xl">{{ pageData.nickName }}</div>
          <div>{{ maskPhoneNumber }}</div>
        </div>
      </div>
      <div class="flex flex-col gap-4 mr-8 rounded" v-if="isMe">
        <t-button @click="showEdit">修改信息</t-button>
        <t-button @click="logOut">登出</t-button>
        <t-button @click="router.push({ path: '/toDoList' })">查看我的任务</t-button>
      </div>
      <div class="mr-4" v-else>
        <t-button @click="backToMe">返回我的</t-button>
      </div>
    </div>
    <!-- 能看到的用户列表，点击可以跳转至该用户详情页   -->
    <div class="flex flex-col divide-y bg-white m-4 rounded">
      <div class="font-bold flex-center my-4">用户列表</div>
      <div v-for="(item, index) in userList" :key="index" class="flex items-center justify-between p-3 hover:bg-gray-200"
        @click="toItsPage(item.token)">
        <div class="flex items-center gap-8">
          <t-image :src="item.avatarUrl" class="w-16 h-16" shape="circle"></t-image>
          <div>{{ item.nickName }}</div>
        </div>
        <ChevronRightIcon />
      </div>
    </div>
    <!-- 用户修改个人信息模块   -->
    <t-dialog v-model:visible="visible" @cancel="cancel" @confirm="editMessage">
      <div class="flex flex-col gap-6">
        <div class="flex items-center">
          <div>头像：</div>
          <up-load-avatar @fileSelect="handleFileSelected"></up-load-avatar>
        </div>
        <t-input placeholder="修改昵称" v-model="editUserData.nickName"></t-input>
        <t-input placeholder="修改手机号" v-model="editUserData.phoneNumber" :status="isPhoneNumber ? 'default' : 'error'"
          :tips="isPhoneNumber ? '' : '请输入正确手机号'" @blur="checkPhoneNumber">
          <template #prefix-icon>
            <User1Icon />
          </template>
        </t-input>
        <t-input type="password" placeholder="修改密码" v-model="editUserData.password"
          :status="isValidPassWord ? 'default' : 'error'" :tips="isValidPassWord ? '' : '密码必须为8位以上包含数字，大小写字母，特殊字符'"
          @blur="checkPassWord">
          <template #prefix-icon>
            <LockOnIcon />
          </template>
        </t-input>
      </div>
    </t-dialog>
  </div>
</template>
<script setup lang="ts">
import useUserStore from "../stores/useUserStore"
import { ChevronRightIcon, User1Icon, LockOnIcon } from "tdesign-icons-vue-next"
interface data {
  nickName: string
  avatarUrl: string
  phoneNumber: string
  password: string
}
const router = useRouter()
const route = useRoute()

/*页面数据初始化工作，跳转和登录载入时触发initUserData*/
const isMe = ref<boolean>(false)
const userData = useUserStore()
const pageData = reactive<data>({
  nickName: '',
  avatarUrl: '',
  phoneNumber: '',
  password: ''
})
const editUserData = reactive<data>(
  {
    phoneNumber: '',
    nickName: '',
    avatarUrl: '',
    password: ''
  }
)

// 使用 watch 监听路由参数变化
watch(() => route.query.token, (newUserToken, oldUserToken) => {
  if (newUserToken !== oldUserToken) {
    // 路由参数变化时重新获取数据
    initUserData();
  }
})
onMounted(() => {
  initUserData()
})
function initUserData() {
  const token = route.query.token
  isMe.value = (token === userData.token)
  userList.forEach((item: data & { token: string }) => {
    if (token === item.token) {
      pageData.nickName = item.nickName
      pageData.avatarUrl = item.avatarUrl
      pageData.phoneNumber = item.phoneNumber
      pageData.password = item.password
    }
  })
  // 如果是在当前用户详情页就把editUserData初始化
  if (isMe.value) {
    editUserData.nickName = pageData.nickName
    editUserData.avatarUrl = pageData.avatarUrl
    editUserData.phoneNumber = pageData.phoneNumber
    editUserData.password = pageData.password
  }
}

/*用户修改个人信息模块*/
function showEdit() {
  visible.value = true
}

// 取消修改
function cancel() {
  visible.value = false
}

function handleFileSelected(base64: string) {
  editUserData.avatarUrl = base64
}

// 确认修改
function editMessage() {
  visible.value = false
  userList.forEach((item: {
    token: string
    nickName: string
    avatarUrl: string
    phoneNumber: string
    password: string
  }) => {
    if (item.token === userData.token) {
      item.nickName = editUserData.nickName
      item.phoneNumber = editUserData.phoneNumber
      item.avatarUrl = editUserData.avatarUrl
      pageData.nickName = editUserData.nickName
      pageData.phoneNumber = editUserData.phoneNumber
      pageData.avatarUrl = editUserData.avatarUrl
      userData.findAndChange(userData.token)
    }
  })
  localStorage.setItem('userList', JSON.stringify(userList))
}

// 个人退出登录
function logOut() {
  userData.logout()
  router.replace('/')
}

// 在其他用户页面浏览完想返回时
function backToMe() {
  const token = userData.token
  if (userData.isAdmin)
    router.push({ path: '/userList' })
  else
    router.push({ path: 'normalUser', query: { token: token } })
}

/* 其他用户信息列表模块 */
const userList = reactive(JSON.parse(localStorage.getItem('userList') || '[]'))
// 手机号脱敏
const maskPhoneNumber = computed(() => {
  return `${pageData?.phoneNumber?.substring(0, 3)}****${pageData?.phoneNumber?.substring(7)}`
})
const visible = ref(false)
const isPhoneNumber = ref<boolean>(true)
const isValidPassWord = ref<boolean>(true)
// const avatarUrlEmpty = ref<boolean>()
function isAvatarEmpty(url: string) : boolean {
  return url === ''
}
function checkPhoneNumber() {
  isPhoneNumber.value = /^1[3456789]\d{9}$/.test(editUserData.phoneNumber)
}
function checkPassWord() {
  isValidPassWord.value = /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/.test(editUserData.password)
}
// 去别的用户的详情页
function toItsPage(token: string) {
  router.push({ path: '/normalUser', query: { token: token } })
}
</script>

<style scoped></style>
