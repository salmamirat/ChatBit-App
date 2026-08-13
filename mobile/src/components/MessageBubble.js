import { View,  Text,  StyleSheet} from "react-native";
import { colors } from "../theme/colors";

export default function MessageBubble({
  message,
  isMine
}) {
  return (
    <View
      style={[
        styles.message,
        isMine
          ? styles.myMessage
          : styles.otherMessage
      ]}
    >
      <Text
        style={[
          styles.text,
          isMine && styles.myText
        ]}
      >
        {message.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 15,
    marginBottom: 8
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.lightGray
  },

  text: {
    color: colors.text,
    fontSize: 15
  },

  myText: {
    color: colors.white
  }
});