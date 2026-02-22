import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  children?: React.ReactNode;
  id: string;
  name?: string;
  type?: 'text' | 'password' | 'email' | 'numeric';
  onChangeText?: (text: string) => void;
  required?: boolean;
}

export default function Input({
  children,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChangeText,
  required,
  ...rest
}: InputProps) {
  const isPassword = type === 'password';
  const keyboardType =
    type === 'email' ? 'email-address' : type === 'numeric' ? 'numeric' : 'default';

  return (
    <View className="mb-4 flex flex-col gap-1">
      {children && (
        <Text className="mb-1 text-left text-sm font-medium text-zinc-300">{children}</Text>
      )}

      <TextInput
        id={id}
        placeholder={placeholder}
        placeholderTextColor="#a1a1aa"
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 focus:border-zinc-500"
        value={value}
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        secureTextEntry={isPassword}
        keyboardType={keyboardType}
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        {...rest}
      />
    </View>
  );
}
