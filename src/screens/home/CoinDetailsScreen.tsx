import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import { useCoinDetails } from '../../hooks/useCoinDetails';
import { useCoinChart } from '../../hooks/useCoinChart';
import Chart from '../../components/Chart';
import { useCreateAlert } from '../../hooks/useAlerts';
import { useAddHolding } from '../../hooks/usePortfolio';

function formatYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CoinDetailsScreen() {
  const { colors } = useTheme();
  const { params }: any = useRoute();
  const { coinId } = params;

  const [range, setRange] = useState<'7' | '30' | '90' | '365' | 'max'>('7');
  // modal portfólio
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('1');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(formatYMD(new Date()));
  const [error, setError] = useState('');

  // e modal alerta
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTarget, setAlertTarget] = useState(''); // target_price_usd
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [alertError, setAlertError] = useState('');

  const { data: details, isLoading } = useCoinDetails(coinId);
  const { data: chart } = useCoinChart(coinId, range);
  const createAlert = useCreateAlert();
  const addHolding = useAddHolding();

  if (isLoading || !details) {
    return <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />;
  }

  const creating = createAlert.isPending;

  const handleConfirmAdd = () => {
    const amountNum = Number(amount.replace(',', '.'));
    const priceNum = Number(price.replace(',', '.'));

    if (!amountNum || amountNum <= 0) return setError('Informe uma quantidade válida (> 0).');
    if (!priceNum || priceNum <= 0) return setError('Informe um preço válido (> 0).');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return setError('Data no formato YYYY-MM-DD.');

    setError('');
    addHolding.mutate(
      {
        coin_id: details.id,
        amount: amountNum,
        purchase_price_usd: priceNum,
        purchase_date: date,
      },
      {
        onSuccess: () => {
          setShowModal(false);
          Alert.alert('Portfólio', `${details.name} adicionada com sucesso!`);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            'Não foi possível adicionar ao portfólio.';
          Alert.alert('Erro', msg);
        },
      }
    );
  };

  const handleOpenAlertModal = () => {
    setAlertError('');
    setAlertTarget(details.current_price.toFixed(2)); // default: preço atual
    setAlertCondition('above'); // default
    setShowAlertModal(true);
  };

  const handleConfirmCreateAlert = () => {
    const target = Number(alertTarget.replace(',', '.'));
    if (!target || target <= 0) {
      return setAlertError('Informe um preço alvo válido (> 0).');
    }
    setAlertError('');

    createAlert.mutate(
      {
        coin_id: details.id,
        coin_name: details.name,
        coin_symbol: details.symbol,
        condition: alertCondition,
        target_price_usd: target,
      },
      {
        onSuccess: () => {
          setShowAlertModal(false);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            'Não foi possível criar o alerta.';
          Alert.alert('Erro', msg);
        },
      }
    );
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: 16 }}>
      {/* Nome e preço da moeda */}
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>
        {details.name}{' '}
        <Text style={{ color: colors.text, opacity: 0.6 }}>({details.symbol.toUpperCase()})</Text>
      </Text>

      <Text style={{ fontSize: 16, marginVertical: 8, color: colors.text }}>
        ${details.current_price.toLocaleString()}
      </Text>

      {/* Gráfico */}
      {chart?.prices && (
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 10 }}>
          <Chart data={chart.prices} />
        </View>
      )}

      {/* Botões de range */}
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8, flexWrap: 'wrap' }}>
        {(['7', '30', '90', '365', 'max'] as const).map((d) => (
          <View
            key={d}
            style={{
              flex: 1,
              minWidth: 60,
              marginVertical: 4,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: colors.card,
            }}
          >
            <Button title={d.toUpperCase()} onPress={() => setRange(d)} color={colors.primary} />
          </View>
        ))}
      </View>

      {/* Botões principais */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        {/* Abrir modal de portfólio */}
        <View style={{ flex: 1 }}>
          <Button
            title={addHolding.isPending ? 'Adicionando...' : 'Adicionar ao portfólio'}
            onPress={() => {
              setPrice(details.current_price.toString());
              setShowModal(true);
            }}
            color={colors.primary}
            disabled={addHolding.isPending}
          />
        </View>

        {/* Abrir modal de alerta */}
        <View style={{ flex: 1, opacity: creating ? 0.8 : 1 }}>
          <Button
            title={creating ? 'Criando...' : 'Criar alerta'}
            onPress={handleOpenAlertModal}
            color={colors.primary}
            disabled={creating}
          />
        </View>
      </View>

      {/* ---------- Modal: Adicionar ao Portfólio ---------- */}
      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              padding: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 40, height: 4, backgroundColor: '#999', borderRadius: 2 }} />
            </View>

            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
              Adicionar {details.name} ao portfólio
            </Text>

            <Text style={{ color: colors.text, marginTop: 12 }}>Quantidade</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="Ex.: 1.5"
              placeholderTextColor={colors.text + '80'}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 10,
                color: colors.text,
                marginTop: 6,
              }}
            />

            <Text style={{ color: colors.text, marginTop: 12 }}>Preço de compra (USD)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              placeholder="Ex.: 65000.00"
              placeholderTextColor={colors.text + '80'}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 10,
                color: colors.text,
                marginTop: 6,
              }}
            />

            <Text style={{ color: colors.text, marginTop: 12 }}>Data (YYYY-MM-DD)</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              keyboardType="numbers-and-punctuation"
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.text + '80'}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 10,
                color: colors.text,
                marginTop: 6,
                marginBottom: 8,
              }}
            />

            {!!error && <Text style={{ color: '#ff5a5f', marginBottom: 8 }}>{error}</Text>}

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Button
                  title="Cancelar"
                  onPress={() => setShowModal(false)}
                  color={Platform.OS === 'ios' ? '#999' : undefined}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Adicionar" onPress={handleConfirmAdd} />
              </View>
            </View>

            <TouchableOpacity onPress={() => setShowModal(false)} style={{ alignSelf: 'center', marginTop: 12 }}>
              <Text style={{ color: colors.primary }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ---------- Modal: Criar Alerta ---------- */}
      <Modal visible={showAlertModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              padding: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 40, height: 4, backgroundColor: '#999', borderRadius: 2 }} />
            </View>

            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
              Criar alerta — {details.name}
            </Text>

            <Text style={{ color: colors.text, marginTop: 12 }}>Condição</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <View style={{ flex: 1 }}>
                <Button
                  title={`Acima (above)`}
                  onPress={() => setAlertCondition('above')}
                  color={alertCondition === 'above' ? colors.primary : undefined}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={`Abaixo (below)`}
                  onPress={() => setAlertCondition('below')}
                  color={alertCondition === 'below' ? colors.primary : undefined}
                />
              </View>
            </View>

            <Text style={{ color: colors.text, marginTop: 12 }}>Preço alvo (USD)</Text>
            <TextInput
              value={alertTarget}
              onChangeText={setAlertTarget}
              keyboardType="decimal-pad"
              placeholder="Ex.: 65000.00"
              placeholderTextColor={colors.text + '80'}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 10,
                color: colors.text,
                marginTop: 6,
                marginBottom: 8,
              }}
            />

            {!!alertError && <Text style={{ color: '#ff5a5f', marginBottom: 8 }}>{alertError}</Text>}

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Button
                  title="Cancelar"
                  onPress={() => setShowAlertModal(false)}
                  color={Platform.OS === 'ios' ? '#999' : undefined}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={creating ? 'Criando...' : 'Criar alerta'}
                  onPress={handleConfirmCreateAlert}
                  disabled={creating}
                />
              </View>
            </View>

            <TouchableOpacity onPress={() => setShowAlertModal(false)} style={{ alignSelf: 'center', marginTop: 12 }}>
              <Text style={{ color: colors.primary }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {!!details.description && (
        <Text style={{ marginTop: 16, color: colors.text, opacity: 0.7, lineHeight: 20 }}>
          {details.description}
        </Text>
      )}
    </ScrollView>
  );
}
