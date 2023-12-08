import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

const Login = () => {
    const [user, setUser] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const changeUser = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    const submit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8090/login", user)
            .then(res => {
                console.log(res.headers.authorization);
                dispatch({ type: "token", payload: res.headers.authorization });
                window.location.replace("/");
            })
            .catch(err => {
                console.log(err);
            })
    }
    function goToNaver() {
        window.location.href="http://localhost:8090/oauth2/authorization/naver"
    }
    return (
        <div className='main' style={{ overflow: "scroll", height: "932px", overflowX: "hidden", paddingTop: "110px", paddingLeft: "0px", paddingRight: "0px", paddingBottom: "0px" }}>
            <div style={{ paddingRight: "50px", paddingLeft: "50px", marginBottom: "108px" }}>
                <div style={{ width: "330px", textAlign: "left", paddingBottom: "20px" }}>
                    <a href="/"><FaArrowLeft size={30} color="darkgray" /></a>
                </div>
                <a className="logo" style={{ fontSize: "50px", fontWeight: "bold", color: "#14C38E", textDecoration: "none" }}>DEALicious</a>
                <br /><br />
                <FormGroup style={{ textAlign: "left" }}>
                    <Label for="email" style={{ fontSize: "20px" }}>이메일</Label>
                    <Input type="text" name="email" id="email" value={user.email} onInput={changeUser} style={{ height: "55px", width: "325px" }} />
                </FormGroup>
                <br />
                <FormGroup style={{ textAlign: "left" }}>
                    <Label for="password" style={{ fontSize: "20px" }}>비밀번호</Label>
                    <Input type="password" name="password" id="password" value={user.password} onInput={changeUser} style={{ height: "55px", width: "325px" }} />
                </FormGroup>
                <br />
                <Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#14C38E", borderStyle: "none", marginBottom: "10px" }} onClick={submit}>이메일로 로그인</Button>
                <a href="/join" style={{ color: "#999999", textDecoration: "none" }}>회원가입</a>
                <Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#FEE500", color: "#000000", borderStyle: "none", marginTop: "20px" }}>카카오로 시작</Button>
                <div style={{ height: "10px" }}></div>
                <Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#03C75A", borderStyle: "none" }} onClick={goToNaver}>
                    <a style={{color:"white", textDecoration:"none"}}>네이버로 시작</a>
                </Button>
            </div>
        </div>

    )
}

export default Login;