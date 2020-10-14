import createDataContext from './createDataContext';
import authApiLink from '../api/authApi';
import AsyncStorage from '@react-native-community/async-storage';

const userReducer = (state, action) => {
    switch(action.type){
        case 'user_detials':
            return {...state, userData: action.payload}
        default:
            return state
    }
}

const userBasicDetails = dispatch => {

    return async() => {
        try{
            //get token
            const userToken = await AsyncStorage.getItem('token') 

            await authApiLink.get('/user', {
                headers: {
                    'Test-Header': 'test-value',
                    'x-auth-token':userToken
                  }
            }).then((response) => {
                console.log(response.data);
                dispatch({type:'user_detials', payload:response.data})
                
            })
        }catch(err){
            console.log(err.message);
            
        }
    }
}

export const {Provider, Context} = createDataContext(
    userReducer,
    {userBasicDetails},
    {userData: []}
)