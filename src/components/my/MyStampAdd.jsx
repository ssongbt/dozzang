import axios from "axios";
import {useEffect, useState, forwardRef} from "react";
import {Link, useParams} from 'react-router-dom';
import Searching from '../common/Searching';
import { format, parseISO } from 'date-fns';
import DoubleCheck from "./DoubleCheck";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/esm/locale";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";
import searchPlayList from "../../data/searchPlayList.json";
import { loadAllStamps, saveStamp, getFilledCount, getCardAlias } from "../../utils/stampStorage";
import { getDefaultPlayTime } from "../../utils/defaultPlayTime";

const MyStampAdd = () =>{

    const params = useParams();
    const presetPlayNum = params.playNum ? Number(params.playNum) : null;
    const presetCoalesce = params.coalesce ? Number(params.coalesce) : null;
    const presetPlay = presetPlayNum ? searchPlayList.find((p) => p.play_num === presetPlayNum) : null;

    const [stamps, setStamps] = useState([]);
    const [playNum, setPlayNum] = useState(presetPlayNum || undefined);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [max, setMax] = useState();
    const [double, setDouble] = useState(1);
    const [stampMemo, setStampMemo]  = useState();
    const [hasStamp, setHasStamp] = useState();
    // const [userStamp, setUserStamp] = useState({
    //     // playNum:'',
    //     // playDate:'',
    //     // playTime:'',
    //     // stampCnt:'',
    //     stampMemo:''
    // })
console.log("dja마아"+presetCoalesce);
    const [stampCnt, setStampCnt] = useState();

    function getPlayNum(e) {
        // console.log("전달된 공연번호",e);
        setPlayNum(e);
    }

    useEffect(()=>{
        if(playNum){
            getStampList(playNum);
            StampList();
        }
        return () =>{
            // setPlayNum('');
            setStamps([]);
            setStampMemo('');
            setDouble();
            // console.log("스타드데이트",startDate);
        }
    },[playNum]);

    const Reset = () => {
        setPlayNum();
        setStamps([]);
        setPlayDate(new Date());
        setPlayTime(getDefaultPlayTime(new Date()));
        setStartDate();
        setEndDate();
        setStampMemo('');
        setHasStamp();
    }

    const getStampList = (playNum) =>{
        const play = searchPlayList.find((p) => p.play_num === Number(playNum));
        if(!play){
            return;
        }
        setStartDate(play.play_start ? format(parseISO(play.play_start),'yyyy-MM-dd') : '');
        setEndDate(play.play_end ? format(parseISO(play.play_end),'yyyy-MM-dd') : '');
        setMax(play.play_stamp);
        setStamps(loadAllStamps()[playNum] || []);
        const today = new Date();
        const playStart = play.play_start ? parseISO(play.play_start) : null;
        const initialDate = playStart && playStart > today ? playStart : today;
        setPlayDate(initialDate);
        setPlayTime(getDefaultPlayTime(initialDate));
        // axios({
        //     url:`/api/myhome/stamp/add/${playNum}`,
        //     method:'POST'
        // })
        // .then((res)=>{
        //     console.log(res.data);
        //     setStartDate(res.data.start ? format(parseISO(res.data.start),'yyyy-MM-dd') : '');
        //     setEndDate(res.data.end ? format(parseISO(res.data.end),'yyyy-MM-dd') : '');
        //     setMax(res.data.max);
        //     // setHasStamp(res.data.stamp);
        //     // console.log("startdate",startDate);
        //     // console.log("도장판있는지확인하는거", max);
        //     // console.log(format(parseISO(res.data.start),'yyyy-MM-dd'));
        //     if(res.data.stamp !== 0){
        //         setStamps(res.data.stamp);
        //         console.log("stamps",stamps);
        //     }
        // })
        // .catch((err)=>{
        //     console.log(err);
        // })

    }

    const getStampCnt = () =>{
        if(stamps && stamps.length !==0){
            for(let i=0;i<stamps.length;i++){
                let myMax = getFilledCount(stamps[i]);

                if(myMax < max){
                    setStampCnt(stamps[i].coalesce);

                    break;
                }else{
                    continue;
                }
            }
        }else{
            setStampCnt(1);
        }
    }

    useEffect(()=>{
        if(stamps){
            getStampCnt();
        }
    },[stamps]);

    useEffect(()=>{
        if(presetCoalesce && stamps.some((s) => Number(s.coalesce) === presetCoalesce)){
            setStampCnt(presetCoalesce);
        }
    },[stamps]);

    // console.log(stampCnt);
    const StampList = () => {
        // console.log(stamps);
        if(stamps.length === 0){
            return(
                <div className="stamp">
                    <select defaultValue="0" name="stampCnt">
                        <option value="0">첫발급</option>
                    </select>
                </div>
            )
        }else{ 

            const size = stamps.length;

            return(
                <div className="stamp">
                    <select defaultValue={stampCnt} name="stampCnt" onChange={(e) => setStampCnt(e.target.value)}>
                        {stamps && stamps.map(stamp=>{
                            const coalesceLabel = presetCoalesce ? presetCoalesce : stamp.coalesce;
                            const alias = getCardAlias(playNum, stamp.coalesce);
                            return(
                                <option key={stamp.coalesce} value={presetCoalesce ? presetCoalesce : stamp.coalesce} disabled={getFilledCount(stamp)>=max ? "disabled" : "" } >{coalesceLabel}{alias ? ` (${alias})` : ''}</option>
                            )
                        })}
                        
                        <option value={size+1}>새 도장판</option>
                    </select>
                </div>
            )
        }
    }

    // const getUserStamp = e =>{
    //     const {name, value} = e.target;
    //     const newStamp = {
    //         ...userStamp,
    //         [name] : value,
    //     };

    //     setUserStamp(newStamp);
    //     console.log(userStamp);
    // }

    const addStamp = async() =>{
        if(!playNum){
            window.alert("공연을 입력해주세요");
            return false;
        }
        if(!playDate){
            window.alert("공연날짜를 입력해주세요");
            return false;
        }
        if(!playTime){
            window.alert("공연 시간을 입력해주세요");
            return false;
        }
        if(stampMemo && stampMemo.length>200){
            window.alert("메모는 200자를 초과할 수 없습니다.");
            return false;
        }
        const double2 = double ? double : 1;
        const data = {
            playNum : playNum,
            playDate : format(playDate,'yyyy-MM-dd'),
            playTime : playTime.toTimeString().split(' ')[0],
            stampCnt : stampCnt,
            stampMemo : stampMemo,
            doubleStamp : double2
        }

        saveStamp(playNum, stampCnt, double2, data);
        window.alert("저장되었습니다");
        window.location.replace("#/myhome/stamp");
        // await axios({
        //     url:"/api/myhome/stamp/add",
        //     method:"POST",
        //     data: data
        // })
        // .then(()=>{
        //     alert("저장되었습니다");
        //     window.location.replace("/myhome/stamp");
        // })
        // .catch((err)=>{
        //     alert(err);
        //     console.log(err);
        // })


    }

    function chkDoubleStamp (chkDoubleStamp) {
        setDouble(chkDoubleStamp);
    }

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

    const [playDate, setPlayDate] = useState(new Date());
    const [playTime, setPlayTime] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth());
    
    const handleMonthChange = (date) => {
        setMonth(date.getMonth());
    };

    const Input = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
        {value}
    </button>
    ));



    return(

        <div id="myStampAdd">
            <div className="wrap">
                <div className="myStampAdd-gap">
                    <div className="myStampAdd-wrap">
                        <div className="myStampAdd-title">
                            도장 추가
                        </div>
                        <div className="inputbox play">
                            <label htmlFor="play">공연명</label>
                            <Searching getPlayNum={getPlayNum} Reset={Reset} initialValue={presetPlay ? presetPlay.play_name : ''}/>
                        </div>
                        <div className="inputbox date">
                            {/* <input type="date" name="playDate" id="playDate" onChange={getUserStamp}></input> */}
                            <div className = "date">
                            <label htmlFor="playDate">일자</label>
                            {max !== 0 ? 
                                <DatePicker
                                    className="datePicker"
                                    locale={ko}
                                    showIcon
                                    selected={playDate}
                                    minDate ={parseISO(startDate)}
                                    maxDate={parseISO(endDate)}
                                    onChange={(date) => { setPlayDate(date); setPlayTime(getDefaultPlayTime(date)); }}
                                    dateFormat="yyyy년 MM월 dd일"
                                    customInput={<Input />}
                                    onMonthChange={handleMonthChange}
                                    dayClassName={(d) =>
                                        d.getDate() === (playDate !== null? playDate.getDate():new Date().getDate()) && d.getMonth() === (playDate !== null ? playDate.getMonth():new Date().getMonth())
                                        ? 'custom-day selected-day'
                                        : d.getMonth() === month || d.getDate() >= parseISO(startDate).getDate() || d.getDate() <= parseISO(endDate).getDate() 
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
                                            className={`btn_month btn_month-prev${prevMonthButtonDisabled ? ' disabled' : ''}`}
                                            onClick={prevMonthButtonDisabled ? undefined : decreaseMonth}
                                            >
                                            &lt;
                                            {/* <img src="/static/images/arrow-black-left.png" /> */}
                                        </div>
                                        <div className="month-day">
                                            {getYear(date)}년 {months[date.getMonth()]}월
                                        </div>

                                        <div
                                            className={`btn_month btn_month-next${nextMonthButtonDisabled ? ' disabled' : ''}`}
                                            onClick={nextMonthButtonDisabled ? undefined : increaseMonth}
                                            >
                                            &gt;
                                            {/* <img src="/static/images/arrow-black-right.png" /> */}
                                        </div>
                                        </div>
                                    )}
                                />
                            :''}
                            
                            </div>
                            <div className="time">
                            <label htmlFor="playTime">시간</label>
                            {max !== 0 ? 
                                <DatePicker
                                    selected={playTime}
                                    onChange={(time) => setPlayTime(time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="aa h:mm"
                                    timeFormat="aa h:mm"
                                    customInput={<Input />}
                                />
                            :''}
                            {/* <input type="time" name="playTime" id="playTime" onChange={getUserStamp}></input> */}
                            </div>
                            {max === 0 ?
                            <div> 도장이 없는 공연입니다. </div>
                            :''}
                            {/* <DoubleCheck stampDate={playDate?playDate:new Date()} stampTime={playTime} playNum={playNum} chkDoubleStamp={chkDoubleStamp}
                            /> */}
                        </div>
                        <div className="inputbox stamp">
                            <div className="stampPlate">
                                <label htmlFor="stamp">도장판</label>
                                {max !== 0 ? StampList() : ''}
                            </div>
                            <div className="stampCount">
                                <label htmlFor="countCheck">적립체크</label>
                                <div className="stampCount-options">
                                    <label>
                                        <input
                                            type="checkbox"
                                            id="countCheck"
                                            name="stampCount"
                                            checked={double === 2}
                                            onChange={(e) => setDouble(e.target.checked ? 2 : 1)}
                                        />
                                        더블적립
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="stampCount"
                                            checked={double === 3}
                                            onChange={(e) => setDouble(e.target.checked ? 3 : 1)}
                                        />
                                        트리플적립
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="stampCount"
                                            checked={double === 4}
                                            onChange={(e) => setDouble(e.target.checked ? 4 : 1)}
                                        />
                                        쿼드적립
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="inputbox memo">
                            <label htmlFor="stampMemo">메모</label>
                            <br></br>
                            <input type="text" name="stampMemo" id="stampMemo" value={stampMemo ? stampMemo : ''} onChange={(e)=>setStampMemo(e.target.value)}></input>
                        </div>

                        <div className="btn">
                            <button className="save" type="submit" onClick={addStamp}>저장</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default MyStampAdd;