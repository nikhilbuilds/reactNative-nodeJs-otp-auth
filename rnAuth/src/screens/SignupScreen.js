import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView,ScrollView } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import { Context as AuthContext } from '../Context/AuthContext';

const SignUpScreen = ({ navigation }) => {
    const { state, signup } = useContext(AuthContext);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

  
    console.log(state);
    
    return (
    <KeyboardAvoidingView style={styles.container} >
        <ScrollView>
            <Input
                label="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
            />    


            <Input
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                autoCapitalize="none"
                autoCorrect={false}
            />

                {state.errorMessage ? <Text style={styles.errorMessages}>{state.errorMessage}</Text> : null}

            <Button title="Sign Up" onPress={() => signup({ phone, email, name })} />

            
            
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn',{phone})} style={styles.linkbtn}>
                    <Text style={styles.linkText}>Sign In?</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
    
    );
};

SignUpScreen.navigationOptions = () => {
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

export default SignUpScreen;
