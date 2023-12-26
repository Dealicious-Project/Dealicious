import axios from 'axios';
import { useEffect, useState } from 'react';
import { GoArrowLeft } from "react-icons/go";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const NotiKeyword = () => {

  const [notikeywordList, setNotikeywordList] = useState([]);
  const token = useSelector(state => state.persistedReducer.token);
  const navigate = useNavigate();
  const [noticnt, setNoticnt] = useState();
  useEffect(() => {
    axios.get(`${url}/notikeyword`, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        setNotikeywordList((_noti_keyword_list) => [
          ..._noti_keyword_list, ...res.data
        ]);
        axios.get(`${url}/notiacticnt`, {
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
    <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", paddingTop:"10px", paddingLeft:"20px", paddingRight:"20px"}}>
      <br />
      <div>
        <div style={{ display: "flex" }}>
          <Link to="/notiactivity" style={{ textDecoration: "none", color: "black" }}>
            {noticnt >= 1 && <div style={{ borderRadius: "50px", position: "absolute", marginTop: "5px", marginLeft: "140px", width: "18px", height: "18px", backgroundColor: "red", justifyContent: "center", alignItems: "center", display: "flex", color: "white", fontSize: "15px" }}>{noticnt}</div>}<div style={{ width: "200px", fontSize: "17px" }}>활동 알림</div>
          </Link>
          <Link to="/notikeyword" style={{ textDecoration: "none", color: "black" }}>
            <div style={{ width: "200px", fontWeight: "bold", fontSize: "17px" }}>키워드 알림</div>
          </Link>
        </div>
        <div style={{ height: "2px", backgroundColor: "#D9D9D9", width: "385px", position: "relative" }}>
          <div style={{ position: "absolute", height: "3px", width: "192.5px", backgroundColor: "#14C38E", marginLeft: "192.5px" }} />
        </div>

        {notikeywordList.map((item, index) =>
          <Link to={"/saledetail/only-detail/" + item.salenum} style={{ color: "black", textDecoration: "none" }}>
            <div style={{ borderBottom: "1px solid gray", width: "385px" }}>
              <div style={{ display: "flex", paddingBottom: "15px", paddingTop: "15px" }}>
                <div><img src='gg.png' style={{ width: "50px", height: "50px", marginTop: "5px" }}></img></div>
                <div style={{ marginLeft: "10px", width: "330px" }}>
                  <div style={{ textAlign: "left", marginBottom: "5px" }}>{item.title}</div>
                  <div style={{ display: "flex" }}>
                    <div style={{ textAlign: "left", color: "gray", fontSize: "15px", width: "200px" }}>{item.content}</div>
                    <div style={{ textAlign: "right", color: "gray", fontSize: "14px", width: "125px" }}>{timediff(item.notidate)}</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

      </div>
      <br /><br />
      <Link to="/keyword">
        <button style={{ width: "150px", height: "40px", borderRadius: "5px", backgroundColor: "#D9D9D9", border: "white", fontWeight: "bold" }}>키워드 등록하기</button>
      </Link>
    </div>
  );
}

export default NotiKeyword;