import {  View,  Text,  FlatList,  Pressable,  StyleSheet} from "react-native";
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

  const {
    data: conversations = []
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations
  });

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

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: colors.gray
  }
});