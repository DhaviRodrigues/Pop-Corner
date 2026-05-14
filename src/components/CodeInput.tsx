import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { componentStyle } from "@/styles/component";

type CodeInputProps = {
  onCodeChange: (code: string) => void;
};

export default function CodeInput({ onCodeChange }: CodeInputProps) {
  // A gente precisa do useRef aqui em formato de array para guardar a referência (o controle direto) de cada um dos 5 quadradinhos de texto. 
  // Sem isso, o React Native não deixa a gente forçar o teclado a pular pro próximo input via código.
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Estado pra guardar os 5 dígitos. Optei por um array com 5 posições vazias em vez de uma string única pra facilitar a renderização de cada input separado no map lá embaixo.
  const [code, setCode] = useState(["", "", "", "", ""]);

  const handleChange = (text: string, index: number) => {
    // Como não podemos alterar o state diretamente (imutabilidade do React), fazemos uma cópia do array atual.
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    onCodeChange(newCode.join(""));

    // A mágica do auto-focus: se o cara digitou um número (text tem valor) e a gente não está no último quadradinho (index < 4), 
    // a gente acessa a referência do próximo input (index + 1) e chama o .focus() pra jogar o cursor pra lá.
    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Essa função existe basicamente pra tratar uma falha de UX que ia rolar se o cara tentasse apagar tudo de uma vez.
    // Se ele aperta Backspace, o quadradinho atual já está vazio (""), e não é o primeiro quadradinho (index > 0)...
    // A gente força o cursor a voltar pro quadradinho anterior pra ele continuar apagando.
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={componentStyle.codeInputContainer}>
      {/* Usando o array do state pra gerar os 5 TextInputs dinamicamente em vez de escrever a mesma tag 5 vezes na mão. */}
      {code.map((digit, index) => (
        <TextInput
          key={index}
          // É aqui que a gente "pesca" a referência do elemento na tela e salva no array do useRef usando o index da iteração atual.
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={componentStyle.codeInputBox}
          // maxLength 1 garante que cada quadrado só receba 1 dígito, evitando bugar o layout.
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