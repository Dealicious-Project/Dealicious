import { Link } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";

const AdminLogin = () => {
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
                <Label for="email" style={{ fontSize: "20px" }}>이메일</Label>
                <Input type="text" name="email" id="email" style={{ height: "55px", width: "325px" }} />
            </FormGroup>
            <br />
            <FormGroup style={{ textAlign: "left" }}>
                <Label for="password" style={{ fontSize: "20px" }}>비밀번호</Label>
                <Input type="password" name="password" id="password" style={{ height: "55px", width: "325px" }} />
            </FormGroup>
            <br />
            <a href="/adminmain"><Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#14C38E", borderStyle: "none", marginBottom: "10px" }}>관리자 로그인</Button></a>
            <Link to="/adminjoin" style={{ color: "#999999", textDecoration: "none" }}>회원가입</Link>
        </div>
    )
}

export default AdminLogin;