import { useEffect, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaArrowRight, FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { IoHeartCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import axios from "axios";

const Mypage_zzim = () => {
    const [files, setFiles] = useState(null);
    const Image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    const [saleList, setSaleList] = useState([]);
    const user = useSelector(state => state.persistedReducer.user);
    useEffect(() => {
        axios.get(`${url}/myzzimlist/${user.email}`)
            .then(res => {
                console.log(res.data);
                setSaleList([]);
                setSaleList((_sale_list) => [
                    ..._sale_list, ...res.data
                ]);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const formatPrice = (amount) => {
        if (!amount) return '';
        const numericPrice = parseInt(amount.replace(/[^0-9]/g, ''));
        const formattedPrice = numericPrice.toLocaleString('ko-KR');
        return `${formattedPrice}원`;
    };

    return (
        <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", paddingTop: "50px" }}>
            <FormGroup style={{ textAlign: "left", paddingBottom: "10px" }}>
                <IoArrowBackOutline style={{ marginRight: "100px" }} size="30" color="#14C38E" />
                <Label style={{ fontSize: "25px", fontWeight: "bold", color: "#14C38E" }}>마이페이지</Label>
            </FormGroup>
            <div style={{ paddingBottom: "30px", display: "flex", paddingBottom: "30px" }}>
                <div style={{ paddingBottom: "20px", textAlign: "left" }}>
                    <img src={user.profileimgurl ? `${url}/img/${user.profileimgurl}` : Image} width="100px" height="100px" alt='' style={{ borderRadius: "50px", width: "65px", height: "65px" }} />
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
                <div style={{ width: "80px", marginLeft: "5px", marginRight: "10px" }}><Link to="/mypage" style={{ fontSize: "18px", color: "black", textDecoration: "none" }}>내가 쓴 글</Link></div>
                <div style={{ width: "60px", marginRight: "10px" }}><Link to="/myzzim" style={{ fontSize: "18px", color: "black", textDecoration: "none", fontWeight: "bold" }}>찜한 글</Link></div>
                <div style={{ width: "80px" }}><Link to="/myreview" style={{ fontSize: "18px", color: "black", textDecoration: "none" }}>받은 후기</Link>   </div>
            </div>
            <div style={{ height: "2px", backgroundColor: "#D9D9D9", width: "385px", position: "relative" }}>
                <div style={{ position: "absolute", height: "3px", width: "70px", backgroundColor: "#14C38E", marginLeft: "88px" }} />
            </div>
            <div style={{ height: "10px" }} />
            {saleList.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "50px", width: "305px", marginLeft: "40px" }}>
                    <img src="\ggulggulee.png" style={{ width: "100px" }} /><br />
                    <b>현재 찜한 글이 없어요!</b><br />
                    <a style={{ color: '#14C38E', fontWeight: "bold" }}>딜리셔스</a>로 구경하고<br />
                    <Link to="/salelist" style={{ color: "black" }}>찜 하러가기<FaArrowRight /></Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", textAlign: "left", marginBottom: "3px" }}>
                    {saleList.map((item, index) => (
                        <Link to={`/saledetail/only-detail/${item.num}`} key={index} style={{ textDecoration: "none", color: "black" }}>
                            <div style={{ display: "inline-block", paddingRight: (index + 1) % 3 === 0 ? "0px" : "10px" }}>
                                <div style={{ width: "120px", height: "120px", borderRadius: "10px", position: "relative" }}>
                                    <img src={`${url}/img/${item.fileurl.split(',')[0]}`} style={{ width: "120px", height: "120px", borderRadius: "10px" }} />
                                    <IoHeartCircleOutline color="#E57070" size="30" style={{ position: "absolute", top: "3%", left: "3%" }} />
                                </div>
                                {item.amount.length > 15 ? (
                                    <div style={{ textAlign: "left", fontWeight: "bold" }}>
                                        {formatPrice(`${item.amount.slice(0, 15)}...`)}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "left", fontWeight: "bold" }}>
                                        {formatPrice(item.amount)}
                                    </div>
                                )}
                                {item.title.length > 11 ? (
                                    <div style={{ textAlign: "left", marginTop: "-5px" }}>
                                        <a style={{ fontSize: "13px" }}>{`${item.title.slice(0, 11)}...`}</a>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "left", marginTop: "-5px" }}>
                                        <a style={{ fontSize: "13px" }}>{item.title}</a>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>)}
        </div>
    )
}

export default Mypage_zzim;