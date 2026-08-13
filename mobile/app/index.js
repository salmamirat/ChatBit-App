import { useEffect } from "react";
import {  ActivityIndicator, View} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../src/store/authStore";

export default function Index() {
  const user = useAuthStore(
    (state) => state.user
  );

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    if (user.role === "agent") {
      router.replace("/(agent)/home");
    } else {
      router.replace("/(client)/home");
    }
  }, [user]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <ActivityIndicator />
    </View>
  );
}