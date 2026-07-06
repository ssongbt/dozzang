import { useEffect, forwardRef, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/esm/locale";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";
import { format, parseISO } from 'date-fns';

const AddDoubleTurn = ({inputItmes, addInput, InputDelete, onChange, playStart, playEnd}) =>{

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

    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth());
    
    // console.log("더블적립날짜",doubleDate);
    const handleMonthChange = (date) => {
        setMonth(date.getMonth());
    };

    const Input = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
        {value}
    </button>
    ));

    return(
        <div className="addDoubleTurn">
           {inputItmes && inputItmes.map((item, index) =>{
                return(
                    <div className="addDoubleStamp" key={index}>                        
                        <li key={index} >
                            <div className="inputbox date">
                                <label htmlFor="date">더블적립일자</label>
                                <br></br>
                                {/* <input type="date" name="date" id="date" onChange={(e) => onChange(e, item.id)}></input> */}
                                <DatePicker
                                        className="datePicker"
                                        locale={ko}
                                        showIcon
                                        selected={item.date}
                                        minDate ={parseISO(playStart)}
                                        maxDate={parseISO(playEnd)}
                                        name="date"
                                        id="date"
                                        onChange={(date) => {onChange('date', date, item.id); setDate(date)}}
                                        // onChangeRaw={(e)=>onChange(e, item.id)}
                                        dateFormat="yyyy년 MM월 dd일"
                                        customInput={<Input />}
                                        onMonthChange={handleMonthChange}
                                        dayClassName={(d) =>
                                            d.getDate() === (date !== null? date.getDate():new Date().getDate()) && d.getMonth() === (date !== null ? date.getMonth():new Date().getMonth())
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
                            <div className="inputbox time">
                                <label htmlFor="time">더블적립회차</label>
                                <br></br>
                                {/* <input type="time" name="time" id="time" onChange={(e) => onChange(e, item.id)}></input> */}
                                <DatePicker
                                    selected={item.time}
                                    onChange={(time) => {setTime(time);  onChange('time', time, item.id)}}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    customInput={<Input />}
                                />
                            </div>
                            <div className="stamp-btn">
                                {index === 0 && inputItmes.length<10 && (
                                    <button className="s-btn" onClick={()=> addInput()}>+</button>
                                    )}
                                {index >0 && inputItmes[index-1]? (
                                    <button className="s-btn" onClick={() => InputDelete(item.id)}>-</button>
                                    ) : ("")}
                            </div>
                        </li>
                    </div>
                )
           })} 
        </div>
    )


}


export default AddDoubleTurn;