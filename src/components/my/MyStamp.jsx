import {useEffect, useMemo, useState} from "react";
import { format, parseISO } from 'date-fns';
import { PencilSquare } from "react-bootstrap-icons";
import searchPlayList from "../../data/searchPlayList.json";
import playStampList from "../../data/playStampList.json";
import { loadAllStamps, getFilledCount, getCardAlias, setCardAlias } from "../../utils/stampStorage";

const formatDotLabel = (date, time) => {
    if(!date){
        return '';
    }
    const md = format(parseISO(date),'MM/dd');
    if(!time){
        return md;
    }
    const hour24 = Number(time.substring(0,2));
    const minute = time.substring(3,5);
    const ampm = hour24 >= 12 ? 'pm' : 'am';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const timeLabel = minute === '00'
        ? `${hour12}${ampm}`
        : `${hour12}:${minute}${ampm}`;
    return `${md} ${timeLabel}`;
}

const editStamp = (num) =>{
    window.location.href=`#/myhome/stamp/edit/${num}`;
}

const addStamp = (playNum, coalesce) =>{
    window.location.href=`#/myhome/stamp/add/${playNum}/${coalesce}`;
}

const viewDetail = (playNum, coalesce) => {
    window.location.href = `#/myhome/stamp/detail/?playNum=${playNum}&stampNum=${coalesce}`;
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
        const benefit = playStampList.find((s) => s.stamp_play_num === row.stamp_play_num && Number(s.stamp_benefit_num) === round);
        return {
            filled: Boolean(visit),
            date: visit ? visit.date : null,
            time: visit ? visit.time : null,
            recordIndex: visit ? visit.recordIndex : null,
            benefit: Boolean(benefit),
            benefitEmoji: benefit ? (benefit.stamp_benefit_emoji || '🎁') : null,
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
                    className="stampIcon-cell clickable"
                    key={i}
                    onClick={dot.filled
                        ? () => editStamp(`${row.stamp_play_num}-${row.coalesce}-${dot.recordIndex}`)
                        : () => addStamp(row.stamp_play_num, row.coalesce)}
                >
                    {dot.benefit ? <span className="benefitBadge" title="혜택 회차">{dot.benefitEmoji}</span> : ''}
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
    const [selectedPlayNum, setSelectedPlayNum] = useState(null);
    const [nowStampList, setNowStampList] = useState([]);
    const [nowMyCount, setNowMyCount] = useState();
    const [endStampList, setEndStampList] = useState([]);
    const [endMyCount, setEndMyCount] = useState();
    const [totalStampList, setTotalStampList] = useState([]);
    const [totalMyCount, setTotalMyCount] = useState();

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
                    play_emoji: play.play_emoji,
                    coalesce: card.coalesce,
                    max: play.play_stamp,
                    records: card.records || [],
                    alias: getCardAlias(play.play_num, card.coalesce),
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

    

    const editAlias = (e, playNum, coalesce, currentAlias) => {
        e.stopPropagation();
        const next = window.prompt("도장판 별칭을 입력하세요", currentAlias || '');
        if(next === null){
            return;
        }
        setCardAlias(playNum, coalesce, next.trim());
        getStampList();
    }

    const changeStamp = (state) => {
        setStampState(state);
        setSelectedPlayNum(null);
    }

    const currentList = stampState === 'now' ? nowStampList : stampState === 'end' ? endStampList : totalStampList;

    const playFilterOptions = useMemo(() => {
        const seen = new Map();
        currentList.forEach((row) => {
            if(!seen.has(row.stamp_play_num)){
                seen.set(row.stamp_play_num, { stamp_play_num: row.stamp_play_num, play_name: row.play_name, play_emoji: row.play_emoji });
            }
        });
        return Array.from(seen.values());
    }, [currentList]);

    const filteredList = selectedPlayNum ? currentList.filter((row) => row.stamp_play_num === selectedPlayNum) : currentList;

    const stampChoice = () => {
        if(currentList.length === 0){
            return(
                <p className="no-stamp">도장판이 없습니다</p>
            )
        }
        return(
            <>
                {playFilterOptions.length > 1 &&
                    <div className="playFilter">
                        <button
                            type="button"
                            className={`playFilter-chip ${selectedPlayNum === null ? 'active' : ''}`}
                            onClick={() => setSelectedPlayNum(null)}
                        >
                            전체
                        </button>
                        {playFilterOptions.map((play) => (
                            <button
                                type="button"
                                key={play.stamp_play_num}
                                className={`playFilter-chip ${selectedPlayNum === play.stamp_play_num ? 'active' : ''}`}
                                onClick={() => setSelectedPlayNum(play.stamp_play_num)}
                            >
                                <span className="playFilter-emoji">{play.play_emoji}</span>
                                <span className="playFilter-name">{play.play_name}</span>
                            </button>
                        ))}
                    </div>
                }
                <div className="list">
                    {filteredList.map(renderStampCard)}
                </div>
            </>
        )
    }

    const renderStampCard = (list, index) => {
        const mySum = getFilledCount(list);
        return(
            <div className="myStamp" key={index}>
                <div className="stampTop clickable" onClick={() => viewDetail(list.stamp_play_num, list.coalesce)}>
                    <div className="playName">
                    {list.play_genre} &lt;{list.play_name}&gt;
                    <span className="stampCoalesce">
                        도장판{list.coalesce}
                        {list.alias ? <span className="stampAlias">{list.alias}</span> : ''}
                        <button type="button" className="alias-edit-btn" title="별칭 수정" aria-label="별칭 수정" onClick={(e)=>editAlias(e, list.stamp_play_num, list.coalesce, list.alias)}><PencilSquare size={11}/></button>
                    </span>
                    </div>
                    <div className="stampCount">
                        <span className="mymax">{mySum}</span><span className="max"> / {list.max}</span>
                    </div>
                </div>
                <StampDots row={list} />
                <div className="warning">
                    {mySum>list.max ? '‼️수정필요':''}
                </div>
            </div>
        )
    }

    return(
        <div id="myStamp">
            <div className="wrap">
                <div className="myStamp-gap">
                    <div className="myStamp-wrap">
                        <div className="myInfo">
                            <div className="state">
                                <div className={`now ${stampState === 'now' ? 'active' : ''}`} onClick={()=>changeStamp('now')}>
                                    <p>현재 도장판</p>
                                    <p className="num">{nowMyCount}</p>
                                </div>
                                <div className={`end ${stampState === 'end' ? 'active' : ''}`} onClick={()=>changeStamp('end')}>
                                    <p>종료 도장판</p>
                                    <p className="num">{endMyCount}</p>
                                </div>
                                <div className={`total ${stampState === 'total' ? 'active' : ''}`} onClick={()=>changeStamp('total')}>
                                    <p>전체 도장판</p>
                                    <p className="num">{totalMyCount}</p>
                                </div>

                            </div>
                        </div>
                        <div className="myStampList">
                            {stampChoice()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default MyStamp;