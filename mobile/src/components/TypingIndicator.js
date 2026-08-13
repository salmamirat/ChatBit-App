import {  Text,  StyleSheet} from "react-native";
import { colors } from "../theme/colors";

export default function TypingIndicator({
  visible
}) {
  if (!visible) {
    return null;
  }

  return (
    <Text style={styles.text}>
      En train d'écrire...
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.gray,
    fontSize: 13,
    marginLeft: 15,
    marginBottom: 5
  }
});