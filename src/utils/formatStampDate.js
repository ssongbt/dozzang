import { parseISO, format, isValid } from "date-fns";

// stamp_get/use 날짜 필드에는 가끔 "2026-06-27 3시 공연"처럼 순수 ISO 날짜 뒤에
// 부가 설명이 붙어 있거나, "2026-27 7시 공연"처럼 아예 날짜 형식이 깨진 값이 들어있다.
// 앞부분이 yyyy-MM-dd로 파싱 가능할 때만 포맷하고, 아니면 원문을 그대로 보여줘서
// parseISO/format이 던지는 RangeError로 화면이 죽는 것을 막는다.
export const formatStampDate = (value) => {
    if (!value) {
        return '';
    }
    const match = value.match(/^(\d{4}-\d{2}-\d{2})(.*)$/);
    if (!match) {
        return value;
    }
    const parsed = parseISO(match[1]);
    if (!isValid(parsed)) {
        return value;
    }
    return format(parsed, 'yyyy-MM-dd') + match[2];
};
