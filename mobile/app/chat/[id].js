import { useEffect, useState } from "react";
import { View,  Text,  TextInput,  Pressable,  FlatList,  StyleSheet} from "react-native";
import { useLocalSearchParams,  router} from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getMessages, closeConversation} from "../../src/services/conversationService";
import { useAuthStore } from "../../src/store/authStore";
import { useSocketStore } from "../../src/store/socketStore";
import MessageBubble from "../../src/components/MessageBubble";
import TypingIndicator from "../../src/components/TypingIndicator";
import { colors } from "../../src/theme/colors";

export default function Chat() {
  const { id } =
    useLocalSearchParams();

  const user = useAuthStore(
    (state) => state.user
  );

  const socket = useSocketStore(
    (state) => state.socket
  );

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const [isOtherOnline, setIsOtherOnline] =
    useState(true);

  const [closed, setClosed] =
    useState(false);

  const { data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessages(id)
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit(
      "conversation:join",
      {
        conversationId: Number(id)
      }
    );

    socket.on(
      "message:new",
      (newMessage) => {
        if (
          Number(newMessage.conversation_id) ===
          Number(id)
        ) {
          setMessages((oldMessages) => [
            ...oldMessages,
            newMessage
          ]);
        }
      }
    );

    socket.on(
      "typing:update",
      (data) => {
        if (
          Number(data.conversationId) ===
          Number(id)
        ) {
          setIsTyping(data.isTyping);
        }
      }
    );

    socket.on(
      "conversation:updated",
      (conversation) => {
        if (
          Number(conversation.id) ===
          Number(id)
        ) {
          if (
            conversation.status ===
            "fermee"
          ) {
            setClosed(true);
          }
        }
      }
    );

    socket.on("error", (error) => {
      console.log(
        "Socket error:",
        error
      );
    });

    socket.on(
      "presence:update",
      ({ userId, isOnline }) => {
        if (userId !== user?.id) {
          setIsOtherOnline(isOnline);
        }
      }
    );

    return () => {
      socket.emit(
        "conversation:leave",
        {
          conversationId: Number(id)
        }
      );

      socket.off("message:new");
      socket.off("typing:update");
      socket.off("conversation:updated");
      socket.off("presence:update");
      socket.off("error");
    };
  }, [socket, id]);

  function sendMessage() {
    if (
      !socket ||
      message.trim() === "" ||
      closed
    ) {
      return;
    }

    socket.emit(
      "message:send",
      {
        conversationId: Number(id),
        content: message.trim()
      }
    );

    socket.emit(
      "typing:stop",
      {
        conversationId: Number(id)
      }
    );

    setMessage("");
  }

  function startTyping(text) {
    setMessage(text);

    if (!socket || closed) {
      return;
    }

    if (text.length > 0) {
      socket.emit(
        "typing:start",
        {
          conversationId: Number(id)
        }
      );
    } else {
      socket.emit(
        "typing:stop",
        {
          conversationId: Number(id)
        }
      );
    }
  }

  async function handleClose() {
    try {
      await closeConversation(id);

      setClosed(true);
    } catch (error) {
      console.log(
        "Erreur fermeture:",
        error.message
      );
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerInfo}>
          <Text style={styles.title}>
            Support
          </Text>

          <Text style={[
            styles.online,
            !isOtherOnline && styles.offline
          ]}>
            {isOtherOnline ? "● En ligne" : "● Hors ligne"}
          </Text>
        </View>

        {user?.role === "agent" &&
        !closed ? (
          <Pressable
            onPress={handleClose}
          >
            <Text style={styles.close}>
              Fermer
            </Text>
          </Pressable>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>


      <FlatList
        style={styles.messages}
        data={messages}
        keyExtractor={(item, index) =>
          String(item.id || index)
        }
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isMine={
              Number(item.sender_id) ===
              Number(user?.id)
            }
          />
        )}
        contentContainerStyle={{
          padding: 15
        }}
      />

      <TypingIndicator
        visible={isTyping}
      />


      {closed ? (
        <View style={styles.closed}>
          <Text style={styles.closedText}>
            Cette conversation est fermée.
          </Text>
        </View>
      ) : (
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Écrire un message..."
            value={message}
            onChangeText={startTyping}
          />

          <Pressable
            style={styles.send}
            onPress={sendMessage}
          >
            <Text style={styles.sendText}>
              →
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center"
  },

  back: {
    fontSize: 35,
    color: colors.text
  },

  headerInfo: {
    flex: 1,
    marginLeft: 10
  },

  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.text
  },

  online: {
    color: colors.green,
    fontSize: 12,
    marginTop: 2
  },

  offline: {
    color: colors.gray
  },

  close: {
    color: colors.red,
    fontSize: 13
  },

  messages: {
    flex: 1
  },

  inputArea: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10
  },

  send: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8
  },

  sendText: {
    color: colors.white,
    fontSize: 22
  },

  closed: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center"
  },

  closedText: {
    color: colors.gray
  }
});