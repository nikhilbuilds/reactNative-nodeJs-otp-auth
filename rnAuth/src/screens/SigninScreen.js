import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import { Context as AuthContext } from '../Context/AuthContext';

  const SignInScreen = ({ navigation, route }) => {
  const { state, signin, verifyOTP, resendOTP, trylocalSignin } = useContext(AuthContext);
  
 
  var [phone, setPhone] = useState('');
  const [OTP, setOTP] = useState('');
  
  if(route.params){
    var phone = route.params.phone
  }
  
  useEffect(() => {
    trylocalSignin()
    console.log('working');
    
}, [])


  
  return (
    <View style={styles.container}>
       
      <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        autoCapitalize="none"
        autoCorrect={false}

      />
       {state.phoneStatus && ( 
      <Input
        label="OTP"
        value={OTP}
        onChangeText={setOTP}
        autoCapitalize="none"
        autoCorrect={false}
      />
      )}
       

      {state.errorMessage ? <Text style={styles.errorMessages}>{state.errorMessage}</Text> : null}
      
       
        {state.phoneStatus ?   <Button title="Sign In" onPress={() => verifyOTP({ phone, OTP })}  style={styles.signbtn}/>:<Button title="Send OTP" onPress={() => signin({ phone })} style={styles.signbtn}/>}  
       
        
       
      <View style={{flexDirection:"row", justifyContent:'space-between'}}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkbtn}>
            <Text style={styles.linkText}>Sign Up?</Text>
          </TouchableOpacity>

          {state.phoneStatus && (
          <TouchableOpacity onPress={() => resendOTP({phone})} style={styles.linkbtn}>
            <Text style={styles.linkText}>Resend OTP</Text>
          </TouchableOpacity>
          )}


          

        </View>
    </View>
  );
};

SignInScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin:20
  },
  errorMessages:{
    color: 'red',
    marginBottom: 15
  },
  linkbtn:{
    paddingTop: 20
},
linkText:{
    fontSize: 20
}
});

export default SignInScreen;
