import {useEffect, useState, forwardRef} from "react";
import {Link, useParams} from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/esm/locale";
import getYear from "date-fns/getYear";
import styled from 'styled-components';
import { Files, Trash3 } from "react-bootstrap-icons";
import searchPlayList from "../../data/searchPlayList.json";
import { loadAllStamps, saveStamp, updateStamp, removeStamp, getFilledCount } from "../../utils/stampStorage";

const MyStampEdit = () => {

    const [stamps, setStamps] = useState([]);
    const [playNum, setPlayNum] = useState();
    const [coalesce, setCoalesce] = useState();
    const [recordIndex, setRecordIndex] = useState();
    const [playTitle, setPlayTitle] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [max, setMax] = useState();
    const [double, setDouble] = useState(1);
    const [stampMemo, setStampMemo] = useState('');
    const [stampCnt, setStampCnt] = useState();
    const [mode, setMode] = useState('edit');

    const [playDate, setPlayDate] = useState(null);
    const [playTime, setPlayTime] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth());

    let params = useParams();

    const getStamp = () =>{
        const [numPlay, numCoalesce, numRecordIndex] = params.num.split('-');
        const parsedPlayNum = Number(numPlay);
        const parsedCoalesce = Number(numCoalesce);
        const parsedRecordIndex = Number(numRecordIndex);

        const play = searchPlayList.find((p) => p.play_num === parsedPlayNum);
        if(!play){
            return;
        }
        const cards = loadAllStamps()[parsedPlayNum] || [];
        const card = cards.find((c) => Number(c.coalesce) === parsedCoalesce);
        const record = card && card.records ? card.records[parsedRecordIndex] : null;
        if(!record){
            return;
        }

        setPlayNum(parsedPlayNum);
        setCoalesce(parsedCoalesce);
        setRecordIndex(parsedRecordIndex);
        setStampCnt(parsedCoalesce);
        setStamps(cards);

        setPlayTitle(play.play_name);
        setStartDate(play.play_start ? format(parseISO(play.play_start),'yyyy-MM-dd') : '');
        setEndDate(play.play_end ? format(parseISO(play.play_end),'yyyy-MM-dd'):'');
        setMax(play.play_stamp);

        setPlayDate(parseISO(record.playDate));
        setPlayTime(parseISO(`${record.playDate}T${record.playTime}`));
        setStampMemo(record.stampMemo || '');
        setDouble(Number(record.doubleStamp) || 1);
    }

    useEffect(()=>{
        getStamp();
    },[]);

    const StmapList = () => {
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
                    <select value={stampCnt || ''} name="stampCnt" onChange={(e) => setStampCnt(e.target.value)}>
                        {stamps.map(stamp=>{
                            const isOwnCard = Number(stamp.coalesce) === Number(coalesce);
                            const isFull = getFilledCount(stamp)>=max;
                            return(
                                <option key={stamp.coalesce} value={stamp.coalesce} disabled={!isOwnCard && isFull}>{stamp.coalesce}</option>
                            )
                        })}
                        <option value={size+1}>새 도장판</option>
                    </select>
                </div>
            )
        }
    }

    const addStamp = () =>{
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

        const record = {
            playNum : playNum,
            playDate : format(playDate,'yyyy-MM-dd'),
            playTime : playTime.toTimeString().split(' ')[0],
            stampCnt : Number(stampCnt),
            stampMemo : stampMemo,
            doubleStamp : double
        }

        if(Number(stampCnt) !== Number(coalesce)){
            removeStamp(playNum, coalesce, recordIndex);
            saveStamp(playNum, stampCnt, double, record);
        }else{
            updateStamp(playNum, coalesce, recordIndex, record);
        }

        window.alert("저장되었습니다");
        window.location.href = "#/myhome/stamp";
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

    const copyStamp = () => {
        setMode('copy');
    }

    const deleteStamp = () => {
        if(window.confirm("정말 삭제하시겠습니까?")){
            removeStamp(playNum, coalesce, recordIndex);
            window.alert("삭제되었습니다.");
            window.location.href = "#/myhome/stamp";
        }
    }

    const saveCopy = () => {
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

        const record = {
            playNum : playNum,
            playDate : format(playDate,'yyyy-MM-dd'),
            playTime : playTime.toTimeString().split(' ')[0],
            stampCnt : Number(stampCnt),
            stampMemo : stampMemo,
            doubleStamp : double
        }

        saveStamp(playNum, stampCnt, double, record);

        window.alert("복사되었습니다");
        window.location.href = "#/myhome/stamp";
    }



    return(

        <div id="myStampAdd">
            <div className="wrap">
                <div className="myStampAdd-gap">
                    <div className="myStampAdd-wrap">
                        <div className="myStampAdd-title">
                            {mode === 'copy' ? '도장 복사' : '도장 수정'}
                            {mode === 'copy' ? '' : (
                                <div className="title-actions">
                                    <button type="button" className="icon-btn" onClick={copyStamp} title="복사" aria-label="복사"><Files size={15}/></button>
                                    <button type="button" className="icon-btn danger" onClick={deleteStamp} title="삭제" aria-label="삭제"><Trash3 size={15}/></button>
                                </div>
                            )}
                        </div>
                        <div className="inputbox play">
                            <label htmlFor="play">공연명</label>
                            <InputBox>
                                <Input type="text" name="search" value ={playTitle||""} readonly/>
                            </InputBox>
                        </div>
                        <div className="inputbox date">
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
                                    dateFormat="yyyy.MM.dd"
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
                                        </div>
                                        <div className="month-day">
                                            {getYear(date)}년 {months[date.getMonth()]}월
                                        </div>

                                        <div
                                            className={`btn_month btn_month-next${nextMonthButtonDisabled ? ' disabled' : ''}`}
                                            onClick={nextMonthButtonDisabled ? undefined : increaseMonth}
                                            >
                                            &gt;
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
                            </div>
                        </div>
                        <div className="inputbox stamp">
                            <div className="stampPlate">
                                <label htmlFor="stamp">도장판</label>
                                {StmapList()}
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
                            <input type="text" name="stampMemo" id="stampMemo" value={stampMemo||''} onChange={(e)=>setStampMemo(e.target.value)}></input>
                        </div>

                        <div className="btn">
                            <button className="save" type="submit" onClick={mode === 'copy' ? saveCopy : addStamp}>수정</button>
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
