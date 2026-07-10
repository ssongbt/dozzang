import axios from "axios";
import React, { useEffect } from 'react';
import Logo from "../assets/dozzang_logo.png";
import {Link, useLocation, useNavigate } from 'react-router-dom';
import {useState} from 'react';
import stampplus from '../assets/stampplus.png';
import my from '../assets/my.png';
import pre from '../assets/pre.png';

const HeaderComponent = () => {

    const location = useLocation();

    const navigate  = useNavigate();
    console.log(navigate);

    const logout = () =>{
        axios({
            url:'/api/admin/logout',
            method:'POST'
        })
        .then((res)=>{
            localStorage.clear();
            window.location.href= '/admin';
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const prePage = () =>{
        navigate(-1);
        console.log(navigate(-1));
    }

    const adminLeftCheck = () =>{
        if(location.pathname.substring(1,6) === 'admin'){
            // console.log("어드민페이지");
            if(localStorage.getItem('adminLogined') === 'undefined'){
                return(
                    <div>
                        <p><a href="/admin">관리자 페이지</a></p>
                    </div>
                )
            }else{
                return(
                    <div>
                        <p><a href="/admin/playlist">관리자 페이지</a></p>
                    </div>
                )
            }
        }else{
            if(localStorage.getItem('logined') === 'true'){
                return(
                    <div>
                        {/* <p><Link to="/myhome/stamp"><img className="myImg" src={my} alt="my"></img></Link></p>  */}
                        
                        <p onClick={prePage}><img className="pre" src={pre} alt="pre"></img></p>
                    </div>
                )
            }else{
                return(
                    <div>
                    </div>
                )
            }
        }
    }

    const adminRightCheck = () =>{
        if(location.pathname.substring(1,6) === 'admin'){
            if(localStorage.getItem('adminLogined') === 'undefined'){
                return(
                    <div>
                        
                    </div>
                )
            }else{
                return(
                    <div>
                        
                        <p><Link to="/admin/admininfo">{localStorage.getItem('adminId')} </Link> | <span onClick={logout}>로그아웃</span></p>
                    </div>
                )
            }
        }else{
            if(localStorage.getItem('logined') === 'true'){
                return(
                    <div className="user-menu">
                        <div className="my"><Link to="/myhome/stamp"><img className="myImg" src={my} alt="my"></img></Link></div> 
                        <div className="plus"><Link to="/myhome/stamp/add"><img className="stampplusImg" src={stampplus} alt="plus"></img></Link></div>
                    </div>
                )
            }else{
                return(
                    <div className="user-menu">
                        <div className="my"><Link to="/myhome/stamp"><img className="myImg" src={my} alt="my"></img></Link></div> 
                        <div className="plus"><Link to="/myhome/stamp/add"><img className="stampplusImg" src={stampplus} alt="plus"></img></Link></div>
                    </div>
                )
            }
        }
    }

    return(
        <div id="header">
            <div className="wrap">
                <div className="header-gap">
                    <div className="header-wrap">
                        <div className="pre">
                            <div className="pre-gap">
                                <div className="pre-wrap">
                                    {adminLeftCheck()}
                                </div>
                            </div>
                        </div>
                        <div className="title">
                            <div className="title-gap">
                                <div className="title-wrap">
                                    <p><a href="/home"><img className="logo" src={Logo} alt="dozzang"></img></a></p>
                                </div>
                            </div>
                        </div>
                        <div className="my">
                            <div className="my-gap">
                                <div className="my-wrap">
                                    {adminRightCheck()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default HeaderComponent;