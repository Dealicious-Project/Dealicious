import {useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Button, Col, FormGroup, Input, Table } from 'reactstrap';
import axios from "axios";

const AdminSettle = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [checkItems, setCheckItems] = useState([])
  const [payList,setPayList] = useState([]);
  
  useEffect(() => {

    axios.get(`${url}/adminsettle`)
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



  const checkItemHandler = (isChecked,id) => {
    if (isChecked) {
      console.log("1");
      console.log(id);
      setCheckItems((prev) => [...prev, id]) 
    } else {
      console.log("2");
      console.log(id);
      setCheckItems(checkItems.filter((item) => item !== id)) 
    }
    console.log(checkItems);
  }

  const allCheckedHandler = (checked) => {
    if (checked) { 
      const checkedListArray= [];
      payList.forEach((item) => checkedListArray.push(item.paynum));
      setCheckItems(checkedListArray);
    } else {
      setCheckItems([]);
    }
    console.log(checkItems);
    console.log(`allCheck = `, checked)
  };

  useEffect(() => {
    console.log(checkItems);
  }, [checkItems]);

  const settle = () => {
    console.log("여기옴?")
    var temp = checkItems.join();
    const settlelist = {data:temp};
    axios.post(`${url}/settle`,settlelist)
    .then(res => {
      console.log(res);
      setModalIsOpen(false);
      window.location.href="/adminsettle";
    })
    .catch(err => {
      console.log(err);
    })
    
  }

  return (
    <div className='admin' style={{ overflow: "scroll", height: "632px", overflowX: "hidden" }}>
      <div>
        <FormGroup row style={{ width: "395px", margin: "0 auto", paddingTop: "20px" }}>
          <Col sm={6} style={{ textAlign: "left", fontWeight: "bold", fontSize: "20px" }}>
            수령완료 상품 정산
          </Col>
          <Col sm={6} style={{ textAlign: "right" }}>
            <Button style={{ backgroundColor: "#14C38E", borderStyle: "none" }} onClick={() => setModalIsOpen(true)}>정산하기</Button>
            <Modal className='main' style={{
              content: {
                width: "350px", height: "160px", position: "absolute",
                top: "30%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", border: "1px solid lightgray", borderRadius: "10px"
              }
            }} isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} ariaHideApp={false}>
              <div style={{ textAlign: "center" }}>
                <br />
                <p>N건의 거래를 정산 하시겠습니까?</p>
                <button style={{ width: "90px", borderRadius: "5px", backgroundColor: "gray", border: "white", fontWeight: "bold", color: "white" }} onClick={() => setModalIsOpen(false)}>취소하기</button>&nbsp;&nbsp;&nbsp;
                <button style={{ width: "90px", borderRadius: "5px", backgroundColor: "#14C38E", border: "white", fontWeight: "bold", color: "white" }} onClick={settle}>정산하기</button>
              </div>
            </Modal>
          </Col>
        </FormGroup>
        <Table className="table" style={{ margin: "0 auto", width: "395px" }}>
          <thead>
            <tr style={{ fontWeight: "bold" }}>
              <td>번호</td><td>제목</td><td>가격</td><td><input type='checkbox' name='select-all'
              onChange={(e) => allCheckedHandler(e.target.checked)}
              checked={checkItems.length === payList.length ? true : false} /></td>
            </tr>
          </thead>
          {payList.map((item, index) =>
          <tbody>
          <tr key={index}>
          <td>{item.paynum}</td>
          <td>{item.title}</td>
          <td>{item.amount}</td>
          <td> <input type='checkbox' id={item.paynum}
                onChange={(e) => checkItemHandler(e.target.checked, item.paynum)}
                checked={checkItems.includes(item.paynum) ? true : false} /></td>
        </tr>
        </tbody>)}
        </Table>
      </div>
    </div>
  );
}

export default AdminSettle;
