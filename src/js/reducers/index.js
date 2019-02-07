import {
    FETCH_DOCUMENTOS_REQUEST,
    FETCH_DOCUMENTOS_FAILURE,
    FETCH_DOCUMENTOS_SUCCESS,
    PRINT_DOCUMENTO_REQUEST,
    PRINT_DOCUMENTO_SUCCESS,
    PRINT_DOCUMENTO_FAILURE,
    FETCH_LOJAS_REQUEST,
    FETCH_LOJAS_SUCCESS,
    FETCH_LOJAS_FAILURE,
    FETCH_TABLOIDES_REQUEST,
    FETCH_TABLOIDES_SUCCESS,
    FETCH_TABLOIDES_FAILURE,
    FETCH_PAPEIS_REQUEST,
    FETCH_PAPEIS_SUCCESS,
    FETCH_PAPEIS_FAILURE,
    FETCH_TIPOS_REQUEST,
    FETCH_TIPOS_SUCCESS,
    FETCH_TIPOS_FAILURE,
    SIGNIN_REQUEST,
    SIGNIN_REQUEST_SUCCESS,
    SIGNIN_REQUEST_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    GET_LOJAS_REQUEST,
    GET_LOJAS_SUCCESS,
    GET_LOJAS_FAILURE,
    SIGNIN_REQUEST_DENIED,
    UNLOAD_DOCUMENTOS_REQUEST,
    UNLOAD_DOCUMENTOS_SUCCESS,
    UNLOAD_DOCUMENTOS_FAILURE
} from '../constants/action-types';

const initialState = {
    fetching: false,
    documentos: [],
    tabloides: [],
    papeis: [],
    hostEan: '',
    error: null,
    isAuthorized: undefined,
    isLogout: false,
    authData: undefined,
    denied: false,
    authData: null
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DOCUMENTOS_REQUEST:
            return { ...state, fetching: true, error: null };
        case FETCH_DOCUMENTOS_SUCCESS:
            return { ...state, fetching: false, documentos: action.documentos, error: null };
        case FETCH_DOCUMENTOS_FAILURE:
            return { ...state, fetching: false, error: action.error };

        case PRINT_DOCUMENTO_REQUEST:
            return { ...state };
        case PRINT_DOCUMENTO_SUCCESS:
            return { ...state, error: null };
        case PRINT_DOCUMENTO_FAILURE:
            return { ...state, error: action.error };

        case FETCH_LOJAS_REQUEST:
            return { ...state };
        case FETCH_LOJAS_SUCCESS:
            return { ...state, lojas: action.lojas };
        case FETCH_LOJAS_FAILURE:
            return { ...state, error: action.error };

        case FETCH_TIPOS_REQUEST:
            return { ...state };
        case FETCH_TIPOS_SUCCESS:
            return { ...state, tipos: action.tipos };
        case FETCH_TIPOS_FAILURE:
            return { ...state, error: action.error };

        case FETCH_TABLOIDES_REQUEST:
            return { ...state };
        case FETCH_TABLOIDES_SUCCESS:
            return { ...state, tabloides: action.tabloides };
        case FETCH_TABLOIDES_FAILURE:
            return { ...state, error: action.error };

        case FETCH_PAPEIS_REQUEST:
            return { ...state };
        case FETCH_PAPEIS_SUCCESS:
            return { ...state, papeis: action.papeis };
        case FETCH_PAPEIS_FAILURE:
            return { ...state, error: action.error };

        case SIGNIN_REQUEST:
            return { ...state, isAuthorized: undefined, denied: false, isLogout: false };
        case SIGNIN_REQUEST_SUCCESS:
            return { ...state, isAuthorized: true, denied: false, isLogout: false, authData: action.authData, lojas: action.lojas, error: null };
        case SIGNIN_REQUEST_DENIED:
            return { ...state, isAuthorized: false, denied: true, isLogout: false, aaa: Math.random() };
        case SIGNIN_REQUEST_FAILURE:
            return { ...state, isAuthorized: false, denied: false, isLogout: false, aaa: Math.random(), error: action.error };

        case LOGOUT_REQUEST:
            return { ...state, isAuthorized: undefined, isLogout: false };
        case LOGOUT_SUCCESS:
            return { ...state, isAuthorized: undefined, isLogout: true, authData: undefined, lojas: undefined, documentos: [] };
        case LOGOUT_FAILURE:
            return { ...state, error: action.error, isLogout: false, authData: undefined, lojas: undefined, documentos: [] };

        case GET_LOJAS_REQUEST:
            return { ...state };
        case GET_LOJAS_SUCCESS:
            return { ...state, lojas: action.lojas };
        case GET_LOJAS_FAILURE:
            return { ...state, error: action.error };

        case UNLOAD_DOCUMENTOS_REQUEST:
            return { ...state };
        case UNLOAD_DOCUMENTOS_SUCCESS:
            return { ...state, documentos: [], error: null };
        case UNLOAD_DOCUMENTOS_FAILURE:
            return { ...state, error: action.error };

        case 'STORE_AUTH_DATA':
            return { ...state, authData: action.authData };

        default:
            return state;
    }
}

export default rootReducer;