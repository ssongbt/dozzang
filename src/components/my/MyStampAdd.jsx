import axios from "axios";
import {useEffect, useState, forwardRef} from "react";
import {Link} from 'react-router-dom';
import Searching from '../common/Searching';
import { format, parseISO } from 'date-fns';
import DoubleCheck from "./DoubleCheck";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/esm/locale";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";

const MyStampAdd = () =>{

    const [stamps, setStamps] = useState([]);
    const [playNum, setPlayNum] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [max, setMax] = useState();
    const [firstDouble, setFirstDouble] = useState();
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

    const [stampCnt, setStampCnt] = useState();

    function getPlayNum(e) {
        // console.log("전달된 공연번호",e);
        setPlayNum(e);
    }

    useEffect(()=>{
        if(playNum){
            getStampList();
            StmapList();
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
        console.log("리셋");
        setPlayNum();
        setStamps([]);
        setPlayDate(null);
        setPlayTime(null);
        setStartDate();
        setEndDate();
        setStampMemo('');
        setHasStamp();
        console.log("메모",stampMemo);
    }

    const getStampList = () =>{
        axios({
            url:`/api/myhome/stamp/add/${playNum}`,
            method:'POST'
        })
        .then((res)=>{
            console.log(res.data);
            setStartDate(res.data.start ? format(parseISO(res.data.start),'yyyy-MM-dd') : '');
            setEndDate(res.data.end ? format(parseISO(res.data.end),'yyyy-MM-dd') : '');
            setMax(res.data.max);
            setFirstDouble(res.data.firstdouble);
            // setHasStamp(res.data.stamp);
            // console.log("startdate",startDate);
            // console.log("도장판있는지확인하는거", max);
            // console.log(format(parseISO(res.data.start),'yyyy-MM-dd'));
            if(res.data.stamp !== 0){
                setStamps(res.data.stamp);
                console.log("stamps",stamps);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const getStampCnt = () =>{
        if(stamps && stamps.length !==0){
            for(let i=0;i<stamps.length;i++){
                let myMax = Number(stamps[i].nomal) + Number((stamps[i].double*2));
                // console.log(myMax);
                if(myMax < max){
                    setStampCnt(stamps[i].coalesce);
                    // console.log("mymax",myMax);
                    // console.log("i",i);
                    // console.log("그래이겨",stamps[i].coalesce);
                    // console.log("stampcnt",stampCnt);
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


    // console.log(stampCnt);
    const StmapList = () => {
        // console.log(stamps);
        if(stamps.length === 0){
            // console.log("도장처음");
            return(
                <div className="stamp">
                    <select defaultValue="0" name="stampCnt">
                        <option value="0">첫발급</option>
                    </select>
                </div>
            )
        }else{
            // console.log("도장판존재");
            const size = stamps.length;

            // console.log(max);
            // console.log(size);
            // console.log(stamps[Number(size-1)].coalesce);
            return(
                <div className="stamp">
                    <select defaultValue={stampCnt} name="stampCnt" onChange={(e) => setStampCnt(e.target.value)}>
                        {stamps && stamps.map(stamp=>{
                            return(
                                <option key={stamp.coalesce} value={stamp.coalesce} disabled={(Number(stamp.nomal) + Number((stamp.double*2)))>=max ? "disabled" : "" } >{stamp.coalesce}</option>
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
        if(stampMemo.length>200){
            window.alert("메모는 200자를 초과할 수 없습니다.");
            return false;
        }
        // console.log("addstamp",double);
        //첫적립 이고 첫적립이 더블적립일 경우
        let double2 = double ? double : 1;
        if(stamps.length === 0 && firstDouble === 2){
            setStampCnt(stampCnt+1);
            double2 = double2 +1;
            // console.log("첫적립더블",double2);
            // break;
        }else if(stampCnt === 0 && firstDouble === null){
            setStampCnt(stampCnt+1);
        }
        // console.log("double",double);
        const data = {
            playNum : playNum,
            playDate : format(playDate,'yyyy-MM-dd'),
            playTime : playTime.toTimeString().split(' ')[0],
            stampCnt : stampCnt,
            stampMemo : stampMemo,
            doubleStamp : double2
        }

        await axios({
            url:"/api/myhome/stamp/add",
            method:"POST",
            data: data
        })
        .then(()=>{
            alert("저장되었습니다");
            window.location.replace("/myhome/stamp");
        })
        .catch((err)=>{
            alert(err);
            console.log(err);
        })


    }

    function chkDoubleStamp (chkDoubleStamp) {
        setDouble(chkDoubleStamp);
        // console.log("체크더블스탬프double",double);
    }

    const firstDoubleStmap = () =>{
        // console.log("첫발급더블cnt",stampCnt);
        // console.log("첫발급더블",firstDouble);
        if(stamps.length === 0 && firstDouble === 2){
            return(
                <div>
                    첫발급 더블적립
                </div>
            )
        }
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

    const [playDate, setPlayDate] = useState(null);
    const [playTime, setPlayTime] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth());
    
    console.log(playDate);
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
                            <Searching getPlayNum={getPlayNum} Reset={Reset}/>
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
                                    onChange={(date) => setPlayDate(date)}
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
                                    dateFormat="h:mm aa"
                                    customInput={<Input />}
                                />
                            :''}
                            {/* <input type="time" name="playTime" id="playTime" onChange={getUserStamp}></input> */}
                            </div>
                            {max === 0 ?
                            <div> 도장이 없는 공연입니다. </div>
                            :''}
                            {firstDoubleStmap()}
                            <DoubleCheck stampDate={playDate?playDate:new Date()} stampTime={playTime} playNum={playNum} chkDoubleStamp={chkDoubleStamp}
                            />
                        </div>
                        <div className="inputbox stamp">
                            <label htmlFor="stamp">도장판</label>
                            {max !== 0 ? StmapList() : ''}
                        </div>
                        <div className="inputbox memo">
                            <label htmlFor="stampMemo">메모</label>
                            <br></br>
                            <input type="text" name="stampMemo" id="stampMemo" value={stampMemo ? stampMemo : ''} onChange={(e)=>setStampMemo(e.target.value)}></input>
                        </div>

                        <div className="btn">
                            <button className="save" type="submit" onClick={addStamp}>저장</button>
                            <button className="list"> <Link to="/myhome/stamp">목록</Link></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default MyStampAdd;