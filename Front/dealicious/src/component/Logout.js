import {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {persistor} from '../App';
import axios from "axios";
import { useWebSocket } from './WebSocketProvider';

const Logout = () => {
    const { url } = useWebSocket();
    const dispatch = useDispatch();
    const token = useSelector(state => state.persistedReducer.token);

    useEffect(()=> {
        axios.get(url+"logout1", {
                    headers: {
                        Authorization: token,
                    }
                })
                    .then(res => {
                        console.log(res);
                        dispatch({type:"token", payload:''})
                        dispatch({type:"user", payload:''})
                        persistor.purge();
                        window.location.href="/mypagenl";
                    })
                    .catch(err => {
                        console.log(err)
                        dispatch({type:"token", payload:''})
                        dispatch({type:"user", payload:''})
                        persistor.purge();
                        window.location.href="/mypagenl";
                    })

    }, [])
}

export default Logout;