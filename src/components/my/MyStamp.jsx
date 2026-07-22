import axios from "axios";
import {useEffect, useState} from "react";
import { useCookies } from 'react-cookie';
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import searchPlayList from "../../data/searchPlayList.json";
import { loadAllStamps } from "../../utils/stampStorage";

const MyStamp = () => {

    const [stampState, setStampState] = useState('now');
    const [nowStampList, setNowStampList] = useState([]);
    const [nowMyCount, setNowMyCount] = useState();
    const [endStampList, setEndStampList] = useState([]);
    const [endMyCount, setEndMyCount] = useState();
    const [totalStampList, setTotalStampList] = useState([]);
    const [totalMyCount, setTotalMyCount] = useState();

    const [cookies, setCookie] = useCookies(['id','nick','img']);

    const [userNick, setUserNick] = useState(localStorage.getItem('userNick'));
    const [userImg, setUserImg] = useState(localStorage.getItem('userImg'));

    const getStampList = () =>{
        const all = loadAllStamps();
        const today = format(new Date(),'yyyy-MM-dd');
        const now = [];
        const end = [];
        const total = [];
console.log(all);
        Object.keys(all).forEach((playNum) => {
            const play = searchPlayList.find((p) => p.play_num === Number(playNum));
            if(!play){
                return;
            }
            all[playNum].forEach((card) => {
                const row = {
                    stamp_play_num: play.play_num,
                    play_name: play.play_name,
                    play_genre: play.play_genre,
                    coalesce: card.coalesce,
                    nomal: card.nomal,
                    double: card.double,
                    max: play.play_stamp,
                };
                total.push(row);
                if(!play.play_end || play.play_end >= today){
                    now.push(row);
                }else{
                    end.push(row);
                }
            });
        });

        setNowStampList(now);
        setNowMyCount(now.length);
        setEndStampList(end);
        setEndMyCount(end.length);
        setTotalStampList(total);
        setTotalMyCount(total.length);
        // axios({
        //     url:'/api/myhome/stamp',
        //     method:'GET'
        // })
        // .then((res)=>{
        //     setNowStampList(res.data.nowRows);
        //     setNowMyCount(res.data.nowMyCount);
        //     setEndStampList(res.data.endRows);
        //     setEndMyCount(res.data.endMyCount);
        //     setTotalStampList(res.data.totalRows);
        //     setTotalMyCount(res.data.totalMyCount);
        //     console.log(res.data.nowRows);
        // })
        // .catch((err)=>{
        //     console.log(err);
        // })
    }

    useEffect(()=>{
        // setStampState();
        getStampList();
        // console.log(stampState);

    },[])

    const viewDetail = (playNum, stampNum) => {
        console.log(playNum);
        console.log(stampNum);
        window.location.href = `/myhome/stamp/detail?playNum=${playNum}&stampNum=${stampNum}`;
    }

    const changeStamp = (state) => {
        setStampState(state);
    }

    const stampChoice = (stampState) => {
        if(stampState === 'now') {
            if(nowMyCount === 0){
                return(
                    <p className="no-stamp">도장판이 없습니다</p>
                )
            }else{
                return(
                    <div className="list">
                    {nowList}
                    </div>
                )
            }
        }else if(stampState === 'end'){
            if(endMyCount === 0){
                return(
                    <p className="no-stamp">도장판이 없습니다</p>
                )
            }else{
                return(
                    <div className="list">
                    {endList}
                    </div>
                )
            }
        }else{
            if(totalMyCount === 0){
                return(
                    <p className="no-stamp">도장판이 없습니다</p>
                )
            }else{
                return(
                    <div className="list">
                    {totalList}
                    </div>
                )
            }
        }
    }

    const nowList = nowStampList && nowStampList.map((list, index)=>{
        return(
            <div className="myStamp" key={index} onClick={()=>viewDetail(list.stamp_play_num, list.coalesce)}>
                <div className="playName">
                {list.play_genre} &lt;{list.play_name}&gt;
                </div>
                <div className="stamp">
                    <span className="mymax">{Number(list.nomal) + Number(list.double*2)}</span><span className="max"> /{list.max}</span>
                </div>
                <div className="warning">
                    {Number(list.nomal) + Number(list.double*2)>list.max ? '❗❗수정필요':''}
                </div>
            </div>
        )
    })

    const endList = endStampList && endStampList.map((list, index)=>{
        return(
            <div className="myStamp" key={index} onClick={()=>viewDetail(list.stamp_play_num, list.coalesce)}>
                <div className="playName">
                {list.play_genre} &lt;{list.play_name}&gt;
                </div>
                <div className="stamp">
                    <span className="mymax">{Number(list.nomal) + Number(list.double*2)}</span><span className="max"> /{list.max}</span>
                </div>
                <div className="warning">
                    {Number(list.nomal) + Number(list.double*2)>list.max ? '❗❗수정필요':''}
                </div>
            </div>
        )
    })

    const totalList = totalStampList && totalStampList.map((list, index)=>{
        return(
            <div className="myStamp" key={index} onClick={()=>viewDetail(list.stamp_play_num, list.coalesce)}>
                <div className="playName">
                {list.play_genre} &lt;{list.play_name}&gt;
                </div>
                <div className="stamp">
                    <span className="mymax">{Number(list.nomal) + Number(list.double*2)}</span><span className="max"> /{list.max}</span>
                </div>
                <div className="warning">
                    {Number(list.nomal) + Number(list.double*2)>list.max ? '❗❗수정필요':''}
                </div>
            </div>
        )
    })

    return(
        <div id="myStamp">
            <div className="wrap">
                <div className="myStamp-gap">
                    <div className="myStamp-wrap">
                        <div className="myInfo">
                            <div className="state">
                                <div className="now" onClick={()=>changeStamp('now')}>
                                    <p>현재 도장판</p>
                                    <p className="num">{nowMyCount}</p>
                                </div>
                                <div className="end" onClick={()=>changeStamp('end')}>
                                    <p>종료 도장판</p>
                                    <p className="num">{endMyCount}</p>
                                </div>
                                <div className="total" onClick={()=>changeStamp('total')}>
                                    <p>전체 도장판</p>
                                    <p className="num">{totalMyCount}</p>
                                </div>

                            </div>
                        </div>
                        <div className="myStampList">
                            {stampChoice(stampState)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default MyStamp;