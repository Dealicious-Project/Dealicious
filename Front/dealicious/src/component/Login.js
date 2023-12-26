import { Button, FormGroup, Input, Label } from "reactstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

const Login = () => {
    const [user, setUser] = useState({ email: '', password: '' });
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setpasswordError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage_p, setErrorMessage_p] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const changeUser = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setEmailError(false);
        setErrorMessage('');
        setpasswordError(false); // 이메일이 변경되면 비밀번호 에러도 초기화
        setErrorMessage_p('');
        setError(''); // 이메일이 변경되면 일반 에러 메시지도 초기화
    }

    const submit = (e) => {
        e.preventDefault();

        if (!user.email || user.email.trim() === "") {
            setEmailError(true);
            setErrorMessage('이메일을 입력해주세요.');
            return;
        }

        if (!user.password || user.password.trim() === "") {
            setpasswordError(true);
            setErrorMessage_p('비밀번호를 입력해주세요.');
            return;
        }

        axios.post("$url/login", user)
            .then(res => {
                console.log(res.headers.authorization);
                dispatch({ type: "token", payload: res.headers.authorization });
                axios.get("${url}/user", {
                    headers: {
                        Authorization: res.headers.authorization,
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

            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 401) {
                        // 인증 실패: 아이디 또는 비밀번호가 잘못 입력됨
                        setError('아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.');
                    }
                }
            });
    }

    function goToNaver() {
        window.location.href = "${url}/oauth2/authorization/naver"
    }

    function goToKakao() {
        window.location.href = "${url}/oauth2/authorization/kakao"
    }

    return (
        <div className='main' style={{ overflow: "scroll", height: "932px", overflowX: "hidden", paddingTop: "110px", paddingLeft: "0px", paddingRight: "0px", paddingBottom: "0px" }}>
            <div style={{ paddingRight: "50px", paddingLeft: "50px", marginBottom: "108px" }}>
                <div style={{ width: "330px", textAlign: "left", paddingBottom: "20px" }}>
                    <a href="/"><FaArrowLeft size={30} color="darkgray" /></a>
                </div>
                <a className="logo" style={{ fontSize: "50px", fontWeight: "bold", color: "#14C38E", textDecoration: "none" }}>DEALicious</a>
                <br /><br />
                <FormGroup style={{ textAlign: "left", marginBottom: "20px" }}>
                    <Label for="email" style={{ fontSize: "20px" }}>이메일</Label>
                    <Input type="text" name="email" id="email" value={user.email} onInput={changeUser} style={{ height: "55px", width: "325px" }} />
                    {emailError && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errorMessage}</div>}
                </FormGroup>
                <FormGroup style={{ textAlign: "left" }}>
                    <Label for="password" style={{ fontSize: "20px" }}>비밀번호</Label>
                    <Input type="password" name="password" id="password" value={user.password} onInput={changeUser} style={{ height: "55px", width: "325px" }} />
                    {passwordError && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errorMessage_p}</div>}

                </FormGroup>
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', textAlign: 'left' }}>{error}</div>
                <br />
                <Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#14C38E", borderStyle: "none", marginBottom: "10px" }} onClick={submit}>이메일로 로그인</Button>
                <a href="/join" style={{ color: "#999999", textDecoration: "none" }}>회원가입</a>
                <Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#FEE500", color: "#000000", borderStyle: "none", marginTop: "20px" }} onClick={goToKakao}>카카오로 시작</Button>
                <div style={{ height: "10px" }}></div>
                <Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#03C75A", borderStyle: "none" }} onClick={goToNaver}>
                    <a style={{ color: "white", textDecoration: "none" }}>네이버로 시작</a>
                </Button>
            </div>
        </div>
    )
}

export default Login;
