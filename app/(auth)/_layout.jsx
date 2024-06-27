import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Redirect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {useGlobalContext} from '../../context/GlobalProvider'
const AuthLayout = () => {
  const { loading, isLoggedIn } = useGlobalContext();

  if (!loading && isLoggedIn) return <Redirect href="/home" />;
  return (
    <>
      <Stack>
        <Stack.Screen
          name='sign-in'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='sign-up'
          options={{
            headerShown: false
          }}
        />
        <StatusBar
        backgroundColor='#161622'
        style='light'
        />
      </Stack>
    </>
  )
}

export default AuthLayout