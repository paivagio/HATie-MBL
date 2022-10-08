import axios from 'axios';
import { useSelector } from '../hooks';
import { useNavigation } from '@react-navigation/native';
import store, { StoreState } from '../store/store';

const instance = axios.create({
    baseURL: 'http://192.168.1.11:4000/'
});

const getAuthorizationToken = () => {
    const current = store.getState();
    return current.auth.token;
}

const redirectErrorHandling = (error) => {
    // const navigation = useNavigation();
    //   navigation.navigate("errors"{
    //     status: error.response ? error.response.status : '',
    //     message: error.response ? error.response.statusText : '' + error,
    //   });
};

instance.interceptors.request.use((config) => {
    const token = getAuthorizationToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}
);

instance.interceptors.response.use(
    (response) => response,
    (error) => { throw error }
    // if (axios.isAxiosError(error)) {
    //     console.log('error message: ', error.message);
    // } else {
    //     console.log('unexpected error: ', error);
    // }
);

export default instance;