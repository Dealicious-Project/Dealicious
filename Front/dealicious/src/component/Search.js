
import axios from 'axios';
import { useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { useWebSocket } from './WebSocketProvider';

const Search = () => {
  const { url } = useWebSocket();
  const [keyword, setKeyword] = useState();
  const [hotlist, setHotlist] = useState([]);
  const navigate = useNavigate();
  const search = () => {
    axios.get(url + `search/${keyword}`)
      .then(res => {
        console.log("검색어 추가완료");
        navigate(`/salelist/search/${keyword}`);
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    axios.get(url + `hotlist`)
      .then(res => {
        console.log(res.data);
        setHotlist([]);
        setHotlist((hotlist) => [
          ...hotlist, ...res.data
        ]);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", paddingTop: "10px" }}>
      <br />
      <div style={{ display: "flex", width: "390px" }}>
        <div style={{ lineHeight: "30px" }}>
          <Link to="/"><GoArrowLeft size={20} style={{ color: "gray" }} /></Link>
        </div>
        <div style={{ textAlign: "left", color: "gray", width: "320px", borderBottom: "1px solid gray", height: "40px" }}>
          <input style={{ marginLeft: "10px", border: "white", width: "280px", lineHeight: "30px" }} placeholder='어떤 물품을 원하시나요?' onChange={(e) => setKeyword(e.target.value)} value={keyword}></input>
        </div>
        <div style={{ width: "70px", textAlign: "right" }}>
          <Button style={{ marginLeft: "10px", width: "50px", backgroundColor: "#14C38E", borderStyle: "none", color: "white", height: "40px", fontSize: "13px" }} onClick={search}>검색</Button>
        </div>
      </div>
      <br />
      <div style={{ fontWeight: "bold", textAlign: "left", marginBottom: "5px" }}>인기 검색어</div>
      {hotlist.map((item, index) =>
        <Link to={"/salelist/" + item.content} key={index} style={{ textDecoration: "none", color: "black" }}>
          <div style={{ height: "25px", marginLeft: "20px", textAlign: "left", fontSize:"15px" }}>{item.content}</div>
        </Link>
      )}

    </div>
  );
}

export default Search;
