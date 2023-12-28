import { IoArrowBackOutline } from "react-icons/io5";
import { Button, Label } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useWebSocket } from './WebSocketProvider';

const Gpay_finish = () => {
    const { num } = useParams();
    const { url } = useWebSocket();
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
        axios
            .get(url + `gpay/${num}`)
            .then(res => {
                console.log(res.data);
                setSale(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const formatPrice = (amount) => {
        if (!amount) return '';
        const numericPrice = parseInt(amount.replace(/[^0-9]/g, ''))*1.05;
        const formattedPrice = numericPrice.toLocaleString('ko-KR');
        return `${formattedPrice}원`;
    };

    const formatPrice2 = (amount) => {
        if (!amount) return '';
        const numericPrice = parseInt(amount.replace(/[^0-9]/g, ''))*0.05;
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
            <div style={{ textAlign: "left" }}>
                <Label style={{ fontSize: "18px", fontWeight: "550", color: "black" }}>꿀페이 결제완료</Label>
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
            <div style={{ textAlign: "right", marginRight: "10px", marginBottom:"220px" }}>
                &nbsp;&nbsp;
                <div>
                    수수료: {formatPrice2(sale.amount)}
                </div>
                <div style={{ fontWeight: "550" }}>
                    결제 금액: {formatPrice(sale.amount)}
                </div>
            </div>
            <Link to="/">
                <Button style={{ width: "390px", height: "40px", fontSize: "16px", backgroundColor: "#14C38E", borderStyle: "none" }}>메인화면으로 이동</Button>
            </Link>
        </div>
    )
}

export default Gpay_finish;