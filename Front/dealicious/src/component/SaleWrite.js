import React, { useEffect, useRef, useState } from 'react';
import { IoArrowBackOutline } from "react-icons/io5";
import './img.css';
import './text.css';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from 'reactstrap';
import { FaCamera } from "react-icons/fa";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { GiCancel } from 'react-icons/gi';
import { useWebSocket } from './WebSocketProvider';

const SaleWrite = () => {
    const { url } = useWebSocket();
    const token = useSelector(state => state.persistedReducer.token);
    const user = useSelector(state => state.persistedReducer.user);
    const [currentImage, setCurrentImage] = useState("./ggul2.png");
    const navigate = useNavigate();
    const [imageCount, setImageCount] = useState(0); // 상태 변수로 이미지 카운트를 관리.
    const [selectedImages, setSelectedImages] = useState([]); // 여러 이미지를 저장하는 배열
    const fileInputRef = useRef(null);
    const [titleError, setTitleError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const [amountError, setAmountError] = useState(false);
    const [placeError, setPlaceError] = useState(false);
    const [contentError, setContentError] = useState(false);
    const [fileurlError, setFileurlError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage_t, setErrorMessage_t] = useState('');
    const [errorMessage_ca, setErrorMessage_ca] = useState('');
    const [errorMessage_a, setErrorMessage_a] = useState('');
    const [errorMessage_p, setErrorMessage_p] = useState('');
    const [errorMessage_c, setErrorMessage_c] = useState('');
    const [errorMessage_f, setErrorMessage_f] = useState('');
    const MAX_TITLE_LENGTH = 20;

    const [sale, setSale] = useState({      //상품 정보 초기화
        title: '',
        category: '',
        amount: '',
        place: '',
        content: '',
        ggull: '0',
        fileurl: ''
    });

    const formatPrice = (amount) => {
        if (!amount) return '';
        const numericPrice = parseInt(amount.replace(/[^0-9]/g, ''));

        // 숫자를 천단위로 포맷팅합니다.
        const formattedPrice = numericPrice.toLocaleString('ko-KR');
        return `${formattedPrice}`;

    };
    const removeImage = (indexToRemove) => {
        const updatedImages = selectedImages.filter((_, index) => index !== indexToRemove);
        setSelectedImages(updatedImages);
        setImageCount(updatedImages.length);
    };

    const fileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (selectedImages.length < 5) { // 이미지가 5개 미만일 때만 추가
                setSelectedImages([...selectedImages, file]);
                setImageCount(selectedImages.length + 1);
            }
        }
    };

    const changeImage = () => {
        if (user.accountid === "" || user.accountid === "null") {
            alert("계좌번호 등록 후 꿀페이 이용 가능합니다.")
            console.log(user.accountid)
        } else {
            console.log(user.accountbank)
            if (currentImage === "./ggul2.png") {
                setCurrentImage("./ggul.png");
                setSale({ ...sale, ggull: 1 });
            } else if (currentImage === './ggul.png') {
                setCurrentImage("./ggul2.png"); // 처음 이미지로 다시 변경.
                setSale({ ...sale, ggull: 0 });
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') {
            const truncatedValue = value.slice(0, MAX_TITLE_LENGTH);
            setSale({ ...sale, [name]: truncatedValue });
        } else if (name === 'amount') {
            const numericValue = value.replace(/[^0-9]/g, '');
            const truncatedValue = numericValue.slice(0, 10);
            setSale({ ...sale, [name]: truncatedValue });
        } else {
            setSale({ ...sale, [name]: value });
        }
    };

    const changecontent = (e) => {  //초기화
        setTitleError(false);       //input 초기화
        setAmountError(false);
        setCategoryError(false);
        setContentError(false);
        setPlaceError(false);
        setFileurlError(false);
        setErrorMessage_ca('');     //error메시지 초기화
        setErrorMessage_t('');
        setErrorMessage_a('');
        setErrorMessage_p('');
        setErrorMessage_c('');
        setErrorMessage_f('');
        setErrorMessage('');
    }

    const isFormValid = () => { //유효성검사

        let isValid = true;

        if (imageCount === 0) {
            setFileurlError(true);
            setErrorMessage_f('사진을 선택하세요.');
            isValid = false;
        } else {
            setFileurlError(false);
            setErrorMessage_f('');
        }
        if (sale.title.trim() === '') {
            setTitleError(true);
            setErrorMessage_t('제목을 입력하세요.');
            isValid = false;
        } else {
            setTitleError(false);
            setErrorMessage_t('');
        }

        if (sale.category.trim() === '') {
            setCategoryError(true);
            setErrorMessage_ca('카테고리를 선택하세요.');
            isValid = false;
        } else {
            setCategoryError(false);
            setErrorMessage_ca('');
        }

        if (sale.amount.trim() === '') {
            setAmountError(true);
            setErrorMessage_a('가격을 입력하세요.');
            isValid = false;
        } else {
            setAmountError(false);
            setErrorMessage_a('');
        }

        if (sale.place.trim() === '') {
            setPlaceError(true);
            setErrorMessage_p('장소를 입력하세요.');
            isValid = false;
        } else {
            setPlaceError(false);
            setErrorMessage_p('');
        }

        if (sale.content.trim() === '') {
            setContentError(true);
            setErrorMessage_c('상세 설명을 입력하세요.');
            isValid = false;
        } else {
            setContentError(false);
            setErrorMessage_c('');
        }

        return isValid;
    };

    const submit = (e) => {
        if (!isFormValid()) {
            e.preventDefault();
            setErrorMessage('');
            return;
        }
        if (imageCount === 0) {
            e.preventDefault();
            setErrorMessage_f('이미지를 최소 1개 이상 선택하세요.');
            return;
        }
        const formData = new FormData();
        formData.append("title", sale.title);
        formData.append("category", sale.category);
        formData.append("amount", sale.amount);
        formData.append("place", sale.place);
        formData.append("content", sale.content);
        formData.append("ggull", sale.ggull);
        formData.append("file", sale.fileurl);
        formData.append("email", user.email);

        for (let image of selectedImages) {
            formData.append("file", image);
        }

        console.log(formData)

        axios.post(url + 'salewrite', formData, {
            headers: {
                Authorization: token,
            }
        })
            .then(res => {
                console.log(res);

                navigate(`/salelist`);
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <div className='main' style={{ textAlign: 'left', overflow: "scroll", height: "632px", overflowX: "hidden" }}>
            <div style={{ display: "flex", lineHeight:"30px" }}>
                <div style={{marginRight:"5px"}}>
                    <Link to="/salelist">
                        <IoArrowBackOutline size="20" color="14C38E" />
                    </Link>
                </div>
                <div style={{ color: "#14C38E", fontSize: "20px" }}>판매글작성</div>
            </div>
            <br />
            <div style={{ display: "flex" }}>
                <div style={{ border: "2px solid #E9E9E9", borderRadius: "5px", width: "50px", height: "50px", textAlign: "center", position: "relative", cursor: "pointer" }}>
                    <div style={{ textAlign: "center" }}>
                        <div onClick={() => document.getElementById("file").click()}>
                            <FaCamera size="23" color='gray' />
                            <div style={{ position: "absolute", textAlign: "center", width: "48px", fontWeight: "550", color: "gray", fontSize: "14px" }}>
                                {imageCount}/5
                            </div>
                        </div>
                        <Input name="file" type="file" id="file" accept="image/*" onInput={changecontent} onChange={fileChange} hidden ref={fileInputRef} />

                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    {selectedImages.map((image, index) => (
                        <div key={index} style={{ marginLeft: '5px', position: 'relative' }}>
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Selected ${index + 1}`}
                                style={{ width: '50px', height: '50px', borderRadius: "10px" }}
                            />
                            <button data-idx={index} onClick={() => removeImage(index)} style={{ position: "absolute", top: "-15px", right: "-15px", background: "none", border: "none", cursor: "pointer" }}><GiCancel /></button>
                        </div>
                    ))}
                </div>
            </div>
            {fileurlError && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errorMessage_f}</div>}
            <div style={{ marginBottom: "5px", fontSize: "18px", marginTop: "20px" }}>제목</div>
            <Input
                type="text"
                placeholder="제목을 입력해주세요"
                style={{ width: "390px", height: "40px", borderColor: "lightgray" }}
                name="title"
                value={sale.title}
                onInput={changecontent}
                onChange={handleInputChange}
            />
            {titleError && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errorMessage_t}</div>}
            <div style={{ marginTop: "20px", display: "flex" }}>
                <div>
                    <div style={{ marginBottom: "5px", fontSize: "18px" }}>카테고리</div>
                    <select
                        style={{ width: "180px", height: "40px", textAlign: "center", borderRadius: "5px", float: "left", borderColor: "lightgray" }}
                        name="category"
                        value={sale.category} onInput={changecontent}
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
            {categoryError && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errorMessage_ca}</div>}
            <div style={{ marginBottom: "20px" }} />
            <div style={{ display: "flex" }}>
                <div>
                    <div style={{ marginBottom: "5px", fontSize: "18px" }}>가격</div>
                    <div><Input type="text" placeholder="10,000" style={{ borderRadius: "5px", height: "40px", width: "180px", float: "left" }} name="amount" value={formatPrice(sale.amount)} onInput={changecontent} onChange={handleInputChange}></Input></div>
                    {amountError && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errorMessage_a}</div>}
                </div>
                <div>
                    <div style={{ marginBottom: "5px", fontSize: "18px", marginLeft: "25px" }}>장소</div>
                    <div><Input type="text" placeholder="A동 1층" style={{ borderRadius: "5px", height: "40px", width: "180px", marginLeft: "25px" }} name="place" value={sale.place} onInput={changecontent} onChange={handleInputChange}></Input></div>
                    {placeError && <div style={{ color: 'red', fontSize: '14px', marginTop: '2px', marginLeft: "30px" }}>{errorMessage_p}</div>}
                </div>
            </div>
            <div>
                <div style={{ fontSize: "18px", marginBottom: "10px", marginTop: "20px" }}>상세설명</div>
                <Input type='textarea'
                    style={{ width: "390px", height: "300px", resize: "none" }} name="content" value={sale.content} onInput={changecontent} onChange={handleInputChange}
                    placeholder='상세설명을 입력하세요
구매날짜, 하자 등 자세하게 작성할수록
구매자에게 편리합니다'></Input>
                {contentError && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errorMessage_c}</div>}
            </div>
            <br /> <p style={{ textAlign: "center" }}><Button
                type="button"
                onInput={changecontent}
                onClick={submit}
                style={{
                    fontWeight: "550",
                    fontSize: "18px",
                    width: "390px",
                    height: "50px",
                    backgroundColor: '#14C38E',
                    color: "white",
                    borderStyle: "none"
                }}>
                등록하기
            </Button></p>
        </div>
    )
};
export default SaleWrite;