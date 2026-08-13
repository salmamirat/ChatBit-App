import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {  loginUser,  registerUser} from "../services/authService";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const data = await loginUser(email, password);

        set({
          token: data.token,
          user: data.user
        });
      },

      register: async (fullName, email, password) => {
        const data = await registerUser(
          fullName,
          email,
          password
        );

        set({
          token: data.token,
          user: data.user
        });
      },

      logout: () => {
        set({
          user: null,
          token: null
        });
      }
    }),

    {
      name: "chatbit-auth",
      storage: createJSONStorage(
        () => AsyncStorage
      )
    }
  )
);