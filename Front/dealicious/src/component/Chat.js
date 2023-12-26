import { useState } from 'react';
import { GoArrowLeft } from "react-icons/go";
import { FaImage, FaStar } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import Modal from 'react-modal';
import { Link, useParams } from "react-router-dom";
import { Button } from 'reactstrap';
import axios from 'axios';


const Chat = () => {
  const{num}=useParams;
  const [modal1IsOpen, setModal1IsOpen] = useState(false);
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
  const [rating, setRating] = useState(0); // 사용자가 선택한 별점을 저장
  const [fixedRating, setFixedRating] = useState(0);
  const [review,setReview]=useState(0);
  const [sale,setSale]=useState({num: "",
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
        writerdate: "",});

  const handleClick = (starValue) => {
    setRating(starValue);
    setFixedRating(starValue); // 사용자가 선택한 별을 고정
  };

  const handleHover = (starValue) => {
    if (fixedRating === 0) {
      setRating(starValue);
    }
  };

  const handleHoverLeave = () => {
    if (fixedRating === 0) {
      setRating(0);
    }
  };
  const handleRegister = (e) => {
    // 여기서 실제로 등록하는 로직을 구현.
    // 예시로 console에 선택한 별점을 출력
    
    axios.get(`${url}/salelike/${num}`)
    .then(res=>{
      console.log(`등록된 별점: ${rating}`);
        console.log(res.data)
        setSale({...sale,likeCount:res.data.likeCount});
        
    })
    setReview()
    // 등록 후 모달을 닫을 수 있도록 처리
    setModal1IsOpen(false);
  };
  return (
    <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden" }}>
      <div style={{ textAlign: "left", color: "#14C38E", display: "flex", verticalAlign: "middle" }}>
        <Link to="/chatlist"><GoArrowLeft size={30} style={{ color: "#14C38E", height: "40px" }} /></Link>
        <div style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "10px", height: "40px", lineHeight: "40px" }}>어깡이</div>
      </div>
      <div style={{ marginTop: "20px", width: "385px", borderTop: "1px solid gray", borderBottom: "1px solid gray" }}>
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <div style={{ display: "flex" }}>
            <div><img src='gg.png' style={{ width: "80px" }}></img></div>
            <div style={{ width: "230px", textAlign: "left", lineHeight: "40px" }}>
              <Link to="/saledetail" style={{ color: "black", textDecoration: "none" }}><div style={{ textAlign: "left" }}>디스펜서 팔아요</div></Link>
              <div style={{ textAlign: "left", fontSize: "18px" }}>60,000원</div>
            </div>
            <div style={{ lineHeight: "40px", width: "80px", textAlign: "right", marginRight: "10px" }}>
              <div>판매중</div>
              <div><Link to="/gpay"><img src='ggul.png' style={{ width: "34px", height: "19px" }}></img></Link></div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <p style={{ color: "gray" }}>2023년 11월 17일</p>
      <br />
      <div style={{ textAlign: "left", marginBottom: "15px" }}>
        <div style={{ display: "inline-block", marginRight: "8px" }}><img src='profile.png' style={{ width: "50px" }}></img></div>
        <div style={{ display: "inline-block", width: "auto", maxWidth: "210px", borderRadius: "10px", backgroundColor: "#D9D9D9", padding: "10px" }}>안녕하세요 구매 원하는데 혹시 장소 변경 가능할까요?</div>
      </div>
      <div style={{ textAlign: "right", marginBottom: "15px" }}>
        <div style={{ display: "inline-block", width: "auto", maxWidth: "210px", borderRadius: "10px", backgroundColor: "#14C38E", padding: "10px", color: "white" }}>되겠냐?</div>
      </div>
      <div style={{ textAlign: "left", marginBottom: "15px" }}>
        <div style={{ display: "inline-block", marginRight: "8px" }}><img src='profile.png' style={{ width: "50px" }}></img></div>
        <div style={{ display: "inline-block", width: "auto", maxWidth: "210px", borderRadius: "10px", backgroundColor: "#D9D9D9", padding: "10px" }}>인성보소</div>
      </div>
      <br />
      <div style={{ borderLeft: "3px solid #D9D9D9", paddingLeft: "10px", textAlign: "left", marginBottom: "15px" }}>
        <img src='dealicious1.png' style={{ marginBottom: "10px", width: "100px" }}></img>
        <p style={{ fontWeight: "bold" }}>디스펜서 팔아요! 의 결제가 완료되었어요.</p>
        <p style={{ color: "gray" }}>구매자에게 물건을 전달해주세요:)</p>
      </div>
      <br />
      <div style={{ borderLeft: "3px solid #D9D9D9", paddingLeft: "10px", textAlign: "left", marginBottom: "15px" }}>
        <img src='dealicious1.png' style={{ marginBottom: "10px", width: "100px" }}></img>
        <p style={{ fontWeight: "bold" }}>디스펜서 팔아요!  의 거래가 완료되었어요.</p>
        <p style={{ color: "gray" }}>거래는 만족스러우셨나요? 후기를 남겨주세요 :)</p>
        <button style={{ width: "310px", backgroundColor: "#C7FBEB", border: "white", padding: "5px", borderRadius: "10px", color: "#14C38E", fontWeight: "bold" }} onClick={() => setModal1IsOpen(true)}>후기 작성하기</button>
        <Modal className='main' style={{
          content: {
            width: "300px", height: "330px", position: "absolute", borderRadius: "20px",
            top: "40%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", border: "1px solid lightgray"
          }
        }} isOpen={modal1IsOpen} onRequestClose={() => setModal1IsOpen(false)}>
          <div style={{ textAlign: "center" }}>
            <div className="logo">DEALicious</div>
            <div><img src="./1.png" /></div>
            <div style={{ textAlign: "center", marginTop: "5px" }}>디스펜서</div>
            <div style={{ textAlign: "center" }}><b>60,000원</b></div>
            <div>
              {[...Array(5)].map((star, i) => {
                const starValue = i + 1;

                return (
                  <FaStar
                    key={i}
                    size={30}
                    color={starValue <= (fixedRating !== 0 ? fixedRating : rating) ? '#ffc107' : '#e4e5e9'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleClick(starValue)}
                    onMouseEnter={() => handleHover(starValue)}
                    onMouseLeave={handleHoverLeave}
                  />
                );
              })}

            </div>
            <Button style={{ width: "60px", height: "35px", borderRadius: "8px", backgroundColor: "#14C38E", border: "white", fontWeight: "bold", color: "white", marginTop: "20px" }} onClick={handleRegister}>등록</Button>
          </div>
        </Modal>
      </div>
      <br />
      <div style={{ borderLeft: "3px solid #D9D9D9", paddingLeft: "10px", textAlign: "left", marginBottom: "15px" }}>
        <img src='dealicious1.png' style={{ marginBottom: "10px", width: "100px" }}></img>
        <p style={{ fontWeight: "bold" }}>디스펜서 팔아요!  의 결제가 완료되었어요.</p>
        <a style={{ color: "gray" }}>수령 후 수령완료 버튼을 눌러주세요:)</a>
        <p style={{ color: "gray", fontSize: "12px" }}>수령완료 버튼을 누르면 판매자에게 정산액이 입금됩니다.</p>
        <button style={{ width: "310px", backgroundColor: "#C7FBEB", border: "white", padding: "5px", borderRadius: "10px", color: "#14C38E", fontWeight: "bold" }} onClick={() => setModal2IsOpen(true)}>수령완료</button>
        <Modal className='main' style={{
          content: {
            width: "350px", height: "190px", position: "absolute",
            top: "40%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", border: "1px solid lightgray", borderRadius: "10px"
          }
        }} isOpen={modal2IsOpen} onRequestClose={() => setModal2IsOpen(false)}>
          <div style={{ textAlign: "center" }}>
            <br />
            <div style={{ marginBottom: "20px" }}>
              수령완료 상태가 되면 판매자에게 정산됩니다.<br/>
              수령완료 상태로 변경하시겠습니까?
            </div>
            <Button style={{ backgroundColor: "gray", border: "white", color: "white" }} onClick={() => setModal2IsOpen(false)}>취소하기</Button>
            <Button style={{ backgroundColor: "#14C38E", border: "white", color: "white", marginLeft: "10px" }} onClick={() => setModal2IsOpen(false)}>수령하기</Button>
          </div>
        </Modal>
      </div>
      <br />
      <div style={{ textAlign: "left", marginBottom: "20px", width: "390px" }}>
        <FaImage size="30" style={{ color: "#D9D9D9" }} />
        <input style={{ marginLeft: "10px", border: "white", width: "300px", height: "40px", borderRadius: "10px", backgroundColor: "#D9D9D9" }} placeholder='  채팅하기'></input>
        <IoMdSend size="40" style={{ marginLeft: "10px", color: "#D9D9D9" }} />
      </div>
    </div>

  );
}

export default Chat;
