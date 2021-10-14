import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});
export default {
  User: () => {
    return {
      login: async (username: string, password: string) => {
        try {
          const requestBody = { username, password };
          const response = await api.post("/login", requestBody);

          const data = response.data;

          if (data["role"] !== "admin") {
            throw new Error("שם משתמש/סיסמה שגויים");
          }

          localStorage.setItem("access_token", response.data.token);

          return response.data;
        } catch (error: any) {
          switch (error.response.status) {
            case 404:
              throw new Error("שם משתמש/סיסמה שגויים");
            case 500:
              throw new Error("הייתה שגיאה בהתחברות. נסה שנית מאוחר יותר");
          }
        }
      },
      profile: async () => {
        try {
          const response = await api.get("/users/me");

          return response.data;
        } catch (error: any) {
          switch (error.response.status) {
            case 401:
              throw new Error("401");
              break;
            case 403:
              throw new Error("403");
              break;
            default:
              throw new Error(error.response.status);
              break;
          }
        }
      },
    };
  },
  Lesson: () => {
    return {
      all: async () => {
        try {
          const response = await api.get("/lessons");

          return response.data;
        } catch (error: any) {
          throw new Error(error.response.status);
        }
      },
    };
  },
};
