import axios from "axios";
import {useEffect, useState} from "react";
import SearchingHome from "../common/SearchingHome";
import kakaoLogin from "../../assets/kakao_login_medium_narrow.png";
import { KAKAO_AUTH_URL } from "../common/KAuth";


const Home = () => {
    
    return(
        <div id="home">
            <div className="wrap">
                <div className="search-gap">
                    <div className="serach-wrap">
                        <SearchingHome />
                    </div>
                </div>
                <div className="login-gap">
                    <div className="login-wrap">
                            {/* {localStorage.getItem('userId')} */}
                            {localStorage.getItem('logined') !== 'true' ? 
                            <a href={KAKAO_AUTH_URL} >
                            <img src={kakaoLogin} alt="kakao"></img>
                            </a>
                            : ''}
                    </div>
                </div>
            </div>
        </div>
        
    )

}

export default Home;