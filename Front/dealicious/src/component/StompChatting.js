import { useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs'; //npm install --save @stomp/stompjs
import * as SockJS from 'sockjs-client'; //npm install --save sockjs-client
import axios from 'axios';
import { useSelector } from 'react-redux';
import { GoArrowLeft } from "react-icons/go";
import { IoMdSend } from "react-icons/io";
import './img.css';
import { Button, Input } from 'reactstrap';
import Modal from 'react-modal';
import { FaImage, FaStar } from "react-icons/fa6";
import { useWebSocket } from './WebSocketProvider';
import { FaCamera } from "react-icons/fa";



const StompChatting = () => {
  const [chatList, setChatList] = useState([]);
  const [modal1IsOpen, setModal1IsOpen] = useState(false);
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
  const [rating, setRating] = useState(0); // 사용자가 선택한 별점을 저장
  const [fixedRating, setFixedRating] = useState(0);
  const [chat, setChat] = useState('');
  const token = useSelector(state => state.persistedReducer.token);
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
  const [chatpartner, setChatpartner] = useState({ email: '', nickname: '', password: '', type: '', typename: '', tel: '', accountbank: '', accountbank: '', admincode: '', profileimgurl: '' });
  const messagesRef = useRef(null);
  const { channelId } = useParams();
  const user = useSelector(state => state.persistedReducer.user);
  const { sendDataToServer } = useWebSocket();
  const { receivedata, resetData, url } = useWebSocket();

  // const chatBox = { border: "1px solid gray", borderRadius: "20%", width: "87px", height: "41px", textAlign: "center", float: "right", backgroundColor: "#14C38E", color: "white", marginTop: "-30px" };
  // const opponent = { backgroundColor: "#D9D9D9", borderRadius: "20%", width: "87px", height: "41px", textAlign: "center", paddingTop: "5px", marginLeft: "20px", marginTop: "20px" }

  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  useEffect(() => { //컴포넌트가 마운트될 때 connect() 함수를 호출하여 Stomp 클라이언트를 연결하고, 컴포넌트가 언마운트될때  disconnect() 함수를 호출하여 연결을 끊습니다.
    axios.get(url + `chatroom/` + channelId, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        console.log(res.data);
        setChatList((_chat_list) => [
          ..._chat_list, ...res.data.chatlist
        ]);
        console.log(res.data.sale);
        setSale(res.data.sale);
        setChatpartner(res.data.chatpartner);
      })
      .catch(err => {
        console.log(err);
      })

  }, [])

  useEffect(() => {
    // 데이터를 기반으로 원하는 작업 수행
    if (receivedata) {
      console.log('Received data:', receivedata);
      if (receivedata.channelId == channelId) {
        if (receivedata.type == "chat" || receivedata.type == "completepay" || receivedata.type == "completereceipt" || receivedata.type == "data") {
          console.log("넣어주는곳")
          setChatList((_chat_list) => [
            ..._chat_list, receivedata
          ]);
          axios.post(url + `insertisread`, receivedata, {
            headers: {
              Authorization: token,
            }
          })
            .then(res => {
              console.log(res.data);
            })
            .catch(err => {
              console.log(err);
            })
        }
      }
      resetData();
    }
  }, [receivedata]);

  const publish = () => {
    console.log("chat:" + chat);
    if (chat !== '') {
      const dataToSend = {
        channelId: channelId,
        writerId: user.email,
        receiverId: chatpartner.email,
        chat: chat,
        type: "chat"
      };
      setChat('');
      sendDataToServer(dataToSend);
    }
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result.split(',')[1];

        const dataToSend = {
          channelId: channelId,
          writerId: user.email,
          receiverId: chatpartner.email,
          type: "data",
          chat: "이미지 전송",
          data: imageData, // 이미지를 Base64로 인코딩한 문자열을 추가
        };
        setChat('');
        sendDataToServer(dataToSend);
      };

      reader.readAsDataURL(file);
    } else {
      alert('Please connect to WebSocket and select a file.');
    }
  };



  // const publish = () => {
  //   if (!stompClient.connected) return;
  //   console.log("chat:" + chat);
  //   stompClient.send('/pub/chat', {},
  //     JSON.stringify({
  //       channelId: channelId,
  //       writerId: user.email,
  //       chat: chat,
  //     }),
  //   );
  //   setChat('');
  // };

  // const uploadFile = (input) => {
  //   if (input.target.files.length > 0) {
  //     console.log('파일 선택됨')
  //     var FR = new FileReader();
  //     FR.onload = function (base64) {
  //       const image = new Image();
  //       image.src = base64.target.result;
  //       image.onload = (e) => {
  //         const $canvas = document.createElement(`canvas`);
  //         const ctx = $canvas.getContext(`2d`);

  //         $canvas.width = e.target.width;
  //         $canvas.height = e.target.height;

  //         ctx.drawImage(e.target, 0, 0);

  //         // 용량이 줄어든 base64 이미지
  //         publishFile($canvas.toDataURL(`image/jpeg`, 0.5))
  //       }

  //     };
  //     FR.readAsDataURL(input.target.files[0]);
  //   }
  // }

  // const publishFile = (data) => {
  //   if (!client.current.connected) return;
  //   console.log(data.length)
  //   client.current.send('/pub/chat', {},
  //     JSON.stringify({
  //       channelId: channelId,
  //       writerId: user.email,
  //       data: data,
  //     }),
  //   );
  //   setChat('');
  // };

  // const subscribe = () => {
  //   client.current.subscribe('/sub/chat/' + channelId, (body) => {
  //     if (body.headers['content-type'] === 'application/octet-stream') {  //binary
  //     } else {
  //       const receive = JSON.parse(body.body);
  //       console.log(receive)
  //       setChatList((_chat_list) => [
  //         ..._chat_list, receive
  //       ]);
  //       console.log(chatList);
  //     }
  //   })
  // };

  // const disconnect = () => {
  //   client.current.deactivate();
  // };

  const handleChange = (event) => { // 채팅 입력 시 state에 값 설정
    setChat(event.target.value);
  };

  // const handleSubmit = (event, chat) => { // 보내기 버튼 눌렀을 때 publish
  //   event.preventDefault();

  //   publish(chat);
  // };

  const fileurlList = sale.fileurl.split(',').map(url => url.trim());
  const scrollToBottom = () => {
    if (messagesRef.current) {
      // 스크롤을 제일 아래로 이동
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const receipt = () => {
    console.log("수령완료");
    axios.get(url + `receipt/` + sale.num, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        console.log(res.data);
        setModal2IsOpen(false);
      })
      .catch(err => {
        console.log(err);
        alert("이미 수령 완료 처리되었습니다.");
      })
  }
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

    axios.get(url + `review/${fixedRating}/${chatpartner.email}/${sale.num}`, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        alert("리뷰 등록 완료!")
      })
      .catch(err => {
        console.log(err);
        alert(err.response.data);
      })
    // 등록 후 모달을 닫을 수 있도록 처리
    setModal1IsOpen(false);
  };
  const Image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  return (
    <div className='main' style={{height:"632px", padding:"10px 15px 10px 20px"}}>
      <div style={{ textAlign: "left", color: "#14C38E", display: "flex", verticalAlign: "middle" }}>
        <Link to="/chatlist"><GoArrowLeft size={20} style={{ height: "40px", color: "black" }} /></Link>
        <div style={{ fontSize: "18px", marginLeft: "10px", height: "40px", lineHeight: "40px", color: "black" }}>{chatpartner.nickname}</div>
      </div>
      <div style={{ width: "390px", borderTop: "1px solid #D9D9D9", borderBottom: "1px solid #D9D9D9", height: "85px" }}>
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <div style={{ display: "flex" }}>

            <div><img src={url + `img/${fileurlList[0]}`} style={{ width: "60px", height: "60px", borderRadius:"10px" }}></img></div>
            <div style={{ width: "230px", textAlign: "left", lineHeight: "40px" }}>
              <Link to={"/saledetail/only-detail/" + sale.num} style={{ color: "black", textDecoration: "none" }}><div style={{ textAlign: "left" }}>{sale.title}</div></Link>
              <div style={{ textAlign: "left", fontSize: "18px" }}>{sale.amount}</div>
            </div>
            <div style={{ lineHeight: "40px", width: "80px", textAlign: "right", marginRight: "10px" }}>
              <div>{sale.status}</div>
              <div>{sale.ggull == 1 ? sale.email == user.email ? <img src='/ggul.png' style={{ width: "34px", height: "19px" }}></img> : <Link to={"/gpay/" + sale.num}><img src='/ggul.png' style={{ width: "34px", height: "19px" }}></img></Link> : ""}</div>
            </div>
          </div>
        </div>
      </div>
      <div ref={messagesRef} style={{ overflowY: 'auto', height: "437px", maxHeight: "437px", overflowX: "hidden" }}>
        <div style={{ paddingRight: "10px" }}>
          <br />
          {chatList.map((item, index) => <div key={index}>{
            item.type == "chat" ?
              item.writerId == user.email ?
                <div style={{ textAlign: "right", marginBottom: "15px" }}>
                  <div style={{ display: "inline-block", width: "auto", maxWidth: "265px", borderRadius: "10px", backgroundColor: "#14C38E", padding: "10px", color: "white" }}>{item.chat}</div>
                </div>
                :
                <div style={{ textAlign: "left", marginBottom: "15px", maxHeight: "100%", display: "flex" }}>
                  <div style={{ marginRight: "5px" }}>{chatpartner.profileimgurl == null ? <img src={Image} style={{ width: "44px", borderRadius: "50px" }}></img> : <img src={url + `img/${chatpartner.profileimgurl}`} style={{ width: "44px", borderRadius: "50px" }}></img>}</div>
                  <div style={{ width: "auto", borderRadius: "10px", backgroundColor: "#D9D9D9", padding: "10px", maxWidth: "265px" }}>{item.chat}</div>
                </div>
              :
              item.type == "completepay" ?
                sale.email == user.email ?
                  <div style={{ borderLeft: "3px solid #D9D9D9", paddingLeft: "10px", textAlign: "left", paddingBottom: "8px", paddingTop:"8px", marginBottom:"15px" }}>
                    <div className='logo'>DEALicious</div>
                    <div><span style={{ fontWeight: "bold" }}>"{sale.title}"</span> 의 결제가 완료되었어요.</div>
                    <div style={{ color: "gray", fontSize: "15px" }}>&nbsp;&nbsp;구매자에게 물건을 전달해주세요:)</div>
                  </div>
                  : <div style={{ borderLeft: "3px solid #D9D9D9", paddingLeft: "10px", textAlign: "left", paddingBottom: "8px", paddingTop:"8px", marginBottom:"15px" }}>
                    <div className='logo'>DEALicious</div>
                    <div><span style={{ fontWeight: "bold" }}>"{sale.title}"</span> 의 결제가 완료되었어요.</div>
                    <div style={{ color: "gray", fontSize: "15px" }}>수령 후 수령완료 버튼을 눌러주세요:)</div>
                    <div style={{ color: "gray", fontSize: "12px" }}>&nbsp;&nbsp;수령완료 버튼을 누르면 판매자에게 정산액이 입금됩니다.</div>
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
                          수령완료 상태가 되면 판매자에게 정산됩니다.<br />
                          수령완료 상태로 변경하시겠습니까?
                        </div>
                        <Button style={{ backgroundColor: "gray", border: "white", color: "white" }} onClick={() => setModal2IsOpen(false)}>취소하기</Button>
                        <Button style={{ backgroundColor: "#14C38E", border: "white", color: "white", marginLeft: "10px" }} onClick={receipt}>수령하기</Button>
                      </div>
                    </Modal>
                  </div>
                :
                item.type == "completereceipt" ?
                <div style={{ borderLeft: "3px solid #D9D9D9", paddingLeft: "10px", textAlign: "left", paddingBottom: "8px", paddingTop:"8px", marginBottom:"15px" }}>
                  <div className='logo'>DEALicious</div>
                  <div><span style={{ fontWeight: "bold" }}>"{sale.title}"</span> 의 거래가 완료되었어요.</div>
                  <div style={{ color: "gray", fontSize: "15px" }}>&nbsp;&nbsp;거래는 만족스러우셨나요? 후기를 남겨주세요 :)</div>
                  <button style={{ width: "310px", backgroundColor: "#C7FBEB", border: "white", padding: "5px", borderRadius: "10px", color: "#14C38E" }} onClick={() => setModal1IsOpen(true)}>후기 작성하기</button>
                  <Modal className='main' style={{
                    content: {
                      width: "300px", height: "330px", position: "absolute", borderRadius: "20px",
                      top: "40%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", border: "1px solid lightgray"
                    }
                  }} isOpen={modal1IsOpen} onRequestClose={() => setModal1IsOpen(false)}>
                    <div style={{ textAlign: "center" }}>
                      <div className="logo">DEALicious</div>
                      <div><img src={url + `img/${fileurlList[0]}`} style={{ width: "100px" }} /></div>
                      <div style={{ textAlign: "center", marginTop: "5px" }}>{sale.title}</div>
                      <div style={{ textAlign: "center" }}><b>{sale.amount}원</b></div>
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
                : item.writerId == user.email ?
                <div style={{ textAlign: "right", marginBottom: "15px" }}>
                  <img src={url+`img/${item.data}`} style={{ width: "80px", height:"80px" }}></img>
                </div>
                :
                <div style={{ textAlign: "left", marginBottom: "15px" }}>
                  <div style={{ display: "inline-block", marginRight: "8px" }}>{chatpartner.profileimgurl==null ? <img src={Image} style={{ width: "44px", borderRadius: "50px" }}></img>:<img src={url+`img/${chatpartner.profileimgurl}`} style={{ width: "50px" }}></img>}</div>
                  <img src={url+`img/${item.data}`} style={{ width: "80px", height:"80px" }}></img>
                </div>
          }
          </div>)}
        </div>
      </div>
      <div style={{ paddingTop: "8px", textAlign: "left", width: "390px", height: "50px", backgroundColor: "white" }}>
        {/* <FaImage size="30" style={{ color: "#D9D9D9" }} /> */}
        <span onClick={() => document.getElementById("file").click()}>
                        <FaCamera size="30" color='gray' />
                    </span>
        <Input type="file" id="file" onChange={onFileChange} hidden/>
        <input style={{ marginLeft: "10px", border: "white", width: "300px", height: "40px", borderRadius: "10px", backgroundColor: "#D9D9D9" }} placeholder='  채팅하기' onChange={handleChange} value={chat}></input>
        <IoMdSend size="40" style={{ marginLeft: "10px", color: "#D9D9D9" }} onClick={publish} />
      </div>
    </div>



    // <div>
    //   <div style={{width:"300px",height:"600px", border:"1px solid black", padding:"10px"}}>
    //     {chatList.map((item, index) =>

    //       <div key={index}>
    //         {item.writerId!==writerId&&(
    //           <div>
    //               <div>{item.writerId}</div>
    //               <div style={opponent}>{item.chat}</div>


    //           </div>

    //         )}
    //         {item.writerId==writerId&&(
    //           <div style={{marginTop:"50px"}}>
    //             <div>
    //             <div>{item.chat!=null&&item.chat!==''}</div>
    //             <br/>
    //             <div style={chatBox}>{item.chat}</div>

    //             </div>
    //           </div>

    //         )}
    //        {item.data!=null&&item.data!==''&& item.chat!=null&&item.chat!==''&&(
    //         <img src={item.data} alt='' width={"20%"} style={{marginTop:"20px",float:"right"}}/>
    //        )}

    //       </div>  
    //     )}
    //   </div>
    //   <form onSubmit={(event) => handleSubmit(event, chat)}>
    //     <label for="file" style={{cursor:"pointer",marginLeft:"-90px",width:'30px',height:"30px",borderRadius:"50%",backgroundColor:"#D9D9D9"}} onChange={uploadFile} accept="image/*"><FaImage /></label>
    //     <input type={'file'} id="file" style={{display:"none"}}></input>
    //     <input type={'text'} style={{marginLeft:"10px",backgroundColor:"#D9D9D9",borderRadius:"10px",borderColor:"white"}} placeholder='채팅하기' name={'chatInput'} onChange={handleChange} value={chat} />
    //     <input type="image" style={{marginLeft:"10px",marginTop:"30px"}} src="..\Sent.png" name="submit"  />
    //   </form>
    // </div>
  );
}

export default StompChatting;