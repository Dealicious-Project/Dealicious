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
  const [payList, setPayList] = useState([]);

  const [selected, setSelected] = useState("토픽 선택");

  const handleSelect = (e) => {
    console.log(e.target.value);
    setSelected(e.target.value);
    axios.get(url + `adminmain/` + e.target.value)
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

    axios.get(url + `adminmain/` + "all")
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
  const formatPrice = (amount) => {
    if (!amount) return '';
    const numericPrice = parseInt(amount.replace(/[^0-9]/g, ''));

    // 숫자를 천단위로 포맷팅합니다.
    const formattedPrice = numericPrice.toLocaleString('ko-KR');
    return `${formattedPrice}원`;
  };
  return (
    <div className='admin' style={{ overflow: "scroll", height: "632px", overflowX: "hidden" }}>
      <div style={{ textAlign: "left", marginBottom: "7px" }}>
        <select value={selected} style={{ border: "1px solid lightgray", borderRadius: "10px", width: "133px", height: "35px", textAlign: "left" }} onChange={handleSelect}>
          {selectList.map((item) => {
            return <option style={{ fontSize: "12px" }} value={item.value} key={item.value}>
              &nbsp;&nbsp;{item.name}
            </option>;
          })}
        </select>
      </div>
      <Table className="table" style={{ margin: "0 auto", width: "395px", fontSize:"14px" }}>
        <thead>
          <tr style={{ fontWeight: "550" }}>
            <td>번호</td><td>상태</td><td>제목</td><td>가격</td>
          </tr>
        </thead>
        {payList.map((item, index) =>
          <tbody>
            <tr key={index}>
              <td>{item.paynum}</td>
              <td>{item.status}</td>
              <td>{item.title.length > 11 ? `${item.title.slice(0, 11)}...` : item.title}</td>
              <td>{formatPrice(item.amount)}</td>
            </tr>
          </tbody>)}

      </Table>
    </div>
  );
}

export default AdminMain;
