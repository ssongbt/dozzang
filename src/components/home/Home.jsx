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
            </div>
        </div>
        
    )

}

export default Home;