import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/auth/authSlice';
import nestingRedcer from "./feature/nestingPortal/nestingSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    nesting:nestingRedcer
  },
});

// ✅ Export these types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { useDispatch } from 'react-redux';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/Stack';

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();