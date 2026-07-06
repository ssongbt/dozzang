import axios from "axios";
import {useEffect, useState} from "react";
import { useCookies } from "react-cookie";

const Login = () => {

    const [userId, setUserId] = useState();
    const [userPw, setUserPw] = useState();

    const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]);
    const [isRemember, setIsRemember] = useState(false);

    /*페이지가 최초 렌더링 될 경우*/
    useEffect(() => {
        /*저장된 쿠키값이 있으면, CheckBox TRUE 및 UserID에 값 셋팅*/
        // console.log(cookies);
        if (cookies.rememberUserId !== undefined) {
            setUserId(cookies.rememberUserId);
            setIsRemember(true);
        }
    }, []);

    const handleOnChange = (e) => {
        setIsRemember(e.target.checked);
        console.log(isRemember);
        if (!e.target.checked) {
            removeCookie("rememberUserId");
        }
    };

    const goLogin = () =>{

        if((typeof userId === 'string' ? userId.trim() : userId) === '' || userId === undefined){
            alert("아이디를 다시 확인해주세요.")
            return false;
        }
        if((typeof userPw === 'string' ? userPw.trim() : userPw) === '' || userPw === undefined){
            alert("비밀번호를 다시 확인해주세요.")
            return false;
        }

        axios({
            url : '/api/admin/login',
            method : 'POST',
            data : {id : userId, pw : userPw, isRemember:isRemember}
        })
        .then((res)=>{
            if(res.data.code === 'P'){
                window.location.href = "/admin/playlist";
            }else{
                alert(res.data.msg);
                return false;
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const join = () =>{
        window.location.href = "/admin/join";
    }

    return (
        <div id="login">
            <div className="wrap">
                <div className="login-gap">
                    <div className="login-wrap">
                        <div className="login-title">
                            관리자 로그인
                        </div>
                        <div className="login-box">
                            <form id="login-form">
                                <div className="login-id" >
                                    <div className="id">관리자 ID</div>
                                    <input type="text" placeholder="ID" defaultValue={userId} onChange={(e)=>setUserId(e.target.value)}></input>
                                </div>
                                <div className="login-pw">
                                <div className="pw">관리자 PW</div>
                                    <input type="password" placeholder="PASSWORD" onChange={(e)=>setUserPw(e.target.value)}></input>
                                </div>
                                <div className="login-op">
                                    <div className="save-id">
                                        <input type="checkbox" className="saveId-cb" id="saveId" name="saveId" onChange={(e)=>handleOnChange(e)} checked={isRemember}/>{" "}
                                        <label htmlFor="saveId">ID 저장하기</label>
                                    </div>
                                    <div className="join-btn" type="button" onClick={()=>join()}>회원가입</div>
                                </div>

                                <div className="btn">
                                    <div className="login-btn" type="button" onClick={goLogin}>LOGIN</div>
                                </div>
                            </form>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
    }

export default Login;