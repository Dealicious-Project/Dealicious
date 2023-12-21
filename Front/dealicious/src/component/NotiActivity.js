import axios from 'axios';
import { useEffect, useState } from 'react';
import { GoArrowLeft } from "react-icons/go";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const NotiActivity = () => {
  const [notiactiList, setNotiactiList] = useState([]);
  const token = useSelector(state => state.persistedReducer.token);
  useEffect(() => {
    axios.get(`http://localhost:8090/notiactivity`, {
            headers: {
                Authorization: token,
            }
        })
            .then(res => {
              setNotiactiList((_noti_acti_list) => [
                ..._noti_acti_list, ...res.data
            ]);
            })
            .catch(err => {
                console.log(err);
            })
  }, []);

  return (
    <div className='main' style={{ overflow: "scroll", height: "732px", overflowX: "hidden", paddingTop:"10px", paddingLeft:"20px", paddingRight:"20px"}}>
      <br />
      <div>
        <div style={{display:"flex"}}>
          <Link to="/notiactivity" style={{textDecoration:"none", color:"black"}}>
            <td style={{ width: "200px", fontWeight: "bold", fontSize:"17px" }}>활동 알림</td>
          </Link>
          <Link to="/notikeyword" style={{textDecoration:"none", color:"black"}}>
            <td style={{ width: "200px",sfontSize:"17px" }}>키워드 알림</td>
          </Link>
        </div>
        <div style={{height:"2px", backgroundColor:"#D9D9D9", width:"385px", position:"relative"}}>
            <div style={{position:"absolute", height:"3px", width:"192.5px", backgroundColor:"#14C38E"}}/>
        </div>
        {notiactiList.map((item, index) =>
        <div key={index} style={{borderBottom: "1px solid gray", width:"385px" }}>
        <div style={{display:"flex", paddingBottom:"15px", paddingTop:"15px"}}>
          <div><img src='gg.png' style={{width:"50px", height:"50px", marginTop:"10px"}}></img></div>
          <div style={{marginLeft:"10px", width:"330px"}}>
            <div style={{textAlign:"left", marginBottom:"5px" }}>{item.title}</div>
            <div style={{display:"flex"}}>
              <div style={{textAlign:"left", color:"gray", fontSize:"15px", width:"200px" }}>{item.content}</div>
              <div style={{textAlign:"right", color:"gray", fontSize:"14px", width:"125px"  }}>{item.notidate}</div>
            </div>
          </div>
        </div>
      </div>
        )}
      </div>
    </div>
  );
}

export default NotiActivity;
