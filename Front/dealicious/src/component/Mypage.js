import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Button, FormGroup, Label } from "reactstrap";
import { useSelector } from "react-redux";
import axios from "axios";

const Mypage = () => {
    const [Image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
    const [user, setUser] = useState({ id: '', email: '', nickname: '' })
    const [saleList, setSaleList] = useState([]);
    const [page, setPage] = useState(1);
    const temp = useSelector(state => state.persistedReducer.user);
    useEffect(() => {
        setUser(temp);
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:8090/mypagelist`)
            .then(res => {
                console.log(res);
                setSaleList([]);
                setSaleList((_sale_list) => [
                    ..._sale_list, ...res.data.saleList
                ]);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);
    return (
        <div className='main' style={{ overflow: "scroll", height: "732px", overflowX: "hidden", paddingTop: "50px" }}>
            <FormGroup style={{ textAlign: "left", paddingBottom: "10px" }}>
                <IoArrowBackOutline style={{ marginRight: "100px" }} size="30" color="#14C38E" />
                <Label style={{ fontSize: "25px", fontWeight: "bold", color: "#14C38E" }}>마이페이지</Label>
            </FormGroup>
            <div style={{ paddingBottom: "30px", display: "flex", paddingBottom: "30px" }}>
                <div style={{ paddingBottom: "20px", textAlign: "left" }}>
                    <img src={user.profileimgurl ? `http://localhost:8090/img/${user.profileimgurl}` : Image} width="100px" height="100px" alt='' style={{ borderRadius: "50px", width: "65px", height: "65px" }} />
                </div>
                <div style={{ fontSize: "20px", fontWeight: "bold", textAlign: "left", paddingLeft: "20px", width: "220px" }}>
                    &nbsp;{user.nickname}
                    <br />
                    <div>
                        <FaStar size="25" color="#F2D43E" />
                        <FaStar size="25" color="#F2D43E" />
                        <FaStar size="25" color="#F2D43E" />
                        <FaStar size="25" color="#F2D43E" />
                    </div>
                </div>

                <div style={{ textAlign: "right" }}>
                    <Link to="/profiledetail">
                        <Button style={{
                            width: "100px", height: "35px", fontSize: "15px",
                            backgroundColor: "#D9D9D9", borderStyle: "none", borderRadius: "20px"
                        }}>내 정보 수정
                        </Button>
                    </Link><br />
                    <a href="/logout" style={{ fontSize: "13px", color: "gray", textDecoration: "none", marginRight: "10px" }}>로그아웃</a>
                </div>
            </div>
            <div style={{ display: "flex", textAlign: "left", marginBottom: "3px" }}>
                <div style={{ width: "80px", marginLeft: "5px", marginRight: "15px" }}><Link to="/mypage" style={{ fontSize: "18px", fontWeight: "bold", color: "black", textDecoration: "none" }}>내가 쓴 글</Link></div>
                <div style={{ width: "60px", marginRight: "5px" }}><Link to="/myzzim" style={{ fontSize: "18px", color: "black", textDecoration: "none" }}>찜한 글</Link></div>
                <div style={{ width: "80px" }}><Link to="/myreview" style={{ fontSize: "18px", color: "black", textDecoration: "none" }}>받은 후기</Link>   </div>
            </div>
            <div style={{ height: "2px", backgroundColor: "#D9D9D9", width: "385px", position: "relative" }}>
                <div style={{ position: "absolute", height: "3px", width: "90px", backgroundColor: "#14C38E" }} />
            </div>
            <div style={{ height: "10px" }} />
            <div style={{ textAlign: "left", marginBottom: "10px", marginLeft: "5px" }}>
                <select style={{ border: "1px solid lightgray", borderRadius: "10px", width: "83px", height: "30px", textAlign: "center", fontSize: "14px" }}>
                    <option>판매중</option>
                    <option>판매완료</option>
                </select>
            </div>
            <Link to="/saledetail" style={{ textDecoration: "none", color: "black" }}>
                <div style={{ display: "inline-block", paddingRight: "10px" }}>
                    <div style={{ width: "120px", height: "120px", borderRadius: "10px", position: "relative", opacity: "0.5" }}>
                        <img src="..\1.png" style={{ width: "120px", height: "120px", borderRadius: "10px" }} />
                        <a style={{ fontWeight: "bold", color: "white", position: "absolute", top: "40%", left: "32%" }}>예약중</a>
                    </div>
                    <div style={{ textAlign: "left", fontWeight: "bold" }}>
                        50,000원
                    </div>
                    <div style={{ textAlign: "left", marginTop: "-5px" }}>
                        <a style={{ fontSize: "13px" }}>커피 디스펜서 팔아...</a>
                    </div>
                </div>
            </Link>
            <Link to="/saledetail" style={{ textDecoration: "none", color: "black" }}>
                <div style={{ display: "inline-block", paddingRight: "10px" }}>
                    <div style={{ width: "120px", height: "120px", borderRadius: "10px", position: "relative", opacity: "0.5" }}>
                        <img src="..\1.png" style={{ width: "120px", height: "120px", borderRadius: "10px" }} />
                        <a style={{ fontWeight: "bold", color: "white", position: "absolute", top: "40%", left: "32%" }}>예약중</a>
                    </div>
                    <div style={{ textAlign: "left", fontWeight: "bold" }}>
                        50,000원
                    </div>
                    <div style={{ textAlign: "left", marginTop: "-5px" }}>
                        <a style={{ fontSize: "13px" }}>커피 디스펜서 팔아...</a>
                    </div>
                </div>
            </Link>
            <Link to="/saledetail" style={{ textDecoration: "none", color: "black" }}>
                <div style={{ display: "inline-block" }}>
                    <div style={{ width: "120px", height: "120px", borderRadius: "10px", position: "relative", opacity: "0.5" }}>
                        <img src="..\1.png" style={{ width: "120px", height: "120px", borderRadius: "10px" }} />
                        <a style={{ fontWeight: "bold", color: "white", position: "absolute", top: "40%", left: "32%" }}>예약중</a>
                    </div>
                    <div style={{ textAlign: "left", fontWeight: "bold" }}>
                        50,000원
                    </div>
                    <div style={{ textAlign: "left", marginTop: "-5px" }}>
                        <a style={{ fontSize: "13px" }}>커피 디스펜서 팔아...</a>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Mypage;