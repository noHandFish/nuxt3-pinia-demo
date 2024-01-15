<template>
  <div class="h-40 flex items-center justify-between bg-white m-4">
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
    <t-dialog v-model:visible="editVisible" :on-cancel="cancel" :on-confirm="editMessage">
      <div class="flex flex-col gap-6">
        <div class="flex items-center">
          <div>头像：</div>
          <up-load-avatar  @fileSelect="handleFileSelected"></up-load-avatar>
        </div>
        <t-input placeholder="修改昵称" v-model="editUserData.nickName"></t-input>
        <t-input placeholder="修改手机号" v-model="editUserData.phoneNumber" :status="isPhoneNumber ? 'default' : 'error'" :tips="isPhoneNumber ? '' : '请输入正确手机号'" @blur="checkPhoneNumber">
          <template #prefix-icon>
            <User1Icon />
          </template>
        </t-input>
        <t-input type="password" placeholder="修改密码" v-model="editUserData.password" :status="isValidPassWord ? 'default' : 'error'" :tips="isValidPassWord ? '' : '密码必须包含数字，字母，特殊字符'" @blur="checkPassWord">
          <template #prefix-icon>
            <LockOnIcon />
          </template>
        </t-input>
      </div>
    </t-dialog>
  </div>
<div class="font-bold flex-center">用户列表</div>
<div class="m-2">
  <div v-for="(item,index) in userList" :key="index" class="flex justify-between p-2 hover:bg-gray-200" @click="showDetail(item.token)">
    <div>{{ item.nickName }}</div>
    <div class="flex gap-3">
      <t-button @click.stop="showItsList(item.token)">任务列表</t-button>
      <t-button @click.stop="showEditUser(item)">编辑</t-button>
    </div>
  </div>
</div>
  <t-dialog v-model:visible="visible" @confirm="saveEditUser"
            @cancel="cancelEditUser"
            :closeBtn="false"
            title="修改用户信息">
    <div class="h-full flex flex-col gap-4">
      <div class="flex">昵称：<t-input v-model="nickName" placeholder="请输入昵称" style="width: 85%"></t-input></div>
      <div class="flex">密码：<t-input v-model="password" placeholder="请输入密码" style="width: 85%"></t-input></div>
    </div>
  </t-dialog>
</template>

<script lang="ts" setup>
import useUserStore from "../stores/useUserStore";
const userList = reactive(JSON.parse(localStorage.getItem('userList') || '[]'))
const userData = useUserStore()
const visible = ref<boolean>(false)
const editVisible = ref<boolean>(false)
const editUserData = reactive({})
const nickName = ref<string>('')
const password = ref<string>('')
const token = ref<string>('')
const router = useRouter()

onMounted(() => {
  initUserData()
})
const pageData = reactive({})
const maskPhoneNumber = ref<string>('')
function initUserData() {
  userList.forEach((item : object) => {
    if(userData.token === item.token) {
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
const isPhoneNumber = ref<boolean>(true)
const isValidPassWord = ref<boolean>(true)

function checkPhoneNumber() {
  isPhoneNumber.value = /^1[3456789]\d{9}$/.test(userData.phoneNumber)
}
function checkPassWord() {
  isValidPassWord.value = /^1[3456789]\d{9}$/.test(userData.password)
}
function logOut() {
  userData.logout()
  router.replace('/')
}
function showEdit() {
  editVisible.value = true
}
function cancel() {
  editVisible.value = false
}
function editMessage() {
  editVisible.value = false
  userList.forEach((item : object) => {
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
function showEditUser(editItem : object) {
  visible.value = true
  userList.forEach((item : object) => {
    if (item.token === editItem.token) {
      token.value = editItem.token
      nickName.value = editItem.nickName
      password.value = editItem.password
    }
  })
  localStorage.setItem('userList', JSON.stringify(userList))
}
function handleFileSelected(base64 : string) {
  editUserData.avatarUrl = base64
}
function saveEditUser() {
  userList.map((item : object) => {
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
function showDetail(token : string) {
  router.push({ path: '/normalUser', query: { token : token }})
}
function showItsList(token : string) {
  router.push({ path: 'toDoList', query : { token : token }})
}
</script>

<style scoped>

</style>
