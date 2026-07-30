import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './home/Home';
import PlayList from './admin/PlayList';
import AddPlayList from './admin/AddPlayList';
import PlayDetail from './admin/PlayDetail';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';
import BottomNavComponent from './BottomNavComponent';
import CalendarComponent from './CalendarComponent';
import SearchList from './home/SearchList';
import SearchPlay from './home/SearchPlay';
import MyHome from './my/MyHome';
import MyStampAdd from './my/MyStampAdd';
import DoubleStamp from './admin/DoubleStamp';
import MyStamp from './my/MyStamp';
import MyStampDetail from './my/MyStampDetail';
import MyStampEdit from './my/MyStampEdit';
import Kakao from './common/Kakao';
import Admin from './admin/Login';
import Join from './admin/Join';
import UserList from './admin/UserList';
import AdminList from './admin/AdminList';

import axios from "axios";
import {useEffect, useState} from "react";
import { CookiesProvider, useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import AdminInfo from './admin/AdminInfo';

const WrapComponent = () =>{

    const [userInfo, setUserInfo] = useState();
    const [cookies, setCookie] = useCookies(['id','img','nick']);
    const expires = new Date();
    expires.setMinutes(expires.getHours() + 600);
    console.log(localStorage);
    const location = useLocation();

    const loginCheck = () =>{

        if(location.pathname.substring(1,6) === 'admin'){
            axios({
                url:'/api/admin',
                method:'get'
            },
            { withCredentials: true })
            .then((res)=>{
                localStorage.setItem('adminId',res.data.adminId);
                localStorage.setItem('adminLogined', res.data.adminLogined);
            })
            .catch((err)=>{
                console.log(err);
            })
        }else{
            axios({
                url:'/api/home',
                method:'get'
            },
            { withCredentials: true })
            .then((res)=>{
                setUserInfo(res.data.usernum);
                // console.log(userInfo);
                localStorage.setItem('usernum', res.data.usernum);
                localStorage.setItem('userNick', res.data.loginNick);
                localStorage.setItem('userImg', res.data.loginImg);
                localStorage.setItem('logined', res.data.logined);
                // setCookie('id', res.data.loginId, {
                //     path:"/mystamp",
                //     expires,
                //     // secure:true,
                //     // httpOnly:true
                // });
                // setCookie('img', res.data.loginImg, {
                //     path:"/mystamp",
                //     expires,
                //     // secure:true,
                //     // httpOnly:true
                // });
                // setCookie('nick', res.data.loginNick,{
                //     path:"/mystamp",
                //     expires,
                //     // secure:true,
                //     // httpOnly:true
                // });
                // console.log(localStorage.getItem('userId'));
                // console.log(cookies.img);
            })
            .catch((err)=>{
                console.log(err);
            })
        }

    }

    useEffect(()=>{
        loginCheck();
    },[userInfo])
    
    return (
        <div id="wrap">
            <CookiesProvider>

            <HeaderComponent />
            <Routes>
                <Route path='/home' element={<Home/>} />
                {/* <Route path='/home/login/kakao' element={<Kakao/>} /> */}
                <Route path='/home/search/:keyword' element={<SearchList/>} />
                <Route path='/home/search/play/:playnum' element={<SearchPlay />} />
                <Route path='/admin' element={<Admin/>} />
                <Route path="/admin/join" element={<Join/>} />
                <Route path='/admin/playlist' element={<PlayList/>} />
                <Route path='/admin/playlist/add' element={<AddPlayList/>} />
                <Route path='/admin/playlist/play/:num' element={<PlayDetail />} ></Route>
                <Route path='/admin/play/double/:num' element={<DoubleStamp />} ></Route>
                <Route path='/admin/userlist' element={<UserList/>} />
                <Route path='/admin/adminlist' element={<AdminList/>} />
                <Route path='/admin/admininfo' element={<AdminInfo/>} />
                <Route path='/myhome' element={<MyHome/>} />
                <Route path='/myhome/stamp' element={<MyStamp />} />
                <Route path='/myhome/stamp/add/:playNum?/:coalesce?' element={<MyStampAdd/>} />
                <Route path='/myhome/stamp/edit/:num' element={<MyStampEdit/>} />
                <Route path='/myhome/stamp/detail/' element={<MyStampDetail/>} />
                <Route path='/calendar' element={<CalendarComponent/>} />
            </Routes>
            <FooterComponent />
            <BottomNavComponent />
            </CookiesProvider>
        </div>

    );
}

export default WrapComponent;