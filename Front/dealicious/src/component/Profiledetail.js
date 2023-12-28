import { Button, FormGroup, Label } from "reactstrap";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useWebSocket } from './WebSocketProvider';

const Profiledetail = () => {
    const { url } = useWebSocket();
    const [Image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
    const [user, setUser] = useState({ name: '', email: '', nickname: '', typename: '', tel: '', accountid: '', accountbank: '', profileimgurl: '' })
    const temp = useSelector(state => state.persistedReducer.user);
    useEffect(() => {
        setUser(temp);
    }, [])
    return (
        <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", paddingTop: "20px", paddingLeft: "50px", paddingRight: "50px" }}>
            <FormGroup style={{ textAlign: "left", display: "flex" }}>
                <Link to="/mypage" style={{ lineHeight: "38px", cursor: "pointer" }}><IoArrowBackOutline size="20" color="#14C38E" /></Link>
                <div style={{ width: "360px", textAlign: "center", fontSize: "20px", color: "#14C38E", lineHeight: "38px" }}>회원정보</div>
            </FormGroup>
            <div style={{ paddingBottom: "10px", textAlign: "left" }}>
                <img src={user.profileimgurl ? url + `img/${user.profileimgurl}` : Image} style={{ marginRight: "10px", borderRadius: "50px", width: "50px", height: "50px" }} />
            </div>
            <div style={{ marginLeft: "5px" }}>
                <div style={{ textAlign: "left", display: "flex", marginBottom:"5px" }}>
                    <Label for="name" style={{ fontSize: "18px", width: "100px" }}>이름</Label>
                    <Label for="name" style={{ fontSize: "18px" }}>{user.name}</Label>
                </div>
                <div style={{ textAlign: "left", display: "flex", marginBottom:"5px" }}>
                    <Label for="nickname" style={{ fontSize: "18px", width: "100px" }}>닉네임</Label>
                    <Label for="nickname" style={{ fontSize: "18px" }}>{user.nickname}</Label>
                </div>
                <div style={{ textAlign: "left", display: "flex", marginBottom:"5px" }}>
                    <Label for="email" style={{ fontSize: "18px", width: "100px" }}>이메일</Label>
                    <Label for="email" style={{ fontSize: "18px" }}>{user.email}</Label>
                </div>
                <div style={{ textAlign: "left", display: "flex", marginBottom:"5px" }}>
                    <Label for="univ" style={{ fontSize: "18px", width: "100px" }}>{user.type === "univ" ? "학교" : "회사"}</Label>
                    <Label for="univ" style={{ fontSize: "18px" }}>{user.typename}</Label>
                </div>
                <div style={{ textAlign: "left", display: "flex", marginBottom:"5px" }}>
                    <Label for="phonenum" style={{ fontSize: "18px", width: "100px" }}>전화번호</Label>
                    <Label for="phonenum" style={{ fontSize: "18px" }}>{user.tel}</Label>
                </div>
                <div style={{ textAlign: "left", display: "flex", paddingBottom: "24px" }}>
                    <Label for="accountid" style={{ fontSize: "18px", width: "100px" }}>계좌번호</Label>
                    <Label for="accountbank" style={{ fontSize: "16px", lineHeight: "30px" }}>{user.accountbank == null || user.accountbank == "null" ? "등록된 계좌번호가 없습니다" : user.accountbank}</Label>&nbsp;
                    <Label for="accountid" style={{ fontSize: "16px", lineHeight: "30px" }}>{user.accountid == null || user.accountbank == "null" ? "" : user.accountid}</Label>
                </div>
            </div>
            <Link to="/profilemodify">
                <Button style={{
                    width: "325px", height: "40px", fontSize: "18px",
                    backgroundColor: "#14C38E", borderStyle: "none"
                }}>수정하기</Button>
            </Link>
            <div style={{ paddingTop: "5px" }}>
                <Link to="/changepassword" style={{ textDecoration: "none", color: "#999999" }}>비밀번호 변경하기</Link>
            </div>
        </div>
    )
}

export default Profiledetail;