import { Table } from "reactstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useWebSocket } from './WebSocketProvider';

const AdminMain = () => {
  const { url } = useWebSocket();
  const selectList = [
    { value: "all", name: "전체" },
    { value: "결제완료", name: "결제완료" },
    { value: "수령완료", name: "수령완료" },
    { value: "거래완료", name: "거래완료" }
  ];
  const [payList,setPayList] = useState([]);

  const [selected, setSelected] = useState("토픽 선택");

  const handleSelect  = (e) => {
    console.log(e.target.value);
    setSelected(e.target.value);
    axios.get(url+`adminmain/`+e.target.value)
      .then(res => {
        console.log(res);
        setPayList([]);
        setPayList((_pay_list) => [
          ..._pay_list, ...res.data
        ]);
      })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {

    axios.get(url+`adminmain/`+"all")
      .then(res => {
        console.log(res);
        setPayList([]);
        setPayList((_pay_list) => [
          ..._pay_list, ...res.data
        ]);
      })
      .catch(err => {
        console.log(err);
      })
}, []);

  return (
    <div className='admin' style={{ overflow: "scroll", height: "632px", overflowX: "hidden" }}>
      <div style={{textAlign:"left", marginBottom:"10px"}}>
        <select value={selected} style={{ border: "1px solid lightgray", marginTop: "12.5px", borderRadius: "10px", width: "133px", height: "45px", textAlign: "left" }} onChange={handleSelect}>
        {selectList.map((item) => {
            return <option value={item.value} key={item.value}>
              &nbsp;&nbsp;{item.name}
            </option>;
          })}
        </select>
      </div>
      <Table className="table" style={{ margin: "0 auto", width: "395px" }}>
        <thead>
          <tr style={{ fontWeight: "bold" }}>
            <td>번호</td><td>상태</td><td>제목</td><td>가격</td>
          </tr>
        </thead>
          {payList.map((item, index) =>
          <tbody>
          <tr key={index}>
          <td>{item.paynum}</td>
          <td>{item.status}</td>
          <td>{item.title}</td>
          <td>{item.amount}</td>
        </tr>
        </tbody>)}
       
      </Table>
    </div>
  );
}

export default AdminMain;
