import axios from "axios";
import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import Logo from "../assets/dozzang_logo.png";
import {Link, useLocation, useNavigate } from 'react-router-dom';
import {useState} from 'react';
import { Download, Upload } from 'react-bootstrap-icons';
import stampplus from '../assets/stampplus.png';
import my from '../assets/my.png';
import pre from '../assets/pre.png';
import { exportStampsBackup, restoreStampsBackup } from '../utils/stampStorage';

const HeaderComponent = () => {

    const location = useLocation();

    const navigate  = useNavigate();

    const fileInputRef = useRef(null);

    const handleBackup = () => {
        const data = exportStampsBackup();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dozzang-backup-${format(new Date(), 'yyyyMMdd-HHmm')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleRestoreClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRestoreFile = (e) => {
        const file = e.target.files[0];
        e.target.value = '';
        if (!file) {
            return;
        }
        if (!window.confirm('현재 도장판 데이터를 백업 파일 내용으로 덮어씁니다. 계속할까요?')) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            try {
                restoreStampsBackup(reader.result);
                window.alert('복원되었습니다');
                window.location.reload();
            } catch (err) {
                window.alert('복원에 실패했습니다. 올바른 백업 파일인지 확인해주세요.');
            }
        };
        reader.readAsText(file);
    };

    // const logout = () =>{
    //     axios({
    //         url:'/api/admin/logout',
    //         method:'POST'
    //     })
    //     .then((res)=>{
    //         localStorage.clear();
    //         window.location.href= '/admin';
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     })
    // }

    const prePage = () =>{
        navigate(-1);
    }

    // const adminLeftCheck = () =>{
    //     if(location.pathname.substring(1,6) === 'admin'){
    //         // console.log("어드민페이지");
    //         if(localStorage.getItem('adminLogined') === 'undefined'){
    //             return(
    //                 <div>
    //                     <p><a href="/admin">관리자 페이지</a></p>
    //                 </div>
    //             )
    //         }else{
    //             return(
    //                 <div>
    //                     <p><a href="/admin/playlist">관리자 페이지</a></p>
    //                 </div>
    //             )
    //         }
    //     }else{
    //         if(localStorage.getItem('logined') === 'true'){
    //             return(
    //                 <div>
    //                     {/* <p><Link to="/myhome/stamp"><img className="myImg" src={my} alt="my"></img></Link></p>  */}
                        
    //                     <p onClick={prePage}><img className="pre" src={pre} alt="pre"></img></p>
    //                 </div>
    //             )
    //         }else{
    //             return(
    //                 <div>
    //                 </div>
    //             )
    //         }
    //     }
    // }

    // const adminRightCheck = () =>{
    //     if(location.pathname.substring(1,6) === 'admin'){
    //         if(localStorage.getItem('adminLogined') === 'undefined'){
    //             return(
    //                 <div>
                        
    //                 </div>
    //             )
    //         }else{
    //             return(
    //                 <div>
                        
    //                     <p><Link to="/admin/admininfo">{localStorage.getItem('adminId')} </Link> | <span onClick={logout}>로그아웃</span></p>
    //                 </div>
    //             )
    //         }
    //     }else{
    //         if(localStorage.getItem('logined') === 'true'){
    //             return(
    //                 <div className="user-menu">
    //                     <div className="my"><Link to="/myhome/stamp"><img className="myImg" src={my} alt="my"></img></Link></div> 
    //                     <div className="plus"><Link to="/myhome/stamp/add"><img className="stampplusImg" src={stampplus} alt="plus"></img></Link></div>
    //                 </div>
    //             )
    //         }else{
    //             return(
    //                 <div className="user-menu">
    //                     <div className="my"><Link to="/myhome/stamp"><img className="myImg" src={my} alt="my"></img></Link></div> 
    //                     <div className="plus"><Link to="/myhome/stamp/add"><img className="stampplusImg" src={stampplus} alt="plus"></img></Link></div>
    //                 </div>
    //             )
    //         }
    //     }
    // }

    return(
        <div id="header">
            <div className="wrap">
                <div className="header-gap">
                    <div className="header-wrap">
                        <div className="title">
                            <div className="title-gap">
                                <div className="title-wrap">
                                    <p><Link to="/home"><img className="logo" src={Logo} alt="dozzang"></img></Link></p>
                                </div>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button type="button" className="header-util-btn" onClick={handleBackup}>
                                <Download size={16} />
                                <span>데이터 백업</span>
                            </button>
                            <button type="button" className="header-util-btn" onClick={handleRestoreClick}>
                                <Upload size={16} />
                                <span>데이터 복원</span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/json"
                                className="header-file-input"
                                onChange={handleRestoreFile}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default HeaderComponent;