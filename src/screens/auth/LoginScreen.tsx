import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import api from '../../api/axios';
import { endpoints } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';
import { useTheme, useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser   = useAuthStore((s) => s.setUser);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  async function onLogin() {
    if (!email || !password) {
      Alert.alert('Atenção', 'Informe e-mail e senha.');
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post(endpoints.auth.login, { email, password });
      setTokens(data.access, data.refresh);

      try {
        const { data: userData } = await api.get(endpoints.auth.me);
        setUser(userData);
      } catch {
        // fallback mínimo se /me não existir ou falhar
        setUser({ email });
      }
    } catch (e: any) {
      const status = e?.response?.status;
      Alert.alert('Erro', status === 401 ? 'Credenciais inválidas' : 'Falha ao conectar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: colors.background }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 12 }}>
            Entrar
          </Text>

          <Text style={{ color: colors.text, marginBottom: 6 }}>Email</Text>
          <TextInput
            placeholder="seu@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={colors.text + '80'}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.background,
              color: colors.text,
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
            }}
          />

          <Text style={{ color: colors.text, marginBottom: 6 }}>Senha</Text>
          <TextInput
            placeholder="********"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={colors.text + '80'}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.background,
              color: colors.text,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          />

          <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={onLogin} color={colors.primary} disabled={loading} />
        </View>

        <Text
          onPress={() => navigation.navigate('Register')}
          style={{ textAlign: 'center', marginTop: 12, color: colors.primary }}
        >
          Criar conta
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
