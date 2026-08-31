import { useEffect, useMemo, useState } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addMonths,
    subMonths,
    isSameMonth,
    isToday,
    getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import searchPlayList from "../data/searchPlayList.json";
import { loadAllStamps } from "../utils/stampStorage";

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const PLAY_COLOR_PALETTE = ['#E9EFFD', '#FDEBEF', '#EAF7EE', '#FFF6E0', '#F1EAFB', '#E3F6F5', '#FDEEDC', '#ECEDF5'];

const getPlayColor = (playNum) => PLAY_COLOR_PALETTE[Number(playNum) % PLAY_COLOR_PALETTE.length];

const circledNumber = (num) => {
    const n = Number(num);
    if (n >= 1 && n <= 20) {
        return String.fromCodePoint(0x2460 + (n - 1));
    }
    return `(${n})`;
};

const truncateName = (name) => (name.length > 4 ? `${name.slice(0, 4)}…` : name);

const formatEntryTime = (time) => {
    if (!time) {
        return '';
    }
    const hour24 = Number(time.substring(0, 2));
    const minute = time.substring(3, 5);
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${ampm} ${hour12}:${minute}`;
};

// 대한민국 법정공휴일(대체공휴일 포함). 날짜 문자열에 연도가 포함돼있어서
// 새 연도가 되면 이 객체에 그 해 항목을 추가하기만 하면 됨 (신정·현충일은
// 대체공휴일 적용 대상이 아니라서 주말에 걸려도 대체일이 없음에 유의).
const KR_HOLIDAYS = {
    // 2026년
    '2026-01-01': '신정',
    '2026-02-16': '설날 연휴',
    '2026-02-17': '설날',
    '2026-02-18': '설날 연휴',
    '2026-03-01': '삼일절',
    '2026-03-02': '삼일절 대체공휴일',
    '2026-05-05': '어린이날',
    '2026-05-24': '부처님오신날',
    '2026-05-25': '부처님오신날 대체공휴일',
    '2026-06-06': '현충일',
    '2026-08-15': '광복절',
    '2026-08-17': '광복절 대체공휴일',
    '2026-09-24': '추석 연휴',
    '2026-09-25': '추석',
    '2026-09-26': '추석 연휴',
    '2026-10-03': '개천절',
    '2026-10-05': '개천절 대체공휴일',
    '2026-10-09': '한글날',
    '2026-12-25': '크리스마스',
    // 2027년
    '2027-01-01': '신정',
    '2027-02-06': '설날 연휴',
    '2027-02-07': '설날',
    '2027-02-08': '설날 연휴',
    '2027-02-09': '설날 대체공휴일',
    '2027-03-01': '삼일절',
    '2027-05-05': '어린이날',
    '2027-05-13': '부처님오신날',
    '2027-06-06': '현충일',
    '2027-08-15': '광복절',
    '2027-08-16': '광복절 대체공휴일',
    '2027-09-14': '추석 연휴',
    '2027-09-15': '추석',
    '2027-09-16': '추석 연휴',
    '2027-10-03': '개천절',
    '2027-10-04': '개천절 대체공휴일',
    '2027-10-09': '한글날',
    '2027-10-11': '한글날 대체공휴일',
    '2027-12-25': '크리스마스',
    '2027-12-27': '크리스마스 대체공휴일',
};

const buildStampEntriesByDate = () => {
    const all = loadAllStamps();
    const entriesByDate = {};

    Object.keys(all).forEach((playNumKey) => {
        const play = searchPlayList.find((p) => p.play_num === Number(playNumKey));
        if (!play) {
            return;
        }

        all[playNumKey].forEach((card) => {
            const indexedRecords = (card.records || []).slice().sort((a, b) => {
                const dateCompare = (a.playDate || '').localeCompare(b.playDate || '');
                if (dateCompare !== 0) {
                    return dateCompare;
                }
                return (a.playTime || '').localeCompare(b.playTime || '');
            });

            let roundCursor = 0;
            indexedRecords.forEach((record) => {
                const weight = Number(record.doubleStamp) || 1;
                const roundStart = roundCursor + 1;
                const roundEnd = roundCursor + weight;
                roundCursor = roundEnd;

                if (!record.playDate) {
                    return;
                }

                const entry = {
                    playNum: play.play_num,
                    playName: play.play_name,
                    playEmoji: play.play_emoji || '',
                    coalesce: card.coalesce,
                    round: roundStart,
                    weight,
                    time: record.playTime,
                };

                if (!entriesByDate[record.playDate]) {
                    entriesByDate[record.playDate] = [];
                }
                entriesByDate[record.playDate].push(entry);
            });
        });
    });

    return entriesByDate;
};

const CalendarComponent = () => {

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [entriesByDate, setEntriesByDate] = useState({});

    useEffect(() => {
        setEntriesByDate(buildStampEntriesByDate());
    }, []);

    const goPrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
    const goNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
    const goToday = () => setCurrentMonth(new Date());

    const days = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const gridStart = startOfWeek(monthStart);
        const gridEnd = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: gridStart, end: gridEnd });
    }, [currentMonth]);

    return (
        <div id="calendar">
            <div className="wrap">
                <div className="calendar-gap">
                    <div className="calendar-header">
                        <button type="button" className="calendar-nav prev" onClick={goPrevMonth} aria-label="이전 달">
                            <ChevronLeft />
                        </button>
                        <div className="calendar-title" onClick={goToday}>
                            {format(currentMonth, 'yyyy년 M월')}
                        </div>
                        <button type="button" className="calendar-nav next" onClick={goNextMonth} aria-label="다음 달">
                            <ChevronRight />
                        </button>
                    </div>

                    <div className="calendar-weekdays">
                        {WEEKDAYS.map((weekday, i) => (
                            <div className={`calendar-weekday ${i === 0 ? 'sun' : ''} ${i === 6 ? 'sat' : ''}`} key={weekday}>
                                {weekday}
                            </div>
                        ))}
                    </div>

                    <div className="calendar-grid">
                        {days.map((day) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const dayEntries = entriesByDate[dateStr] || [];
                            const dayOfWeek = getDay(day);
                            const holidayName = KR_HOLIDAYS[dateStr];
                            return (
                                <div
                                    className={`calendar-cell ${isSameMonth(day, currentMonth) ? '' : 'outside'} ${isToday(day) ? 'today' : ''}`}
                                    key={dateStr}
                                >
                                    <div className={`calendar-date ${dayOfWeek === 0 || holidayName ? 'sun' : ''} ${dayOfWeek === 6 ? 'sat' : ''}`}>
                                        {format(day, 'd')}
                                    </div>
                                    <div className="calendar-entries">
                                        {dayEntries.map((entry, i) => (
                                            <div
                                                className="calendar-entry"
                                                key={i}
                                                style={{ backgroundColor: getPlayColor(entry.playNum) }}
                                                title={`${entry.playName} 도장판${entry.coalesce} ${entry.round}회차${entry.weight > 1 ? ` (${entry.weight}배적립)` : ''}`}
                                            >
                                                {entry.time ? <div className="entryTime">{formatEntryTime(entry.time)}</div> : ''}
                                                <div className="entryLabel">
                                                    {entry.playEmoji}{truncateName(entry.playName)} {circledNumber(entry.coalesce)}
                                                    {' - '}{entry.round}{entry.weight > 1 ? `(${entry.weight})` : ''}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarComponent;
