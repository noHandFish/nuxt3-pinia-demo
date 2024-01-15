import { defineStore } from 'pinia'
const adminList = ['8LMyKbMGqk', '9cCWNOioLh']
const useUserStore = defineStore('user', {
    state: () => ({
        userName: '',
        avatarUrl: '',
        phoneNumber: '',
        token: '',
        canLogin: false,
    }),
    getters: {
        isAdmin(state) {
            return adminList.includes(state.token)
        },
    },
    actions: {
        async login(userData : {
            phoneNumber : string
            password : string
            nickName : string
            avatarUrl : string
        }) {
        //     模拟调接口
        const userList = JSON.parse(localStorage.getItem('userList')  || '[]')
            userList.forEach((item : {
                phoneNumber : string
                password : string
                nickName : string
                avatarUrl : string
                token : string
            }) => {
                if (item.phoneNumber === userData.phoneNumber && item.password === userData.password) {
                    this.canLogin = true
                    this.phoneNumber = item.phoneNumber
                    this.userName = item.nickName
                    this.avatarUrl = item.avatarUrl
                    this.token = item.token
                }
            })
        },
        // 找到对应元素并更改
        async findAndChange(token : string) {
            const userList = JSON.parse(localStorage.getItem('userList') || '[]')
            userList.forEach((item : {
                token : string
                phoneNumber : string
                nickName : string
                avatarUrl : string
            }) => {
                if (item.token === this.token) {
                    this.phoneNumber = item.phoneNumber
                    this.userName = item.nickName
                    this.avatarUrl = item.avatarUrl
                }
            })
        },
        async logout() {
            this.userName = ''
            this.phoneNumber = ''
            this.avatarUrl = ''
            this.token = ''
            this.canLogin = false
        }
    }
})
export default useUserStore
