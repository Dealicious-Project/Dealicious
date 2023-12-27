import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { Stomp } from '@stomp/stompjs'; //npm install --save @stomp/stompjs
import * as SockJS from 'sockjs-client'; //npm install --save sockjs-client
import { useSelector } from 'react-redux';
import { useWebSocket } from './WebSocketProvider';
import { FaArrowRight } from 'react-icons/fa6';
import { configureStore } from '@reduxjs/toolkit';

function ChatList() {
    const Image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    const { url } = useWebSocket();
    const [chatRoomList, setChatRoomList] = useState([]);
    const token = useSelector(state => state.persistedReducer.token);
    const { receivedata, resetData } = useWebSocket();

    useEffect(() => { //컴포넌트가 마운트될 때 connect() 함수를 호출하여 Stomp 클라이언트를 연결하고, 컴포넌트가 언마운트될때  disconnect() 함수를 호출하여 연결을 끊습니다.
        axios.get(url + `chatroomlist`, {
            headers: {
                Authorization: token,
            }
        })
            .then(res => {
                console.log(res.data);
                setChatRoomList((_chat_room_list) => [
                    ..._chat_room_list, ...res.data
                ]);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    useEffect(() => {
        // 데이터를 기반으로 원하는 작업 수행
        if (receivedata) {
            console.log('Received data:', receivedata);
            if (receivedata.type == "chat" || receivedata.type == "completepay" || receivedata.type == "completereceipt"|| receivedata.type == "data") {
                console.log("넣어주는곳")
                setChatRoomList((prevChatRoomList) => {
                    const isChannelIdExists = prevChatRoomList.some(chatRoom => chatRoom.channelId === receivedata.channelId);

                    if (isChannelIdExists) {
                        const updatedChatRoomList = prevChatRoomList.map((chatRoom) => {
                            if (chatRoom.channelId === receivedata.channelId) {
                                console.log("조건문")
                                return {
                                    ...chatRoom,
                                    chat: [receivedata.chat],
                                    chatdate: [receivedata.chatdate],
                                    nonReadCnt: chatRoom.nonReadCnt + 1
                                };
                            }
                            return chatRoom;
                        });
                        const sortedChatRoomList = updatedChatRoomList.sort((a, b) => new Date(b.chatdate) - new Date(a.chatdate));
                        return sortedChatRoomList;
                    } else {    // If channelId doesn't exist, add a new chat room
                        axios.get(url + `chatroomlist/` + receivedata.channelId, {
                            headers: {
                                Authorization: token,
                            }
                        })
                            .then(res => {
                                console.log(res.data);
                                const newChatRoom = res.data;
                                const updatedChatRoomList = [...prevChatRoomList, newChatRoom];
                                const sortedChatRoomList = updatedChatRoomList.sort((a, b) => new Date(b.chatdate) - new Date(a.chatdate));
                                setChatRoomList(sortedChatRoomList); // 수정된 부분
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                    return prevChatRoomList; // 이 부분 추가
                });

            }
            resetData();
        }
    }, [receivedata]);

    const goChatRoom = (e) => {
        axios.get(url + `chatRead/${e}`, {
            headers: {
                Authorization: token,
            }
        })
            .then(res => {
                console.log(res.data);
                window.location.href = "/chat/" + e;
            })
            .catch(err => {
                console.log(err);
            })

    }
    const timediff = (writedate) => {
        const currentDate = new Date(); // 현재 날짜와 시간
        const writeDate = new Date(writedate); // 주어진 날짜

        const diffInMilliseconds = currentDate - writeDate; // 밀리초 단위의 시간 차이
        const diffInMinutes = diffInMilliseconds / (1000 * 60); // 분 단위의 차이

        if (diffInMinutes < 60) {
            return `${Math.floor(diffInMinutes)}분 전`;
        } else if (diffInMinutes < 1440) {
            const hoursDiff = Math.floor(diffInMinutes / 60);
            const remainingMinutes = Math.floor(diffInMinutes % 60);
            return `${hoursDiff}시간 전`;
        } else {
            const daysDiff = Math.floor(diffInMinutes / 1440);
            return `${daysDiff}일 전`;
        }

    };
    const convertCategoryToKorean = (category) => {
        switch (category) {
            case "mobile":
                return "모바일/태블릿";
            case "pc":
                return "노트북/PC";
            case "ticket":
                return "티켓/쿠폰";
            case "clothes":
                return "의류";
            case "free":
                return "나눔";
            case "others":
                return "기타";
            default:
                return category;
        }
    };
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return `${text.slice(0, maxLength)}...`;
        }
        return text;
    };
    return (
        <div className='main' style={{ textAlign: 'left', overflow: "scroll", height: "632px", overflowX: "hidden", paddingLeft: "20px", paddingRight: "20px" }}>
            <div style={{ borderBottom: "1px solid", fontSize: "20px", paddingBottom: "10px" }}><b>채팅</b></div>
            {chatRoomList.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "50px", width: "305px", marginLeft: "40px" }}>
                    <img src="\ggulggulee.png" style={{ width: "100px" }} /><br />
                    <b>현재 채팅 목록이 비어있어요!</b><br />
                    <a style={{ color: '#14C38E', fontWeight: "bold" }}>딜리셔스</a>로 구경하고<br />
                    <Link to="/salelist" style={{ color: "black" }}>안전한 중고거래 하러가기<FaArrowRight /></Link>
                </div>
            ) : (
                <div>
                    {chatRoomList.map((item, index) =>
                        <div key={index} style={{ cursor: "pointer", paddingTop: "10px", paddingBottom: "10px", borderBottom: "1px solid lightgray", display: "flex" }} onClick={() => goChatRoom(item.channelId)}>
                            <div>{item.profileimgurl == null ? <img src={Image} alt='' style={{ width: "50px", height: "50px", borderRadius: "50px" }} /> : <img src={url + `img/${item.profileimgurl}`} alt='' style={{ width: "50px", height: "50px", borderRadius: "50px" }} />}</div>
                            <div style={{ width: "280px" }}>
                                <div style={{ fontSize: "16px", paddingLeft: "10px", fontWeight: "bold", height: "25px", paddingTop: "5px" }}>{item.nickname}</div>
                                <div style={{ display: "flex", height: "20px" }}>
                                    <div style={{ fontSize: "12.5px", color: "gray", paddingLeft: "10px", width: "205px" }}>{truncateText(item.chat, 25)}</div>
                                    <div style={{ width: "70px", color: "gray", fontSize: "12px", textAlign: "right", marginRight:"5px" }}>{timediff(item.chatdate)}&nbsp;</div>
                                </div>
                            </div>
                            <div><img src={url + `img/${item.fileurl.split(',')[0]}`} alt='' style={{ width: "50px", height: "50px", borderRadius: "10px" }} /></div>
                            <div>
                                <div style={{ textAlign: "center" }}>{item.nonReadCnt > 0 ? <div style={{ width: "25px", textAlign: "center", borderRadius: "50%", color: "white", fontWeight: "bold", backgroundColor: "red" }}>{item.nonReadCnt}</div> : ""}</div>
                            </div>
                        </div>
                    )}
                </div>)}


        </div>
    )
}
export default ChatList;