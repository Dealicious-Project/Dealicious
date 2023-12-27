import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

const AdminMy = () => {

  const [admin, setAdmin] = useState({ adminid: '', accountid: '', bank: '', balance: '' })
  const admin1 = useSelector(state => state.persistedReducer.admin);

  useEffect(()=> {
    setAdmin({ adminid: admin1.adminid, accountid: admin1.accountid, bank: admin1.bank, balance: admin1.balance });
}, [])
  return (
    <div className='admin' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", paddingTop: "10px" }}>
      <div style={{ width: "395px", textAlign: "left", fontSize: "20px", fontWeight: "bold", paddingLeft: "15px", paddingTop: "20px", paddingBottom: "20px" }}>
        마이페이지
      </div>
      <div style={{ width: "395px", borderTop: "1px solid", borderBottom: "1px solid", marginBottom: "20px" }}>
        <Table borderless style={{ textAlign: "left" }}>
          <thead style={{ borderBottom: "1px solid lightgray" }}>
            <th>기본정보</th><th></th>
          </thead>
          <tbody>
            <tr>
              <td>아이디</td><td>{admin.adminid}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Link to="/adminmymodi">
        <Button style={{ width: "200px", height: "45px", backgroundColor: "#14C38E", borderStyle: "none", color: "white" }}>비밀번호 수정</Button>
      </Link>
    </div>
  );
}

export default AdminMy;
