import axios from "axios";
import {useEffect, useState, forwardRef} from "react";
import { Link, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import InputContainer from "./InputContainer";
import EditStampList from "./EditStampList";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/esm/locale";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";
import AdminMenu from "../admin/AdminMenu";

const PlayDetail = () => {

    const [playNum, setPlayNum] = useState();
    const [playName, setPlayName] = useState();
    const [playStart, setPlayStart] = useState();
    const [playEnd, setPlayEnd] = useState();
    const [playCast, setPlayCast] = useState();
    const [playStamp, setPlayStamp] = useState();
    // const [playImg, setPlayImg] = useState();
    const [playUrl, setPlayUrl] = useState();
    const [playGenre, setPlayGenre] = useState();
    const [playFirstStamp, setPlayFirstStamp] = useState();
    const [playFirstDouble, setPlayFirstDouble] = useState();

    const [stampList, setStampList] = useState([
        {
            stamp:[], index:1
        }
    ]);

    // const startDate = format(new Date(playStart.substr(0,10)), 'yyyy-MM-dd');
    // console.log((playStart+"").substr(0,10));

    const [file, setFile] = useState(null);

    let params = useParams();

    const getPlay = () =>{
        axios({
            url:`/api/admin/playlist/play/${params.num}`,
            method:'GET'
        })
        .then((res)=>{
            setPlayNum(res.data.play.play_num);
            setPlayName(res.data.play.play_name);
            setPlayGenre(res.data.play.play_genre);
            setPlayStart(res.data.play.play_start? parseISO(res.data.play.play_start) : null);
            setPlayEnd(res.data.play.play_end? parseISO(res.data.play.play_end) : null);
            setPlayCast(res.data.play.play_cast);
            setPlayStamp(res.data.play.play_stamp);
            setPlayUrl(res.data.play.play_url);
            setFile(res.data.play.play_img);
            setPlayFirstStamp(res.data.play.play_firststamp);
            setPlayFirstDouble(res.data.play.play_firstdouble);
            setStampList({stamp:res.data.stamp});
            // console.log(res.data.stamp);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        getPlay();
    },[]);

    // console.log(stampList.stamp);
    // console.log(playStamp);
    // const editImg = (e) => {
    //     console.log(e.target.files[0]);
    //     setFile(e.target.files[0]);
    // };
    const [stamp, setStamp] = useState([]);

    const getStamp = (inputItems) => {
 
        setStamp({
            inputItems : inputItems
        })

        // setStamp(newStamp);
    }

    // useEffect(()=>{
    //     if(stamp){
    //         // getStamp()
    //         console.log("스탬프있음??");
    //     }
    // },[stamp]);

    const editList = async() => {
        // console.log("클릭");
        // console.log(JSON.stringify(stamp.inputItems[0].benefit));
        // return false;
        if(!playGenre){
            window.alert("장르를 선택해주세요.");
            return false;
        }
        if(!playName){
            window.alert("공연명을 입력해주세요.");
            return false;
        }
        if(playName.length>50){
            window.alert("공연명은 50자를 초과할 수 없습니다.");
            return false;
        }
    

        const formData = new FormData();
        formData.append('playName', playName);
        formData.append('playStart', playStart);
        formData.append('playEnd', playEnd);
        formData.append('playCast', playCast);
        formData.append('playStamp', playStamp);
        // formData.append('playImg', file);
        formData.append('playGenre', playGenre);
        formData.append('playNum', playNum);
        formData.append('playUrl', playUrl);
        formData.append('playFisrtStamp', playFirstStamp);
        formData.append('playFirstDouble', playFirstDouble);
        formData.append('stamp[]', JSON.stringify(stamp));

        const data = {
            playName:playName,
            playStart:format(playStart,'yyyy-MM-dd'),
            playEnd:format(playEnd,'yyyy-MM-dd'),
            playCast:playCast,
            playStamp:playStamp,
            playGenre:playGenre,
            playNum:playNum,
            playUrl:playUrl,
            playFirstStamp:playFirstStamp,
            playFirstDouble:playFirstDouble,
            stamp:JSON.stringify(stamp)
        }

        // console.log(JSON.stringify(formData));
        await axios({
            method:'POST',
            url:'/api/admin/playlist/play/edit',
            data: data
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
            alert("err",err);
            console.log(err);
        })

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

    const [startMonth, setStartMonth] = useState();
    const [endMonth, setEndMonth] = useState();

    const handleMonthChangeStart = (date) => {
        setStartMonth(date.getMonth());
    };
    
    const handleMonthChangeEnd = (date) => {
        setEndMonth(date.getMonth());
    };

    const Input = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
        {value}
    </button>
    ));
    useEffect(()=>{
        setStartMonth(new Date(playStart).getMonth());
        setEndMonth(new Date(playEnd).getMonth());
    },[playStart,playEnd]);


    const AddStamp = () => {
        // console.log(play.playStamp);

        if(playStamp === 1){

            return (
                <InputContainer
                    parentFunction={getStamp}
                />
            );        
        }
    };

    const delPlay = () =>{
        if(window.confirm("정말 삭제하시겠습니까?")){

            axios({
                url:`/api/admin/playlist/play/del/${playNum}`,
                method:'POST'
            })
            .then((res)=>{
                alert(res.data.msg);
                if(res.data.code === 'S'){
                    window.location.href = `/admin/playlist`;
                }else{
                    return false;
                }
            })
            .catch((err)=>{
                console.log(err);
            })

        }else{
            return false;
        }
    }



    return(
        <div id="playdetail">
            <div  className="wrap">
                <div className="menu">
                    <AdminMenu 
                        menu={'playlist'}
                    />
                </div>
                <div className="playdetail-gap">
                    <div className="playdetail-wrap">
                        <div className="inputbox genre">
                                <label htmlFor="playGenre">장르</label>
                                <br></br>
                                {/* <input type="text" name="playGenre" onChange={getPlay}></input> */}
                                <select name="playGenre" onChange={(e) => setPlayGenre(e.target.value)} value={playGenre}>
                                    <option value="">장르선택</option>
                                    <option value="뮤지컬">뮤지컬</option>
                                    <option value="연극">연극</option>
                                    <option value="음악극">음악극</option>
                                </select>
                            </div>
                            <div className="inputbox name">
                                <label htmlFor="playName">공연명</label>
                                <br></br>
                                <input type="text" name="playName" id="playName" onChange={(e) => setPlayName(e.target.value)} defaultValue={playName || ''}></input>
                            </div>
                            <div className="inputbox start">
                                <label htmlFor="playStart">공연 시작일</label>
                                <br></br>
                                <DatePicker
                                    className="datePicker"
                                    locale={ko}
                                    showIcon
                                    selected={playStart}
                                    // minDate ={new Date('2023-01-01')}
                                    // maxDate={new Date()}
                                    onChange={(date) => setPlayStart(date)}
                                    dateFormat="yyyy년 MM월 dd일"
                                    customInput={<Input />}
                                    onMonthChange={handleMonthChangeStart}
                                    dayClassName={(d) =>
                                        d.getDate() === playStart.getDate() && d.getMonth() === playStart.getMonth()
                                        ? 'custom-day selected-day'
                                        : d.getMonth() === startMonth
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
                                {/* <input type="date" name="playStart" id="playStart" onChange={(e) => setPlayStart(e.target.value)} defaultValue={playStart !== '1000-01-01' ? playStart|| '' : ''}></input> */}
                            </div>
                            <div className="inputbox end">
                                <label htmlFor="playEnd">공연 종료일</label>
                                <br></br>
                                <DatePicker
                                    className="datePicker"
                                    locale={ko}
                                    showIcon
                                    selected={playEnd}
                                    minDate ={playStart}
                                    // maxDate={new Date()}
                                    onChange={(date) => setPlayEnd(date)}
                                    dateFormat="yyyy년 MM월 dd일"
                                    customInput={<Input />}
                                    onMonthChange={handleMonthChangeEnd}
                                    dayClassName={(d) =>
                                        d.getDate() === (playEnd !== null? playEnd.getDate():new Date().getDate()) && d.getMonth() === (playEnd !== null ?  playEnd.getMonth() : new Date().getDate())
                                        ? 'custom-day selected-day'
                                        : d.getMonth() === endMonth || d >= playStart
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
                                            {getYear(date)}년  {months[date.getMonth()]}월
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
                                {/* <input type="date" name="playEnd" id="playEnd" onChange={(e) => setPlayEnd(e.target.value)} defaultValue={playEnd !== '1000-01-01' ? playEnd|| '' : ''}></input> */}
                            </div>
                            <div className="inputbox cast">
                                <label htmlFor="playCast">출연진</label>
                                <br></br>
                                <input type="text" name="playCast" id="playCast" onChange={(e) => setPlayCast(e.target.value)} defaultValue={playCast||''}></input>
                            </div>
                            {/* <div className="inputbox playimg">
                                <label htmlFor="playImg">포스터이미지</label>
                                <br></br>
                                <input type="file" accept="image/*" name="playImg" onChange={editImg} ></input>
                            </div> */}
                            <div className="inputbox playurl">
                                <label htmlFor="playUrl">예매처 링크</label>
                                <br></br>
                                <input type="text" name="playUrl" id="playUrl" onChange={(e) => setPlayUrl(e.target.value)} defaultValue={playUrl||''}></input>
                            </div>
                            <div className="inputbox stamp">
                                <label>도장판 유무</label>
                                <br></br>
                                <label htmlFor="playStamp">
                                    <input type="radio" name="playStamp" id="playStamp" onChange={(e)=>setPlayStamp(0)} value ="0" checked={playStamp === 0} ></input>
                                    <span>무</span>
                                </label>
                                <label htmlFor="playStamp">
                                    <input type="radio" name="playStamp" id="playStamp" onChange={(e)=>setPlayStamp(1)} value ="1" checked={playStamp === 1}></input>
                                    <span>유</span>
                                </label>
                            </div>
                    </div>
                    {/* {firstStamp()} */}
                    {playStamp === 1 ? 
                    
                            <div className="inputbox firstStamp">
                                <label htmlFor="playFirstStamp">첫 발급</label>
                                <select name="playFirstStamp" onChange={(e) => setPlayFirstStamp(Number(e.target.value))} defaultValue={playFirstStamp}>
                                    <option value="0">발급X</option>
                                    <option value="1">1회차</option>
                                    <option value="2">2회차</option>
                                </select>
                            </div>
                    :''}
                    {playStamp === 1? 
                            <div className="inputbox firstDouble">
                                <input type="checkbox" name="playFirstDouble" defaultValue="2" onChange={(e) => setPlayFirstDouble(e.target.value)} defaultChecked={playFirstDouble === 2 ? "checked" :''}>
                                </input>
                                <label htmlFor="playFirstDouble">첫 발급 더블적립
                                </label>
                            </div>
                    : ''}


                    <div className="stamplist-gap">
                        <div className="stamplist-wrap">
                            {stampList.stamp && stampList.stamp.map(stamp => {
                            return(
                
                                <EditStampList
                                    key = {stamp.stamp_num}
                                    playNum = {stamp.play_num}
                                    stampNum = {stamp.stamp_num}
                                    stampBenefitNum = {stamp.stamp_benefit_num}
                                    stampBenefit = {stamp.stamp_benefit}
                                    stampGetStartDate = {stamp.stamp_getstartdate ? format(parseISO(stamp.stamp_getstartdate),'yyyy-MM-dd') : ''}
                                    stampGetEndDate = {stamp.stamp_getenddate ? format(parseISO(stamp.stamp_getenddate),'yyyy-MM-dd') : ''}
                                    stampUseStartDate = {stamp.stamp_usestartdate ? format(parseISO(stamp.stamp_usestartdate),'yyyy-MM-dd') : ''}
                                    stampUseEndDate = {stamp.stamp_useenddate ? format(parseISO(stamp.stamp_useenddate),'yyyy-MM-dd') :''}
                                    stampUrl = {stamp.stamp_url}
                                    stampMemo = {stamp.stamp_memo}
                                />

                            )

                            })}
                            {AddStamp()}
                        </div>
                    </div>


                    {/* <EditStamp/> */}


                    <div className="btn">
                        <button className="save" type="submit" onClick={editList}>수정</button>
                        <button className="list"> <Link to="/admin/playlist">목록</Link></button>
                        <button className="delete" onClick={delPlay}>삭제</button>
                    </div>
                </div>

            </div>
        </div>

    )

}

export default PlayDetail;