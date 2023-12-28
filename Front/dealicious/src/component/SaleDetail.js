import React, { useState, useEffect } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import "./img.css";
import { Button, Input } from "reactstrap";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from 'sweetalert2';
import { useWebSocket } from './WebSocketProvider';


function SaleDetail() {
  const { url } = useWebSocket();
  const Image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  const user = useSelector(state => state.persistedReducer.user);
  const [writer, setwriter] = useState({ nickname: '', typename: '', fileurl: '', ggull: '', email: '', id: '' });

  const selectList = [
    { value: "판매중", name: "판매중" },
    { value: "예약중", name: "예약중" },
    { value: "거래완료", name: "판매완료" }
  ];

  const handleSelect = (e) => {
    setSale(prevSale => ({
      ...prevSale,
      status: e.target.value
    }));
    axios.get(url + `changesalestatus/${num}/${e.target.value}`)
      .then(res => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const { sect, num } = useParams();
  const token = useSelector(state => state.persistedReducer.token);
  const [sale, setSale] = useState({
    num: "",
    email: "",
    title: "",
    type: "",
    amount: "",
    category: "",
    content: "",
    place: "",
    fileurl: "",
    status: null,
    ggull: "",
    viewcount: null,
    zzimcnt: "",
    buyeremail: "",
    writerdate: "",
  });
  const [heart, setHeart] = useState(false);
  const navigate = useNavigate();
  const formatPrice = (amount) => {
    if (!amount) return '';
    const numericPrice = parseInt(amount.replace(/[^0-9]/g, ''));

    const formattedPrice = numericPrice.toLocaleString('ko-KR');
    return `${formattedPrice}원`;
  };



  useEffect(() => {
    if (user.email === "" || user.email === undefined) {
      axios
        .get(url + `saledetail/${sect}/${num}`)
        .then(res => {
          console.log(res.data);

          setwriter({
            nickname: res.data.nickname,
            typename: res.data.typename,
            fileurl: res.data.profileimgurl,
            email: res.data.email,
            id: res.data.id
          });

          setSale(res.data.sale);
          setHeart(res.data.heart);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(url + `saledetail/${sect}/${user.email}/${num}`)
        .then(res => {
          console.log(res.data);

          setwriter({
            nickname: res.data.nickname,
            typename: res.data.typename,
            fileurl: res.data.profileimgurl,
            email: res.data.email,
            id: res.data.id
          });

          setSale(res.data.sale);
          setHeart(res.data.heart);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const convertCategoryToKorean = (category) => {
    switch (category) {
      case "mobile":
        return "모바일/태블릿";
      case "pc":
        return "노트북/PC";
      case "ticket":
        return "티켓/쿠폰";
      case "clothes":
        return "의류";
      case "free":
        return "나눔";
      case "others":
        return "기타";
      default:
        return category;
    }
  };
  const selectGood = () => {
    if (user.email === '' || user.email === undefined) {
      Swal.fire({
        icon: 'info',
        title: '로그인이 필요합니다.',
        text: '로그인 후에 찜하기 기능을 사용할 수 있습니다.',
        confirmButtonText: '확인',
      });
    } else {
      axios.get(url + `salelike/${user.email}/${num}`)
        .then(res => {
          console.log(res.data)
          setSale({ ...sale, zzimcnt: res.data.zzimCnt });
          setHeart(res.data.isSelect);
        })
    }
  };

  const gochat = () => {
    if (user.email !== '' && user.email !==null && user.email !==undefined) {
      console.log(user)
      const uniqueString = uuidv4();
      const chatRoom = { channelId: uniqueString, creator: user.email, partner: writer.email, saleNum: num };
      console.log(chatRoom);
      axios.post(url + `findchatroom`, chatRoom, {
        headers: {
          Authorization: token,
        }
      })
        .then(res => {
          console.log(res.data);
          navigate(`/chat/${res.data}`);
        })
        .catch((err) => {
          console.log(err);
        });


    } else {
      alert("로그인 해주세요");
    }
  };
  const goToEditPage = () => {
    navigate(`/salemodify/${num}`);
  }

  const pay = () => {
    if (user.email === writer.email) {
      alert("내가 작성한 글에는 누를 수 없습니다")
    } else if (user.email == '' || user.email === undefined) {
      alert("로그인해주세요")
    } else if (user.email !== writer.email && user.email !== '') {
      const uniqueString = uuidv4();
      const chatRoom = { channelId: uniqueString, creator: user.email, partner: writer.email, saleNum: num };
      console.log(chatRoom);
      axios.post(url + `findchatroom`, chatRoom, {
        headers: {
          Authorization: token,
        }
      })
        .then(res => {
          console.log(res.data);
          navigate(`/gpay/${num}`);
        })
        .catch((err) => {
          console.log(err);
        });

    }

  }


  const fileurlList = sale.fileurl.split(',').map(url => url.trim());
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // const backButton = () => {
  //   navigate(-1);
  // }

  return (
    <div
      className="main"
      style={{
        textAlign: "left",
        overflow: "scroll",
        height: "632px",
        overflowX: "hidden",
      }}
    >
      <div style={{ marginTop: "10px", marginBottom: "20px", display: "flex" }}>
        <Link to="/salelist">
          <div><IoArrowBackOutline size="30" color="14C38E" /></div>
        </Link>
        <div
          style={{
            color: "#14C38E",
            fontSize: "20px",
            textAlign: "center",
            width: "360px"
          }}
        >
          <b>{sale.title}</b>
        </div>
      </div>

      <div>
        <div style={{ paddingBottom: "20px" }}>
          <Slider {...settings}>
            {fileurlList.map((imgnum, index) => (
              <div key={index}>
                <img
                  src={url + `img/${imgnum}`}
                  alt={`slide-${index}`}
                  style={{ width: "390px", height: "210px", borderRadius: "10px" }}
                />
              </div>
            ))}
          </Slider>
        </div>

        <div style={{ marginTop: "15px" }}>
          <div style={{ display: "flex" }}>
            <div rowSpan={2}>
              <img src={writer.fileurl == null ? Image : url + `img/${writer.fileurl}`} style={{ width: "60px", height: "60px", marginRight: "10px", borderRadius: "50px" }} />
            </div>
            <div
              style={{
                fontSize: "18px",
                width: "180px",
                marginLeft: "10px",
                lineHeight: "60px"
              }}
            >
              <b>{writer.nickname}</b>
              <br />
              {/* {writer.typename.length > 9
                ? `${writer.typename.slice(0, 9)}...`
                : writer.typename} */}
            </div>
            <div
              style={{
                border: "1px solid lightgray",
                marginTop: "8px",
                borderRadius: "10px",
                width: "133px",
                height: "44px",
                textAlign: "center",
              }}
            >
              {sale.status === "판매중" || sale.status === "예약중" ?
                <div>
                  {user.email === writer.email ?
                    <select value={sale.status} style={{ borderStyle: "none", borderRadius: "10px", width: "130px", height: "42px", textAlign: "left" }} onChange={handleSelect}>
                      {selectList.map((item) => {
                        return <option value={item.value} key={item.value}>
                          &nbsp;&nbsp;{item.name}
                        </option>;
                      })}
                    </select> : <option style={{ lineHeight: "43px" }}>{sale.status}</option>}
                </div>
                :
                <div style={{ lineHeight: "43px" }}>{sale.status === "결제완료" ? "거래중" : "판매완료"}</div>
              }

            </div>
          </div>
        </div>
        <br />
        <div style={{ textAlign: "left" }}>
          {convertCategoryToKorean(sale.category)}
        </div>
        <tr >
          <td style={{ textAlign: "left", width: "200px" }}><b>{sale.place}</b></td>
          <td
            style={{ width: "250px", fontWeight: "550", textAlign: "right" }}
          >
            {formatPrice(sale.amount)}
          </td>
        </tr>
        <Input
          type="textarea"
          style={{
            width: "390px",
            marginTop: "10px",
            marginBottom: "15px",
            height: "285px",
            resize: "none",
            backgroundColor: "white",
          }}
          disabled
          value={sale.content}
        ></Input>
        <div style={{ display: "flex" }}>

          {writer.email === user.email || user.email == '' ?
            <div style={{ position: "relative", marginTop: "8px" }} onClick={pay}>
              <img src={heart ? "/zzimheart.png" : "/noheart.png"} style={{ verticalAlign: "middle", width: "40px", position: "absolute" }} />
              <div style={{ position: "relative", width: "40px", textAlign: "center", lineHeight: "30px" }}>{sale.zzimcnt}</div>
            </div>
            : <div style={{ position: "relative", marginTop: "8px", cursor: "pointer" }} onClick={selectGood}>
              <img src={heart ? "/zzimheart.png" : "/noheart.png"} style={{ verticalAlign: "middle", width: "40px", position: "absolute" }} />
              <div style={{ position: "relative", width: "40px", textAlign: "center", lineHeight: "30px" }}>{sale.zzimcnt}</div>
            </div>}

          <div style={{ marginLeft: "165px", lineHeight: "45px" }}>

            {sale.ggull == 1 ?//ggull이 1상태일때 
              (writer.email === user.email ?   //로그인한 이메일과,상품등록한 이메일이 같을때
                <img src="/ggul.png" style={{ height: "35px", lineHeight: "100px", cursor: "pointer" }} onClick={pay} />

                ://이메일이 다를때
                <img src="/ggul.png" style={{ height: "35px", lineHeight: "100px", cursor: "pointer" }} onClick={pay} />)
              ://ggull이 0일때
              <img src="/ggul2.png" style={{ height: "35px", lineHeight: "100px" }} />

            }

          </div>
          {user.email === writer.email ?
            <Button style={{ //이메일이 같을때
              marginLeft: "15px", borderRadius: "5px",
              width: "100px",
              height: "45px",
              backgroundColor: "#14C38E",
              color: "white",
              borderStyle: "none",
            }} onClick={goToEditPage}>
              수정하기
            </Button> : <Button style={{
              marginLeft: "15px", borderRadius: "5px",
              width: "100px",
              height: "45px",
              backgroundColor: "#14C38E",
              color: "white",
              borderStyle: "none",
            }} onClick={gochat}>
              채팅하기
            </Button>}

        </div>
      </div>
    </div>
  );
}
export default SaleDetail;
