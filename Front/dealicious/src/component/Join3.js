import axios from "axios";
import { useState } from "react";
import { CgClose } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";

const Join3 = () => {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
    const location = useLocation(); // useLocation 훅 사용
    const type = location.state?.type; // join.js에서 전달받은 type
    const typename = location.state?.typename;
    const navigate = useNavigate();

    const handleNicknameCheck = () => {
        console.log(nickname);
        axios.get(`${url}/nicknamecheck/` + nickname)
            .then(res => {
                console.log(res.data);
                setIsNicknameAvailable(res.data);
                if (res.data) {
                    setNicknameError('사용 가능한 닉네임입니다');
                } else {
                    setNicknameError('이미 사용 중인 닉네임입니다');
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 입력값이 변경될 때 해당 에러 메시지를 초기화
        if (name === 'name') {
            // 이름에 한글 외의 문자가 있는지 확인
            const hasNonKorean = /[^\uAC00-\uD7A3xfe0-9a-zA-Z\s]/.test(value);
            if (hasNonKorean) {
                setErrorMessage("한글 이외의 문자는 사용할 수 없습니다");
            } else {
                setErrorMessage('');
            }
        } else if (name === 'nickname') {
            setNicknameError('');
        } else if (name === 'password') {
            setPasswordError('');
        }

        // 입력값 업데이트
        if (name === 'name') {
            setName(value);
        } else if (name === 'nickname') {
            setNickname(value);
            setIsNicknameAvailable(false);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleClick = () => {
        if (!name) {
            setErrorMessage("빈 칸 없이 입력해주세요");
        } else if (nickname.length < 2 || !isNicknameAvailable) {
            setNicknameError("닉네임을 확인해주세요");
        } else if (password.length < 8) {
            setPasswordError("8자 이상 입력해주세요");
        } else {
            if (isNicknameAvailable) {
                navigate('/join4', { state: { type: type, typename: typename, name, nickname, password } });
            }
        }
    };

    return (
        <div className='main' style={{ overflow: "scroll", height: "832px", overflowX: "hidden", paddingTop: "130px", paddingRight: "50px", paddingLeft: "50px" }}>
            <div style={{ width: "330px", textAlign: "right", paddingBottom: "20px" }}>
                <Link to={"/login"}><CgClose size={30} color="darkgray" /></Link>
            </div>
            <a style={{ fontSize: "30px", fontWeight: "bold", textAlign: "center", color: "#14C38E" }}>회원가입</a>
            <div style={{ paddingBottom: "30px" }}></div>
            <FormGroup style={{ textAlign: "left", paddingBottom: "20px" }}>
                <Label for="name" style={{ fontSize: "20px" }}>이름</Label>
                <Input type="name" name="name" id="name" style={{ height: "55px", width: "325px" }}
                    placeholder="이름(실명을 입력하세요)"
                    onChange={handleChange}
                    value={name}
                />
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: "10px", textAlign: "left" }}>{errorMessage}</div>
            </FormGroup>
            <FormGroup style={{ textAlign: "left", paddingBottom: "20px" }}>
                <Label for="nickname" style={{ fontSize: "20px" }}>닉네임</Label>
                <div style={{ display: "flex" }}>
                    <Input type="text" name="nickname" id="nickname" style={{ height: "55px", width: "220px" }}
                        placeholder="2글자 이상 입력하세요"
                        onChange={handleChange}
                        value={nickname}
                    />&nbsp;&nbsp;
                    <Button style={{
                        width: "100px", fontSize: "17px",
                        backgroundColor: "#14C38E", borderStyle: "none", height: "55px"
                    }} onClick={handleNicknameCheck}>중복확인</Button>
                </div>
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: "10px", textAlign: "left" }}>{nicknameError}</div>
            </FormGroup>
            <FormGroup style={{ textAlign: "left", paddingBottom: "20px" }}>
                <Label for="password" style={{ fontSize: "20px" }}>비밀번호</Label>
                <Input type="password" name="password" id="password" style={{ height: "55px", width: "325px" }}
                    placeholder="8자리 이상 입력하세요"
                    onChange={handleChange}
                    value={password}
                />
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: "10px", textAlign: "left" }}>{password.length < 8 ? passwordError : ""}</div>
            </FormGroup>
            <Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#14C38E", borderStyle: "none" }}
                onClick={handleClick}>다음(3/4)</Button>
        </div>
    )
}

export default Join3;
