import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useWebSocket } from './WebSocketProvider';

const Oauth2 = () => {
    const { url } = useWebSocket();
    const dispatch = useDispatch();    
    const {token} = useParams();
  
    useEffect(()=> {
        console.log("token:"+token);
        dispatch({type:"token", payload:token})
        axios.get(url+"user", {
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