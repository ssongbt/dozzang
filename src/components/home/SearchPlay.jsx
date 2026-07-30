import { useState, useEffect } from "react";
import { format, parseISO } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { Link45deg, PatchPlusFill } from "react-bootstrap-icons";
import SearchPlayStamp from "./SearchPlayStamp";
import Stampimg from "../../assets/stamp.png";
import Ticketlinkimg from "../../assets/ticketlink.png";
import Yes24img from "../../assets/yes24.png";
import Nolimg from "../../assets/nol.png";
import searchPlayList from "../../data/searchPlayList.json";
import playStampList from "../../data/playStampList.json";

const SearchPlay = () => {

    const [playNum, setPlayNum] = useState();
    const [playName, setPlayName] = useState();
    const [playStart, setPlayStart] = useState();
    const [playEnd, setPlayEnd] = useState();
    const [playCast, setPlayCast] = useState();
    const [playStamp, setPlayStamp] = useState();
    const [playUrlT, setPlayUrlT] = useState();
    const [playUrlY, setPlayUrlY] = useState();
    const [playUrlN, setPlayUrlN] = useState();
    // const [playImg, setPlayImg] = useState();
    const [playGenre, setPlayGenre] = useState();
    const [playFirstStamp, setPlayFirstStamp] = useState();
    const [stampList, setStampList] = useState([
        {
            stamp:[]
        }
    ])

    let params = useParams();
    const playnum = params.playnum;

    console.log(playnum);

    useEffect(()=>{
        getPlay()
    },[playnum])

    const getPlay = () =>{
        const play = searchPlayList.find((p) => p.play_num === Number(playnum));
        if(!play) return;

        setPlayNum(play.play_num);
        setPlayName(play.play_name);
        setPlayGenre(play.play_genre);
        setPlayStart(play.play_start);
        setPlayEnd(play.play_end);
        setPlayCast(play.play_cast);
        setPlayStamp(play.play_stamp);
        setPlayUrlT(play.play_url_t);
        setPlayUrlY(play.play_url_y);
        setPlayUrlN(play.play_url_n);
        setPlayFirstStamp(play.play_firststamp);

        const stamp = playStampList.filter((s) => s.stamp_play_num === play.play_num);
        setStampList({stamp});
    }

    const startDate = playStart ? format(parseISO(playStart),'yyyy-MM-dd') : "미정";
    const endDate = playEnd ? format(parseISO(playEnd),'yyyy-MM-dd') : "미정";

    // const index = stampList.findIndex(item => item.stamp_benefit_num ===3);
    // console.log(index);
    const result = (arr, prop) =>{
        return [...new Map(arr&&arr.map((m) => [m[prop], m])).values()];
    }

    // console.log(result(stampList.stamp, 'stamp_benefit_num'));
    const stampbenefit = result(stampList.stamp, 'stamp_benefit_num') && result(stampList.stamp, 'stamp_benefit_num').map(benefit=>{
        return(
            <div className="benefitlist" key={benefit.stamp_num}>
                <div className="benefitNum">
                    <span>{benefit.stamp_benefit_num}회차</span>
                </div>
                    <SearchPlayStamp
                    className = "stamp-benefit"
                    stampbenefit={benefit.stamp_benefit_num}
                    stamplist={stampList.stamp}
                    type="play" />
                
            </div>
        )

    })


    return(
        <div id="searchPlay">
            <div className="wrap">
                <div className="searchplay-gap">
                    <div className="searchplay-wrap">
                        <div className="playdetail-gap">
                            <div className="playdetail">
                                <div className="play">
                                    <div className="playName">
                                        <span className="genreBadge">{playGenre}</span>
                                        <span className="title">{playName}</span>
                                        {playStamp ?
                                            <span className="firstStamp">
                                                <img className="stampImg" src={Stampimg} alt="stamp" />
                                                {playFirstStamp}회차 첫발급
                                            </span>
                                            : ''}
                                    </div>
                                    <div className="playMeta">
                                        <span className="playDate">{startDate} ~ {endDate}</span>
                                        {(playUrlT || playUrlY || playUrlN) &&
                                            <div className="ticketLinks">
                                                {playUrlT ?
                                                    <a className="ticketBtn" href={playUrlT} target="_blank" rel="noreferrer">
                                                        <img src={Ticketlinkimg} alt="티켓링크" />
                                                    </a>
                                                    : ''}
                                                {playUrlY ?
                                                    <a className="ticketBtn" href={playUrlY} target="_blank" rel="noreferrer">
                                                        <img src={Yes24img} alt="YES24" />
                                                    </a>
                                                    : ''}
                                                {playUrlN ?
                                                    <a className="ticketBtn" href={playUrlN} target="_blank" rel="noreferrer">
                                                        <img src={Nolimg} alt="NOL" />
                                                    </a>
                                                    : ''}
                                            </div>
                                        }
                                    </div>
                                    <div className="playCast">
                                        {playCast}
                                    </div>
                                </div>
                                <div className="stamp">
                                    {stampbenefit}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchPlay;