import createDataContext from './createDataContext';
import authApiLink from '../api/authApi';
import AsyncStorage from '@react-native-community/async-storage';
import {navigate} from '../navigationRef'

const authReducer = (state, action) => {
  switch (action.type) {

    case 'add_error':
      return {...state, errorMessage:action.payload}

    case 'sign_in':
      return {errorMessage:'', phoneStatus: action.payload}

    case 'sign_up':
      return {...state, errorMessage:action.payload, phoneStatus:true}

    case 'add_token':
      return {errorMessage:'',  token:action.payload}
    
    case 'signout':
      return {token:null, phoneStatus:false, errorMessage:''}


    default:
      return state;
  }
};

const signup = dispatch => {
 

  return async ({ phone, name, email  }) => {
  
    try {
        const input_number = parseInt(phone)        

        authApiLink.post('/auth/register', {
        phone: input_number,
        name,
        email

      })
      .then(function (response) {
        console.log(response.data);
        
        dispatch({ type: 'sign_up', payload: response.data.message, status:200  })
        navigate('SignIn',{phone})
      })
      .catch(function (error) {
        dispatch({ type: 'sign_up', payload: error.response.request._response  })
      });
      
    } catch (err) {
      console.log(err.message);
    }
  };
};

const signin = dispatch => {

 
    return async ({ phone }) => {
      
        try {
          const input_number = parseInt(phone)
            
        authApiLink.post('/auth/login', {
            phone: input_number,
          })
          .then(function (response) {
            console.log(response.data);
            dispatch({ type: 'sign_in', payload: true })
          })
          .catch(function (error) {
            console.log( error.response.request._response ) 

           //dispatch({ type: 'add_error', payload:response.request._response.errors })
          });

          
        } catch (err) {
          console.log(err.message);
        }
      };
  
};

const resendOTP = dispatch => {
 
  return async ({ phone }) => {
    
      try {
        const input_number = parseInt(phone)
       
          
      authApiLink.post('/auth/resend_otp', {
          phone: input_number,
        })
        .then(function (response) {
          console.log(response.data);
          dispatch({ type: 'sign_in', payload: true })
          
          
        })
        .catch(function (error) {
          console.log( error.response.request._response ) 
          dispatch({ type: 'add_error', payload: error.response.request._response })
        });

        
      } catch (err) {
        console.log(err.message);
      }
    };

};

const verifyOTP = dispatch => {
    return async ({phone, OTP}) => {

            const input_number = parseInt(phone)
            const input_otp = parseInt(OTP)

            console.log({'authContext_phone': {phone}});
            

        try{
            authApiLink.post('/auth/verify', {
                phone: input_number,
                otp:input_otp
            })
            .then(async(response) => {
                console.log(response.data);
                await AsyncStorage.setItem('token', response.data.token)
                
                dispatch({ type: 'add_token', payload: response.data.token })
                navigate('Index')
        
            })
            .catch((error) => {
                console.log( error  )
                dispatch({ type: 'add_error', payload: error.response.request._response })
            })
        }catch(err){
            console.log(error.message);
            
        }
    }
}


const trylocalSignin = dispatch => {
    return async() => {
      try{
        //get token
        const userToken = await AsyncStorage.getItem('token')
    
        //if token is available
        if(userToken){
          console.log('token available');
          dispatch({ type: 'add_token', phoneStatus:true, payload: userToken, load: false })
          navigate('Index')
        }
          else{
            dispatch({ type: 'add_token', phoneStatus:false, load: false })
            navigate('SignIn')
          }

      
      }catch(err){
        console.log(error.message);
      }
    }
}


const signout = dispatch => {
  return async() => {
    await AsyncStorage.removeItem('token')
    dispatch({type: 'signout'})
  };
};

const test = dispatch => {
  return async() => {
    try{
      navigate('SignUp')
    }catch(err){
      console.log(err);
      
    }

    
  }
}






export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, verifyOTP, resendOTP, trylocalSignin, test },
  { token: null, errorMessage: '', phoneStatus:false, load: true}
);
