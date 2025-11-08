import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import api from '../api/axios';
import { endpoints } from '../api/endpoints';
import { AlertItem } from '../types/AlertItem';
import { CreateAlertInput } from '../types/dto/CreateAlertInput';

export const useAlerts = () =>
  useQuery<AlertItem[]>({
    queryKey: ['alerts'],
    queryFn: async () => (await api.get(endpoints.alerts.list)).data,
  });

export const useCreateAlert = () => {
  const qc = useQueryClient();
  return useMutation<AlertItem, any, CreateAlertInput>({
    mutationFn: (payload) => api.post(endpoints.alerts.create, payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alerts'] });
      Alert.alert('Tudo certo', 'Alerta criado com sucesso ✅');
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Não foi possível criar o alerta.';
      console.warn('create alert error:', err?.response?.data || err?.message);
      Alert.alert('Erro', msg);
    },
  });
};

export const useRemoveAlert = () => {
  const qc = useQueryClient();
  return useMutation<void, any, number | string>({
    mutationFn: (id) => api.delete(endpoints.alerts.remove(String(id))).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Não foi possível remover o alerta.';
      console.warn('remove alert error:', err?.response?.data || err?.message);
      Alert.alert('Erro', msg);
    },
  });
};
