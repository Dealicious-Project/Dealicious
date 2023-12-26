import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";

const AdminJoin = () => {
    const [adminid, setAdminId] = useState('');
    const [admincode, setAdmincode] = useState('');
    const [password, setPassword] = useState('');
    const [admincodeError, setAdmincodeError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [idError, setIdError] = useState('');
    const [isAdminidAvailable, setIsAdminidAvailable] = useState(false);
    const token = useSelector(state => state.persistedReducer.token);
    const handleAdmincodeChange = (e) => {
        const value = e.target.value;
        setAdmincode(value);

        // Check if admin code is not 10 characters
        if (value.length !== 10) {
            setAdmincodeError('관리자코드는 10자입니다');
        } else {
            setAdmincodeError('');
        }
    };
    const handleIdCheck = () => {
        axios.get(`${url}/adminidcheck/` + adminid)
            .then(res => {
                console.log(res.data);
                setIsAdminidAvailable(res.data);
                if (res.data) {
                    setIsAdminidAvailable(true)
                    setIdError('사용 가능한 아이디입니다');
                } else {
                    setIsAdminidAvailable(false)
                    setIdError('이미 사용 중인 아이디입니다');
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(e.target.value);
        if (value.length < 8) {
            setPasswordError('비밀번호는 8자리 이상이어야 합니다');
        } else {
            setPasswordError('');
        }
    };

    const adminidInput = (e) => {
        setAdminId(e.target.value)
        setIsAdminidAvailable(false)
    }

    const join = (e) => {
        e.preventDefault();

        if (isAdminidAvailable && password.length >= 8 && admincode.length == 10) {
            // 입력값이 유효하면 회원가입 요청
            const userData = {
                adminid: adminid,
                admincode: admincode,
                password: password
            };
            axios.post(`${url}/adminjoin`, userData, {
                headers: {
                    Authorization: token,
                }
            })
                .then(res => {
                    console.log(res.data);
                    console.log(adminid);
                    console.log(admincode);
                    console.log(password);
                    window.location.href = "/adminlogin";
                })
                .catch(err => {
                    console.error("Error response from server:", err.response);
                });
        } else if (!isAdminidAvailable) {
            console.log("에휴");
            setIdError("중복확인 버튼을 눌러주세요");
        }
    }

    return (
        <div className='main' style={{ overflow: "scroll", height: "832px", overflowX: "hidden", paddingTop: "130px", paddingRight: "50px", paddingLeft: "50px" }}>
            <div style={{ display: "flex", width: "325px", textAlign: "center" }} className="main">
                <div style={{ fontSize: "30px", fontWeight: "bold", textAlign: "center", color: "#14C38E", marginLeft: "88px" }}>
                    회원가입
                </div>
                <div className="logo" style={{ color: "black", fontWeight: "bold", marginLeft: "-21px", fontSize: "17px", marginTop: "-10px" }}>
                    admin
                </div>
            </div>
            <FormGroup style={{ textAlign: "left", paddingBottom: "20px" }}>
                <Label for="id" style={{ fontSize: "20px" }}>아이디</Label>
                <div style={{ display: "flex" }}>
                    <Input type="text" name="id" id="id" style={{ height: "55px", width: "225px" }}
                        onChange={adminidInput}
                        value={adminid}
                        placeholder="사용할 아이디를 입력해주세요" />
                    <Button style={{
                        width: "90px", fontSize: "17px",
                        backgroundColor: "#14C38E", borderStyle: "none", height: "55px", marginLeft: "10px"
                    }} onClick={handleIdCheck}>중복확인</Button>
                </div>
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: "10px", textAlign: "left" }}>{idError}</div>
            </FormGroup>
            <FormGroup style={{ textAlign: "left", paddingBottom: "10px" }}>
                <Label for="admincode" style={{ fontSize: "20px" }}>관리자코드</Label>
                <Input
                    type="text"
                    name="admincode"
                    id="admincode"
                    style={{ height: "55px", width: "325px" }}
                    placeholder="유효한 관리자코드를 입력해주세요"
                    value={admincode}
                    onChange={handleAdmincodeChange}
                />
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: "10px", textAlign: "left" }}>{admincodeError}</div>
            </FormGroup>
            <FormGroup style={{ textAlign: "left" }}>
                <Label for="password" style={{ fontSize: "20px" }}>비밀번호</Label>
                <Input
                    type="password"
                    name="password"
                    id="password"
                    style={{ height: "55px", width: "325px" }}
                    placeholder="8자리 이상 입력하세요"
                    onChange={handlePasswordChange}
                />
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: "10px", textAlign: "left" }}>{passwordError}</div>
            </FormGroup>
            <Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#14C38E", borderStyle: "none" }} onClick={join}>가입하기</Button>
        </div>
    )
}

export default AdminJoin;