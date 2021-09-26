import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000",
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
    };
  },
};
