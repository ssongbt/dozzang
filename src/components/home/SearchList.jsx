import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import SearchingHome from "../common/SearchingHome";
import SearchStampList from "./SearchStampList";
import { parseISO, format } from "date-fns";
import { Link45deg, PatchPlusFill } from "react-bootstrap-icons";
import Stampimg from "../../assets/stamp.png";
import { getPlayStampJoin } from "../../data/playStampJoin";

const SearchList = () => {

    const [playList, setPlayList] = useState([
        {
            play :[]
        }
    ]);

    const [stampList, setStampList] = useState([
        {
            stamp: []
        }
    ])

    let params = useParams();
    const keyword = params.keyword;


    useEffect(()=>{
        searchPlayList();
    }, [keyword]);



    const searchPlayList = () => {
        const rows = getPlayStampJoin(keyword);
        setPlayList({play:rows});
        setStampList({stamp:rows});
    }

    // console.log(playList.play);
    // const result = [... new Map(playList.play.map((m) => [m.play_num, m])).values()];
    // console.log(result);
    const result = (arr, prop) =>{
        return [...new Map(arr&&arr.map((m) => [m[prop], m])).values()];
    }

    console.log(result(playList.play).length);

    const resultPlayList = result(playList.play, 'play_num');

    // console.log(resultPlayList);
    const viewDetail = (num) =>[
        window.location.href = `/home/search/play/${num}`
    ]
 
    const noResult = () => {
        return(
            <div className="search-result">
                    검색결과가 존재하지않습니다.
            </div>
        )
    }

    const sResult = () => {
        return(
            <div className="search-result">
                <span> {keyword} </span> 에 대한 검색결과입니다.
            </div>
        )
    }

    const play = result(playList.play) && result(playList.play, 'play_num').map(list =>{

        const startDate = list.play_start ? format(parseISO(list.play_start),'yyyy-MM-dd') : "미정";
        const endDate = list.play_end ? format(parseISO(list.play_end),'yyyy-MM-dd') : "미정";

            return(
                <div className="list" key={list.play_num} onClick={() => viewDetail(list.play_num)}>
                    <div className="play">
                        <div className="playName">
                            <span className="genreBadge">{list.play_genre}</span>
                            <span className="title">{list.play_name.trim()}</span>
                            {/* {list.play_stamp ?
                                <img className="stampImg" src={Stampimg} alt="stamp" />
                            :''} */}
                        </div>
                        <div className="playDate">
                            {startDate} ~ {endDate}
                        </div>
                    </div>
                    <div className="stamp">
                        {list.play_stamp ?
                            <SearchStampList
                                playNum={list.play_num}
                                playStamp={list.play_stamp}
                                stamp ={stampList}
                            /> : ''
                        }
                    </div>
                </div>
            )
        
    })

    return(
        <div id="searchList">
            <div className="wrap">
                <div className="searchlist-gap">
                    <div className="searchlist-wrap">
                        <div  className="list-wrap">
                            {result(playList.play).length>0 ? sResult() : noResult()}
                            {result(playList.play).length>0 ? play : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default SearchList;