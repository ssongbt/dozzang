import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { parseISO, format } from "date-fns";
import { PencilSquare, Trash3 } from "react-bootstrap-icons";
import BenefitCheck from "./BenefitCheck";
import Linkimg from "../../assets/free-icon-link-2089782.png";
import searchPlayList from "../../data/searchPlayList.json";
import playStampList from "../../data/playStampList.json";
import { loadAllStamps, removeStamp, getFilledCount, getCardAlias, setCardAlias } from "../../utils/stampStorage";
import { getBenefitDisplayText } from "../../utils/benefitDisplay";

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const formatStampDateTime = (dateStr, timeStr) => {
    const dt = parseISO(`${dateStr}T${timeStr}`);
    const weekday = WEEKDAYS[dt.getDay()];
    const hour24 = dt.getHours();
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const minute = format(dt, 'mm');
    return `${format(dt, 'yyyy-MM-dd')}(${weekday}) ${ampm} ${hour12}:${minute}`;
};

const MyStampDetail = () => {

    const [detailParams] = useSearchParams();
    const playNum = detailParams.get('playNum');
    const stampNum = detailParams.get('stampNum');
    const [playName, setPlayName] = useState();
    const [playGenre, setPlayGenre] = useState();
    const [playStart, setPlayStart] = useState();
    const [playEnd, setPlayEnd] = useState();
    const [playCast, setPlayCast] = useState();
    const [playUrl, setPlayUrl] = useState();
    const [max, setMax] = useState();
    const [detailList, setDetailList] = useState();
    const [mySum, setMySum] = useState(0);
    const [alias, setAlias] = useState('');

    const getDetail = () =>{
        const play = searchPlayList.find((p) => p.play_num === Number(playNum));
        if(!play){
            return;
        }
        setPlayName(play.play_name);
        setPlayGenre(play.play_genre);
        setPlayStart(play.play_start);
        setPlayEnd(play.play_end);
        setPlayCast(play.play_cast);
        setPlayUrl(play.play_url);
        setMax(play.play_stamp);

        const cards = loadAllStamps()[playNum] || [];
        const card = cards.find((c) => Number(c.coalesce) === Number(stampNum));
        const records = card && card.records ? card.records : [];

        setMySum(card ? getFilledCount(card) : 0);
        setAlias(getCardAlias(playNum, stampNum));

        let sum = 0;
        const rows = records.map((record, index) => {
            sum += Number(record.doubleStamp) || 1;
            return {
                idx: index,
                ustamp_num: index,
                sum,
                ustamp_play_date: record.playDate,
                ustamp_play_time: record.playTime,
                ustamp_double: record.doubleStamp,
                ustamp_memo: record.stampMemo,
            };
        });

        setDetailList(rows);
    }

    const startDate = playStart ? format(parseISO(playStart),'yyyy-MM-dd') : "미정";
    const endDate = playEnd ? format(parseISO(playEnd),'yyyy-MM-dd') : "미정";


    useEffect(()=>{
        getDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const editStamp = (recordIndex) =>{
        window.location.href=`#/myhome/stamp/edit/${playNum}-${stampNum}-${recordIndex}`;
    }

    const delStamp = (recordIndex) => {
        if(window.confirm("정말 삭제하시겠습니까?")){
            removeStamp(playNum, stampNum, recordIndex);
            alert("삭제되었습니다.");
            getDetail();
        }else{
            return false;
        }
    }

    const editAlias = () => {
        const next = window.prompt("도장판 별칭을 입력하세요", alias || '');
        if(next === null){
            return;
        }
        setCardAlias(playNum, stampNum, next.trim());
        setAlias(next.trim());
    }

    const today = format(new Date(),'yyyy-MM-dd');

    const list = detailList && detailList.map(list=>{
        const upcoming = list.ustamp_play_date > today;
        const weight = Number(list.ustamp_double) || 1;
        const roundStart = list.sum - weight + 1;
        const roundBenefits = playStampList.filter((b) =>
            b.stamp_play_num === Number(playNum) &&
            Number(b.stamp_benefit_num) >= roundStart &&
            Number(b.stamp_benefit_num) <= list.sum
        );
        return(
            <div className={`stampdetail ${upcoming ? 'upcoming' : 'visited'}`} key={list.idx}>
                <div className="stampIconWrap">
                    <span className={`stampIcon filled ${upcoming ? 'upcoming' : ''}`} />
                    <span className="stampNum"><span className="num">{list.sum}</span><span className="max">/{max}</span></span>
                </div>

                <div className="stampInfo">
                    <div className="stampDate">
                        {formatStampDateTime(list.ustamp_play_date, list.ustamp_play_time)}
                        {upcoming ? <span className="upcomingBadge">예정</span> : ''}
                        {list.ustamp_double===2 ? <span className="doubleBadge">더블적립</span> : ''}
                        {list.ustamp_double===3 ? <span className="doubleBadge">트리플적립</span> : ''}
                        {list.ustamp_double===4 ? <span className="doubleBadge">쿼드적립</span> : ''}
                    </div>
                    {roundBenefits.length > 0 &&
                        <div className="stampBenefit">
                            {roundBenefits.map((b) => (
                                <span className="benefitTag" key={b.stamp_num}>{b.stamp_benefit_emoji || '🎁'} {getBenefitDisplayText(b)}</span>
                            ))}
                        </div>
                    }
                    {list.ustamp_memo ?
                        <div className="stampMemo">{list.ustamp_memo}</div>
                        : ''}
                    {list.sum>max ?
                        <span className="warnLabel" onClick={()=>editStamp(list.ustamp_num)}>‼️ 수정필요</span>
                        : ''}
                </div>

                <div className="rowActions">
                    <button type="button" className="icon-btn" title="수정" aria-label="수정" onClick={()=>editStamp(list.ustamp_num)}><PencilSquare size={13}/></button>
                    <button type="button" className="icon-btn danger" title="삭제" aria-label="삭제" onClick={()=>delStamp(list.ustamp_num)}><Trash3 size={13}/></button>
                </div>
            </div>
            )
    })

    return(
        <div id="stampDetail">
            <div className="wrap">
                <div className="stampDetail-gap">
                    <div className="stampDetail-wrap">
                        <div className="playdetail">
                            <div className="play">
                                <div className="playName">
                                    <span className="genreBadge">{playGenre}</span>
                                    <span className="title">{playName}</span>
                                    {playUrl ?
                                        <img className="linkImg" src={Linkimg} alt="link" onClick={() => window.open(`${playUrl}`, "_blank")} />
                                        : ''}
                                </div>
                                <div className="playMeta">
                                    <span className="playDate">{startDate} ~ {endDate}</span>
                                </div>
                                <div className="playCast">
                                    {playCast}
                                </div>
                            </div>

                            <div className="benefitdetail">
                                <div className="section-title">혜택 안내</div>
                                <BenefitCheck
                                    playNum = {playNum}
                                    coalesce = {stampNum}
                                    mySum = {mySum}
                                />
                            </div>

                            <div className="myStampStatus">
                                <div className="titleRow">
                                    <span className="stampCoalesce">도장판{stampNum}</span>
                                    {alias ? <span className="stampAlias">{alias}</span> : ''}
                                    <button type="button" className="icon-btn" title="별칭 수정" aria-label="별칭 수정" onClick={editAlias}><PencilSquare size={12}/></button>
                                </div>
                                <span className="count"><span className="mymax">{mySum}</span><span className="max"> / {max}</span></span>
                            </div>

                            <div className="stamplist">
                                {list}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default MyStampDetail;
