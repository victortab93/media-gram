import { React, useState } from 'react'
import { Image, ScrollView,View, Text, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'
import { createUser , getCurrentUser} from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
const SignUp = () => {
  const {setUser, setIsLoggedIn} =useGlobalContext();
  const [form, setForm] = useState({
    username:'',
    email:'',
    password:''
  })
  const [issubmitting, setIssubmitting] = useState(false)

  const onSubmit = async () => {
    if(!form.username || !form.email || !form.password){
      Alert.alert('Error', 'Please fill data for sign up');
    }
    setIssubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);

      // set it to global state
      setUser(result);
      setIsLoggedIn(true);
      /*
      getCurrentUser()
            .then((res) => {
               if(res) {
                setIsLoggedIn(true);                
                setUser(res);
               } else{
                setIsLoggedIn(false);
                setUser(null);
               }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });*/
      router.replace('/home')
    } catch(e) {
      Alert.alert('Error', e.message);
    } finally {
      setIssubmitting(false);
    }

    
  }

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
            Sign up to Aora
          </Text>
          <FormField
          title ="Username"
          value={form.username}
          handleChangeText={(e) =>
            setForm({
              ...form,
              username: e
            })
          }
          otherStyles="mt-10"
          />
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
          title = "Sign up"
          handlePress={onSubmit}
          containerStyles='mt-7'
          isLoading={issubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>

            <Link href='/sign-in' className='text-lg font-semibold text-secondary'>
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp