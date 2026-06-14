import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StatusBar,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { miscStyle } from '@/styles/misc';
import { textStyle } from '@/styles/text';
import { logoStyle } from '@/styles/logo';
import { componentStyle } from '@/styles/component';
import { COLORS } from '@/constants/colors';
import { FormInput } from '@/components/CouponFormInput';
import { CouponFormSlider } from '@/components/CouponFormSlider';
import { CouponTypeDropdown } from '@/components/CouponTypeDropdown';
import BottomNavbar from '@/components/Navbar';
import { DateInput } from '@/components/DateInput';
import { createCoupon, getCoupon, updateCoupon } from '@/services/couponService';
import { couponFormStyle } from '@/styles/couponForm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackButton } from '@/components/BackButton';
import { ButtonY } from '@/components/ButtonY';

export default function CouponFormScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
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
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (isEditing && couponId) {
      loadCouponData();
    }
  }, [couponId]);

  const loadCouponData = async () => {
    try {
      const result = await getCoupon(couponId as string);
      
      if (!result.valid || !result.data) {
        setStatusType('error');
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
      setStatusType('error');
      setStatusMessage('Erro ao carregar cupom.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (
      !nome.trim() ||
      !tipo.trim() ||
      !valorPipokas.trim() ||
      !valorBeneficios.trim() ||
      !urlIcone.trim() ||
      !tempoValidade.trim()
    ) {
      setStatusType('error');
      setStatusMessage('Preencha todos os campos obrigatórios.');
      return false;
    }

    if (temporaria && !dataExpiracao.trim()) {
      setStatusType('error');
      setStatusMessage('Informe a data de expiração quando a oferta for temporária.');
      return false;
    }

    if (Number.isNaN(Number(valorPipokas))) {
      setStatusType('error');
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
      setStatusType('error');
      setStatusMessage('Data de Expiração inválida. Use o formato dd/mm/aaaa.');
      return false;
    }

    if (limitada) {
      if (!qtdCupons.trim()) {
        setStatusType('error');
        setStatusMessage('Informe a quantidade de cupons quando a oferta for limitada.');
        return false;
      }
      if (Number.isNaN(Number(qtdCupons)) || Number(qtdCupons) <= 0) {
        setStatusType('error');
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
      ...(limitada ? { qtdCupons: Number(qtdCupons) } : {}),
    };

    try {
      if (isEditing && couponId) {
        const result = await updateCoupon(couponId as string, couponData);
        
        if (!result.valid) {
          setStatusType('error');
          setStatusMessage(result.error || 'Erro ao atualizar o cupom.');
          setLoading(false);
          return;
        }
        
        setStatusType('success');
        setStatusMessage('Cupom atualizado com sucesso!');
        
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        const result = await createCoupon(couponData);
        
        if (!result.valid) {
          setStatusType('error');
          setStatusMessage(result.error || 'Erro ao salvar o cupom.');
          setLoading(false);
          return;
        }

        setStatusType('success');
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
          router.back();
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao salvar cupom:", error);
      setStatusType('error');
      setStatusMessage('Erro ao salvar o cupom. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={miscStyle.background}>
      <StatusBar barStyle="light-content" backgroundColor="#922B21" />

      <BackButton 
        style={couponFormStyle.backButtonContainer}
        onPress={() => router.back()}
      />

      {loading && isEditing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FFFEB2" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={couponFormStyle.scrollContent}
        >
          <View style={[miscStyle.center, { marginTop: height * 0.05 }]}>
            <Image
              source={require('../../assets/images/Logo.png')}
              style={logoStyle.escudo}
              resizeMode="contain"
            />
          </View>

          <View style={couponFormStyle.formContainer}>
            <Text style={[textStyle.outBoxMessage, couponFormStyle.titleText]}>
              {isEditing ? 'Editar Cupom' : 'Escreva as Informações do Cupom'}
            </Text>

            <View style={couponFormStyle.fullInput}>
              <FormInput
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={couponFormStyle.row}>
              <View style={couponFormStyle.halfInput}>
                <FormInput
                  placeholder="Valor em Pipokas"
                  value={valorPipokas}
                  onChangeText={setValorPipokas}
                  keyboardType="numeric"
                />
              </View>
              <View style={couponFormStyle.halfInput}>
                <FormInput
                  placeholder="URL do Ícone"
                  value={urlIcone}
                  onChangeText={setUrlIcone}
                  keyboardType="url"
                />
              </View>
            </View>

            <View style={couponFormStyle.fullInput}>
              <CouponTypeDropdown
                value={tipo}
                onSelect={setTipo}
              />
            </View>

            <View style={couponFormStyle.fullInput}>
              <FormInput
                placeholder="Valor dos benefícios"
                value={valorBeneficios}
                onChangeText={setValorBeneficios}
                keyboardType="numeric"
              />
            </View>

            <View style={couponFormStyle.fullInput}>
              <FormInput
                placeholder="Quantidade de cupons"
                value={qtdCupons}
                onChangeText={setQtdCupons}
                keyboardType="numeric"
                disabled={!limitada}
              />
            </View>

            <View style={couponFormStyle.row}>
              <View style={couponFormStyle.halfInput}>
                <DateInput
                  placeholder="Data Exp. (dd/mm/aaaa)"
                  value={dataExpiracao}
                  onChangeText={setDataExpiracao}
                  disabled={!temporaria}
                />
              </View>
              <View style={couponFormStyle.halfInput}>
                <FormInput
                  placeholder="Tempo de Validade"
                  value={tempoValidade}
                  onChangeText={setTempoValidade}
                />
              </View>
            </View>

            <View style={couponFormStyle.row}>
              <View style={couponFormStyle.halfInput}>
                <CouponFormSlider
                  label="Limitada"
                  active={limitada}
                  onToggle={() => {
                    setLimitada((v) => {
                      const next = !v;
                      if (!next) {
                        setQtdCupons('');
                      }
                      return next;
                    });
                  }}
                />
              </View>
              <View style={couponFormStyle.halfInput}>
                <CouponFormSlider
                  label="Temporária"
                  active={temporaria}
                  onToggle={() => {
                    setTemporaria((v) => {
                      const next = !v;
                      if (!next) {
                        setDataExpiracao('');
                      }
                      return next;
                    });
                  }}
                />
              </View>
            </View>

            <View style={couponFormStyle.grayBoxContainer}>
              <Text style={couponFormStyle.grayBoxTitle}>Observações</Text>
              <View style={[componentStyle.inputContainer, { width: "100%", height: 100, borderRadius: 10 }]}>
                <TextInput
                  style={[componentStyle.inputText, { flex: 1, textAlignVertical: 'top', padding: 10, fontFamily: "Poppins-Regular" } as any]}
                  value={observacoes}
                  onChangeText={setObservacoes}
                  multiline
                  placeholder="Digite as observações..."
                  placeholderTextColor="#A9A9A9"
                />
              </View>
            </View>

            {statusMessage ? (
              <Text style={[couponFormStyle.errorText, { color: statusType === 'success' ? '#B5E48C' : COLORS.gold }]}>
                {statusMessage}
              </Text>
            ) : null}

            <View style={{ marginTop: height * 0.03, width: '100%', alignItems: 'center' }}>
              <ButtonY 
                 title={loading ? 'Enviando...' : isEditing ? 'Atualizar' : 'Confirmar'} 
                 onPress={handleConfirmar} 
              />
            </View>

          </View>
        </ScrollView>
      )}

      <BottomNavbar />
    </View>
  );
}
