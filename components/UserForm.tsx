import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { createUser, editUser } from '../services/user-service';
import { User } from '../interfaces/User';

import Input from './Input';
import Button from './Button';
import RadioButtons from './RadioButtons';

interface UserFormProps {
  isEditing?: boolean;
  initialData?: User;
}

export default function UserForm({ isEditing = false, initialData }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profile: 'student',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        email: initialData.email || '',
        password: '',
        confirmPassword: '',
        profile: initialData.profile || 'student',
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.email) {
      Toast.show({ type: 'error', text1: 'Validation', text2: 'Username and Email are required.' });
      return;
    }

    if (isEditing) {
      if (formData.password && formData.password !== formData.confirmPassword) {
        Toast.show({ type: 'error', text1: 'Mismatch', text2: 'Passwords do not match.' });
        return;
      }
    } else {
      if (!formData.password) {
        Toast.show({
          type: 'error',
          text1: 'Validation',
          text2: 'Password is required for new users.',
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Toast.show({ type: 'error', text1: 'Mismatch', text2: 'Passwords do not match.' });
        return;
      }
    }

    setLoading(true);
    try {
      if (isEditing && initialData?.id) {
        const payload: any = {
          username: formData.username,
          email: formData.email,
          profile: formData.profile,
        };
        if (formData.password) {
          payload.password = formData.password;
        }

        await editUser(initialData.id, payload);

        router.replace({
          pathname: '/manage-users',
          params: { status: 'user-updated' },
        });
      } else {
        await createUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          profile: formData.profile,
        });

        router.replace({
          pathname: '/manage-users',
          params: { status: 'user-created' },
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Operation failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Input
        id="username"
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => handleChange('username', text)}
        autoCapitalize="none">
        Username
      </Input>

      <Input
        id="email"
        placeholder="Email Address"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none">
        Email Address
      </Input>

      <View className="my-2 border-t border-zinc-800 pt-2">
        <Text className="mb-2 text-xs italic text-zinc-500">
          {isEditing ? 'Leave blank to keep current password' : 'Set a password for the new user'}
        </Text>

        <Input
          id="password"
          placeholder={isEditing ? 'New Password (Optional)' : 'Password'}
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry>
          {isEditing ? 'Change Password' : 'Password'}
        </Input>

        {(!isEditing || formData.password.length > 0) && (
          <Input
            id="confirm-password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            secureTextEntry>
            Confirm Password
          </Input>
        )}
      </View>

      <RadioButtons
        label="Profile"
        options={['Student', 'Teacher', 'Admin']}
        selected={formData.profile}
        onChange={(val) => handleChange('profile', val)}
      />

      <View className="mt-4 flex-row gap-4">
        <View className="flex-1">
          <Button variant="primary" onPress={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update User' : 'Register User'}
          </Button>
        </View>
        <View className="flex-1">
          <Button variant="secondary" onPress={() => router.back()} disabled={loading}>
            Cancel
          </Button>
        </View>
      </View>
    </View>
  );
}
