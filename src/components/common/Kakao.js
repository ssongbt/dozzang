import React, { useEffect } from "react";
import axios from "axios";


const Kakao = (props) =>{

    useEffect(()=>{

        let params = new URL(document.URL).searchParams;
        let code = params.get("code");
    
        // const KAKAO_OAUTH_TOKEN_API_URL = "https://kauth.kakao.com/oauth/token";
        const KAKAO_GRANT_TYPE="authorization_code";
        const KAKAO_CLIENT_ID="007438fd58de051608236584233d68c5";
        const KAKAO_REDIRECT_URL="http://localhost:3000/home/login/kakao";

        axios.post(`https://kauth.kakao.com/oauth/token?grant_type=${KAKAO_GRANT_TYPE}&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}`,
            {
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
        }).then((res)=>{
            console.log(res);
            axios({
                url:'/api/home/login/kakao',
                method:'POST',
                data : {access_token : res.data}
            })
            .then((result)=>{
                // console.log(res);
                // window.location.replace('/home');
                // document.location.href = '/home';
                window.location.href= '/home';
            })
            .catch((err)=>{
                console.log(err);
            })
        })
    },[])
    
    return (
        <div>로그인처리과정</div>
    )
 

}

export default Kakao;