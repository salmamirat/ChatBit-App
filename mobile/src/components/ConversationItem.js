import {  View,  Text,  Pressable,  StyleSheet} from "react-native";
import { colors } from "../theme/colors";

export default function ConversationItem({
  conversation,
  onPress
}) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          C
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subject}>
          {conversation.subject}
        </Text>

        <Text style={styles.status}>
          {conversation.status}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center"
  },

  avatarText: {
    color: colors.white,
    fontWeight: "bold"
  },

  content: {
    marginLeft: 12
  },

  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text
  },

  status: {
    marginTop: 5,
    color: colors.gray
  }
});