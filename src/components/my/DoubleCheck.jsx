import { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';
import axios from "axios";

const DoubleCheck = ({chkDoubleStamp, stampDate, stampTime, playNum}) =>{

    const [doubleList, setDoubleList] = useState([]);
    const double = 2;

    console.log(stampTime);
    console.log("props",format(stampDate,'yyyy-MM-dd'));
    const doubleCheck = () =>{

        axios({
            url:`/api/myhome/stamp/doublecheck`,
            method:'POST',
            data : {playNum : playNum,
                    stampDate : format(stampDate,'yyyy-MM-dd'),
                    stampTime : stampTime?stampTime.toTimeString().split(' ')[0]:''
                    }
        })
        .then((res)=>{
            setDoubleList(res.data.doubles);
            console.log("더블리스트",doubleList);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        if(playNum){
            doubleCheck();
        }return ()=>{
            setDoubleList([]);
        }
    },[stampDate,stampTime])

    const getDoubleStamp = () =>{
        chkDoubleStamp(double);
    }

    useEffect(()=>{
        doubleList && doubleList.map(list=>{
            if(list.dstamp_end_date && !list.dstamp_time){
                const start = format(parseISO(list.dstamp_start_date),'yyyy-MM-dd');
                const end = format(parseISO(list.dstamp_end_date),'yyyy-MM-dd');
                if( format(stampDate,'yyyy-MM-dd')>=start && format(stampDate,'yyyy-MM-dd')<=end){
                    getDoubleStamp();
                }
            }else if(!list.dstamp_end_date && list.dstamp_time){
                const start = format(parseISO(list.dstamp_start_date),'yyyy-MM-dd');
                const time = list.dstamp_time.substring(0,5);
                // console.log(time);
                if( format(stampDate,'yyyy-MM-dd')===start && format(stampTime,'HH:mm')===time){
                    getDoubleStamp();
                }
            }
        // getDoubleStamp();
        })
    },[doubleList]);

    return(
        doubleList && doubleList.map(list=>{
            if(list.dstamp_end_date && !list.dstamp_time){
                const start = format(parseISO(list.dstamp_start_date),'yyyy-MM-dd');
                const end = format(parseISO(list.dstamp_end_date),'yyyy-MM-dd');
                if(format(stampDate,'yyyy-MM-dd')>=start && format(stampDate,'yyyy-MM-dd')<=end){

                    return(
                        <div className="doubleCheck" key={list.dstamp_num}>
                            📍 더블 적립 회차
                        </div>
                    )
                }
            }else if(!list.dstamp_end_date && list.dstamp_time){
                const start = format(parseISO(list.dstamp_start_date),'yyyy-MM-dd');
                const time = list.dstamp_time.substring(0,5);
                // console.log(time);
                if(format(stampDate,'yyyy-MM-dd')===start && format(stampTime,'HH:mm')===time){
                    return(
                        <div className="doubleCheck" key={list.dstamp_num}>
                            📍 더블 적립 회차
                        </div>
                    )
                }
            }

        })

    )


}


export default DoubleCheck;