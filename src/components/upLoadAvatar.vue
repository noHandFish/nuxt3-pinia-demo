<template>
  <div>
    <input ref="upLoadImg" type="file" @change="handleSelectFile" class="hidden">
    <div @click="$refs.upLoadImg.click()"
         class="w-24 h-24 rounded-full bg-gray-200 flex-center"
         v-if="isAvatarEmpty">+</div>
    <t-image :src="userImage" alt="Avatar" class="w-24 h-24 hover: cursor" shape="circle" fit="cover" @click="$refs.upLoadImg.click()" v-else/>
  </div>
</template>

<script setup lang="ts">
import useUserStore from "../stores/useUserStore";
const userData = useUserStore()
const userImage = ref<string>(userData.avatarUrl)
const isAvatarEmpty = computed(() => userImage.value === '')
const emit = defineEmits(['fileSelect'])

// 向父组件传值
function handleSelectFile(event : any) {
  const file = event.target.files[0];
  console.log(file)
  if (file) {
    readImageAsDataURL(file, (base64String : string) => {
      userImage.value = base64String;
      //传递给父组件
      emit('fileSelect',userImage.value)
    }, () => {});
  }
}

// 获取base64图片url
function readImageAsDataURL(file : any, successCallback: any, errorCallback : any) {
  const reader = new FileReader();

  reader.onloadend = () => {
    if (typeof reader.result === 'string') {
      console.log('live')
      successCallback(reader.result);
    } else {
      errorCallback(new Error('Failed to read the file as Data URL'));
    }
  };

  reader.onerror = () => {
    errorCallback(new Error('Error reading the file'));
  };

  reader.readAsDataURL(file);
}
</script>

<style scoped>

</style>
