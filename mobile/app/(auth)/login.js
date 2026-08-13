import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";
import { colors } from "../../src/theme/colors";

export default function Login() {
  const login = useAuthStore(
    (state) => state.login
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      setError("");

      await login(email, password);

      const user = useAuthStore.getState().user;

      if (user.role === "agent") {
        router.replace("/(agent)/home");
      } else {
        router.replace("/(client)/home");
      }
    } catch (error) {
      setError("Email ou mot de passe incorrect");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ChatBit</Text>

      <Text style={styles.subtitle}>
        Support client
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error !== "" && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <Pressable
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Se connecter
        </Text>
      </Pressable>

      <Pressable
        onPress={() =>
          router.push("/(auth)/register")
        }
      >
        <Text style={styles.link}>
          Créer un compte
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: colors.background
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary
  },

  subtitle: {
    textAlign: "center",
    color: colors.gray,
    marginBottom: 30
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 13,
    marginBottom: 15
  },

  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },

  buttonText: {
    color: colors.white,
    fontWeight: "bold"
  },

  link: {
    textAlign: "center",
    color: colors.primary,
    marginTop: 20
  },

  error: {
    color: colors.red,
    marginBottom: 10
  }
});