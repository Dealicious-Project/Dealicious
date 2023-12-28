import { IoArrowBackOutline } from "react-icons/io5";
import { Button, Label, Modal } from "reactstrap";
import { FaCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useWebSocket } from './WebSocketProvider';

const Gpay = () => {
    const { url } = useWebSocket();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const user = useSelector(state => state.persistedReducer.user);
    const navigate = useNavigate();
    const { num } = useParams();
    const [check, setCheck] = useState(false);
    const [sale, setSale] = useState({
        num: "",
        email: "",
        title: "",
        type: "",
        amount: "",
        category: "",
        content: "",
        place: "",
        fileurl: "",
        status: "",
        ggull: "",
        viewcount: null,
        zzimcnt: null,
        buyeremail: "",
        writerdate: "",
    });
    useEffect(() => {
        const jquery = document.createElement("script");
        jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);

        axios
            .get(url + `gpay/${num}`)
            .then(res => {
                console.log(res.data);
                setSale(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        return () => {
            document.head.removeChild(jquery);
            document.head.removeChild(iamport);
        };


    }, []);

    const requestPay = () => {
        if (!check) {
            alert("수수료 약관에 동의하여 주세요");
            return;
        }
        var IMP = window.IMP;
        IMP.init("imp23063576");
        IMP.request_pay({
            pg: 'html5_inicis.INIpayTest', //테스트 시 html5_inicis.INIpayTest 기재 
            pay_method: 'card',
            merchant_uid: new Date().getTime(), //상점에서 생성한 고유 주문번호
            name: sale.title,
            amount: Number(sale.amount) * 1.05,
            buyer_email: user.email,
            buyer_name: user.name,
            buyer_tel: user.tell   //필수 파라미터 입니다.
        }, function (rsp) { // callback
            if (rsp.success) {
                console.log(rsp.imp_uid);
                console.log("결제성공");
                const pay = { salenum: num, amount: sale.amount * 1.05, imp_uid: rsp.imp_uid, buyerEmail: user.email };
                axios.post(url + `pay`, pay)
                    .then(res => {
                        console.log("어드민 계좌 입금 성공");
                        navigate(`/gpay_finish/${num}`)
                    })
                    .catch(err => {
                        console.log(err);
                        console.log("어드민 계좌 입금 실패, 관리자 확인 필요");
                    })
            } else {
                console.log(rsp);
                console.log("결제실패");
            }
        });
    }
    const checkUse = () => {
        if (check) {
            setCheck(false);
        } else {
            setCheck(true);
        }
    }

    const formatPrice = (amount) => {
        if (!amount) return '';
        const numericPrice = parseInt(amount.replace(/[^0-9]/g, '')) * 1.05;
        const formattedPrice = numericPrice.toLocaleString('ko-KR');
        return `${formattedPrice}원`;
    };

    const formatPrice2 = (amount) => {
        if (!amount) return '';
        const numericPrice = parseInt(amount.replace(/[^0-9]/g, '')) * 0.05;
        const formattedPrice = numericPrice.toLocaleString('ko-KR');
        return `${formattedPrice}원`;
    };

    const formatPrice3 = (amount) => {
        if (!amount) return '';
        const numericPrice = parseInt(amount.replace(/[^0-9]/g, ''));
        const formattedPrice = numericPrice.toLocaleString('ko-KR');
        return `${formattedPrice}원`;
    };



    return (
        <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden" }}>
            <div style={{ textAlign: "left", paddingBottom: "10px", display:"flex" }}>
                <IoArrowBackOutline style={{ marginRight:"5px", lineHeight:"27px", height:"27px" }} size="20" color="lightgray" />
                <Label style={{ fontSize: "18px", fontWeight: "550", color: "black", lineHeight:"27px" }}>꿀페이 결제하기</Label>
            </div>
            <div style={{ textAlign: "left", paddingBottom: "10px", borderBottom: "1px solid lightgray", display: "flex", width: "390px" }}>
                <img src={url + `img/${sale.fileurl.split(',')[0]}`} style={{ width: "60px", height: "60px", borderRadius: "10px" }}></img>
                <div style={{ marginLeft: "10px", height: "60px", marginTop: "7px" }}>
                    <div style={{ fontSize: "16px" }}> {sale.title}</div>
                    <div style={{ fontSize: "15px" }}> {formatPrice3(sale.amount)}</div>
                </div>
            </div>
            <div style={{ textAlign: "left", borderBottom: "1px solid lightgray", paddingBottom: "20px" }}>
                &nbsp;&nbsp;
                <div style={{ marginBottom: "10px", paddingLeft: "5px" }}>
                    <span style={{ color: "gray", }}>거래방법</span>
                    <span style={{ paddingLeft: "20px" }}>직거래</span>
                </div>
                <div style={{ paddingLeft: "5px" }}>
                    <span style={{ color: "gray" }}>결제수단</span>
                    <img src="../ggul.png" style={{ width: "40px", marginLeft: "20px" }} />
                </div>
            </div>
            <div style={{ textAlign: "left", borderBottom: "1px solid lightgray", paddingBottom: "10px", paddingTop:"10px" }}>
                <div style={{ paddingLeft: "5px" }}>
                    <FaCheck size="20" style={{ cursor: "pointer" }} onClick={checkUse} color={check ? "black" : "lightgray"} />&nbsp;&nbsp;
                    <Button style={{ backgroundColor: "lightgray", borderStyle: "none" }}>
                        꿀페이 수수료 서비스 이용약관&nbsp;&nbsp;&nbsp;
                        <Link style={{ color: "gray", fontSize:"15px" }} onClick={() => setModalIsOpen(true)}>자세히
                            <Modal className="main" style={{
                                width: "350px", top: "22%"
                            }} isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                                <div style={{ textAlign: "center", height: "100%" }}>
                                    <div>
                                        <button style={{ color: "#14C38E", border: "none", backgroundColor: "white", float: "right", marginRight: "10px", marginTop: "20px" }} onClick={() => setModalIsOpen(false)}>
                                            <IoClose size="27" />
                                        </button>
                                    </div>
                                    <br />
                                    <div style={{ textAlign: "left" }}>
                                        <div style={{ fontWeight: "550", marginLeft: "20px", marginTop: "25px" }}>
                                            1. 꿀페이 결제 수수료는 얼마인가요?
                                        </div>
                                        <div style={{ marginLeft: "37px", marginBottom: "10px" }}>
                                            꿀페이 수수료는 건당 5%입니다.
                                        </div>
                                        <div style={{ fontWeight: "550", marginLeft: "20px" }}>
                                            2. 거래 완료 후 정산은 언제 되나요?
                                        </div>
                                        <div style={{ marginLeft: "37px" }}>
                                            영업일 기준 1~3일 소요됩니다.
                                        </div>
                                        <br /><br />
                                        <div style={{ display: "flex" }}>
                                            <div style={{ marginLeft: "20px", fontWeight: "550" }}>
                                                꿀페이 문의하기
                                            </div>
                                            <div style={{ marginLeft: "10px", textAlign: "right" }}>
                                                DEALicious 고객센터<br />
                                                070-6767-4054
                                            </div>
                                        </div>
                                        <br />
                                    </div>
                                </div>
                            </Modal>
                        </Link>
                    </Button>
                </div>
            </div>
            <div style={{ textAlign: "right", marginRight: "10px", paddingBottom:"153px" }}>
                &nbsp;&nbsp;
                <div>
                    수수료: {formatPrice2(sale.amount)}
                </div>
                <div style={{ fontWeight: "550" }}>
                    결제 금액: {formatPrice(sale.amount)}
                </div>
            </div>
            <Button style={{ width: "390px", height: "40px", fontSize: "16px", backgroundColor: "#14C38E", borderStyle: "none" }} onClick={requestPay}>결제하기</Button>
        </div>
    )
}

export default Gpay;