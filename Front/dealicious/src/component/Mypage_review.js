import { useEffect, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaArrowRight, FaStar } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Button, FormGroup, Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useWebSocket } from './WebSocketProvider';

const Mypage_review = () => {
    const { url } = useWebSocket();
    const Image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    const [reviewList, setReviewList] = useState([]);
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
                axios.get(url + `myreviewlist/${res.data.email}`)
                    .then(res => {
                        console.log(user.email)
                        console.log(res.data);
                        setReviewList([]);
                        setReviewList((_review_list) => [
                            ..._review_list, ...res.data
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

    return (

        <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", paddingTop: "20px" }}>
            <FormGroup style={{ textAlign: "left", display: "flex" }}>
                <div style={{ width: "390px", textAlign: "center", fontSize: "20px", color: "#14C38E", lineHeight: "38px" }}>마이페이지</div>
            </FormGroup>
            <div style={{ display: "flex", paddingBottom: "30px" }}>
                <div style={{ textAlign: "left" }}>
                    <img src={user.profileimgurl ? url + `img/${user.profileimgurl}` : Image} width="100px" height="100px" alt='' style={{ borderRadius: "50px", width: "65px", height: "65px" }} />
                </div>
                <div style={{ fontSize: "20px", textAlign: "left", paddingLeft: "15px", width: "220px" }}>
                    <div style={{ fontWeight: "550", height: "45px", paddingTop: "9px" }}>&nbsp;{user.nickname}</div>
                    <div >
                        {user.starpoint === "" || user.starpoint === undefined || user.starpoint === null || user.starpoint === 0 ?
                            <div style={{ fontSize: "14px", color: "gray", marginTop: "-6px" }}>
                                &nbsp;아직 받은 별점이 없어요!
                            </div>
                            :
                            <div style={{ lineHeight: "25px", marginTop: "-10px" }}>{Array.from({ length: user.starpoint }, (_, index) => (
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
                <div style={{ width: "80px", marginLeft: "5px" }}><Link to="/mypage" style={{ fontSize: "16px", color: "lightgray", textDecoration: "none" }}>내가 쓴 글</Link></div>
                <div style={{ width: "60px" }}><Link to="/myzzim" style={{ fontSize: "16px", color: "lightgray", textDecoration: "none" }}>찜한 글</Link></div>
                <div style={{ width: "80px" }}><Link to="/myreview" style={{ fontSize: "16px", color: "black", textDecoration: "none" }}>받은 후기</Link>   </div>
            </div>
            <div style={{ height: "2px", backgroundColor: "#D9D9D9", width: "390px", position: "relative" }}>
                <div style={{ position: "absolute", height: "3px", width: "80px", backgroundColor: "#14C38E", marginLeft: "140px" }} />
            </div>
            <div style={{ height: "10px" }} />
            {reviewList.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "50px", width: "305px", marginLeft: "40px" }}>
                    <img src="\ggulee.png" style={{ width: "100px" }} /><br />
                    <b>현재 받은 후기가 없어요!</b><br />
                    <a style={{ color: '#14C38E', fontWeight: "550" }}>딜리셔스</a>로 안전한 중고거래<br />
                    <Link to="/salelist" style={{ color: "black" }}>시작하기<FaArrowRight /></Link>
                </div>
            ) : (
                <div>
                    {reviewList.map((review, index) => (
                        <div key={index} style={{ display: "flex", width: "390px", height: "80px", borderBottom: "1px solid lightgray" }}>
                            <div style={{ height: "70px", marginTop: "7.5px", marginLeft: "5px" }}>
                                <img
                                    src={review.profileimgurl ? url + `img/${review.profileimgurl}` : Image}
                                    style={{ borderRadius: "50px", width: "55px", height: "55px" }}
                                />
                            </div>
                            <div style={{ marginLeft: "10px", textAlign: "left", width: "130px", marginTop: "9px" }}>
                                &nbsp;<a style={{ fontSize: "17px", fontWeight: "550" }}>{review.nickname}</a>
                                <br />
                                <div>
                                    {Array.from({ length: review.starcount }, (_, index) => (
                                        <FaStar key={index} size="25" color="#F2D43E" />
                                    ))}
                                </div>
                            </div>
                            <div style={{ width: "95px", textAlign: "right", marginRight: "15px", marginTop: "10px" }}>
                                <div style={{ fontSize: "14px", color: "black", marginBottom: "7px" }}>{formatDate(review.reviewdate)}</div>
                                <img src={review.ggull === "1" ? "\ggul.png" : "\ggul2.png"} style={{ width: "34px", height: "19px" }} />
                            </div>
                            <div style={{ width: "70px", height: "70px", borderRadius: "10px", textAlign: "right" }}>
                                <img src={url + `img/${review.fileurl.split(',')[0]}`} style={{ width: "70px", height: "70px", borderRadius: "10px" }} />
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div>
    )
}

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate.replace(/\.$/, '');
};

export default Mypage_review;