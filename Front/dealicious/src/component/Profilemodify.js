import { Button, FormGroup, Input, Label } from "reactstrap";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useWebSocket } from './WebSocketProvider';

const Profilemodify = () => {
    const { url } = useWebSocket();
    const [nicknameMessage, setNicknameMessage] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
    const navigate = useNavigate();
    const Image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    const [files, setFiles] = useState(null);
    const [selected, setSelected] = useState();
    const dispatch = useDispatch();
    const [previewImage, setPreviewImage] = useState(Image);
    const [user, setUser] = useState({ name: '', email: '', nickname: '', typename: '', tel: '', accountid: '' })
    const temp = useSelector(state => state.persistedReducer.user);
    useEffect(() => {
        setUser(temp);
    }, [])

    const selectbank = (e) => {
        console.log(e.target.value);
        setSelected(e.target.value);
    }
    const handleModifyClick = () => {
        const formData = new FormData();
        formData.append("file", files);
        formData.append("nickname", user.nickname);
        formData.append("accountid", user.accountid);
        formData.append("accountbank", user.accountbank);
        formData.append("email", user.email);
        console.log("1")
        if (isNicknameAvailable) {
            console.log("2")
            axios.put(url+"profilemodify", formData)
                .then(res => {
                    console.log(res);
                    dispatch({ type: "user", payload: res.data });
                    navigate("/profiledetail");
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            console.log("에휴");
            setNicknameMessage("중복확인 버튼을 눌러주세요");
        }
    };
    const nicknameInput = (e) => {
        setUser({ ...user, nickname: e.target.value })
        setIsNicknameAvailable(false)
    }
    const handleNicknameCheck = () => {
        if (user.nickname === temp.nickname) {
            setIsNicknameAvailable(true);
            setNicknameMessage("현재 사용 중인 닉네임입니다");
            return;
        }

        axios.get(url+"nicknamecheck/" + user.nickname)
            .then(res => {
                console.log(res.data);
                setIsNicknameAvailable(res.data);
                if (res.data) {
                    setNicknameMessage("사용가능한 닉네임입니다");
                } else {
                    setNicknameMessage("사용중인 닉네임입니다");
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    useEffect(() => {
        if (temp.profileimgurl) {
            setPreviewImage(url+`img/${temp.profileimgurl}`);
        } else {
            setPreviewImage(Image);
        }
    }, [temp.profileimgurl]);
    const fileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFiles(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", paddingTop: "50px", paddingLeft: "50px", paddingRight: "50px" }}>
            <FormGroup style={{ textAlign: "left", paddingBottom: "10px" }}>
                <Link to="/profiledetail"><IoArrowBackOutline style={{ marginRight: "80px" }} size="30" color="#14C38E" /></Link>
                <Label style={{ fontSize: "25px", fontWeight: "bold", color: "#14C38E" }}>마이페이지</Label>
            </FormGroup>
            <div style={{ display: "flex", paddingBottom: "20px" }}>
                <img src={previewImage} width="100px" height="100px" alt='' style={{ marginRight: "10px", borderRadius: "50px", width: "55px", height: "55px" }} />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div style={{ lineHeight: "55px" }}>
                    <Button style={{
                        width: "130px", height: "35px", fontSize: "15px",
                        backgroundColor: "#14C38E", borderStyle: "none", borderRadius: "20px"
                    }} onClick={() => document.getElementById("file").click()}>프로필 사진 변경
                    </Button>
                </div>
                <Input name="file" type="file" id="file" accept="image/*" onChange={fileChange} hidden />
            </div>
            <div style={{ marginLeft: "5px" }}>
                <FormGroup style={{ textAlign: "left", display: "flex" }}>
                    <Label for="name" style={{ fontSize: "20px", width: "100px" }}>이름</Label>
                    <Label for="name" style={{ fontSize: "20px" }}>{user.name}</Label>
                </FormGroup>
                <FormGroup style={{ textAlign: "left" }}>
                    <div style={{ display: "flex" }}>
                        <Label for="nickname" style={{ fontSize: "20px", width: "100px", lineHeight: "44px" }}>닉네임</Label>
                        <Input
                            type="text"
                            for="nickname"
                            name="nickname"
                            id="nickname"
                            style={{ fontSize: "20px", width: "120px" }}
                            value={user.nickname}
                            onChange={nicknameInput}
                        />
                        &nbsp;&nbsp;
                        <Button style={{
                            width: "100px", fontSize: "17px",
                            backgroundColor: "#14C38E", borderStyle: "none", height: "44px"
                        }} onClick={handleNicknameCheck}>중복확인</Button>
                    </div>
                    <div style={{ color: 'red', fontSize: '14px', height: "10px", textAlign: "left", marginLeft: "100px" }}>{nicknameMessage}</div>
                </FormGroup>

                <FormGroup style={{ textAlign: "left", display: "flex" }}>
                    <Label for="email" style={{ fontSize: "20px", width: "100px" }}>이메일</Label>
                    <Label for="email" style={{ fontSize: "20px" }}>{user.email}</Label>
                </FormGroup>
                <FormGroup style={{ textAlign: "left", display: "flex" }}>
                    <Label for="univ" style={{ fontSize: "20px", width: "100px" }}>{user.type === "univ" ? "학교" : "회사"}</Label>
                    <Label for="univ" style={{ fontSize: "20px" }}>{user.typename}</Label>
                </FormGroup>
                <FormGroup style={{ textAlign: "left", display: "flex" }}>
                    <Label for="phonenum" style={{ fontSize: "20px", width: "100px" }}>전화번호</Label>
                    <Label for="phonenum" style={{ fontSize: "20px" }}>{user.tel}</Label>
                </FormGroup>
                <FormGroup style={{ textAlign: "left", paddingBottom: "10px" }}>
                    <Label for="accountid" style={{ fontSize: "20px", lineHeight: "44px" }}>계좌번호<a style={{ fontSize: "12px", marginLeft: "10px" }}>'-' 없이 숫자만 작성해주세요</a></Label>
                    <div style={{ display: "flex" }}>
                        <select style={{ border: "1px solid lightgray", borderRadius: "5px", width: "100px", height: "45px", textAlign: "left" }}
                            name="accountbank" id="accountbank" value={selected} onChange={selectbank}>
                            <option value="">선택하세요</option>
                            <option value="국민">국민은행</option>
                            <option value="신한">신한은행</option>
                            <option value="농협">농협은행</option>
                            <option value="우리">우리은행</option>
                            <option value="하나">하나은행</option>
                            <option value="기업">기업은행</option>
                            <option value="카카오">카카오뱅크</option>
                        </select>
                        <Input type="text" for="accountid" name="accountid" id="accountid" style={{ fontSize: "16px", width: "214px", height: "44px", marginLeft: "5px" }}
                            onChange={(e) => setUser({ ...user, accountid: e.target.value })} value={user.accountid === "null" || user.accountid === null ? "" : user.accountid} />
                    </div>
                </FormGroup>
            </div>
            <Button
                style={{
                    width: "325px",
                    height: "55px",
                    fontSize: "20px",
                    backgroundColor: "#14C38E",
                    borderStyle: "none",
                }}
                onClick={handleModifyClick}
            >
                수정하기
            </Button>
            <div style={{ paddingTop: "5px" }}>
                <Link to="/changepassword" style={{ textDecoration: "none", color: "#999999" }}>비밀번호 변경하기</Link>
            </div>
        </div>
    )
}

export default Profilemodify;