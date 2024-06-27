import { React, useState } from 'react'
import { Image, ScrollView,View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { Alert } from 'react-native'
import { SignInApp, getCurrentUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
const SignIn = () => {
  const {setUser, setIsLoggedIn} =useGlobalContext();
  const [form, setForm] = useState({
    email:'',
    password:''
  })

  const onSubmit = async () => {
    if(!form.email || !form.password){
      Alert.alert('Error', 'Please fill data for sign in');
    }
    setIssubmitting(true);

    try {
      const session = await SignInApp(form.email, form.password);
      // set it to global state
      //setUser(session);
      //setIsLoggedIn(true);
      const currentUser = await getCurrentUser();

      if(currentUser){
        setIsLoggedIn(true);
        setUser(currentUser);
      }
      
      router.replace('/home')
    } catch(e) {
      Alert.alert('Error', e.message);
    } finally {
      setIssubmitting(false);
    }

    
  }


  const [issubmitting, setIssubmitting] = useState(false)
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full
        justify-center min-h-[85vh]
        px-4 my-6">
          <Image
          source={images.logo}
          resizeMode='contain'
          className='w-[115px]  
          h-[35px]'
          />
          <Text className="text-2xl
          text-white text-semibold
          mt-10 font-psemibold">
            Log in to Aora
          </Text>
          <FormField
          title ="Email"
          value={form.email}
          handleChangeText={(e) =>
            setForm({
              ...form,
              email: e
            })
          }
          otherStyles="mt-7"
          keyboardType="email-address"
          />
          <FormField
          title ="Password"
          value={form.password}
          handleChangeText={(e) =>
            setForm({
              ...form,
              password: e
            })
          }
          otherStyles="mt-7"
          />

          <CustomButton 
          title = "Log in"
          handlePress={onSubmit}
          containerStyles='mt-7'
          isLoading={issubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Dont have an account?
            </Text>

            <Link href='/sign-up' className='text-lg font-semibold text-secondary'>
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn