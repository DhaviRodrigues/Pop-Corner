import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function CodeInput() {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [code, setCode] = useState(["", "", "", "", ""]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={localStyle.container}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={localStyle.box}
          maxLength={1}
          keyboardType="numeric"
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
}

const localStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginVertical: 20,
    width: "100%",
  },
  box: {
    width: 50,
    height: 55,
    backgroundColor: "#3A1200",
    borderRadius: 10,
    color: "#FFFEB2",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
  },
});
