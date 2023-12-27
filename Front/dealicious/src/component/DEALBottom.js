import { AiFillHome } from 'react-icons/ai';
import { TbExchange } from 'react-icons/tb';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { IoPerson } from 'react-icons/io5';
import { Nav } from 'reactstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useWebSocket } from './WebSocketProvider';

const DEALBottom = () => {
  const user = useSelector(state => state.persistedReducer.user);
  const token = useSelector(state => state.persistedReducer.token);
  const [chatcnt, setChatcnt] = useState(0);
  const { receivedata, resetData, url } = useWebSocket();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user.email !== undefined && user.email !== '') {
      axios.get(url + `chatcnt`, {
        headers: {
          Authorization: token,
        }
      })
        .then(res => {
          setChatcnt(res.data);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [navigate]);

  useEffect(() => {
    // 데이터를 기반으로 원하는 작업 수행
    if (receivedata) {
      console.log('Received data:', receivedata);
      if (receivedata.type == 'chat' || receivedata.type == 'data') {
        console.log(`/chat/${receivedata.channelId}`)
        console.log(location.pathname)
        if(location.pathname !== `/chat/${receivedata.channelId}` && receivedata.writerId !== user.email) {

          console.log("여기?")
          setChatcnt(chatcnt + 1);
        }
      }
      resetData();
    }
  }, [receivedata]);

  return (
    <Nav className="b_wrapper nav">
      <div>
        <Link to="/">
          <AiFillHome size="23" color="72DBBB" />
        </Link>
      </div>
      <div>
        <Link to="/salelist">
          <TbExchange size="23" color="72DBBB" />
        </Link>
      </div>
      <div>
        <Link to={user.email === "" || user.email === undefined ? "/mypagenl" : "/chatlist"}>
          {chatcnt > 0 &&
            <div className="font" style={{ borderRadius: "50px", position: "absolute", marginLeft: "12px", marginTop:"4px", width: "12px", height: "12px", backgroundColor: "#FA5858", justifyContent: "center", alignItems: "center", display: "flex", color: "white", fontSize: "9px" }}>{chatcnt}</div>
          }
          <IoChatboxEllipsesOutline size="23" color="72DBBB" />
        </Link>
      </div>
      <div>
        <Link to={user.email === "" || user.email === undefined ? "/mypagenl" : "/mypage"}>
          <IoPerson size="23" color="72DBBB" />
        </Link>
      </div>
    </Nav>
  );
};

export default DEALBottom;
