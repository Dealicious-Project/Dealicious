import React, { useRef, useState, useEffect } from 'react';
import { IoArrowBackOutline } from "react-icons/io5";
import './img.css';
import './text.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Input, Button } from 'reactstrap';
import { FaCamera } from "react-icons/fa";
import axios from 'axios';
import { GiCancel } from "react-icons/gi";
import Swal from 'sweetalert2';
import { useWebSocket } from './WebSocketProvider';

const formatPrice = (amount) => {

    if (!amount) return '';
    const numericPrice = parseInt(amount.replace(/[^0-9]/g, ''));

    const formattedPrice = numericPrice.toLocaleString('ko-KR');
    return `${formattedPrice}원`;
};

const SaleModify = () => {
    const { url } = useWebSocket();
    const MAX_TITLE_LENGTH = 20;
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    let selectImg = null;
    const [imageCount, setImageCount] = useState(0);
    const fileInputRef = useRef(null);
    const [timeAgo, setTimeAgo] = useState('');
    const [sale, setSale] = useState({
        title: '',
        category: '',
        amount: '',
        place: '',
        content: '',
        ggull: '0',
        fileurl: '',
        num: ''
    });
    const [currentImage, setCurrentImage] = useState();
    const { sect, num } = useParams();
    useEffect(() => {
        axios.get(url+`saledetail/${sect}/${num}`)
            .then(res => {
                console.log(res.data);
                setSale(res.data.sale);
                let fileurl = res.data.sale.fileurl;
                let filenums = fileurl.split(',');
                let filearr = [];
                for (let filenum of filenums) {
                    filearr.push({ type: 'i', data: filenum })
                }
                setFiles([...filearr])
                setImageCount(res.data.sale.fileurl.split(',').length);
                setSale((prevSale) => ({ ...prevSale, files }));
                setCurrentImage(res.data.sale.ggull === "1" ? "/ggul.png" : "/ggul2.png");
            })
            .catch((err) => {
                console.log(err);
            });


    }, []);
    const calculateTimeAgo = (submissionTime) => {
        const currentTime = new Date(); // 현재 시간
        const timeDiffInMs = currentTime - submissionTime; // 현재 시간 - 등록 시간
        const minutesAgo = Math.floor(timeDiffInMs / (1000 * 60)); // 분 단위로 시간 차이 계산

        if (minutesAgo < 60) {
            setTimeAgo(`${minutesAgo}분 전`); // 현재 시간과 등록 시간의 차이를 분으로 표시
        } else {
            const hoursAgo = Math.floor(minutesAgo / 60);
            setTimeAgo(`${hoursAgo}시간 전`); // 1시간 이상인 경우 'n시간 전'으로 표시
        }
    };

    const imageClick = (e) => {
        selectImg = e;
        document.getElementById("file").click();
    }

    const plusClick = (e) => {
        if (files.length >= 5) {
            alert('최대 5장까지 첨부 가능합니다.');
            return;
        }
        selectImg = null;
        document.getElementById("file").click();
    }

    const deleteClick = (e) => {
        console.log("deleteClick");
        // let idx = e.target.dataset.idx;
        console.log(e);
        files.splice(e, 1);
        setFiles([...files]);
        setImageCount((prevCount) => Math.max(0, prevCount - 1));
    }

    const fileChange = (e) => {
        if (e.target.files.length == 0) return;
        if (files.length >= 5) {
            alert('더 이상 사진을 추가할 수 없습니다. 최대 5장까지 첨부 가능합니다.');
            return;
        }
        if (selectImg == null)
            setFiles([...files, { type: 'f', data: e.target.files[0] }]);
        else {
            console.log("fileChange");
            let id = selectImg.target.id;
            files.splice(id, 1, { type: 'f', data: e.target.files[0] })
            setFiles([...files]);
        }
        setImageCount((prevCount) => Math.min(5, prevCount + 1));
    };


    const changeImage = () => {
        if (currentImage === "/ggul2.png") {
            setCurrentImage("/ggul.png");
            setSale({ ...sale, ggull: 1 });
        } else if (currentImage === '/ggul.png') {
            setCurrentImage("/ggul2.png");
            setSale({ ...sale, ggull: 0 });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') {
            const truncatedValue = value.slice(0, MAX_TITLE_LENGTH);
            setSale({ ...sale, [name]: truncatedValue });
        } else {
            setSale({ ...sale, [name]: value });
        }
    };

    const submit = (e) => {
        const formData = new FormData();
        formData.append("num", sale.num);
        formData.append("title", sale.title);
        formData.append("category", sale.category);
        formData.append("amount", sale.amount);
        formData.append("place", sale.place);
        formData.append("content", sale.content);
        formData.append("ggull", sale.ggull);

        for (let file of files) {
            if (file.type === 'i')
                formData.append("file", new Blob(), file.data);
            else
                formData.append("file", file.data);
        }

        axios.post(url+'salemodify', formData)
            .then(res => {
                console.log(res);
                let saleNum = res.data;
                navigate(`/saledetail/after-modify/${saleNum}`);
            })
            .catch(err => {
                console.log(err);
            });
        const submissionTime = new Date(); // 등록 시간
        calculateTimeAgo(submissionTime); // 함수 호출하여 시간 차이 계산
    }
    const deleteSale = (seq) => {
        Swal.fire({
            title: '글을 삭제하시겠습니까?',
            text: "삭제 후에는 복구할 수 없습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#14C38E',
            cancelButtonColor: '#d9d9d9',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if(result.value){
                axios.delete(url+`saledelete/${num}`)
                    .then(res => {
                        Swal.fire({
                            title: "삭제되었습니다",
                            icon: "success",
                            confirmButtonText: "확인",
                        })
                        navigate(`/salelist`);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })

    }
    return (
        <div className='main' style={{ textAlign: 'left', overflow: "scroll", height: "632px", overflowX: "hidden" }}>
            <br />
            <div style={{ display: 'flex', marginBottom: "20px" }}>
                <Link to="/salelist">
                    <IoArrowBackOutline size="30" color="14C38E" />
                </Link>
                <div
                    style={{
                        color: "#14C38E",
                        fontSize: "20px",
                        textAlign: "center",
                        width: "360px",
                        marginLeft: "-20px"
                    }}
                >
                    <b>판매글수정</b>
                </div>
            </div>
            <div style={{ backgroundColor: "#E9E9E9", width: "48px", height: "63px", textAlign: "center", paddingTop: "5px", position: "relative", cursor: "pointer" }}
            >
                <div style={{ display: "flex" }}>
                    <div onClick={plusClick}>
                        <div style={{ width: "48px", textAlign: "center" }}>
                            <FaCamera size="30" color='gray' />
                        </div>
                        <div style={{ position: "absolute", textAlign: "center", width: "48px", paddingBottom: "5px", fontWeight: "bold", color: "gray" }}>
                            {imageCount}/5
                        </div>
                    </div>
                    <Input name="file" type="file" id="file" accept="image/*" onChange={fileChange} hidden ref={fileInputRef} />
                    <div style={{ display: "flex", marginLeft: "10px" }}>
                        {files.length !== 0 &&
                            files.map((file, index) =>
                                <span key={index}>
                                    <div style={{ position: "relative", display: 'inline-block', marginRight: "10px" }}>
                                        <img src={file.type === 'i' ? url+`img/${file.data}` : URL.createObjectURL(file.data)} width="45px" height="45px" alt='' id={index} onClick={imageClick} />
                                        <button data-idx={index} onClick={() => deleteClick(index)} style={{ position: "absolute", top: "-15px", right: "-15px", background: "none", border: "none", cursor: "pointer" }}><GiCancel /></button>
                                    </div>
                                </span>
                            )
                        }
                    </div>
                </div>
            </div>
            <div style={{ marginBottom: "5px", fontSize: "18px", marginTop: "20px" }}>제목</div>
            <Input
                type="text"
                placeholder="제목을 입력해주세요"
                style={{ width: "385px", height: "40px", borderColor: "lightgray" }}
                name="title"
                value={sale.title}
                onChange={handleInputChange}
            />

            <div style={{ marginTop: "20px" }}>
                <div style={{ display: 'flex' }}>
                    <div>
                        <div style={{ marginBottom: "5px", fontSize: "18px" }}>카테고리</div>
                        <select
                            style={{ width: "180px", height: "40px", textAlign: "center", borderRadius: "5px", float: "left", borderColor: "lightgray" }}
                            name="category"
                            value={sale.category}
                            onChange={handleInputChange}>
                            <option value="" style={{ textAlign: "left" }}>&nbsp;&nbsp;&nbsp;선택</option>
                            <option value="mobile" style={{ textAlign: "left" }}>&nbsp;&nbsp;&nbsp;모바일/태블릿</option>
                            <option value="pc" style={{ textAlign: "left" }}>&nbsp;&nbsp;&nbsp;노트북/PC</option>
                            <option value="ticket" style={{ textAlign: "left" }}>&nbsp;&nbsp;&nbsp;티켓/쿠폰</option>
                            <option value="clothes" style={{ textAlign: "left" }}>&nbsp;&nbsp;&nbsp;의류</option>
                            <option value="free" style={{ textAlign: "left" }}>&nbsp;&nbsp;&nbsp;나눔</option>
                            <option value="others" style={{ textAlign: "left" }}>&nbsp;&nbsp;&nbsp;기타</option>
                        </select>
                    </div>
                    <div style={{ marginLeft: "25px" }}>
                        <div style={{ marginBottom: "10px", fontSize: "18px" }} name="ggull" value={sale.ggull}>
                            꿀페이
                        </div>
                        <img src={currentImage} style={{ width: "50px" }} onClick={changeImage} alt="Ggul Image" />
                    </div>
                </div>
                <div style={{ marginBottom: "20px" }} />
                <div style={{ display: "flex" }}>
                    <div>
                        <div style={{ marginBottom: "5px", fontSize: "18px" }}>가격</div>
                        <div><Input type="text" placeholder="10,000원" style={{ borderRadius: "5px", height: "40px", width: "180px", float: "left" }} name="amount" value={sale.amount} onChange={handleInputChange}></Input></div>
                    </div>
                    <div>
                        <div style={{ marginBottom: "5px", fontSize: "18px", marginLeft: "25px" }}>장소</div>
                        <div><Input type="text" placeholder="A동 1층" style={{ borderRadius: "5px", height: "40px", width: "180px", marginLeft: "25px" }} name="place" value={sale.place} onChange={handleInputChange}></Input></div>
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: "18px", marginBottom: "10px", marginTop: "20px" }}>상세설명</div>
                    <Input type='textarea'
                        style={{ width: "385px", height: "300px", resize: "none" }} name="content" value={sale.content} onChange={handleInputChange}
                        placeholder='상세설명을 입력하세요
구매날짜, 하자 등 자세하게 작성할수록

구매자에게 편리합니다'></Input>

                </div>
                <br />
                <div style={{ display: "flex", textAlign: 'center' }}>
                    <div style={{ width: "190px", textAlign: "right" }}>
                        <Button
                            onClick={submit}
                            style={{
                                textAlign: "center",
                                width: "190px",
                                height: "45px",
                                backgroundColor: '#14C38E',
                                color: "white",
                                borderStyle: "none"
                            }}>
                            수정하기
                        </Button>
                    </div>
                    <div style={{ width: "190px", textAlign: "left" }}>
                        <Button onClick={deleteSale} style={{
                            width: "190px",
                            marginLeft: "5px",
                            height: "45px"
                        }}>삭제하기</Button>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default SaleModify;