import { useEffect, useState } from "react";
import {  ActivityIndicator,  View} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../src/store/authStore";

export default function Index() {
  const user = useAuthStore(
    (state) => state.user
  );

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    if (user.role === "agent") {
      router.replace("/(agent)/home");
    } else {
      router.replace("/(client)/home");
    }
  }, [ready, user]);

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