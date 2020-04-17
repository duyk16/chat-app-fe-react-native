import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackActionHelpers } from '@react-navigation/routers/lib/typescript/src/StackRouter';

const Auth = () => {
  const navigation: StackActionHelpers<any> = useNavigation<any>();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Conversation');
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Authenticating...</Text>
      <ActivityIndicator size="large" style={styles.indicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    marginVertical: 15,
  },
});

export default Auth;
