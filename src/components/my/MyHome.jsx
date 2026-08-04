import axios from "axios";
import {useState} from "react";
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';

const MyHome = () =>{

    const [cookies, setCookie, removeCookie ] = useCookies(['id','nick','img']);

    const [userNick, setUserNick] = useState(localStorage.getItem('userNick'));
    const [userImg, setUserImg] = useState(localStorage.getItem('userImg'));

    const logout = () =>{
        console.log("로그아웃");
        axios({
            url:'/api/myhome/logout',
            method:'GET'
        })
        .then((res)=>{
            // removeCookie('id');
            // removeCookie('nick');
            // removeCookie('img');
            localStorage.clear();
            window.location.href= '#/home';
            // document.location.href = '/home'
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const delInfo = () =>{
        if(!window.confirm('정말 탈퇴하시겠습니까?\n모든 도장판이 사라집니다.')){
            return false;
        }else{
            axios({
                url:'/api/myhome/delinfo',
                method:'POST'
            })
            .then((res)=>{
                // removeCookie('id');
                // removeCookie('nick');
                // removeCookie('img');
                alert('탈퇴되었습니다');
                localStorage.clear();
                window.location.href= '#/home';
                // document.location.href = '/home'
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    }

     return(
        <div id="myHome">
            <div className="wrap">
                <div className="myHome-gap">
                    <div className="myHome-wrap">
                        <div className="my">
                            <div className="profile-box">
                                <img className="profile" src={userImg} alt="profile"></img>
                            </div>
                            <div className="nick">
                                <span>{userNick}</span> 님
                            </div>
                        </div>
                        <div className="info-btn">
                            <button className="out-btn" onClick={()=>logout()}>
                                로그아웃
                            </button>
                            <button className="del-btn" onClick={()=>delInfo()}>
                                회원탈퇴
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     )

}


export default MyHome;