import { IoArrowBackOutline } from "react-icons/io5";
import { Button, Label, Modal } from "reactstrap";
import { FaCheck } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
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
            .get(url+`gpay/${num}`)
            .then(res => {
                console.log(res.data);
                setSale(res.data);
            })
            .catch((err) => {
                console.log(err);
            });



    }, []);


    return (
        <div className='main' style={{overflow:"scroll", height:"632px", overflowX:"hidden", padding:"20px 50px 0 50px"}}>
            <div style={{textAlign:"left", paddingBottom:"10px"}}>
                <IoArrowBackOutline style={{marginRight:"80px"}} size="30" color="lightgray"/>
            </div>
            <div style={{textAlign:"left", marginLeft:"10px"}}>
                <Label style={{fontSize:"20px", fontWeight:"bold", color:"black"}}>꿀페이 결제완료</Label>
            </div>
            <div style={{textAlign:"left", paddingBottom:"20px", borderBottom:"1px solid lightgray", display:"flex"}}>
                &nbsp;&nbsp;
                <img src={url+`img/${sale.fileurl.split(',')[0]}`}style={{ width: "100px", height: "100px" }}></img>
                <div style={{ marginLeft: "10px" }}>
                    <div style={{ marginLeft: "10px", fontSize: "25px", marginBottom: "5px" }}> {sale.title}</div>
                    <div style={{ marginLeft: "10px" }}> {sale.amount*1.05} 원</div>
                </div>
            </div>
            <div style={{textAlign:"left", borderBottom:"1px solid lightgray", paddingBottom:"20px"}}>
                &nbsp;&nbsp;
                <div style={{marginBottom:"10px", paddingLeft:"5px"}}>
                    <span style={{color:"gray",}}>거래방법</span>
                    <span style={{fontWeight:"bold", paddingLeft:"20px", fontSize:"18px"}}>직거래</span>
                </div>
                <div style={{paddingLeft:"5px"}}>
                    <span style={{color:"gray"}}>결제수단</span>
                    <img src="../ggul.png" style={{width:"40px", marginLeft:"20px"}}/>
                </div>
            </div>
            <div style={{textAlign:"left", borderBottom:"1px solid lightgray", paddingBottom:"20px"}}>
                &nbsp;&nbsp;
                <div style={{paddingLeft:"5px", fontWeight:"bold", paddingBottom:"10px"}}>꿀페이 결제수단</div>
                <div style={{paddingLeft:"5px"}}>
                    <Button style={{backgroundColor:"black", fontWeight:"bold"}}>신용카드</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>
            <div style={{textAlign:"right", marginRight:"10px"}}>
                &nbsp;&nbsp;
                <div>
                    수수료: {sale.amount * 0.05}원
                </div>
                <div style={{fontWeight:"bold"}}>
                    결제 금액: {sale.amount * 1.05}원
                </div>
            </div>
            <br/>
            <Link to="/">
                <Button style={{width:"330px", height:"55px", fontSize:"20px", backgroundColor:"#14C38E", borderStyle:"none"}}>메인화면으로 이동</Button>
            </Link>
        </div>
    )
}

export default Gpay_finish;