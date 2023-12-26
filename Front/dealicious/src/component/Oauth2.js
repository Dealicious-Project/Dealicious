import {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router';
import {useDispatch} from 'react-redux';
import axios from 'axios';

const Oauth2 = () => {
    const dispatch = useDispatch();    
    const {token} = useParams();

    useEffect(()=> {
        console.log("token:"+token);
        dispatch({type:"token", payload:token})
        axios.get("http://43.203.108.152:8090/user", {
                    headers: {
                        Authorization: token,
                    }
                })
                    .then(res => {
                        console.log(res)
                        dispatch({ type: "user", payload: res.data });
                        window.location.replace("/");
                    })
                    .catch(err => {
                        console.log(err)
                    })
    }, [])
}

export default Oauth2;