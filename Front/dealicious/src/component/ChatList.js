import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { Stomp } from '@stomp/stompjs'; //npm install --save @stomp/stompjs
import * as SockJS from 'sockjs-client'; //npm install --save sockjs-client
import { useSelector } from 'react-redux';
import { useWebSocket } from './WebSocketProvider';
import { FaArrowRight } from 'react-icons/fa6';

function ChatList() {
    const [chatRoomList, setChatRoomList] = useState([]);
    const token = useSelector(state => state.persistedReducer.token);

    useEffect(() => { //컴포넌트가 마운트될 때 connect() 함수를 호출하여 Stomp 클라이언트를 연결하고, 컴포넌트가 언마운트될때  disconnect() 함수를 호출하여 연결을 끊습니다.
        axios.get(`${url}/chatroomlist`, {
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
    const goChatRoom = (e) => {
        window.location.href = "/chat/" + e;
    }
    const timediff = (writedate) => {
        const currentDate = new Date(); // 현재 날짜와 시간
        const writeDate = new Date(writedate); // 주어진 날짜
      
        const diffInMilliseconds = currentDate - writeDate; // 밀리초 단위의 시간 차이
        const diffInMinutes = diffInMilliseconds / (1000 * 60); // 분 단위의 차이
      
        if (diffInMinutes < 60) {
          return `${Math.floor(diffInMinutes)} 분 전`;
        } else if (diffInMinutes < 1440) {
          const hoursDiff = Math.floor(diffInMinutes / 60);
          const remainingMinutes = Math.floor(diffInMinutes % 60);
          return `${hoursDiff} 시간 전`;
        } else {
          const daysDiff = Math.floor(diffInMinutes / 1440);
          return `${daysDiff} 일 전`;
        }
        
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
                        <div key={index} style={{ cursor: "pointer", paddingTop: "10px", paddingBottom: "10px", borderBottom: "1px solid lightgray" }} onClick={() => goChatRoom(item.channelId)}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td rowSpan={2}>{item.profileimgurl == null ? <img src='/profile.png' alt='' style={{ width: "50px", height: "50px" }} /> : <img src={`http://localhost:8090/img/${item.profileimgurl}`} alt='' style={{ width: "50px", height: "50px" }} />}</td>
                                        <td style={{ width: "120px", fontSize: "15px", paddingLeft: "10px" }}>{item.nickname}</td>
                                        <td style={{ paddingRight: "15px", width: "70px", color: "gray", fontSize: "12px" }}>{item.category}&nbsp;</td>
                                        <td style={{ width: "150px", color: "gray", fontSize: "13px" }}>{timediff(item.chatdate)}&nbsp;</td>
                                        <td rowSpan={2}><img src={`${url}/img/${item.fileurl.split(',')[0]}`} alt='' style={{ width: "50px", height: "50px" }} /></td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} style={{ width: "300px", fontSize: "13px", color: "gray", paddingLeft: "10px" }}>{item.chat}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>)}


        </div>
    )
}
export default ChatList;