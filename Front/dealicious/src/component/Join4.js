import { Link, useLocation } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { CgClose } from "react-icons/cg";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Swal } from 'sweetalert2';
import { useWebSocket } from './WebSocketProvider';

const Join4 = () => {
    const { url } = useWebSocket();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [emailError, setEmailError] = useState('');
    const [telError, setTelError] = useState('');
    const [tel, setTel] = useState('');
    const location = useLocation(); // useLocation 훅 사용
    const type = location.state?.type; // join.js에서 전달받은 type
    const typename = location.state?.typename;
    const name = location.state?.name;
    const nickname = location.state?.nickname;
    const password = location.state?.password;
    const token = useSelector(state => state.persistedReducer.token);
    const [successEmail, setSuccessEmail] = useState(false);

    useEffect(() => {
        setEmailError('');
        setSuccessEmail(false);
    }, [email]);

    useEffect(() => {
        setTelError('');
    }, [tel]);

    const join = (e) => {
        e.preventDefault();

        // 이메일과 전화번호 유효성 검사
        if (!validateEmail(email)) {
            setEmailError("이메일 형식이 올바르지 않습니다");
            return; // 중단
        }

        if (!validatePhoneNumber(tel)) {
            setTelError("전화번호 형식이 올바르지 않습니다");
            return; // 중단
        }

        // 입력값이 유효하면 회원가입 요청
        const userData = {
            email: email,
            tel: tel,
            password: password,
            type: type,
            typename: typename,
            name: name,
            nickname: nickname
        };
        //headers로 토큰 넘긴 이유는 소셜로그인했을때 가입되면서 추가정보 등록 이어나가기 위해서.
        if (successEmail) {
            axios.post(url+"join", userData, {
                headers: {
                    Authorization: token,
                }
            })
                .then(res => {
                    console.log(res.data);
                    window.location.href = "/logout";
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            alert("이메일 인증을 해주세요")
        }
    }

    // 이메일 유효성 검사 함수
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (tel) => {
        // 13자리이고, 숫자와 '-'로 이루어져 있는지 확인
        const telRegex = /^\d{3}-\d{4}-\d{4}$/;
        return telRegex.test(tel);
    };

    const handleTelChange = (e) => {
        // 숫자만 남기고 나머지 문자 제거
        const numericValue = e.target.value.replace(/\D/g, '');

        // 세 번째와 일곱 번째 숫자 뒤에 하이픈 추가
        let formattedValue = '';
        for (let i = 0; i < numericValue.length; i++) {
            if (i === 3 || i === 7) {
                formattedValue += '-';
            }
            formattedValue += numericValue[i];
        }

        // 직접 setTel 함수 호출
        setTel(formattedValue);
    }

    const verificationEmail = () => {
        axios.post(url+"emails/verification-requests", { email: email })
            .then(res => {
                console.log(res.data);
                alert("인증번호를 발송했습니다.")
            })
            .catch(err => {
                console.log(err);
                alert("이미 가입된 이메일입니다. 다른 이메일로 인증받아주세요.")
            });
    }
    const verificationEmailCode = () => {
        axios.post(url+"emails/verifications", { email: email, code: code })
            .then(res => {
                console.log(res.data);
                console.log("되냐?")
                alert("인증되었습니다.")
                setSuccessEmail(true);
            })
            .catch(err => {
                console.log(err);
                alert("이메일 인증 오류.")
            });
    }

    return (
        <div className='main' style={{ overflow: "scroll", height: "742px", overflowX: "hidden", paddingTop: "65px", paddingRight: "50px", paddingLeft: "50px" }}>
            <div style={{ width: "330px", textAlign: "right" }}>
                <Link to={"/login"}><CgClose size={30} color="darkgray" /></Link>
            </div>
            <a style={{ fontSize: "30px", fontWeight: "bold", textAlign: "center", color: "#14C38E" }}>회원가입</a>
            <div style={{ paddingBottom: "30px" }}></div>
            <FormGroup style={{ textAlign: "left" }}>
                <Label for="email" style={{ fontSize: "20px" }}>이메일</Label>
                <div style={{ display: "flex" }}>
                    <Input type="email" name="email" id="email" style={{ height: "55px", width: "210px" }}
                        placeholder="형식에 맞게 입력하세요"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button style={{ backgroundColor: "#14C38E", color: "white", borderStyle: "none", fontSize: "16px", width: "100px" }} onClick={verificationEmail}>
                        인증받기
                    </Button>
                </div>
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: "10px", textAlign: "left" }}>{validateEmail ? emailError : ""}</div>
            </FormGroup>
            <FormGroup style={{ textAlign: "left", display: "flex" }}>
                <Input type="text" name="code" id="code" style={{ height: "55px", width: "210px" }}
                    placeholder="인증번호 6자리"
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button style={{ backgroundColor: "#14C38E", color: "white", borderStyle: "none", fontSize: "16px", width: "100px" }} onClick={verificationEmailCode}>
                    인증하기
                </Button>
            </FormGroup>
            <FormGroup style={{ textAlign: "left", paddingBottom: "78px" }}>
                <Label for="tel" style={{ fontSize: "20px" }}>전화번호<a style={{ fontSize: "12px", marginLeft: "10px" }}>'-'는 필수입니다</a></Label>
                <Input
                    type="text"
                    name="tel"
                    id="tel"
                    style={{ height: "55px", width: "325px" }}
                    placeholder="010-XXXX-XXXX"
                    onChange={handleTelChange}
                    value={tel}
                    inputMode="numeric"  // 숫자만 입력 가능하도록 설정
                />
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: "10px", textAlign: "left" }}>{validatePhoneNumber ? telError : ""}</div>
            </FormGroup>
            <Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#14C38E", borderStyle: "none" }} onClick={join}>가입하기</Button>
        </div>
    );
}

export default Join4;
