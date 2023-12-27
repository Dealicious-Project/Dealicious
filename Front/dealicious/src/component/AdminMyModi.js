import { useState, useEffect } from 'react';
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";
import { Button, Input, Table } from 'reactstrap';
import axios from "axios";
import { useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';
import { useWebSocket } from './WebSocketProvider';

const AdminMyModi = () => {
  const [admin, setAdmin] = useState({ adminid: '', accountid: '', bank: '', balance: '' })
  const admin1 = useSelector(state => state.persistedReducer.admin);
  const { url } = useWebSocket();
  const navigate = useNavigate();

  useEffect(()=> {
    setAdmin({ adminid: admin1.adminid, accountid: admin1.accountid, bank: admin1.bank, balance: admin1.balance });
}, [])


  const [data,setData] = useState({adminid:admin1.adminid, currentpassword:'', changepassword1:'', changepassword2:''});
  const changePassword = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  const changeadminpassword = () => {
    axios.post(url+"changeadminpassword", data)
            .then(res => {
                alert(res.data);
                navigate(`/adminmy`);
            })
            .catch(err => {
                console.log(err)
            })
  };

  return (
    <div className='admin' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", paddingTop: "10px" }}>
      <div style={{ width: "395px", textAlign: "left", fontSize: "20px", fontWeight: "bold", paddingLeft: "15px", paddingTop: "20px", paddingBottom: "20px" }}>
        마이페이지 수정하기
      </div>
      <div style={{ width: "395px", borderTop: "1px solid", borderBottom: "1px solid" }}>
        <Table borderless style={{ textAlign: "left" }}>
          <thead style={{borderBottom:"1px solid lightgray"}}>
            <th>기본정보</th><th></th><th></th>
          </thead>
          <tbody>
            <tr>
              <td>아이디</td><td>dealadmin1</td><td></td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div style={{ width: "395px", borderBottom: "1px solid", marginBottom:"20px" }}>
        <Table borderless style={{ textAlign: "left" }}>
          <thead style={{borderBottom:"1px solid lightgray"}}>
            <th>비밀번호 변경</th>
          </thead>
          <tbody>
            <tr>
              <td><Input type='password' name='currentpassword' value={data.currentpassword} onChange={changePassword} style={{ width: "371px", height: "45px", borderRadius: "10px", border: "1px solid gray" }} placeholder='현재 비밀번호를 입력하세요'></Input></td>
            </tr>
            <tr>
              <td><Input type='password' name='changepassword1' style={{ width: "371px", height: "45px", borderRadius: "10px", border: "1px solid gray" }} onChange={changePassword} value={data.changepassword1} placeholder='변경할 비밀번호를 입력하세요'></Input></td>
            </tr>
            <tr>
              <td><Input type='password' name='changepassword2' style={{ width: "371px", height: "45px", borderRadius: "10px", border: "1px solid gray" }} onChange={changePassword} value={data.changepassword2} placeholder='변경할 비밀번호를 한번 더 입력하세요'></Input></td>
            </tr>
          </tbody>
        </Table>
      </div>

        <Button style={{ width: "200px", height: "45px", backgroundColor: "#14C38E", borderStyle:"none", color: "white" } } onClick={changeadminpassword}>변경하기</Button>
    </div>
  );
}

export default AdminMyModi;
