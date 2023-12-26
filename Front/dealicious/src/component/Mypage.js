import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Button, FormGroup, Label } from "reactstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";

const Mypage = () => {
    const Image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    const [saleList, setSaleList] = useState([]);
    const user = useSelector(state => state.persistedReducer.user);
    const [filterOption, setFilterOption] = useState("전체");

    useEffect(() => {
        axios.get(`${url}/mypagelist/${user.email}`)
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

    const handleFilterChange = (option) => {
        setFilterOption(option);
    };

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
                <div style={{ width: "80px", marginLeft: "5px", marginRight: "15px" }}><Link to="/mypage" style={{ fontSize: "18px", fontWeight: "bold", color: "black", textDecoration: "none" }}>내가 쓴 글</Link></div>
                <div style={{ width: "60px", marginRight: "5px" }}><Link to="/myzzim" style={{ fontSize: "18px", color: "black", textDecoration: "none" }}>찜한 글</Link></div>
                <div style={{ width: "80px" }}><Link to="/myreview" style={{ fontSize: "18px", color: "black", textDecoration: "none" }}>받은 후기</Link>   </div>
            </div>
            <div style={{ height: "2px", backgroundColor: "#D9D9D9", width: "385px", position: "relative" }}>
                <div style={{ position: "absolute", height: "3px", width: "90px", backgroundColor: "#14C38E" }} />
            </div>
            <div style={{ height: "10px" }} />
            {saleList.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "50px", width: "305px", marginLeft: "40px" }}>
                    <img src="\ggulee.png" style={{ width: "100px" }} /><br />
                    <b>현재 작성한 글이 없어요!</b><br />
                    <a style={{ color: '#14C38E', fontWeight: "bold" }}>딜리셔스</a>로 안전한 중고거래<br />
                    <Link to="/salewrite" style={{ color: "black" }}>첫 시작하기<FaArrowRight /></Link>
                </div>
            ) : (
                <div>
                    <div style={{ display: "flex", marginBottom: "10px" }}>
                        <div
                            onClick={() => handleFilterChange("전체")}
                            style={{
                                cursor: "pointer",
                                marginRight: "10px",
                                fontWeight: filterOption === "전체" ? "bold" : "normal",
                            }}
                        >
                            전체
                        </div>
                        <div
                            onClick={() => handleFilterChange("판매중")}
                            style={{
                                cursor: "pointer",
                                marginRight: "10px",
                                fontWeight: filterOption === "판매중" ? "bold" : "normal",
                            }}
                        >
                            판매중
                        </div>
                        <div
                            onClick={() => handleFilterChange("거래완료")}
                            style={{
                                cursor: "pointer",
                                fontWeight: filterOption === "거래완료" ? "bold" : "normal",
                            }}
                        >
                            판매완료
                        </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", textAlign: "left", marginBottom: "3px" }}>
                        {saleList
                            .filter(item => filterOption === "전체" || (filterOption === "판매중" && item.status !== "거래완료") || (filterOption === "거래완료" && item.status === "거래완료"))
                            .map((item, index) => (
                                <Link to={"/saledetail/only-detail/" + item.num} key={index} style={{ textDecoration: "none", color: "black" }}>
                                    <div style={{ display: "inline-block", paddingRight: index % 3 === 2 ? "0px" : "10px" }}>
                                        {item.status === "거래완료" ? (
                                            <div style={{ width: "120px", height: "120px", borderRadius: "10px", position: "relative", opacity: "0.5" }}>
                                                <img src={`${url}/img/${item.fileurl.split(',')[0]}`} style={{ width: "120px", height: "120px", borderRadius: "10px" }} />
                                                <a style={{ fontWeight: "bold", color: "white", position: "absolute", top: "41%", left: "26%" }}>판매완료</a>
                                            </div>
                                        ) : (
                                            <div style={{ width: "120px", height: "120px", borderRadius: "10px", position: "relative" }}>
                                                <img src={`${url}/img/${item.fileurl.split(',')[0]}`} style={{ width: "120px", height: "120px", borderRadius: "10px" }} />
                                            </div>
                                        )}
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
                    </div>
                </div>)}
        </div>
    )
}

export default Mypage;