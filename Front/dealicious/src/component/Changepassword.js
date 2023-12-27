import { useState } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useWebSocket } from './WebSocketProvider';

const Changepassword = () => {
    const { url } = useWebSocket();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const token = useSelector(state => state.persistedReducer.token);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleChangePassword = async () => {
        try {
            if (formData.newPassword.length < 8) {
                setErrors({ ...errors, newPassword: '새 비밀번호는 8자리 이상이어야 합니다.' });
                return;
            }

            if (formData.newPassword !== formData.confirmNewPassword) {
                setErrors({ ...errors, confirmNewPassword: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.' });
                return;
            }
            const response = await axios.put(
                url+'changepassword',
                formData,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            console.log(response.data);
            alert('비밀번호가 성공적으로 변경되었습니다.');
            navigate('/profiledetail')
        } catch (error) {
            console.error(error.response.data);
            if (error.response.data === '현재 비밀번호가 일치하지 않습니다.') {
                setErrors({ ...errors, currentPassword: '현재 비밀번호와 일치하지 않습니다.' });
            }
        }
    };

    return (
        <div className='main' style={{ overflow: 'scroll', height: '632px', overflowX: 'hidden', paddingTop: '50px', paddingLeft: '50px', paddingRight: '50px' }}>
            <FormGroup style={{ textAlign: 'left', paddingBottom: '10px' }}>
                <Link to="/profiledetail"><IoArrowBackOutline style={{ marginRight: '75px' }} size='30' color='#14C38E' /></Link>
                <Label style={{ fontSize: '25px', fontWeight: 'bold', color: '#14C38E' }}>비밀번호 변경</Label>
            </FormGroup>
            <div style={{ paddingBottom: '30px' }}></div>
            <FormGroup style={{ textAlign: 'left' }}>
                <Label for='curpw' style={{ fontSize: '20px' }}>현재 비밀번호</Label>
                <Input type='password' name='currentPassword' id='curpw' style={{ height: '55px', width: '325px' }}
                    placeholder='현재 비밀번호를 입력하세요' onChange={handleChange} />
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: '10px', textAlign: 'left' }}>{errors.currentPassword}</div>
            </FormGroup>
            <br />
            <FormGroup style={{ textAlign: 'left' }}>
                <Label for='newpw' style={{ fontSize: '20px' }}>새 비밀번호</Label>
                <Input type='password' name='newPassword' id='newpw' style={{ height: '55px', width: '325px' }}
                    placeholder='새 비밀번호를 입력하세요' onChange={handleChange} />
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: '10px', textAlign: 'left' }}>{errors.newPassword}</div>
            </FormGroup>
            <FormGroup style={{ textAlign: 'left', paddingBottom: '63px' }}>
                <Label for='newpwrp' style={{ fontSize: '20px' }}>비밀번호 다시 입력하기</Label>
                <Input type='password' name='confirmNewPassword' id='newpwrp' style={{ height: '55px', width: '325px' }}
                    placeholder='한 번 더 입력하세요' onChange={handleChange} />
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px', height: '10px', textAlign: 'left' }}>{errors.confirmNewPassword}</div>
            </FormGroup>

            <Button style={{ width: '325px', height: '55px', fontSize: '20px', backgroundColor: '#14C38E', borderStyle: 'none' }} onClick={handleChangePassword}>변경하기</Button>
        </div>
    );
}

export default Changepassword;
