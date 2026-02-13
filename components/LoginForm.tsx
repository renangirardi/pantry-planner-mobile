import React, { useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import { useAuth } from 'context/AuthContext';

import Input from './Input';
import Button from './Button/Button';

export default function LoginForm() {
  const { signIn, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields.',
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);

      Toast.show({
        type: 'success',
        text1: `Welcome ${user?.username || 'User'}!`,
        text2: 'Login successful.',
      });
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Invalid email or password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-6 flex-col gap-4">
      <Input
        id="email"
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none">
        Email Address
      </Input>

      <Input
        id="password"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        type="password">
        Password
      </Input>

      <View className="mt-2 flex-row items-center gap-2">
        <View className="flex-1">
          <Button variant="primary" onPress={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </View>
      </View>
    </View>
  );
}
