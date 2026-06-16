import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadUserPhoto, ALLOWED_IMAGE_EXTENSIONS } from '@/services/storage';
import { miscStyle } from '@/styles/misc';
import { textStyle } from '@/styles/text';
import { COLORS } from '@/constants/colors';

import { couponFormStyle, placeholderColor } from '@/styles/couponForm';

import { CouponTypeDropdown } from '@/components/CouponTypeDropdown';
import BottomNavbar from '@/components/Navbar';
import { createCoupon, getCoupon, updateCoupon } from '@/services/couponService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackButton } from '@/components/BackButton';
import { ButtonY } from '@/components/ButtonY';

function LocalInput({
  text,
  value,
  onChangeText,
  keyboardType = "default",
  editable = true,
}: {
  text: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: any;
  editable?: boolean;
}) {
  return (
    <View 
      style={[
        couponFormStyle.inputWrapper, 
        !editable ? couponFormStyle.inputDisabled : null
      ]}
    >
      <TextInput
        placeholder={text}
        placeholderTextColor={placeholderColor}
        keyboardType={keyboardType}
        editable={editable}
        style={couponFormStyle.inputText}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

export default function CouponFormScreen() {
  const router = useRouter();
  const { couponId } = useLocalSearchParams();
  const isEditing = !!couponId;

  const [nome, setNome] = useState('');
  const [valorPipokas, setValorPipokas] = useState('');
  const [urlIcone, setUrlIcone] = useState('');
  const [tipo, setTipo] = useState('');
  const [valorBeneficios, setValorBeneficios] = useState('');
  const [dataExpiracao, setDataExpiracao] = useState('');
  const [tempoValidade, setTempoValidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [limitada, setLimitada] = useState(false);
  const [temporaria, setTemporaria] = useState(false);
  const [qtdCupons, setQtdCupons] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);

  const getImageExtension = (uri: string) => {
    return uri.split('.').pop()?.split('?')[0]?.toLowerCase() || '';
  };

  const handlePickImage = async () => {
    try {
      setLoadingImage(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permissão Negada", "Permissão para acessar galeria é necessária.");
        setLoadingImage(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled || result.assets.length === 0) {
        setLoadingImage(false);
        return;
      }

      const uri = result.assets[0].uri;
      const fileName = result.assets[0].fileName || '';

      const ext = getImageExtension(fileName) || getImageExtension(uri);
      const valid = ext && ALLOWED_IMAGE_EXTENSIONS.includes(ext);
      
      if (!valid) {
        Alert.alert("Erro", "Formato de imagem inválido. Use apenas JPG, JPEG ou PNG.");
        setLoadingImage(false);
        return;
      }

      const identifier = `cupom_${Date.now()}`;
      const uploadResponse = await uploadUserPhoto(uri, 'cinema_foto', identifier, fileName);
      if (!uploadResponse.success) {
        Alert.alert("Erro", uploadResponse.error || "Erro ao fazer upload da imagem.");
        setLoadingImage(false);
        return;
      }

      const signed = uploadResponse.signedUrl;
      if (signed) {
        setUrlIcone(signed);
      } else {
        Alert.alert("Erro", "Erro ao obter URL da imagem.");
      }
    } catch (error) {
      console.error("Erro no upload de imagem:", error);
      Alert.alert("Erro", "Erro ao processar imagem.");
    } finally {
      setLoadingImage(false);
    }
  };

  useEffect(() => {
    if (isEditing && couponId) {
      loadCouponData();
    }
  }, [couponId]);

  const loadCouponData = async () => {
    try {
      const result = await getCoupon(couponId as string);
      
      if (!result.valid || !result.data) {
        setStatusMessage('Cupom não encontrado.');
        setLoading(false);
        return;
      }

      const data = result.data;
      setNome(data.nome || data.nome_cupom || '');
      setValorPipokas(String(data.valorPipokas || data.valor_pipokas || ''));
      setUrlIcone(data.urlIcone || data.url_icone || '');
      setTipo(data.tipo || data.tipo_cupom || '');
      setValorBeneficios(String(data.valorBeneficios || data.valor_beneficio || ''));
      setTempoValidade(String(data.tempoValidade || data.validade_pos_resgate || ''));
      setObservacoes(data.observacoes || '');
      setLimitada(data.limitada || data.is_limitada || false);
      setTemporaria(data.temporaria || data.is_tempo_limitado || false);
      setQtdCupons(String(data.qtdCupons || data.quantidade_disponivel || ''));
      
      if (data.dataExpiracao || data.data_expiracao_resgate) {
        const dateField = data.dataExpiracao || data.data_expiracao_resgate;
        const date = dateField.toDate?.() || new Date(dateField);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        setDataExpiracao(`${day}/${month}/${year}`);
      }
    } catch (error) {
      console.error("Erro ao carregar cupom:", error);
      setStatusMessage('Erro ao carregar cupom.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    // 1. Verifica os campos que são SEMPRE obrigatórios (sem a URL)
    if (
      !nome.trim() ||
      !tipo.trim() ||
      !valorPipokas.trim() ||
      !valorBeneficios.trim() ||
      !tempoValidade.trim()
    ) {
      setStatusMessage('Preencha todos os campos obrigatórios.');
      return false;
    }

    // 2. Regra condicional da URL
    const tipoNormalizado = tipo.trim().toLowerCase();
    const exigeUrl = tipoNormalizado === 'dois por um' || tipoNormalizado === 'produto grátis';
    
    if (exigeUrl && !urlIcone.trim()) {
      setStatusMessage('O Ícone é obrigatório para cupons do tipo Dois por Um ou Produto Grátis.');
      return false;
    }

    if (temporaria && !dataExpiracao.trim()) {
      setStatusMessage('Informe a data de expiração quando a oferta for temporária.');
      return false;
    }

    if (Number.isNaN(Number(valorPipokas))) {
      setStatusMessage('Valor em Pipokas deve ser um número válido.');
      return false;
    }

    const isValidDateDMY = (s: string) => {
      const trimmed = s.trim();
      const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (!match) return false;
      const day = Number(match[1]);
      const month = Number(match[2]);
      const year = Number(match[3]);
      if (month < 1 || month > 12) return false;
      const maxDay = new Date(year, month, 0).getDate();
      if (day < 1 || day > maxDay) return false;
      return true;
    };

    if (temporaria && dataExpiracao && !isValidDateDMY(dataExpiracao)) {
      setStatusMessage('Data de Expiração inválida. Use o formato dd/mm/aaaa.');
      return false;
    }

    if (limitada) {
      if (!qtdCupons.trim()) {
        setStatusMessage('Informe a quantidade de cupons quando a oferta for limitada.');
        return false;
      }
      if (Number.isNaN(Number(qtdCupons)) || Number(qtdCupons) <= 0) {
        setStatusMessage('Quantidade de cupons deve ser um número maior que zero.');
        return false;
      }
    }

    return true;
  };

  const handleConfirmar = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setStatusMessage('');

    let expDateObj: Date | null = null;
    if (temporaria && dataExpiracao) {
      const [dStr, mStr, yStr] = dataExpiracao.trim().split('/');
      expDateObj = new Date(Number(yStr), Number(mStr) - 1, Number(dStr));
    }

    const couponData = {
      nome: nome.trim(),
      tipo: tipo.trim(),
      valorPipokas: Number(valorPipokas),
      valorBeneficios: valorBeneficios.trim(),
      urlIcone: urlIcone.trim(),
      tempoValidade: tempoValidade.trim(),
      limitada,
      temporaria,
      observacoes: observacoes.trim(),
      ...(temporaria && expDateObj ? { dataExpiracao: expDateObj } : {}),
      ...(limitada ? { quantidade_disponivel: Number(qtdCupons) } : {}),
    };

    try {
      if (isEditing && couponId) {
        const result = await updateCoupon(couponId as string, couponData);
        
        if (!result.valid) {
          setStatusMessage(result.error || 'Erro ao atualizar o cupom.');
          setLoading(false);
          return;
        }
        
        setStatusMessage('Cupom atualizado com sucesso!');
        
        setTimeout(() => {
          if (router.canGoBack()) router.back();
        }, 1500);
      } else {
        const result = await createCoupon(couponData);
        
        if (!result.valid) {
          setStatusMessage(result.error || 'Erro ao salvar o cupom.');
          setLoading(false);
          return;
        }

        setStatusMessage('Cupom criado com sucesso!');
        setNome('');
        setValorPipokas('');
        setUrlIcone('');
        setTipo('');
        setValorBeneficios('');
        setDataExpiracao('');
        setTempoValidade('');
        setObservacoes('');
        setLimitada(false);
        setTemporaria(false);
        setQtdCupons('');
        
        setTimeout(() => {
          if (router.canGoBack()) router.back();
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao salvar cupom:", error);
      setStatusMessage('Erro ao salvar o cupom. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={miscStyle.background}>
      <StatusBar barStyle="light-content" backgroundColor="#922B21" />

      {loading && isEditing ? (
        <View style={miscStyle.center}>
          <ActivityIndicator size="large" color="#FFFEB2" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={couponFormStyle.scrollContent}
        >
          <View style={couponFormStyle.headerContainer}>
            <Image
              source={require('../../assets/images/Logo.png')}
              style={couponFormStyle.logoImage}
            />
          </View>

          <View style={couponFormStyle.formContainer}>
            <Text style={[textStyle.outBoxMessage, couponFormStyle.titleText]}>
              {isEditing ? 'Editar Cupom' : 'Escreva as Informações do Cupom'}
            </Text>

            <View style={couponFormStyle.fullInput}>
              <LocalInput
                text="Nome"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={couponFormStyle.fullInput}>
              <LocalInput
                text="Valor em Pipokas"
                value={valorPipokas}
                onChangeText={setValorPipokas}
                keyboardType="numeric"
              />
            </View>

            <View style={[couponFormStyle.fullInput, { alignItems: "center", marginVertical: 15 }]}>
              <ButtonY 
                title={loadingImage ? "Fazendo Upload..." : urlIcone ? "Alterar Ícone do Cupom" : "Selecionar Ícone do Cupom"} 
                onPress={handlePickImage} 
              />
              {urlIcone ? (
                <Image
                  source={{ uri: urlIcone }}
                  style={{ width: 120, height: 120, borderRadius: 12, marginTop: 15 }}
                  resizeMode="contain"
                />
              ) : null}
            </View>

            <View style={couponFormStyle.dropdownWrapper}>
              <CouponTypeDropdown
                value={tipo}
                onSelect={setTipo}
              />
            </View>

            <View style={couponFormStyle.fullInput}>
              <LocalInput
                text="Valor dos benefícios"
                value={valorBeneficios}
                onChangeText={setValorBeneficios}
                keyboardType="numeric"
              />
            </View>

            <View style={couponFormStyle.fullInput}>
              <LocalInput
                text="Quantidade de cupons"
                value={qtdCupons}
                onChangeText={setQtdCupons}
                keyboardType="numeric"
                editable={limitada}
              />
            </View>

            <View style={couponFormStyle.row}>
              <View style={couponFormStyle.halfInput}>
                <LocalInput
                  text="Data Exp. (dd/mm/aaaa)"
                  value={dataExpiracao}
                  onChangeText={setDataExpiracao}
                  editable={temporaria}
                />
              </View>
              <View style={couponFormStyle.halfInput}>
                <LocalInput
                  text="Tempo de Validade"
                  value={tempoValidade}
                  onChangeText={setTempoValidade}
                />
              </View>
            </View>

            <View style={couponFormStyle.sliderRow}>
              <View style={couponFormStyle.sliderItem}>
                <Text style={couponFormStyle.sliderLabel}>Limitada</Text>
                <Switch
                  value={limitada}
                  onValueChange={(v) => {
                    setLimitada(v);
                    if (!v) setQtdCupons('');
                  }}
                  trackColor={{ false: "#555", true: COLORS.gold }}
                  thumbColor={limitada ? COLORS.primary : "#f4f3f4"}
                />
              </View>
              <View style={couponFormStyle.sliderItem}>
                <Text style={couponFormStyle.sliderLabel}>Temporária</Text>
                <Switch
                  value={temporaria}
                  onValueChange={(v) => {
                    setTemporaria(v);
                    if (!v) setDataExpiracao('');
                  }}
                  trackColor={{ false: "#555", true: COLORS.gold }}
                  thumbColor={temporaria ? COLORS.primary : "#f4f3f4"}
                />
              </View>
            </View>

            <View style={couponFormStyle.grayBoxContainer}>
              <Text style={couponFormStyle.grayBoxTitle}>Observações</Text>
              <View style={couponFormStyle.textAreaWrapper}>
                <TextInput
                  style={couponFormStyle.textAreaInput}
                  value={observacoes}
                  onChangeText={setObservacoes}
                  multiline
                  placeholder="Digite as observações..."
                  placeholderTextColor={placeholderColor}
                />
              </View>
            </View>

            {statusMessage ? (
              <Text style={couponFormStyle.errorText}>
                {statusMessage}
              </Text>
            ) : null}

            <ButtonY 
               title={loading ? 'Enviando...' : isEditing ? 'Atualizar' : 'Confirmar'} 
               onPress={handleConfirmar} 
            />

          </View>
        </ScrollView>
      )}

      <BottomNavbar />

      {/* Mantive o BackButton aqui no final garantindo que ele não seja bloqueado */}
      <BackButton 
        style={couponFormStyle.backButtonContainer}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/mycoupons"); 
          }
        }}
      />
    </View>
  );
}