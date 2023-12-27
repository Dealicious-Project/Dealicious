import { useEffect, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaArrowRight, FaStar } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { IoHeartCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useWebSocket } from './WebSocketProvider';

const Mypage_zzim = () => {
    const { url } = useWebSocket();
    const [files, setFiles] = useState(null);
    const Image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    const [saleList, setSaleList] = useState([]);
    const token = useSelector(state => state.persistedReducer.token);
    const [user, setUser] = useState({ email: '', nickname: '', password: '', type: '', typename: '', tel: '', accountbank: '', accountbank: '', admincode: '', profileimgurl: '', starpoint: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(url + "user1", {
            headers: {
                Authorization: token,
            }
        })
            .then(res => {
                console.log(res)
                setUser(res.data);
                dispatch({ type: "user", payload: res.data });
                axios.get(url + `myzzimlist/${res.data.email}`)
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
            })
            .catch(err => {
                console.log(err)
            })

    }, []);

    const backButton = () => {
        navigate(-1);
    }

    const formatPrice = (amount) => {
        if (!amount) return '';
        const numericPrice = parseInt(amount.replace(/[^0-9]/g, ''));
        const formattedPrice = numericPrice.toLocaleString('ko-KR');
        return `${formattedPrice}원`;
    };

    return (
        <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", paddingTop: "20px" }}>
            <FormGroup style={{ textAlign: "left", paddingBottom: "10px", display: "flex" }}>
                <div style={{ lineHeight: "38px", cursor: "pointer" }} onClick={backButton}><IoArrowBackOutline size="20" color="#14C38E" /></div>
                <div style={{ width: "360px", textAlign: "center", fontSize: "20px", color: "#14C38E", lineHeight: "38px" }}>마이페이지</div>
            </FormGroup>
            <div style={{ display: "flex", paddingBottom: "30px" }}>
                <div style={{ textAlign: "left" }}>
                    <img src={user.profileimgurl ? url + `img/${user.profileimgurl}` : Image} width="100px" height="100px" alt='' style={{ borderRadius: "50px", width: "65px", height: "65px" }} />
                </div>
                <div style={{ fontSize: "20px", textAlign: "left", paddingLeft: "15px", width: "220px", lineHeight: "32.5px" }}>
                    <div style={{ fontWeight: "bold" }}>&nbsp;{user.nickname}</div>
                    <div>
                        {user.starpoint === "" || user.starpoint === undefined || user.starpoint === null || user.starpoint === 0 ?
                            <div style={{ fontSize: "14px", color: "gray" }}>
                                &nbsp;아직 받은 별점이 없어요!
                            </div>
                            :
                            <div style={{ lineHeight: "25px" }}>{Array.from({ length: user.starpoint }, (_, index) => (
                                <FaStar key={index} size="25" color="#F2D43E" />
                            ))}</div>
                        }
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
                    <a href="/logout" style={{ fontSize: "13px", color: "gray", textDecoration: "none", marginRight: "13px" }}>로그아웃</a>
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
                    <b style={{ color: '#14C38E' }}>딜리셔스</b> 구경하고<br />
                    <Link to="/salelist" style={{ color: "black" }}>찜 하러가기<FaArrowRight /></Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", textAlign: "left", marginBottom: "3px" }}>
                    {saleList.map((item, index) => (
                        <Link to={`/saledetail/only-detail/${item.num}`} key={index} style={{ textDecoration: "none", color: "black" }}>
                            <div style={{ display: "inline-block", paddingRight: (index + 1) % 3 === 0 ? "0px" : "10px" }}>
                                <div style={{ width: "120px", height: "120px", borderRadius: "10px", position: "relative" }}>
                                    {item.status==="수령완료" || item.status==="거래완료"?
                                    <div>
                                        <img src={url + `img/${item.fileurl.split(',')[0]}`} style={{ width: "120px", height: "120px", borderRadius: "10px", position: "absolute" }} />
                                        <div style={{ width: "120px", height: "120px", position: "relative", borderRadius: "10px" }}>
                                            <div style={{ backgroundColor: "gray", width: "100%", height: "100%", position: "absolute", borderRadius: "10px", opacity: "0.5" }}></div>
                                            <a style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontWeight: "bold", color: "white" }}>판매완료</a>
                                        </div>
                                        <IoHeartCircleOutline color="#E57070" size="30" style={{ position: "absolute", top: "3%", left: "3%" }} />
                                    </div>
                                    :
                                    <div>
                                        <img src={url + `img/${item.fileurl.split(',')[0]}`} style={{ width: "120px", height: "120px", borderRadius: "10px", position: "absolute" }} />
                                        <IoHeartCircleOutline color="#E57070" size="30" style={{ position: "absolute", top: "3%", left: "3%" }} />
                                    </div>}
                                </div>
                                {item.amount.length > 15 ? (
                                    <div style={{ textAlign: "left", fontWeight: "bold" }}>
                                        {formatPrice(`${item.amount.slice(0, 15)}...`)}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "left", fontWeight: "bold", display: "flex" }}>
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