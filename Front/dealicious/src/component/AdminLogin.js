import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";
import Swal from "sweetalert2/src/sweetalert2";
import { useWebSocket } from './WebSocketProvider';

const AdminLogin = () => {
    const [adminid, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { receivedata, resetData,url } = useWebSocket();

    const submit = (e) => {
        e.preventDefault();
        axios.post(url+`login`,{email:adminid,password:password})
        .then(res=> {
            console.log(res.headers.authorization);
            dispatch({ type: "token", payload: res.headers.authorization });
            axios.get(url+"adminlogin", {
                    headers: {
                        Authorization: res.headers.authorization,
                    }
                })
                    .then(res => {
                        console.log(res.data)
                        dispatch({ type: "admin", payload: res.data });
                        window.location.replace("/adminmain");
                    })
                    .catch(err => {
                        console.log(err)
                    })
        })
        .catch(err=> {
            console.log(err);
            //Swal.fire(err.response.data);
        })

    }
    return (
        <div className='main' style={{ overflow: "scroll", height: "832px", overflowX: "hidden", paddingTop: "130px", paddingRight: "50px", paddingLeft: "50px" }}>
            <div style={{ display: "flex", textAlign:"center", marginLeft:"20px" }} className="logo">
                <div style={{fontSize:"50px"}}>
                    DEALicious
                </div>
                <div style={{ color: "black", fontWeight: "bold", marginLeft: "-40px", fontSize: "32px", marginTop:"-5px" }}>
                    admin
                </div>
            </div>
            {/* <a className="logo" style={{ fontSize: "50px", fontWeight: "bold", color: "#14C38E", textDecoration: "none" }}>DEALicious</a> */}
            <br /><br />
            <FormGroup style={{ textAlign: "left" }}>
                <Label for="id" style={{ fontSize: "20px" }}>아이디</Label>
                <Input type="text" name="id" id="id" style={{ height: "55px", width: "325px" }} 
                onChange={(e)=>setAdminId(e.target.value)} value={adminid}/>
            </FormGroup>
            <br />
            <FormGroup style={{ textAlign: "left" }}>
                <Label for="password" style={{ fontSize: "20px" }}>비밀번호</Label>
                <Input type="password" name="password" id="password" style={{ height: "55px", width: "325px" }} 
                onChange={(e)=>setPassword(e.target.value)} value={password}/>
            </FormGroup>
            <br />
            <a href="/adminmain"><Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#14C38E", borderStyle: "none", marginBottom: "10px" }} onClick={submit}>관리자 로그인</Button></a>
            <Link to="/adminjoin" style={{ color: "#999999", textDecoration: "none" }}>회원가입</Link>
        </div>
    )
}

export default AdminLogin;