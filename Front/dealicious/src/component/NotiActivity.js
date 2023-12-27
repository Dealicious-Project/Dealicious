import axios from 'axios';
import { useEffect, useState } from 'react';
import { GoArrowLeft } from "react-icons/go";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketProvider';

const NotiActivity = () => {
  const { url } = useWebSocket();
  const [notiactiList, setNotiactiList] = useState([]);
  const token = useSelector(state => state.persistedReducer.token);
  const navigate = useNavigate();
  const [noticnt, setNoticnt] = useState();
  useEffect(() => {
    axios.get(url + `notiactivity`, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        setNotiactiList((_noti_acti_list) => [
          ..._noti_acti_list, ...res.data
        ]);
        axios.get(url + `notikeycnt`, {
          headers: {
            Authorization: token,
          }
        })
          .then(res => {
            setNoticnt(res.data);
          })
          .catch(err => {
            console.log(err);
          })
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  const goChat = (e) => {
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

  const goKeyword = () => {
    axios.get(url + `notikeywordread`, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        console.log(res)
        navigate("/notikeyword");
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className='main' style={{ paddingBottom: "0px" }}>
      <div>
        <div style={{ display: "flex" }}>
          <Link to="/notiactivity" style={{ textDecoration: "none", color: "black" }}>
            <div style={{ width: "195px", fontWeight: "bold", fontSize: "17px" }}>활동 알림</div>
          </Link>
          <div onClick={goKeyword} style={{ width: "195px", fontSize: "17px", cursor: "pointer", fontWeight:"bold", color:"lightgray" }}>키워드 알림</div>
        </div>
        <div style={{ height: "2px", backgroundColor: "#D9D9D9", width: "390px", position: "relative" }}>
          <div style={{ position: "absolute", height: "3px", width: "195px", backgroundColor: "#14C38E" }} />
        </div>
      </div>
      <div style={{ overflow: "scroll", height: "584.5px", overflowX: "hidden", paddingTop: "0px" }}>
        <div>
          {notiactiList.map((item, index) =>
            <div key={index} style={{ borderBottom: "1px solid gray", width: "390px", cursor: "pointer" }} onClick={() => goChat(item.channelId)}>
              <div style={{ display: "flex", paddingBottom: "10px", paddingTop: "10px" }}>
                <div><img src='ggulggulee.png' style={{ width: "40px", height: "40px", marginTop: "5px" }}></img></div>
                <div style={{ width: "340px", marginLeft: "5px" }}>
                  <div style={{ textAlign: "left" }}>{item.title}</div>
                  <div style={{ display: "flex" }}>
                    <div style={{ textAlign: "left", color: "gray", fontSize: "14px", width: "240px" }}>{item.content}</div>
                    <div style={{ textAlign: "right", color: "gray", fontSize: "14px", width: "95px" }}>{timediff(item.notidate)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotiActivity;
