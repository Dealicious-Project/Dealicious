import { useEffect, useState } from 'react';
import { GoArrowLeft } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useWebSocket } from './WebSocketProvider';

const Keyword = () => {
  const { url } = useWebSocket();
  const [keyword, setKeyword] = useState();
  const [keywordList, setKeywordList] = useState([]);
  const token = useSelector(state => state.persistedReducer.token);

  useEffect(() => {
    axios.get(url+`keywordlist`, {
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
    axios.get(url+`registerkeyword/` + keyword, {
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
    axios.post(url+`deletekeyword`, item, {
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

    <div className='main' style={{overflow:"scroll", height:"632px", overflowX:"hidden", paddingTop:"10px"}}>
      <br/>
      <div style={{textAlign:"left",color:"gray"}}>
      <Link to="/notikeyword"><GoArrowLeft  size={30} style={{color:"gray"}}/></Link>&nbsp;&nbsp;&nbsp;<a style={{fontSize:"18px"}}>알림 키워드 등록</a>
      </div>
      <br />
      <table>
        <tr style={{ height: "40px" }}>
          <td style={{ width: "320px", borderBottom: "1px solid gray" }}><input onChange={handleInputChange} style={{ width: "320px", border: "white" }} placeholder='키워드를 입력해주세요.(예:자전거)' value={keyword}></input></td>
          <td style={{ width: "10px" }}></td>
          <td style={{ width: "55px" }}><button style={{ width: "55px", borderRadius: "15px", backgroundColor: "#14C38E", border: "white", fontWeight: "bold", color: "white", height: "40px" }} onClick={registerKeyword}>등록</button></td>
        </tr>
      </table>
      <br />
      <p style={{ fontWeight: "bold", textAlign: "left" }}>등록한 키워드</p>
      <table>
        <tbody>
          {keywordList.map((item, index) =>
            <tr key={index}>
              <td style={{paddingLeft:"20px", textAlign: "left", width:"130px" }}>{item.content}</td>
              <td><AiOutlineClose onClick={()=>deletekeyword(item)} style={{cursor:"pointer"}}/></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Keyword;
