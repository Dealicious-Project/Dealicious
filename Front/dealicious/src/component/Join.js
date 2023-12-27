import { Link, useNavigate } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { CgClose } from "react-icons/cg";
import { useEffect, useState } from "react";
import axios from "axios";

const Join = () => {
    const [type, setType] = useState(); // 사용자가 선택한 값 저장
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const handleTypeChange = (e) => {
        setType(e.target.value);
    };
    const handleClick = () => {
        // 체크 여부 확인
        if (!type) {
            setErrorMessage("학교 또는 회사를 선택해주세요");
        } else {
            // navigate 함수를 호출하여 Join2.js로 이동하면서 필요한 데이터를 전달
            navigate('/join2', { state: { type: type } });
            console.log(type);
        }
    };
    return (
        <div className='main' style={{ overflow: "scroll", height: "742px", overflowX: "hidden", paddingTop: "65px", paddingRight: "50px", paddingLeft: "50px" }}>
            <div style={{ width: "330px", textAlign: "right" }}>
                <Link to={"/login"}><CgClose size={30} color="darkgray" /></Link>
            </div>
            <a style={{ fontSize: "30px", fontWeight: "bold", color: "#14C38E" }}>회원가입</a>
            <div style={{ paddingBottom: "50px" }}></div>
            <FormGroup>
                <Label for="select" style={{ fontSize: "20px" }}>학교 또는 회사를 선택해주세요</Label>
                <br /><br /><br /><br />
                <Label for="select" style={{ fontSize: "22px" }}>학교 OR 회사</Label>
                <br /><br />
            </FormGroup>
            <FormGroup style={{ paddingBottom: "122px" }}>
                <Label style={{ marginRight: "50px", fontSize: "20px", fontWeight: "bold" }}>
                    <Input
                        type="radio"
                        name="select"
                        id="univ"
                        value="univ"
                        onChange={handleTypeChange}
                        checked={type === 'univ'}
                    />
                    학생
                </Label>
                <Label style={{ marginRight: "-30px", fontSize: "20px", fontWeight: "bold" }}>
                    <Input
                        type="radio"
                        name="select"
                        id="com"
                        value="com"
                        onChange={handleTypeChange}
                        checked={type === 'com'}
                    />
                    직장인
                </Label>
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: "10px" }}>{!type ? errorMessage : ""}</div>
            </FormGroup>
            <Button style={{
                width: "325px", height: "55px", fontSize: "20px",
                backgroundColor: "#14C38E", borderStyle: "none"
            }} onClick={handleClick}>다음(1/4)</Button>
        </div>
    )
}

export default Join;