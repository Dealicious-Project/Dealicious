import {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {persistor} from '../App';
import axios from "axios";
const Logout = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.persistedReducer.token);

    useEffect(()=> {
        axios.get("http://43.203.108.152:8090/logout1", {
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
                    })

    }, [])
}

export default Logout;