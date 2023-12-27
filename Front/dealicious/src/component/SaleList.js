import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import { FiPlusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { FaArrowRight } from 'react-icons/fa6';
import { useWebSocket } from './WebSocketProvider';

const SaleList = () => {
  const { url } = useWebSocket();
  const [saleList, setSaleList] = useState([]);
  const { category, keyword } = useParams();
  const [page, setPage] = useState(1); // 페이지 번호
  const user = useSelector(state => state.persistedReducer.user);
  const token = useSelector(state => state.persistedReducer.token);
  const observerRef = useRef(null);
  const formatPrice = (amount) => {
    if (!amount) return '';
    const numericPrice = parseInt(amount.replace(/[^0-9]/g, ''));

    // 숫자를 천단위로 포맷팅합니다.
    const formattedPrice = numericPrice.toLocaleString('ko-KR');
    return `${formattedPrice}원`;
  };
  const timediff = (writedate) => {
    const currentDate = new Date(); // 현재 날짜와 시간
    const writeDate = new Date(writedate); // 주어진 날짜

    const diffInMilliseconds = currentDate - writeDate; // 밀리초 단위의 시간 차이
    const diffInMinutes = diffInMilliseconds / (1000 * 60); // 분 단위의 차이

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}분 전`;
    } else if (diffInMinutes < 1440) {
      const hoursDiff = Math.floor(diffInMinutes / 60);
      const remainingMinutes = Math.floor(diffInMinutes % 60);
      return `${hoursDiff}시간 전`;
    } else {
      const daysDiff = Math.floor(diffInMinutes / 1440);
      return `${daysDiff}일 전`;
    }

  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {//IntersectionObserver를 생성하여 관찰 대상 요소(observerRef.current)의 교차점을 감시
      if (entries[0].isIntersecting && saleList.length > 0) {//관찰 대상 요소가 뷰포트와 교차되고 데이터가 있을 때(saleList.length > 0), Axios를 사용하여 서버에서 데이터를 가져오는 GET 요청
        if (category == null && keyword == null) {
          if(user.email === "" || user.email === undefined) {
            axios.get(url + `salelist/${page + 1}`)
            .then(res => {
              const newSaleList = res.data;//새로운 데이터가 수신되면(newSaleList.length > 0), setSaleList 함수를 사용하여 새 데이터를 기존 saleList에 추가하고 페이지 번호를 업데이트
              if (newSaleList.length > 0) {
                setSaleList(prevSaleList => [...prevSaleList, ...newSaleList]);
                setPage(page + 1);
              } else {    //새로운 데이터가 없으면 Intersection Observer를 중지하여 추가 요청을 방지
                observer.disconnect();
              }
            })
            .catch(err => {
              console.log(err);
            });
          } else {
            axios.get(url + `salelistbyuser/${page + 1}`,{
              headers: {
                Authorization: token,
              }
            })
            .then(res => {
              const newSaleList = res.data;
              if (newSaleList.length > 0) {
                setSaleList(prevSaleList => [...prevSaleList, ...newSaleList]);
                setPage(page + 1);
              } else {    
                observer.disconnect();
              }
            })
            .catch(err => {
              console.log(err);
            });
          }
          
        } else if (keyword == null) {
          if(user.email === "" || user.email === undefined) {
          axios.get(url + `salelist/${page + 1}/${category}`)
            .then(res => {
              const newSaleList = res.data;
              if (newSaleList.length > 0) {
                setSaleList(prevSaleList => [...prevSaleList, ...newSaleList]);
                setPage(page + 1);
              } else {    
                observer.disconnect();
              }
            })
            .catch(err => {
              console.log(err);
            });
          } else {
            axios.get(url + `salelistbyuser/${page + 1}/${category}`,{
              headers: {
                Authorization: token,
              }
            })
            .then(res => {
              const newSaleList = res.data;
              if (newSaleList.length > 0) {
                setSaleList(prevSaleList => [...prevSaleList, ...newSaleList]);
                setPage(page + 1);
              } else {    
                observer.disconnect();
              }
            })
            .catch(err => {
              console.log(err);
            });
          }
        } else {
          if(user.email === "" || user.email === undefined) {
            axios.get(url + `salesearchlist/${page + 1}/${keyword}`)
            .then(res => {
              const newSaleList = res.data;
              if (newSaleList.length > 0) {
                setSaleList(prevSaleList => [...prevSaleList, ...newSaleList]);
                setPage(page + 1);
              } else {    
                observer.disconnect();
              }
            })
            .catch(err => {
              console.log(err);
            });
          } else {
            axios.get(url + `salesearchlistbyuser/${page + 1}/${keyword}`,{
              headers: {
                Authorization: token,
              }
            })
            .then(res => {
              const newSaleList = res.data;
              if (newSaleList.length > 0) {
                setSaleList(prevSaleList => [...prevSaleList, ...newSaleList]);
                setPage(page + 1);
              } else {    
                observer.disconnect();
              }
            })
            .catch(err => {
              console.log(err);
            });
          }
          
        }
      }
    }, { threshold: 1 });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {//컴포넌트가 언마운트되거나 의존성인 page 또는 saleList.length가 변경될 때 옵저버를 해제
      if (observerRef.current) {
        observer.disconnect(); // 컴포넌트가 언마운트될 때 Observer를 해제합니다.
      }
    };
  }, [page, saleList.length]);

  useEffect(() => {
    if (category == null && keyword == null) {
      console.log(user)
      if(user.email === "" || user.email === undefined) {
        axios.get(url + `salelist/${page}`)
        .then(res => {
          console.log(res);
          setSaleList([]);
          setSaleList((_sale_list) => [
            ..._sale_list, ...res.data
          ]);
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        axios.get(url + `salelistbyuser/${page}`,{
          headers: {
            Authorization: token,
          }
        })
        .then(res => {
          console.log(res);
          setSaleList([]);
          setSaleList((_sale_list) => [
            ..._sale_list, ...res.data
          ]);
        })
        .catch(err => {
          console.log(err);
        })
      }
      
    } else if (keyword == null) {
      if(user.email === "" || user.email === undefined) {
      axios.get(url + `salelist/${page}/${category}`)
        .then(res => {
          console.log(res);
          setSaleList([]);
          console.log(res.data);
          setSaleList((_sale_list) => [
            ..._sale_list, ...res.data
          ]);
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        axios.get(url + `salelistbyuser/${page}/${category}`,{
          headers: {
            Authorization: token,
          }
        })
        .then(res => {
          console.log(res);
          setSaleList([]);
          console.log(res.data);
          setSaleList((_sale_list) => [
            ..._sale_list, ...res.data
          ]);
        })
        .catch(err => {
          console.log(err);
        })
      }
    } else {
      if(user === "" || user === undefined) {
        axios.get(url + `salesearchlist/${page}/${keyword}`)
        .then(res => {
          console.log(res);
          setSaleList([]);
          console.log(res.data);
          setSaleList((_sale_list) => [
            ..._sale_list, ...res.data
          ]);
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        axios.get(url + `salesearchlistbyuser/${page}/${keyword}`,{
          headers: {
            Authorization: token,
          }
        })
        .then(res => {
          console.log(res);
          setSaleList([]);
          console.log(res.data);
          setSaleList((_sale_list) => [
            ..._sale_list, ...res.data
          ]);
        })
        .catch(err => {
          console.log(err);
        })
      }
     
    }

  }, []);


  console.log(user.email);

  return (
    <div className='main' style={{ textAlign: 'left', overflow: "scroll", height: "632px", overflowX: "hidden", paddingLeft: "20px", paddingRight: "20px", paddingTop: "0px", paddingBottom:"0px" }}>
      {user.email === "" || user.email === undefined ?
        <Link to="/mypagenl" style={{ marginLeft: "330px", marginTop: "550px", textAlign: "right", position: "absolute", backgroundColor: "white", width: "40px", height: "40px", borderRadius: "50px" }}><FiPlusCircle size="40" color="#14C38E" /></Link>
        : <Link to="/salewrite" style={{ marginLeft: "330px", marginTop: "550px", textAlign: "right", position: "absolute", backgroundColor: "white", width: "40px", height: "40px", borderRadius: "50px" }}>
          <FiPlusCircle size="33" color="#14C38E" />
        </Link>}
      {saleList.length === 0 ?
        <div style={{ textAlign: "center", marginTop: "50px", width: "305px", marginLeft: "40px" }}>
          <img src="\ggulee.png" style={{ width: "100px" }} /><br />
          <b>현재 텅 비어있어요!</b><br />
          <a style={{ color: '#14C38E', fontWeight: "bold" }}>{user.type === "" || user.type === undefined ? "딜리셔스" : user.type === "univ" ? "우리 학교" : "우리 회사"}</a>에서 안전한 중고거래<br />
          <Link to="/salewrite" style={{ color: "black" }}>내가 먼저 시작하기<FaArrowRight /></Link>
        </div> :
        <div>
          <div style={{ color: "#14C38E", marginTop: "5px" }}>
            {user.typename}
          </div>
          {saleList.map((item, index) =>
            <Link to={"/saledetail/only-detail/" + item.num} key={index} style={{ textDecoration: "none", color: "black" }}>
              <div style={{ paddingTop: "10px", paddingBottom: "10px", borderBottom: "1px solid lightgray", height: "120px" }}>
                <div>
                  <div style={{ display: "flex" }} >
                    {item.fileurl == null ? <img src='./profile.png' width="130px" height="87px" />
                      : <img src={url + `img/${item.fileurl.split(',')[0]}`} width="100px" height="100px" style={{ borderRadius: "10px" }} />}

                    <div style={{ textAlign: "left", marginLeft: "15px", width: "265px" }}>
                      <div style={{ fontSize: "18px", width:"265px" }}>
                        {item.title.length > 20 ? `${item.title.slice(0, 20)}...` : item.title}
                      </div>
                      <div style={{ display: "flex", width:"265px" }}>
                        <div style={{ fontSize: "15px" }}>{item.place}</div>
                      </div>
                      <div style={{ textAlign: "right", width: "55px", width: "265px" }}>
                        {item.ggull == 0 ? <img src='' style={{ width: "35px" }} /> : <img src='/ggul.png' style={{ width: "35px" }} />}
                      </div>
                      <div style={{ display: "flex" }}>
                        <div style={{ fontSize: "16px", fontWeight: "bold", textAlign: "left", width: "170px", display: "flex" }}>{formatPrice(item.amount)}{item.status === "수령완료" || item.status === "거래완료" ? <div style={{ fontSize: "12px", fontWeight: "normal", marginLeft: "5px", backgroundColor:"#E9E9E9", width:"60px", textAlign:"center", lineHeight:"24px", borderRadius:"5px", fontWeight:"bold", color:"darkgray" }}>판매완료</div> : ""}</div>
                        <div style={{ width: "95px", textAlign: "right" }}>
                          {timediff(item.writedate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </Link>

          )}
        </div>}
      <div ref={observerRef} style={{ height: '10px' }} />
    </div>

  )
}
export default SaleList;