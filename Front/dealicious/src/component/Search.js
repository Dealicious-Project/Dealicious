
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
    axios.get(url+`search/${keyword}`)
      .then(res => {
        console.log("검색어 추가완료");
        navigate(`/salelist/search/${keyword}`);
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    axios.get(url+`hotlist`)
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
      <div style={{ display: "flex" }}>
        <div style={{ textAlign: "left", color: "gray", width: "320px", borderBottom: "1px solid gray", height: "40px" }}>
          <Link to="/"><GoArrowLeft size={30} style={{ color: "gray" }} /></Link><input style={{ marginLeft: "10px", border: "white", width: "280px" }} placeholder='어떤 물품을 원하시나요?' onChange={(e) => setKeyword(e.target.value)} value={keyword}></input>
        </div><Button style={{ marginLeft: "10px", width: "50px", backgroundColor: "#14C38E", borderStyle: "none", color: "white", height: "40px", fontSize:"13px" }} onClick={search}>검색</Button>
      </div>

      <br />
      <p style={{ fontWeight: "bold", textAlign: "left" }}>인기 검색어</p>

      {hotlist.map((item, index) =>
      <Link to={"/salelist/"+item.content} key={index} style={{textDecoration: "none", color: "black" }}>

          <div style={{ height:"35px",marginLeft:"20px",textAlign: "left" }}>{item.content}</div>

      </Link>
      )} 

    </div>
  );
}

export default Search;
