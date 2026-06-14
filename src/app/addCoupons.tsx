import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { miscStyle } from '@/styles/misc';
import { couponFormStyle as S } from '@/styles/couponForm';
import { FormInput } from '@/components/CouponFormInput';
import { CouponFormSlider } from '@/components/CouponFormSlider';
import { CouponTypeDropdown } from '@/components/CouponTypeDropdown';
import BottomNavbar from '@/components/Navbar';
import { DateInput } from '@/components/DateInput';
import { createCoupon } from '@/services/couponService';

const { height } = Dimensions.get('window');

export default function CouponFormScreen() {
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
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  const validateForm = () => {
    if (
      !nome.trim() ||
      !tipo.trim() ||
      !valorPipokas.trim() ||
      !valorBeneficios.trim() ||
      !urlIcone.trim() ||
      !dataExpiracao.trim() ||
      !tempoValidade.trim()
    ) {
      setStatusType('error');
      setStatusMessage('Preencha todos os campos obrigatórios.');
      return false;
    }

    if (Number.isNaN(Number(valorPipokas))) {
      setStatusType('error');
      setStatusMessage('Valor em Pipokas deve ser um número válido.');
      return false;
    }

    // validação da data no formato dd/mm/aaaa
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

    if (!isValidDateDMY(dataExpiracao)) {
      setStatusType('error');
      setStatusMessage('Data de Expiração inválida. Use o formato dd/mm/aaaa.');
      return false;
    }

    return true;
  };

  const handleConfirmar = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setStatusMessage('');

    // converter dataExpiracao dd/mm/aaaa para Date (para armazenar como Timestamp no Firestore)
    const [dStr, mStr, yStr] = dataExpiracao.trim().split('/');
    const expDateObj = new Date(Number(yStr), Number(mStr) - 1, Number(dStr));

    const couponData = {
      nome: nome.trim(),
      tipo: tipo.trim(),
      valorPipokas: Number(valorPipokas),
      valorBeneficios: valorBeneficios.trim(),
      urlIcone: urlIcone.trim(),
      // passamos um objeto Date — Firestore vai armazenar como Timestamp
      dataExpiracao: expDateObj,
      tempoValidade: tempoValidade.trim(),
      limitada,
      temporaria,
      observacoes: observacoes.trim(),
    };

    const result = await createCoupon(couponData);
    setLoading(false);

    if (!result.valid) {
      setStatusType('error');
      setStatusMessage(result.error || 'Erro ao salvar o cupom.');
      return;
    }

    setStatusType('success');
    setStatusMessage('Cupom enviado com sucesso!');
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
  };

  return (
    <SafeAreaView style={miscStyle.background} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#922B21" />

      {/* Header: mesmo padrão da commentsModeration */}
      <View style={S.headerContainer}>
        <TouchableOpacity style={S.backButton}>
          <Text style={S.backEmoji}>←</Text>
        </TouchableOpacity>
        {/* SUBSTITUIR: use caminho relativo para o arquivo de imagem */}
        <Image
          source={require('../../assets/images/Logo.png')}
          style={S.logoImage}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={S.scrollContentInner}
      >
        <Text style={S.pageTitle}>Escreva as Informações do Cupom</Text>

        <View style={S.formContainer}>

          {/* Nome — full width */}
          <FormInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />

          {/* Valor em Pipokas + URL do Ícone — metade cada */}
          <View style={S.inputRow}>
            <FormInput
              placeholder="Valor em Pipokas"
              value={valorPipokas}
              onChangeText={setValorPipokas}
              keyboardType="numeric"
              style={S.inputHalf}
            />
            <FormInput
              placeholder="URL do Ícone"
              value={urlIcone}
              onChangeText={setUrlIcone}
              keyboardType="url"
              style={S.inputHalf}
            />
          </View>

          {/* Tipo — full width */}
          <CouponTypeDropdown
            value={tipo}
            onSelect={setTipo}
          />

          {/* Valor dos benefícios — full width */}
          <FormInput
            placeholder="Valor dos benefícios"
            value={valorBeneficios}
            onChangeText={setValorBeneficios}
            keyboardType="numeric"
          />

          {/* Data de Expiração + Tempo de Validade — metade cada */}
          <View style={S.inputRow}>
            <DateInput
              placeholder="Data de Expiração (dd/mm/aaaa)"
              value={dataExpiracao}
              onChangeText={setDataExpiracao}
              style={S.inputHalf}
            />
            <FormInput
              placeholder="Tempo de Validade"
              value={tempoValidade}
              onChangeText={setTempoValidade}
              style={S.inputHalf}
            />
          </View>

          {/* Checkboxes — Limitada e Temporária lado a lado */}
          <View style={S.sliderRow}>
            <CouponFormSlider
              label="Limitada"
              active={limitada}
              onToggle={() => setLimitada((v) => !v)}
            />
            <CouponFormSlider
              label="Temporária"
              active={temporaria}
              onToggle={() => setTemporaria((v) => !v)}
            />
          </View>

          {/* Observações — textarea com header cinza */}
          <View style={S.textAreaWrapper}>
            <View style={S.textAreaHeader}>
              <Text style={S.textAreaHeaderText}>Observações</Text>
            </View>
            <TextInput
              style={S.textAreaInput}
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
              placeholder=""
              placeholderTextColor="#AAAAAA"
            />
          </View>

        </View>

        {/* Botão Confirmar */}
        <TouchableOpacity style={S.confirmButton} onPress={handleConfirmar} activeOpacity={0.85}>
          <Text style={S.confirmButtonText}>{loading ? 'Enviando...' : 'Confirmar'}</Text>
        </TouchableOpacity>

        {statusMessage ? (
          <Text
            style={{
              color: statusType === 'success' ? '#B5E48C' : '#FFB4A2',
              textAlign: 'center',
              marginTop: 10,
              marginHorizontal: 40,
              fontSize: 14,
              fontFamily: 'Poppins-SemiBold',
            }}
          >
            {statusMessage}
          </Text>
        ) : null}

        <View style={{ height: height * 0.05 }} />
      </ScrollView>

      <BottomNavbar />
    </SafeAreaView>
  );
}