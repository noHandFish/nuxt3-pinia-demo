import { defineStore } from "pinia";
import  useUserStore from "./useUserStore";
const userData = useUserStore()
const useToDoListStore = defineStore('list', {
    state: () => ({
        toDoList: JSON.parse(localStorage.getItem(userData.token) || '[]')
    }),
    getters: {},
    actions: {
        addItem(item : object) {
            this.toDoList.push(item)
            localStorage.setItem(userData.token,JSON.stringify(this.toDoList))
        },
        delItem(index : number) {
            this.toDoList.splice(index, 1)
            localStorage.setItem(userData.token, JSON.stringify(this.toDoList))
        }
    }
})
export default useToDoListStore
