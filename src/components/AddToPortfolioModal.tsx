import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Button, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';

type Props = {
  visible: boolean;
  coinName: string;
  defaultPrice: number;
  onClose: () => void;
  onConfirm: (payload: { amount: number; purchase_price_usd: number; purchase_date: string }) => void;
};

function formatYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function AddToPortfolioModal({ visible, coinName, defaultPrice, onClose, onConfirm }: Props) {
  const { colors } = useTheme();
  const [amount, setAmount] = useState<string>('1');
  const [price, setPrice] = useState<string>(String(defaultPrice));
  const [date, setDate] = useState<string>(formatYMD(new Date()));
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (visible) {
      setAmount('1');
      setPrice(String(defaultPrice));
      setDate(formatYMD(new Date()));
      setError('');
    }
  }, [visible, defaultPrice]);

  const confirm = () => {
    const amountNum = Number(amount.replace(',', '.'));
    const priceNum = Number(price.replace(',', '.'));

    if (!amountNum || amountNum <= 0) return setError('Informe uma quantidade válida (> 0).');
    if (!priceNum || priceNum <= 0) return setError('Informe um preço válido (> 0).');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return setError('Data no formato YYYY-MM-DD.');

    setError('');
    onConfirm({ amount: amountNum, purchase_price_usd: priceNum, purchase_date: date });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <View style={{ backgroundColor: colors.card, padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <View style={{ width: 40, height: 4, backgroundColor: '#999', borderRadius: 2 }} />
          </View>

          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
            Adicionar {coinName} ao portfólio
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
              <Button title="Cancelar" onPress={onClose} color={Platform.OS === 'ios' ? '#999' : undefined} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Adicionar" onPress={confirm} />
            </View>
          </View>

          <TouchableOpacity onPress={onClose} style={{ alignSelf: 'center', marginTop: 12 }}>
            <Text style={{ color: colors.primary }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
