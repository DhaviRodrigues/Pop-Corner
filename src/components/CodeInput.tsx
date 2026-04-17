import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { componentStyle } from "@/styles/component";

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
    <View style={componentStyle.codeInputContainer}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={componentStyle.codeInputBox}
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