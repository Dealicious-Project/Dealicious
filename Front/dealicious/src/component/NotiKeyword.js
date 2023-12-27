import axios from 'axios';
import { useEffect, useState } from 'react';
import {Button} from 'reactstrap'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketProvider';

const NotiKeyword = () => {
  const { url } = useWebSocket();
  const [notikeywordList, setNotikeywordList] = useState([]);
  const token = useSelector(state => state.persistedReducer.token);
  const navigate = useNavigate();
  const [noticnt, setNoticnt] = useState();
  useEffect(() => {
    axios.get(url + `notikeyword`, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        setNotikeywordList((_noti_keyword_list) => [
          ..._noti_keyword_list, ...res.data
        ]);
        axios.get(url + `notiacticnt`, {
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
  const goActi = () => {
    axios.get(url + `notiactivityread`, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        console.log(res)
        navigate("/notiactivity");
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className='main' style={{ paddingBottom:"0px"}}>
      <div>
        <div style={{ display: "flex" }}>
          <div onClick={goActi} style={{ width: "195px", fontSize: "16px", cursor: "pointer", color:"lightgray" }}>활동 알림</div>
          <Link to="/notikeyword" style={{ textDecoration: "none", color: "black" }}>
            <div style={{ width: "195px", fontSize: "16px" }}>키워드 알림</div>
          </Link>
        </div>
        <div style={{ height: "2px", backgroundColor: "#D9D9D9", width: "390px", position: "relative" }}>
          <div style={{ position: "absolute", height: "3px", width: "195px", backgroundColor: "#14C38E", marginLeft: "195px" }} />
        </div>
      </div>

      <div style={{ overflow: "scroll", height: "584.5px", overflowX: "hidden", paddingTop: "0px" }}>
        <div>
          <div style={{ height: "30px", textAlign: "left", marginTop:"10px" }}>
            <Link to="/keyword">
              <Button style={{ width: "100px", height: "30px", borderRadius: "5px", backgroundColor: "#D9D9D9", borderStyle:"none", color:"black", fontSize:"11px" }}>키워드 등록하기</Button>
            </Link>
          </div>
          {notikeywordList.length===0?"키워드알림 없음": notikeywordList.map((item) =>
            <Link to={"/saledetail/only-detail/" + item.notification.salenum} style={{ color: "black", textDecoration: "none" }}>
              <div style={{ borderBottom: "1px solid gray", width: "390px" }}>
                <div style={{ display: "flex", paddingBottom: "10px", paddingTop: "10px" }}>
                  <div><img src={url + `img/${item.sale.fileurl.split(',')[0]}`} style={{ width: "50px", height: "50px", borderRadius: "10px" }}></img></div>
                  <div style={{ marginLeft: "10px", width: "330px", height: "50px" }}>
                    <div style={{ textAlign: "left", lineHeight: "25px" }}><b>{item.notification.title}</b> - {item.sale.title}</div>
                    <div style={{ display: "flex", lineHeight: "25px", marginRight: "5px" }}>
                      <div style={{ textAlign: "left", color: "gray", fontSize: "14px", width: "240px" }}>{item.notification.content}</div>
                      <div style={{ textAlign: "right", color: "gray", fontSize: "14px", width: "125px" }}>{timediff(item.notification.notidate)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}

export default NotiKeyword;