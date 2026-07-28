import axios from "axios";
import {useEffect, useState} from "react";
import { useCookies } from 'react-cookie';
import { Link } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import searchPlayList from "../../data/searchPlayList.json";
import playStampList from "../../data/playStampList.json";
import { loadAllStamps } from "../../utils/stampStorage";

const formatDotLabel = (date, time) => {
    if(!date){
        return '';
    }
    const md = format(parseISO(date),'MM/dd');
    if(!time){
        return md;
    }
    const hour24 = Number(time.substring(0,2));
    const ampm = hour24 >= 12 ? 'pm' : 'am';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${md} ${hour12}${ampm}`;
}

const editStamp = (num) =>{
    window.location.href=`/myhome/stamp/edit/${num}`;
}

const buildStampDots = (row) => {
    const today = format(new Date(),'yyyy-MM-dd');
    const indexedRecords = (row.records || []).map((record, recordIndex) => ({ record, recordIndex }));
    indexedRecords.sort((a, b) => {
        const dateCompare = (a.record.playDate || '').localeCompare(b.record.playDate || '');
        if(dateCompare !== 0){
            return dateCompare;
        }
        return (a.record.playTime || '').localeCompare(b.record.playTime || '');
    });
    const visits = [];
    indexedRecords.forEach(({ record, recordIndex }) => {
        const weight = Number(record.doubleStamp) || 1;
        for(let i=0; i<weight; i++){
            visits.push({ date: record.playDate, time: record.playTime, recordIndex });
        }
    });
    const total = Math.max(Number(row.max) || 0, visits.length);
    return Array.from({ length: total }, (_, i) => {
        const round = i + 1;
        const visit = visits[i];
        const hasBenefit = playStampList.some((s) => s.stamp_play_num === row.stamp_play_num && Number(s.stamp_benefit_num) === round);
        return {
            filled: Boolean(visit),
            date: visit ? visit.date : null,
            time: visit ? visit.time : null,
            recordIndex: visit ? visit.recordIndex : null,
            benefit: hasBenefit,
            upcoming: Boolean(visit && visit.date && visit.date > today),
        };
    });
}

const StampDots = ({ row }) => {
    const dots = buildStampDots(row);
    return(
        <div className="stampIcons">
            {dots.map((dot, i) => (
                <div
                    className={`stampIcon-cell ${dot.filled ? 'clickable' : ''}`}
                    key={i}
                    onClick={dot.filled ? () => editStamp(`${row.stamp_play_num}-${row.coalesce}-${dot.recordIndex}`) : undefined}
                >
                    {dot.benefit ? <span className="benefitBadge" title="혜택 회차">🎁</span> : ''}
                    <span className={`stampIcon ${dot.filled ? 'filled' : ''} ${dot.upcoming ? 'upcoming' : ''}`} />
                    <span className="stampIconLabel">
                        {dot.filled ? formatDotLabel(dot.date, dot.time) : ''}
                        {dot.upcoming ? ' 예정' : ''}
                    </span>
                </div>
            ))}
        </div>
    )
}

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
                    records: card.records || [],
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

    // const viewDetail = (playNum, stampNum) => {
    //     // console.log(playNum);
    //     // console.log(stampNum);
    //     window.location.href = `/myhome/stamp/detail?playNum=${playNum}&stampNum=${stampNum}`;
    // }

    

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

    const renderStampCard = (list, index) => {
        const mySum = Number(list.nomal) + Number(list.double*2);
        return(
            <div className="myStamp" key={index}>
                <div className="stampTop">
                    <div className="playName">
                    {list.play_genre} &lt;{list.play_name}&gt; <span className="stampCoalesce">도장판{list.coalesce}</span>
                    </div>
                    <div className="stampCount">
                        <span className="mymax">{mySum}</span><span className="max"> /{list.max}</span>
                    </div>
                </div>
                <StampDots row={list} />
                <div className="warning">
                    {mySum>list.max ? '❗❗수정필요':''}
                </div>
            </div>
        )
    }

    const nowList = nowStampList && nowStampList.map(renderStampCard)

    const endList = endStampList && endStampList.map(renderStampCard)

    const totalList = totalStampList && totalStampList.map(renderStampCard)

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