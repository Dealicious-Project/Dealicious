import { useEffect, useState } from 'react';
import { GoArrowLeft } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useWebSocket } from './WebSocketProvider';
import { Button } from 'reactstrap';

const Keyword = () => {
  const { url } = useWebSocket();
  const [keyword, setKeyword] = useState();
  const [keywordList, setKeywordList] = useState([]);
  const token = useSelector(state => state.persistedReducer.token);

  useEffect(() => {
    axios.get(url + `keywordlist`, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        console.log(res.data);
        setKeywordList((_keyword_list) => [
          ..._keyword_list, ...res.data
        ]);
      })
      .catch(err => {
        console.log(err);
      })

  }, [])

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const registerKeyword = () => {
    axios.get(url + `registerkeyword/` + keyword, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        console.log(res.data);
        setKeywordList((_keyword_list) => [
          ..._keyword_list, res.data
        ]);
        setKeyword('');
      })
      .catch(err => {
        console.log(err);
      })
  }

  const deletekeyword = (item) => {
    const updatedList = keywordList.filter(keyword => keyword.content !== item.content);
    axios.post(url + `deletekeyword`, item, {
      headers: {
        Authorization: token,
      }
    })
      .then(res => {
        console.log(res.data);
        setKeywordList(updatedList);
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", paddingTop: "10px" }}>
      <br />
      <div style={{ display: "flex", width: "390px" }}>
        <div style={{ lineHeight: "30px" }}>
          <Link to="/notiKeyword"><GoArrowLeft size={20} style={{ color: "gray" }} /></Link>
        </div>
        <div style={{ textAlign: "left", color: "gray", width: "320px", borderBottom: "1px solid gray", height: "40px" }}>
          <input onChange={handleInputChange} style={{ marginLeft: "10px", border: "white", width: "280px", lineHeight: "30px" }} placeholder='키워드를 입력해주세요.(예:자전거)' value={keyword}></input>
        </div>
        <div style={{ width: "70px", textAlign: "right" }}>
          <Button style={{ marginLeft: "10px", width: "50px", backgroundColor: "#14C38E", borderStyle: "none", color: "white", height: "40px", fontSize: "13px" }} onClick={registerKeyword}>등록</Button>
        </div>
      </div>
      <br />
      <div style={{ fontWeight: "bold", textAlign: "left", marginBottom: "5px" }}>나의 키워드</div>
      {keywordList.map((item, index) =>
        <div key={index} style={{ display: "flex" }}>
          <div style={{ paddingLeft: "20px", textAlign: "left", width: "130px" }}>{item.content}</div>
          <div><AiOutlineClose onClick={() => deletekeyword(item)} style={{ cursor: "pointer" }} /></div>
        </div>
      )}
    </div>
  );
}

export default Keyword;
