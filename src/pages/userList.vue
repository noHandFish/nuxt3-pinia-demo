<template>
  <div class="h-screen w-full bg-gray-100">
    <div class="h-40 flex items-center justify-between bg-white m-4 rounded">
      <!--  头部个人信息卡片  -->
      <div class="w-65 h-40 flex items-center">
        <t-image :src="pageData.avatarUrl" class="w-32 h-32 m-4" fit="cover"></t-image>
        <div class="h-32 flex flex-col justify-between">
          <div class="font-bold text-xl">{{ pageData.nickName }}</div>
          <div>{{ maskPhoneNumber }}</div>
        </div>
      </div>
      <div class="flex flex-col gap-4 mr-8">
        <t-button @click="showEdit">修改信息</t-button>
        <t-button @click="logOut">登出</t-button>
      </div>
      <!--  修改个人信息部分  -->
      <t-dialog v-model:visible="editVisible" :on-cancel="cancel" :on-confirm="editMessage">
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
    <!-- 管理用户列表模块 -->
    <div class="bg-white m-4 divide-y">
      <div class="font-bold flex-center p-3">用户列表</div>
      <div class="divide-y">
        <div v-for="(item, index) in userList" :key="index" 
          class="flex justify-between hover:bg-gray-200 p-3"
          @click="showDetail(item.token)"
          title="点击查看用户详情">
          <div>{{ item.nickName }}</div>
          <div class="flex gap-2">
            <t-button @click.stop="showItsList(item.token)">任务列表</t-button>
            <t-button @click.stop="showEditUser(item)">编辑</t-button>
          </div>
        </div>
      </div>
    </div>
    <t-dialog v-model:visible="visible" @confirm="saveEditUser" @cancel="cancelEditUser" :closeBtn="false" title="修改用户信息">
      <div class="h-full flex flex-col gap-4">
        <div class="flex">昵称：<t-input v-model="nickName" placeholder="请输入昵称" style="width: 85%"></t-input></div>
        <div class="flex">密码：<t-input v-model="password" placeholder="请输入密码" style="width: 85%"></t-input></div>
      </div>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import useUserStore from "../stores/useUserStore";
const userList = reactive(JSON.parse(localStorage.getItem('userList') || '[]'))
const userData = useUserStore()
const visible = ref<boolean>(false)
const token = ref<string>('')
const router = useRouter()

/* 个人信息数据初始化 */
interface data {
  nickName: string
  avatarUrl: string
  phoneNumber: string
  password: string
}
const pageData = reactive<data>({
  nickName: "",
  avatarUrl: "",
  phoneNumber: "",
  password: ""
})
const maskPhoneNumber = ref<string>('')
const editVisible = ref<boolean>(false)
const editUserData = reactive<data>({
  nickName: "",
  avatarUrl: "",
  phoneNumber: "",
  password: ""
})
const nickName = ref<string>('')
const password = ref<string>('')

onMounted(() => {
  initUserData()
})

function initUserData() {
  userList.forEach((item: data & { token: string }) => {
    if (userData.token === item.token) {
      pageData.nickName = item.nickName
      pageData.avatarUrl = item.avatarUrl
      pageData.phoneNumber = item.phoneNumber
      pageData.password = item.password
      maskPhoneNumber.value = `${pageData.phoneNumber.substring(0, 3)}****${pageData.phoneNumber.substring(7)}`
      editUserData.nickName = pageData.nickName
      editUserData.avatarUrl = pageData.avatarUrl
      editUserData.phoneNumber = pageData.phoneNumber
      editUserData.password = pageData.password
    }
  })
}

/* 修改个人信息 */
function showEdit() {
  editVisible.value = true
}
function cancel() {
  editVisible.value = false
}
function handleFileSelected(base64: string) {
  editUserData.avatarUrl = base64
}

function editMessage() {
  editVisible.value = false
  userList.forEach((item: data & { token: string }) => {
    if (item.token === userData.token) {
      item.nickName = editUserData.nickName
      item.phoneNumber = editUserData.phoneNumber
      item.avatarUrl = editUserData.avatarUrl
      item.password = editUserData.password
      pageData.nickName = editUserData.nickName
      pageData.phoneNumber = editUserData.phoneNumber
      pageData.avatarUrl = editUserData.avatarUrl
      pageData.password = editUserData.password
      userData.findAndChange(userData.token)
      maskPhoneNumber.value = `${pageData.phoneNumber.substring(0, 3)}****${pageData.phoneNumber.substring(7)}`
    }
  })
  localStorage.setItem('userList', JSON.stringify(userList))
}
// 功能函数
const isPhoneNumber = ref<boolean>(true)
const isValidPassWord = ref<boolean>(true)

function checkPhoneNumber() {
  isPhoneNumber.value = /^1[3456789]\d{9}$/.test(userData.phoneNumber)
}
function checkPassWord() {
  isValidPassWord.value = /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/.test(userData.password)
}

// 退出登录
function logOut() {
  userData.logout()
  router.replace('/')
}

/* 修改其他用户信息 */

function showEditUser(editItem: {
  nickName: string,
  password: string,
  token: string
}) {
  visible.value = true
  userList.forEach((item: data & { token: string }) => {
    if (item.token === editItem.token) {
      token.value = editItem.token
      nickName.value = editItem.nickName
      password.value = editItem.password
    }
  })
  localStorage.setItem('userList', JSON.stringify(userList))
}

function saveEditUser() {
  userList.map((item: data & { token: string }) => {
    if (item.token === userData.token) {
      item.nickName = nickName.value
      item.password = password.value
    }
  })
  localStorage.setItem('userList', JSON.stringify(userList))
  visible.value = false
}
function cancelEditUser() {
  visible.value = false
}

/* 查看其他用户信息 */
function showDetail(token: string) {
  router.push({ path: '/normalUser', query: { token: token } })
}
function showItsList(token: string) {
  router.push({ path: 'toDoList', query: { token: token } })
}
</script>

<style scoped></style>
