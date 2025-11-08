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
import { useTheme } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';

export default function RegisterScreen({ navigation }: any) {
  const { colors } = useTheme();

  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser   = useAuthStore((s) => s.setUser);

  const [username, setUsername] = useState(''); 
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [first, setFirst]       = useState('');
  const [last, setLast]         = useState('');
  const [loading, setLoading]   = useState(false);

  async function onRegister() {
    if (!email || !password) {
      Alert.alert('Atenção', 'Informe e-mail e senha.');
      return;
    }

    // Se não preencher username, uso a parte antes do @ como padrão
    const finalUsername = username?.trim() || (email.includes('@') ? email.split('@')[0] : email);

    try {
      setLoading(true);

      // 1) Cria a conta
      await api.post(endpoints.auth.register, {
        username: finalUsername,
        email,
        password,
        first_name: first || '',
        last_name: last || '',
      });

      // 2) Faz login automático (caso o /register não retorne tokens)
      const { data: tokens } = await api.post(endpoints.auth.login, { email, password });
      setTokens(tokens.access, tokens.refresh);

      // 3) Busca /me para preencher o store
      try {
        const { data: me } = await api.get(endpoints.auth.me);
        setUser(me);
      } catch {
        setUser({ email, username: finalUsername, first_name: first, last_name: last });
      }

      Alert.alert('Sucesso', 'Conta criada!');
      // Volta ou navega para sua home, dependendo do seu fluxo:
      // navigation.replace('MainTabs'); // se tiver tabs
      navigation.goBack(); // volta para a tela de login
    } catch (e: any) {
      // Tenta exibir mensagem de validação do backend, se houver
      const backendMsg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === 'string' ? e.response.data : null);

      Alert.alert('Erro ao registrar', backendMsg || 'Não foi possível registrar.');
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
            Criar conta
          </Text>

          <Text style={{ color: colors.text, marginBottom: 6 }}>Username</Text>
          <TextInput
            placeholder="Seu usuário (ex: joaosilva)"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
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

          <Text style={{ color: colors.text, marginBottom: 6 }}>Nome</Text>
          <TextInput
            placeholder="Seu nome"
            value={first}
            onChangeText={setFirst}
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

          <Text style={{ color: colors.text, marginBottom: 6 }}>Sobrenome</Text>
          <TextInput
            placeholder="Seu sobrenome"
            value={last}
            onChangeText={setLast}
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
            placeholder="••••••••"
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

          <Button title={loading ? 'Registrando...' : 'Registrar'} onPress={onRegister} color={colors.primary} disabled={loading} />
        </View>

        <Text
          onPress={() => navigation.goBack()}
          style={{
            textAlign: 'center',
            marginTop: 12,
            color: colors.primary,
          }}
        >
          Já tem conta? Entrar
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
