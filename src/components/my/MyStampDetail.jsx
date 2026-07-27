import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { parseISO, format } from "date-fns";
import { Link45deg, PatchPlusFill } from "react-bootstrap-icons";
import BenefitCheck from "./BenefitCheck";
import Linkimg from "../../assets/free-icon-link-2089782.png";
import searchPlayList from "../../data/searchPlayList.json";
import { loadAllStamps } from "../../utils/stampStorage";

const MyStampDetail = () => {

    const [detailParams] = useSearchParams();
    const [playName, setPlayName] = useState();
    const [playGenre, setPlayGenre] = useState();
    const [playStart, setPlayStart] = useState();
    const [playEnd, setPlayEnd] = useState();
    const [playCast, setPlayCast] = useState();
    const [playUrl, setPlayUrl] = useState();
    const [playFirstStamp, setPlayFirstStamp] = useState();
    const [playFirstDouble, setPlayFirstDouble] = useState();
    const [max, setMax] = useState();
    const [detailList, setDetailList] = useState();

    const getDetail = () =>{
        const playNum = detailParams.get('playNum');
        const stampNum = detailParams.get('stampNum');

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
        setPlayFirstStamp(play.play_firststamp);
        setPlayFirstDouble(play.play_firststamp);
        setMax(play.play_stamp);

        const cards = loadAllStamps()[playNum] || [];
        const card = cards.find((c) => Number(c.coalesce) === Number(stampNum));
        const records = card && card.records ? card.records : [];

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
    },[])

    const editStamp = (num) =>{
        window.location.href=`/myhome/stamp/edit/${num}`;
    }

    const delStamp = (num) => {
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios({
                url:`/api/myhome/stamp/detail/del/${num}`,
                method:'POST'
            })
            .then(()=>{
                alert("삭제되었습니다.");
                window.location.reload();
            })
            .catch((err)=>{
                console.log(err);
            })
        }else{
            return false;
        }
    }

    const doubleCheck = () => {
        return(
            <span>
                더블적립
            </span>
        )
    }

    const list = detailList && detailList.map(list=>{
        const date = format(parseISO(list.ustamp_play_date),'yyyy-MM-dd');
        const time = list.ustamp_play_time.substr(0,5);
        return(
            <div className="stampdetail" key={list.idx}>
                <div className="stampNum"><span className="num">{list.sum}</span><span className="max">/{max}</span></div>
                {/* {list.idx} */}
                <div className="stampDate">
                {date}
                &nbsp;{time}
                &nbsp; {list.ustamp_double===2? doubleCheck():''}
                </div>
                
                <div className="small-btn">
                    <div className="edit-btn" onClick={()=>editStamp(list.ustamp_num)}>수정</div>
                    <div className="div-btn">&nbsp; | &nbsp;</div>
                    <div className="del-btn" onClick={()=>delStamp(list.ustamp_num)}>삭제</div>
                </div>

                <div className="benefitdetail">
                    <BenefitCheck
                        benefitNum = {list.sum}
                        double = {list.ustamp_double}
                    />
                </div>

                
                {list.ustamp_memo ? 
                <div className="stampMemo" > {list.ustamp_memo} </div>
                  : ''}
                
                
                {list.sum>max?<span className="edit-btn" onClick={()=>editStamp(list.ustamp_num)}>수정필요</span>:''}


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
                                    <span className="title">{playGenre}&lt;{playName}&gt;</span>
                                    &nbsp;&nbsp;
                                        {playUrl ? 
                                            <img className="linkImg" src={Linkimg} alt="link" onClick={() => window.open(`${playUrl}`, "_blank")} />
                                            : ''}
                                    &nbsp;&nbsp;
                                </div>
                                <div className="playDate">
                                    {startDate} ~ {endDate}
                                </div>
                                <div className="playCast">
                                    {playCast}
                                </div>
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