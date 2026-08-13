import { useState } from "react";
import {View, Text, TextInput, Pressable, StyleSheet} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";
import { colors } from "../../src/theme/colors";

export default function Register() {
  const register = useAuthStore(
    (state) => state.register
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {
    try {
      setError("");

      await register(
        fullName,
        email,
        password
      );

      router.replace("/(client)/home");
    } catch (error) {
      setError("Erreur lors de l'inscription");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Créer un compte
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={fullName}
        onChangeText={setFullName}
      />

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
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>
          S'inscrire
        </Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>
          J'ai déjà un compte
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
    borderRadius: 8,
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
    marginTop: 20,
    color: colors.primary
  },

  error: {
    color: colors.red,
    marginBottom: 10
  }
});