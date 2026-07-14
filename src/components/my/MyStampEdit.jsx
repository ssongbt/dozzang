import axios from "axios";
import {useEffect, useState, forwardRef} from "react";
import {Link, useParams} from 'react-router-dom';
import Searching from '../common/Searching';
import { format, parseISO, add } from 'date-fns';
import DoubleCheck from "./DoubleCheck";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/esm/locale";
import getYear from "date-fns/getYear";
import styled from 'styled-components';

const MyStampEdit = () => {

    const [stamps, setStamps] = useState([]);
    const [playNum, setPlayNum] = useState();
    const [playTitle, setPlayTitle] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [memo, setMemo] = useState();
    const [max, setMax] = useState();
    const [firstDouble, setFirstDouble] = useState();
    const [double, setDouble] = useState();
    const [userStamp, setUserStamp] = useState({
        // playNum:'',
        // playDate:'',
        // playTime:'',
        // stampCnt:'',
        stampMemo:''
    })

    const [playDate, setPlayDate] = useState(null);
    const [playTime, setPlayTime] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth());


    let params = useParams();
    console.log(params);

    const [stampCnt, setStampCnt] = useState();

    const date = "1000-01-01T15:00:00.000Z";

    function getPlayNum(e) {
        console.log("전달된 공연번호",e);
        setPlayNum(e);
    }

    useEffect(()=>{
    
            getStamp();
            StmapList();

        return () =>{
            // setPlayNum('');
            setStamps([]);
            setUserStamp({
                playDate:'',
                playTime:'',
                stampMemo:''
            });
            setDouble();
            // console.log("스타드데이트",startDate);
        }
    },[playNum]);

    const Reset = () => {
        // console.log("리셋");
        setStamps([]);
        setPlayDate(null);
        setPlayTime(null);
        setStartDate();
        setEndDate();
    }

    const getStamp = () =>{
        const num = params.num;
        axios({
            url:`/api/myhome/stamp/edit/${num}`,
            method:'GET'
        })
        .then((res)=>{
            setPlayTitle(res.data.mystamp.play_name);
            setPlayDate(parseISO(res.data.mystamp.ustamp_play_date));
            // setPlayTime(res.data.stamp.ustamp_play_time.substring(0,5));
            // console.log(res.data.stamp.ustamp_play_time.substring(0,2));
            // console.log(format(add(parseISO(res.data.stamp.ustamp_play_date), {hours: res.data.stamp.ustamp_play_time.substring(0,2)}),"HH:mm"));
            setPlayTime(add(parseISO(res.data.mystamp.ustamp_play_date), {hours: res.data.mystamp.ustamp_play_time.substring(0,2)}));
            console.log(res.data);
            setPlayNum(res.data.mystamp.ustamp_play_num);
            setStartDate(res.data.start ? format(parseISO( res.data.start),'yyyy-MM-dd') : '');
            setEndDate(res.data.end ? format(parseISO(res.data.end),'yyyy-MM-dd'):'');
            setMemo(res.data.mystamp.ustamp_memo);
            setMax(res.data.max);
            setDouble(res.data.mystamp.ustamp_double);
            setFirstDouble(res.data.firstdouble);
            console.log("double",res.data.mystamp.ustamp_double);
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
                console.log(myMax);
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


    console.log(stampCnt);
    const StmapList = () => {
        console.log(stamps);
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
                                <option key={stamp.coalesce} value={stamp.coalesce} disabled={(Number(stamp.nomal) + Number((stamp.double*2)))>=max ? "disabled" : "" } onChange={getUserStamp}>{stamp.coalesce}</option>
                            )
                        })}
                        
                        <option value={size+1}>새 도장판</option>
                    </select>
                </div>
            )
        }
    }

    const getUserStamp = e =>{
        const {name, value} = e.target;
        const newStamp = {
            ...userStamp,
            [name] : value,
        };

        setUserStamp(newStamp);
        console.log(userStamp);
    }


    const addStamp = async() =>{
        // if(!playNum){
        //     window.alert("공연을 입력해주세요");
        //     return false;
        // }
        // if(!userStamp.playDate){
        //     window.alert("공연날짜를 입력해주세요");
        //     return false;
        // }
        // if(!userStamp.playTime){
        //     window.alert("공연 시간을 입력해주세요");
        //     return false;
        // }
        // if(userStamp.stampMemo.length>200){
        //     window.alert("메모는 200자를 초과할수 없습니다.");
        //     return false;
        // }

        //첫적립 이고 첫적립이 더블적립일 경우
        if(stampCnt === 0 && firstDouble === 2){
            setStampCnt(stampCnt+1);
            setDouble(double+1);
        }else if(stampCnt === 0 && firstDouble === null){
            setStampCnt(stampCnt+1);
        }else{
            console.log("엘스부분?");
            console.log(double);
            setDouble(double);
        }

        const data = {
            stampNum : params.num,
            playNum : playNum,
            playDate : format(playDate,'yyyy-MM-dd'),
            playTime : playTime.toTimeString().split(' ')[0],
            stampCnt : stampCnt,
            stampMemo : userStamp.stampMemo,
            doubleStamp : double
        }

        await axios({
            url:"/api/myhome/stamp/edit",
            method:"POST",
            data: data
        })
        .then(()=>{
            alert("저장되었습니다");
            // window.location.replace("/myhome/stamp");
        })
        .catch((err)=>{
            alert(err);
            console.log(err);
        })


    }

    function doubleStamp (double) {
        setDouble(double);
        console.log("double",double);
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
                            도장 수정
                        </div>
                        <div className="inputbox play">
                            <label htmlFor="play">공연명</label>
                            {/* <Searching getPlayNum={getPlayNum} Reset={Reset} editPlayNum={playNum}/> */}
                            <InputBox>
                                <Input type="text" name="search" value ={playTitle||""} readonly/>
                            {/* <button>검색</button> */}
                            </InputBox>
                        </div>
                        <div className="inputbox date">
                            {/* <input type="date" name="playDate" id="playDate" onChange={getUserStamp}></input> */}
                            <div className = "date">
                            <label htmlFor="playDate">일자</label>
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
                            </div>
                            <div className="time">
                            <label htmlFor="playTime">시간</label>
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
                            {/* <input type="time" name="playTime" id="playTime" onChange={getUserStamp}></input> */}
                            </div>
                            <DoubleCheck stampDate={playDate?playDate:new Date()} stampTime={playTime} playNum={playNum} chkDoubleStamp={doubleStamp}
                            />
                        </div>
                        <div className="inputbox stamp">
                            <label htmlFor="stamp">도장판</label>
                            {StmapList()}
                        </div>
                        <div className="inputbox memo">
                            <label htmlFor="stampMemo">메모</label>
                            <br></br>
                            <input type="text" name="stampMemo" id="stampMemo" onChange={getUserStamp} defaultValue={memo||''}></input>
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

const InputBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  width : 100%;
  height : 32px;
  border-radius: 10px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  z-index: 3;

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }
`


export default MyStampEdit;