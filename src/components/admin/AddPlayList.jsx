
import axios from "axios";
import {useState, forwardRef } from "react";
import InputContainer from "./InputContainer";
import {Link} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/esm/locale";
import { format, parseISO } from 'date-fns';
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";
import AdminMenu from "../admin/AdminMenu";


const AddPlayList = () => {
    
    const [play, setPlay] = useState({
        playName:'' ,
        playStart:'',
        playEnd:'',
        playCast:'',
        playStamp:0,
        playGenre:'',
        playUrl:'',
        playFirstStamp:'',
        playFirstDoble:''
    });

    const [file, setFile] = useState(null);

    const isEmptyArr = (arr) =>{
        if(Array.isArray(arr) && arr.length ===0) {
            return true;
        }
        return false;
    }

    const addList = async() => {

        if(!play.playGenre){
            window.alert("장르를 선택해주세요.");
            return false;
        }
        if(!play.playName){
            window.alert("공연명을 입력해주세요.");
            return false;
        }
        if(play.playName.length>50){
            window.alert("공연명은 50자를 초과할 수 없습니다.");
            return false;
        }


        const data = {
            playName:play.playName,
            playStart:format(startDate,'yyyy-MM-dd'),
            playEnd:format(endDate,'yyyy-MM-dd'),
            playCast:play.playCast,
            playStamp:play.playStamp,
            playUrl:play.playUrl,
            playGenre:play.playGenre,
            playFirstStamp:play.playFirstStamp,
            playFirstDouble:play.playFirstDouble,
            stamp:JSON.stringify(stamp)
        }
        
        await axios({
            method:"POST",
            url:"http://localhost:3030/api/admin/playlist/add",
            data: data
        })
        .then((res)=>{
            alert(res.data.msg);
            if(res.data.code === 'F'){
                return false;
            }else{
                window.location.replace("/admin/playlist");
            }
        })
        .catch((err)=>{
            alert(err);
            console.log(err);
        })
    };

    const getImg = (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    };

    const getPlay = e => {
        const {name, value} = e.target;
        const newPlay = {
            ...play,
            [name]:value,
        };

        setPlay(newPlay);
        // console.log(play);
    };

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
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
    // console.log(startDate !==null?startDate.getDate():new Date().getDate());

    const Input = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
        {value}
    </button>
    ));

    const [stamp, setStamp] = useState([]);

    const getStamp = (inputItems) => {

        setStamp({
            inputItems : inputItems.map((item) =>
               item
            )
        })

        // setStamp(newStamp);
        // console.log(stamp);
        // console.log("스탬프부분" );
    }

    const AddStamp = () => {
        // console.log(play.playStamp);
        if(play.playStamp === '1'){
            return (
                <InputContainer
                    parentFunction={getStamp}
                />
            );
        }
    };

    const firstStamp = () => {
        if(play.playStamp === '1') {
            return(
                <div className="inputbox firstStamp">
                    <label htmlFor="playFirstStamp">첫 발급</label>
                    <select name="playFirstStamp" onChange={getPlay}>
                        <option value="0">발급X</option>
                        <option value="1">1회차</option>
                        <option value="2">2회차</option>
                    </select>
                </div>
            )
        }
    }

    const firstDouble = () => {
        if(play.playStamp === '1') {
            return(
                <div className="inputbox firstDouble">
                    <input type="checkbox" name="playFirstDouble" value="2" onChange={getPlay}>
                    </input>
                    <label htmlFor="playFirstDouble">첫 발급 더블적립
                    </label>
                </div>
            )
        }
    }

    return (
        <div id="addplaylist">
            <div className="wrap">
                <div className="menu">
                    <AdminMenu 
                        menu={'playlist'}
                    />
                </div>
                <div className="addplaylist-gap">
                    <div className="addplaylist-wrap">
                        {/* <form id="playlist_addform" encType="multipart/form-data"> */}
                            <div className="inputbox genre">
                                <label htmlFor="playGenre">장르</label>
                                <br></br>
                                {/* <input type="text" name="playGenre" onChange={getPlay}></input> */}
                                <select name="playGenre" onChange={getPlay}>
                                    <option value="">장르선택</option>
                                    <option value="뮤지컬">뮤지컬</option>
                                    <option value="연극">연극</option>
                                    <option value="음악극">음악극</option>
                                </select>
                            </div>
                            <div className="inputbox name">
                                <label htmlFor="playName">공연명</label>
                                <br></br>
                                <input type="text" name="playName" id="playName" onChange={getPlay} placeholder="50자 이내"></input>
                            </div>
                            <div className="inputbox start">
                                <label htmlFor="playStart">공연 시작일</label>
                                <br></br>
                                <DatePicker
                                    className="datePicker"
                                    locale={ko}
                                    showIcon
                                    selected={startDate}
                                    // minDate ={new Date('2023-01-01')}
                                    // maxDate={new Date()}
                                    onChange={(date) => {setStartDate(date); setMonth(date.getMonth());}}
                                    dateFormat="yyyy년 MM월 dd일"
                                    customInput={<Input />}
                                    onMonthChange={handleMonthChange}
                                    dayClassName={(d) =>
                                        d.getDate() === (startDate !== null? startDate.getDate():new Date().getDate()) && d.getMonth() === (startDate !== null ?  startDate.getMonth() : new Date().getDate())
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
                                {/* <input type="date" name="playStart" id="playStart" onChange={getPlay}></input> */}
                            </div>
                            <div className="inputbox end">
                                <label htmlFor="playEnd">공연 종료일</label>
                                <br></br>
                                <DatePicker
                                    className="datePicker"
                                    locale={ko}
                                    showIcon
                                    selected={endDate}
                                    minDate ={startDate}
                                    // maxDate={new Date()}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="yyyy년 MM월 dd일"
                                    customInput={<Input />}
                                    onMonthChange={handleMonthChange}
                                    dayClassName={(d) =>
                                        d.getDate() === (endDate !== null? endDate.getDate():new Date().getDate()) && d.getMonth() === (endDate !== null ?  endDate.getMonth() : new Date().getDate())
                                        ? 'custom-day selected-day'
                                        : d.getMonth() === month || d >= startDate
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
                                {/* <input type="date" name="playEnd" id="playEnd" onChange={getPlay}></input> */}
                            </div>
                            <div className="inputbox cast">
                                <label htmlFor="playCast">출연진</label>
                                <br></br>
                                <input type="text" name="playCast" id="playCast" onChange={getPlay} placeholder="출연진은 '띄어쓰기'로 구분해주세요."></input>
                            </div>
                            <div className="inputbox playurl">
                                <label htmlFor="playUrl">예매처 링크</label>
                                <br></br>
                                <input type="text" name="playUrl" id="playUrl" onChange={getPlay} ></input>
                            </div>
                            {/* <div className="inputbox playimg">
                                <label htmlFor="playImg">포스터이미지</label>
                                <br></br>
                                <input type="file" accept="image/*" name="playImg" onChange={getImg}></input>
                            </div> */}
                            <div className="inputbox stamp">
                                <label>도장판 유무</label>
                                <br></br>
                                <label htmlFor="playStamp">
                                    <input type="radio" name="playStamp" id="playStamp" onChange={getPlay} value ="0" defaultChecked={play.playStamp === 0 } ></input>
                                    <span>무</span>
                                </label>
                                <label htmlFor="playStamp">
                                    <input type="radio" name="playStamp" id="playStamp" onChange={getPlay} value ="1" ></input>
                                    <span>유</span>
                                </label>
                            </div>
                            {firstStamp()}
                            {firstDouble()}
                            {AddStamp()}
 
                            <div className="btn">
                                <button className="save" type="submit" onClick={addList}>저장</button>
                                <button className="list"> <Link to="/admin/playlist">목록</Link></button>
                            </div>
                            
                        {/* </form> */}
                    </div>
                </div>
            </div>
        </div>
  );
}

export default AddPlayList;