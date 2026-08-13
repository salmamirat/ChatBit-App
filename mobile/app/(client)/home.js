import { useState, useEffect } from "react";
import {  View,  Text,  FlatList,  Pressable,  TextInput,  Modal,  ActivityIndicator,  StyleSheet} from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getConversations, createConversation} from "../../src/services/conversationService";
import { useAuthStore } from "../../src/store/authStore";
import ConversationItem from "../../src/components/ConversationItem";
import { colors } from "../../src/theme/colors";

export default function ClientHome() {
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

  const [modalVisible, setModalVisible] =
    useState(false);

  const [subject, setSubject] =
    useState("");

  const {
    data: conversations = [],
    refetch,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations
  });

  async function handleCreate() {
    if (!subject.trim()) {
      return;
    }

    try {
      await createConversation(subject);

      setSubject("");
      setModalVisible(false);

      refetch();
    } catch (error) {
      console.log(
        "Erreur:",
        error.message
      );
    }
  }

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
            Mes conversations
          </Text>

          <Text style={styles.subtitle}>
            Besoin d'aide ?
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

      <Pressable
        style={styles.newButton}
        onPress={() =>
          setModalVisible(true)
        }
      >
        <Text style={styles.newButtonText}>
          + Nouvelle conversation
        </Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Nouvelle conversation
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Sujet de la conversation"
              value={subject}
              onChangeText={setSubject}
            />

            <Pressable
              style={styles.createButton}
              onPress={handleCreate}
            >
              <Text
                style={styles.createButtonText}
              >
                Créer
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                setModalVisible(false)
              }
            >
              <Text style={styles.cancel}>
                Annuler
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "center"
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text
  },

  subtitle: {
    marginTop: 5,
    color: colors.gray
  },

  logout: {
    color: colors.red,
    fontSize: 13
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
  },

  newButton: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center"
  },

  newButtonText: {
    color: colors.white,
    fontWeight: "bold"
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)"
  },

  modal: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15
  },

  createButton: {
    backgroundColor: colors.primary,
    padding: 13,
    borderRadius: 8,
    alignItems: "center"
  },

  createButtonText: {
    color: colors.white,
    fontWeight: "bold"
  },

  cancel: {
    textAlign: "center",
    marginTop: 15,
    color: colors.gray
  }
});