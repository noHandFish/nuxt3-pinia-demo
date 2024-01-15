<template>
  <div v-if="!userData.isAdmin">
    <div class="flex items-center justify-between p-4">
      <div class="flex-center font-bold">我的任务</div>
      <t-button  @click="showAdd">新增</t-button>
    </div>
    <div v-for="(item, index) in toDoListStore.toDoList" :key="index"
         class="flex items-center justify-between p-4 m-4">
      <div>{{ item.content }}</div>
      <DeleteIcon @click="del(index)"/>
    </div>
    <t-dialog v-model:visible="visible" @cancel="cancelAdd" @confirm="add">
      <t-input v-model="content"></t-input>
    </t-dialog>
  </div>
  <div v-else>
  <div class="flex items-center justify-between p-4">
    <div>{{ nickName }}的任务</div>
    <t-button @click="router.back()">返回</t-button>
  </div>
  <div v-for="(item, index) in toDoList" :key="index" class="p-4 m-4">
    <div>{{ item.content }}</div>
  </div>
  <t-dialog v-model:visible="visible" @cancel="cancelAdd" @confirm="add">
    <t-input v-model="content"></t-input>
  </t-dialog>
</div>
</template>

<script setup lang="ts">
import useToDoListStore from '../stores/useToDoListStore'
import useUserStore from "../stores/useUserStore";
import { DeleteIcon } from 'tdesign-icons-vue-next'
const route = useRoute()
const router = useRouter()
const userData = useUserStore()
const visible = ref<boolean>(false)
const toDoListStore = useToDoListStore()
const content = ref<string>('')
const nickName = ref<string>('')
let toDoList = reactive({})

onMounted(() => {
  if(userData.isAdmin) {
    const token = route.query.token
    toDoList = JSON.parse(localStorage.getItem(token) || '[]')
    const userList = JSON.parse(localStorage.getItem('userList') || '[]')
    userList.forEach((item : {
      token : string,
      nickName : string
    }) => {
      if(item.token === token)
        nickName.value = item.nickName
    })
  }
})
function showAdd() {
  visible.value = true
}
const add = async () => {
 await toDoListStore.addItem({
    content: content.value
  })
  visible.value = false
  content.value = ''
}
function cancelAdd() {
  content.value = ''
  visible.value = false
}
function del(index : number) {
  toDoListStore.delItem(index)
}
</script>

<style scoped>

</style>
