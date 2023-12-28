import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { IoIosSearch } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import { useState } from "react";
import axios from "axios";
import { useWebSocket } from './WebSocketProvider';

const Join2 = () => {
  const { url } = useWebSocket();
  const [typename, setTypename] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const type = location.state?.type;
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!typename) {
      setErrorMessage("키워드를 입력하세요");
    } else {
      if (type === "univ") {
        axios.post(url+'univ/getSchoolName', { typename: typename })
          .then(response => {
            setSearchResults(response.data);
          })
          .catch(error => {
            console.error('Error making AJAX request:', error);
          });
      } else if (type === "com") {
        axios.post(url+'corp/getCorpName', { typename: typename })
          .then(response => {
            setSearchResults(response.data);
          })
          .catch(error => {
            console.error('Error making AJAX request:', error);
          });
      }
    }
  };

  const handleClick = () => {
    if (!typename) {
      setErrorMessage("키워드를 입력하세요");
    } else {
      handleSearch();
      navigate('/join3', { state: { type: type, typename: typename } });
      console.log(typename);
    }
  };

  const handleResultClick = (value) => {
    setTypename(value);
  };

  return (
    <div className='main' style={{ overflow: "scroll", height: "742px", overflowX: "hidden", paddingTop: "45px", paddingRight: "50px", paddingLeft: "50px" }}>
      <div style={{ width: "330px", textAlign: "right" }}>
        <Link to={"/login"}><CgClose size={30} color="darkgray" /></Link>
      </div>
      <a style={{ fontSize: "30px", fontWeight: "bold", textAlign: "center", color: "#14C38E" }}>회원가입</a>
      <div style={{ paddingBottom: "50px" }}></div>
      <FormGroup>
        <br /><br /><br />
        <Label for="select" style={{ fontSize: "25px", fontWeight: "550" }}>{type === "univ" ? "학생" : "직장인"}</Label>
        <br />
      </FormGroup>
      <FormGroup style={{ paddingBottom: "12px" }}>
        <div style={{ display: "flex" }}>
          <Input
            type="text"
            name="typename"
            id="typename"
            style={{ width: "300px", height: "55px", backgroundColor: "#F9F9F9", border: "1px solid #EDEDED" }}
            placeholder="키워드를 입력하세요"
            onChange={(e) => setTypename(e.target.value)}
            value={typename}
          />&nbsp;
          <IoIosSearch size='35' style={{ marginTop: "10px", cursor: "pointer" }} onClick={handleSearch} />
        </div>
        <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: "10px", textAlign: "left" }}>{!typename ? errorMessage : ""}</div>
        {/* 검색 결과 출력 */}
        <div style={{ textAlign: "left", height: "180px", cursor: "pointer", maxHeight: "180px", overflowY: "auto" }}>
          {searchResults.length === 0 ? "검색결과가 없습니다" : searchResults.map((result, index) => (
            <div key={index} value={result} onClick={() => handleResultClick(result)}>{result}</div>
          ))}
        </div>
      </FormGroup>
      <Button style={{ width: "325px", height: "55px", fontSize: "20px", backgroundColor: "#14C38E", borderStyle: "none", lineHeight: "35px" }}
        onClick={handleClick}>다음(2/4)</Button>
    </div>
  );
}

export default Join2;