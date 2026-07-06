import {useEffect, useState, forwardRef} from "react";
import { Link, useParams } from 'react-router-dom';
import DoubleInputContainer from "./DoubleInputContainer";
import axios from "axios";
import { format, parseISO } from 'date-fns';
import { PencilSquare, TrashFill } from "react-bootstrap-icons";
import CancleDouble from "./CancleDouble";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/esm/locale";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";
import AdminMenu from "../admin/AdminMenu";

const DoubleStamp = () => {

    let params = useParams();
    
    const [doubleList, setDoubleList] = useState([]);
    const [playName, setPlayName] = useState();
    const [playStart, setPlayStart] =  useState();
    const [playEnd, setPlayEnd] = useState();

    const getDoubleStamp = () =>{
        axios({
            url:`/api/admin/playlist/play/double/${params.num}`,
            method:'GET',
        })
        .then((res)=>{
            // console.log(res.data.rows);
            setDoubleList(res.data.rows);
            setPlayName(res.data.rows[0].play_name);
            setPlayStart(res.data.rows[0].play_start ? format(parseISO(res.data.rows[0].play_start),'yyyy-MM-dd') :'');
            setPlayEnd(res.data.rows[0].play_end ? format(parseISO(res.data.rows[0].play_end ),'yyyy-MM-dd') : '' );
        })
    }

    useEffect(()=>{
        getDoubleStamp();
    },[playName])

    const [stampType, setStampType] = useState();

    const [turnStamp, setTurnStamp] = useState([]);

    const getTurnStamp = (inputItems) => {
        console.log("geturnstamp",inputItems);

        setTurnStamp({
            inputItems : inputItems.map((item) =>
               item
            )
        })

    }

    useEffect(()=>{
        // console.log("turnstamp",turnStamp);
    },[getTurnStamp.inputItems])


    const addDouble = () => {
        // console.log(turnStamp);

        if(stampType === "peroidStamp" && (!doubleStart || !doubleEnd)){
            alert("날짜를 모두 입력해주세요.")
            return false;
        }
        if(stampType === "peroidStamp" && doubleStart >= doubleEnd){
            alert("날짜를 다시 확인해주세요.")
            return false;
        }

        if(stampType === "turnStamp" && !turnStamp.inputItems){
            alert("내용을 입력해주세요")
            return false;
        }

        if(stampType === "turnStamp" && turnStamp.inputItems){
            for(let i = 0 ;i<turnStamp.inputItems.length; i++){
                if(!turnStamp.inputItems[i].date || !turnStamp.inputItems[i].time){
                    alert("날짜와 시간 모두 입력해주세요")
                    return false;
                }
            } 
        }

        const data = {
            playNum : params.num,
            doubleStart : doubleStart,
            doubleEnd : doubleEnd,
            turnStamp : JSON.stringify(turnStamp),
            type : stampType
        }

        axios ({
            url: '/api/admin/playlist/play/double/add',
            method: 'POST',
            data : data
        })
        .then((res)=>{
            alert(res.data.msg);
            if(res.data.code === 'S'){
                window.location.reload();
            }else{
                return false;
            }
        })
        .catch((err)=>{
            alert(err);
        })
    }

    // datepicker
    const [doubleStart, setDoubleStart] = useState(null);
    const [doubleEnd, setDoubleEnd] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth());
    
    const months = [
        // 월 표시
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];

    const handleMonthChange = (date) => {
        setMonth(date.getMonth());
    };
    // console.log("먼스",month);
    // console.log(doubleStart !==null?doubleStart.getDate():new Date().getDate());

    const Input = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
        {value}
    </button>
    ));

    // 더블적립 추가
    const inputDouble = () =>{
        if(stampType === "peroidStamp"){
            return(
                <div className="periodStamp">
                    <div className="inputbox start">
                        <label htmlFor="doubleStart">더블적립 시작일</label>
                        <br></br>
                        {/* <input type="date" name="doubleStart" id="doubleStart" onChange={setStamp}></input> */}
                        <DatePicker
                                    className="datePicker"
                                    locale={ko}
                                    showIcon
                                    selected={doubleStart}
                                    minDate ={parseISO(playStart)}
                                    maxDate={parseISO(playEnd)}
                                    onChange={(date) => {setDoubleStart(date); setMonth(date.getMonth());}}
                                    dateFormat="yyyy년 MM월 dd일"
                                    customInput={<Input />}
                                    onMonthChange={handleMonthChange}
                                    dayClassName={(d) =>
                                        d.getDate() === (doubleStart !== null? doubleStart.getDate():new Date().getDate()) && d.getMonth() === (doubleStart !== null ?  doubleStart.getMonth() : new Date().getDate())
                                        ? 'custom-day selected-day'
                                        : d.getMonth() === month
                                        ? 'custom-day'
                                        : 'custom-day gray-day'
                                    }
                                    renderCustomHeader={({
                                        date,
                                        prevMonthButtonDisabled,
                                        nextMonthButtonDisabled,
                                        decreaseMonth,
                                        increaseMonth,
                                    }) => (
                                        <div
                                        style={{
                                            margin: 10,
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                        >
                                        <div
                                            className="btn_month btn_month-prev"
                                            onClick={decreaseMonth}
                                            disabled={prevMonthButtonDisabled}
                                        >
                                            &lt;
                                            {/* <img src="/static/images/arrow-black-left.png" /> */}
                                        </div>
                                        <div className="month-day">
                                            {getYear(date)}년 {months[date.getMonth()]}월
                                        </div>
                                    
                                        <div
                                            className="btn_month btn_month-next"
                                            onClick={increaseMonth}
                                            disabled={nextMonthButtonDisabled}
                                        >
                                            &gt;
                                            {/* <img src="/static/images/arrow-black-right.png" /> */}
                                        </div>
                                        </div>
                                    )}
                                />
                    </div>
                    <div className="inputbox end">
                        <label htmlFor="doubleEnd">더블적립 종료일</label>
                        <br></br>
                        {/* <input type="date" name="doubleEnd" id="doubleEnd" onChange={setStamp}></input> */}
                        <DatePicker
                                    className="datePicker"
                                    locale={ko}
                                    showIcon
                                    selected={doubleEnd}
                                    minDate ={doubleStart}
                                    maxDate={parseISO(playEnd)}
                                    onChange={(date) => setDoubleEnd(date)}
                                    dateFormat="yyyy년 MM월 dd일"
                                    customInput={<Input />}
                                    onMonthChange={handleMonthChange}
                                    dayClassName={(d) =>
                                        d.getDate() === (doubleEnd !== null? doubleEnd.getDate():new Date().getDate()) && d.getMonth() === (doubleEnd !== null ?  doubleEnd.getMonth() : new Date().getDate())
                                        ? 'custom-day selected-day'
                                        : d.getMonth() === month
                                        ? 'custom-day'
                                        : 'custom-day gray-day'
                                    }
                                    renderCustomHeader={({
                                        date,
                                        prevMonthButtonDisabled,
                                        nextMonthButtonDisabled,
                                        decreaseMonth,
                                        increaseMonth,
                                    }) => (
                                        <div
                                        style={{
                                            margin: 10,
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                        >
                                        <div
                                            className="btn_month btn_month-prev"
                                            onClick={decreaseMonth}
                                            disabled={prevMonthButtonDisabled}
                                        >
                                            &lt;
                                            {/* <img src="/static/images/arrow-black-left.png" /> */}
                                        </div>
                                        <div className="month-day">
                                            {getYear(date)}년 {months[date.getMonth()]}월
                                        </div>
                                    
                                        <div
                                            className="btn_month btn_month-next"
                                            onClick={increaseMonth}
                                            disabled={nextMonthButtonDisabled}
                                        >
                                            &gt;
                                            {/* <img src="/static/images/arrow-black-right.png" /> */}
                                        </div>
                                        </div>
                                    )}
                                />
                    </div>
                </div>
            )
        }else if(stampType === "turnStamp"){
            return(
                <div className="turnStamp">
                    <DoubleInputContainer 
                         parentFunction={getTurnStamp}
                         playStart={playStart}
                         playEnd={playEnd}
                    />
                </div>
            )
        }
    }


    // 더블적립목록 
    // const list = doubleList && doubleList.map(list=>{
    //     const start = format(parseISO(list.dstamp_start_date),'yyyy-MM-dd');
    //     const end = format(parseISO(list.dstamp_end_date?list.dstamp_end_date:'1000-01-01'),'yyyy-MM-dd');
    //     // const time = format(parseISO(list.dstamp_time?list.dsatmp_time:'00:00'),'HH:mm')
    //     return(
    //         <CancleDouble
    //             key={list.dstamp_num}
    //             playNum={params.num}
    //             dstampNum={list.dstamp_num}
    //             start={start}
    //             end={end}
    //             // time={time?time:''}
    //         />
    //     )
    // })

    // console.log(stampType);
    const btn = () =>{
        if(stampType !== undefined){
            return(
                <div className="save-btn">
                    <button className="save" type="submit" onClick={addDouble}>저장</button>
                </div>
            )
        }
    }



    return(
        <div id="doubleAdd">
            <div className="wrap">
                <div className="menu">
                    <AdminMenu 
                        menu={'playlist'}
                    />
                </div>
                <div className="doubleAdd-gap">
                    <div className="doubleAdd-wrap">
                        <div className="play-title">
                            {playName} 더블적립회차
                        </div>
                        <div className="doubleList">
                        {doubleList && doubleList.map(list=>{
                            return(
                                <CancleDouble
                                key={list.dstamp_num?list.dstamp_num:list.play_num}
                                playNum={params.num}
                                dstampNum={list.dstamp_num}
                                start={list.dstamp_start_date?format(parseISO(list.dstamp_start_date),'yyyy-MM-dd'):''}
                                end={list.dstamp_end_date?format(parseISO(list.dstamp_end_date),'yyyy-MM-dd'):''}
                                time={list.dstamp_time}
                                
                                />
                            )
                        })}
                        </div>
                        <div className="doublestamp-gap">
                            <div className="doublestamp-wrap">
                                <div className="doublestamp"> 
                                    <div className="stampType">
                                        <label htmlFor="stampType">
                                            <input type="radio" name="stampType" id="stampType" value="peroidStamp" onChange={(e)=>setStampType(e.target.value)}></input>
                                            <span>기간별</span>
                                        </label>
                                        &nbsp;&nbsp;
                                        <label htmlFor="stampType">
                                            <input type="radio" name="stampType" id="stampType" value="turnStamp" onChange={(e)=>setStampType(e.target.value)}></input>
                                            <span>회차별</span>
                                        </label>
                                    </div>
                                    {inputDouble()}
                                    {btn()}
                                </div>
                            </div>
                        </div>
                        <div className="btn">
                                <button className="list"><Link to="/admin/playlist">목록</Link></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default DoubleStamp;