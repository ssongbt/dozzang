import axios from "axios";
import { useState, useEffect } from "react";
import { parseISO, format } from "date-fns";
import { PencilSquare, TrashFill } from "react-bootstrap-icons";

const CancleDouble = ({playNum, dstampNum, start, end, time}) =>{

    // console.log("공연숫자",playNum);
    const [cancleStart, setCancleStart] = useState();
    const [cancleEnd, setCancleEnd] = useState();
    const [cancleDate, setCancleDate] = useState();
    const [cancleTime, setCancleTime] = useState();
    const [type, setType] = useState();

    useEffect(()=>{
        if(end && !time){
            setCancleStart(start);
            setCancleEnd(end);
            setType("peroidStamp")
        }else if(!end && time){
            setCancleDate(start);
            setCancleTime(time);
            setType("turnStamp");
        }
    },[playNum])

    const cancleDoubleP = (e) =>{

        if(!window.confirm("정말 삭제하시곘습니까?\n복구가 불가합니다.")){
            return false;
        }else{

            const data = {
                playNum : playNum,
                doubleStart : cancleStart,
                doubleEnd : cancleEnd,
                dstampNum : dstampNum,
                doubleDate : cancleDate,
                doubleTime : cancleTime,
                type:type
            }
    
            axios({
                url:`/api/admin/playlist/play/double/cancle`,
                method:'POST',
                data:data
            })
            .then((res)=>{
                alert(res.data.msg);
                if(res.data.code === 'S') {
                    window.location.reload();
                }else{
                    return false;
                }
            })
            .catch((err)=>{
                console.log(err);
            })

        }
    }

    if(cancleEnd && !cancleTime){
        return(
            <div className="cancleDouble">
                <div className="double-date">
                <span>{start}</span>
                    ~
                <span>{end}</span>
                </div>
                <div className="double-btn">
                    {/* <PencilSquare className="d-btn edit" onClick={(e)=>cancleDoubleP()} ></PencilSquare> */}
                    <TrashFill className="d-btn del" onClick={(e)=>cancleDoubleP()} ></TrashFill>
                </div>
            </div>
        )
    }else if(!cancleEnd && cancleTime){
        return(
            <div className="cancleDouble">
                <div className="double-date">
                <span>{start}</span>
                &nbsp;&nbsp;
                <span>{time}</span>
                </div>
            <div className="double-btn">
                {/* <PencilSquare className="d-btn edit" onClick={(e)=>cancleDoubleP()} ></PencilSquare> */}
                <TrashFill className="d-btn del" onClick={(e)=>cancleDoubleP()} ></TrashFill>
            </div>
            </div>
        )
    }


}

export default CancleDouble;