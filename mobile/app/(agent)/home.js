import { useEffect } from "react";
import {  View,  Text,  FlatList,  Pressable,  ActivityIndicator,  StyleSheet} from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getConversations} from "../../src/services/conversationService";
import { useAuthStore } from "../../src/store/authStore";
import ConversationItem from "../../src/components/ConversationItem";
import { colors } from "../../src/theme/colors";

export default function AgentHome() {
  const logout = useAuthStore(
    (state) => state.logout
  );

  const user = useAuthStore(
    (state) => state.user
  );

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/login");
    }
  }, [user]);

  const {
    data: conversations = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Erreur de chargement. Réessayez.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Support
          </Text>

          <Text style={styles.subtitle}>
            Conversations clients
          </Text>
        </View>

        <Pressable onPress={logout}>
          <Text style={styles.logout}>
            Déconnexion
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) =>
          String(item.id)
        }
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() =>
              router.push(
                `/chat/${item.id}`
              )
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Aucune conversation
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.text
  },

  subtitle: {
    color: colors.gray,
    marginTop: 5
  },

  logout: {
    color: colors.red
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background
  },

  errorText: {
    color: colors.red,
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 30
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: colors.gray
  }
});