import { IoIosSearch } from "react-icons/io";
import { PiBell } from "react-icons/pi";
import {
  Navbar,
  NavbarBrand,
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Stomp } from "@stomp/stompjs";
import * as SockJS from 'sockjs-client'; //npm install --save sockjs-client
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useWebSocket } from './WebSocketProvider';
import axios from "axios";

const DEALTop = () => {
  const user = useSelector(state => state.persistedReducer.user);
  const token = useSelector(state => state.persistedReducer.token);
  const [noticnt, setNoticnt] = useState(0);
  const receivedata = useWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if(user.email !== undefined && user.email !== '') {
    axios.get(`${url}/noticnt`, {
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
    
    // 데이터를 기반으로 원하는 작업 수행
    if (receivedata) {
      console.log('Received data:', receivedata);
      if (receivedata.type == 'completepay' || receivedata.type == 'completereceipt' || receivedata.type == 'notikeyword') {
        setNoticnt(noticnt + 1);
      }
    }
  }
  }, [receivedata]);

  const goNotification = () => {
    if(user.email !== undefined && user.email !== '') {
      setNoticnt(0);
      navigate("/notiactivity");
    } else {
      navigate("/mypagenl");
    }
  }
  const goHome = () => {
    navigate("/");
  }
  return (
    <div className="t_wrapper" style={{ zIndex: 0 }}>
      <Navbar color='white' expand="md" className="navbar-expand-md">
        <NavbarBrand className="d-flex justify-content-between align-items-center w-100">
          <div className="logo" onClick={goHome} style={{cursor:"pointer"}}>
            DEALicious
          </div>
          <div className="d-flex">

            <Link to='/search'>
              <IoIosSearch size='23' color='14C38E' />
            </Link>
            <div onClick={goNotification} style={{cursor:"pointer"}}>
                {noticnt >= 1 && <div style={{ borderRadius: "50px", position: "absolute", marginLeft: "20px", width: "18px", height: "18px", backgroundColor: "red", justifyContent: "center", alignItems: "center", display: "flex", color: "white", fontSize: "15px" }}>{noticnt}</div>}
                <PiBell size='23' color='14C38E' />
            </div>
          </div>
        </NavbarBrand>
      </Navbar>
    </div>
  );
}

export default DEALTop;
