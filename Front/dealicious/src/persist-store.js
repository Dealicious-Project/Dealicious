import {configureStore} from "@reduxjs/toolkit";
import {persistReducer,PERSIST, PURGE} from "redux-persist";
import storage from "redux-persist/lib/storage";  //localStorage에 저장
//import storageSession from "redux-persist/lib/storage/session";  //sessionStorage에 저장
//왜? redux의 storage 페이지를 새로고침하면 state가 사라짐
//npm install --save @reduxjs/toolkit
//npm install --save redux-persist

export const initialState = {
    token:'',
    user:{id:'', email:'', username:'', roles:''},
}

const reducer = (currentState,action) => {
    if(currentState===undefined) {
        return initialState;
    }
    const newState = {...currentState};
    switch(action.type) {
        case "token":  newState.token=action.payload; break;
        case "user": newState.user=action.payload; break;
        default: 
    }
    return newState;
}

const persistConfig = {
    key:'root',
    storage,
    //whiteList: ["id","name","name","email","address"],
}

const persistedReducer = persistReducer(persistConfig, reducer);
//const store = configureStore({reducer:persistedReducer})
const store = configureStore({reducer:{persistedReducer},
    middleware:(getDefaultMiddleware)=> 
        getDefaultMiddleware({
            serializableCheck:false,
        })
    });

export default store;