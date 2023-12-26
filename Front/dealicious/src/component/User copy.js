import axios from 'axios';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
const User = () => {
    const [user, setUser] = useState({id:'', email:'', username:'', roles:''})
    const token = useSelector(state=>state.persistedReducer.token);
    console.log("token:"+token);
    useEffect(()=> {
        axios.get("${url}/user",{
            headers : {
                Authorization : token,
            }
        })
        .then(res=> {            
            console.log(res)
            setUser(res.data);
        })
        .catch(err=> {
            console.log(err)
        })
    }, [])

    return(
        <>
        <h2>회원정보</h2>
        <table border="1">
        <tbody>
            <tr>
                <td><label>id</label></td>
                <td><label name="id">{user.id}</label></td>
            </tr>
            <tr>
                <td><label>username</label></td>
                <td><label name="username">{user.username}</label></td>
            </tr>
            <tr>
                <td><label>email</label></td>
                <td><label name="email">{user.email}</label></td>
            </tr>
            <tr>
                <td><label>roles</label></td>
                <td><label name="roles">{user.roles}</label></td>
            </tr>
            </tbody>
        </table>        
        </>
    )
}

export default User;