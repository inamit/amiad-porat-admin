import api from "@/api/api";
import { User } from "@/api/models/user";
import { ActionContext, Commit } from "vuex";

export interface UserState {
  loginApiStatus: string;
  userProfile: User;
}

// export default {
//   namespaced: true as true,
//   state: {
//     loginApiStatus: "",
//   } as UserState,
//   getters: {},
//   mutations: {
//     setLoginStatus: (state: UserState, data: string) => {
//       state.loginApiStatus = data;
//     },
//     setUserProfile: (state: UserState, data: User) => {
//       state.userProfile = { ...data };
//     },
//   },
//   actions: {
//     userProfile: async ({ commit }: ActionContext<any, any>) => {
//       try {
//         const user = await api.User().profile();

//         if (user) commit("setUserProfile", user);
//       } catch (error: any) {
//         commit("setLoginStatus", error.message);
//       }
//     },
//   },
// };
