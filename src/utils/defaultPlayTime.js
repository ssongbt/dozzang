// 공연 시간을 고를 때 요일별로 흔한 회차 시간을 기본값으로 미리 채워준다.
// 평일 20시, 토요일 15시, 일요일 14시 — 사용자가 고르기 전 기본 제안일 뿐이라
// 시간 선택 UI에서 언제든 다시 바꿀 수 있다.
export const getDefaultPlayTime = (date) => {
    if (!date) {
        return null;
    }
    const day = date.getDay();
    const hour = day === 0 ? 14 : day === 6 ? 15 : 20;
    const result = new Date(date);
    result.setHours(hour, 0, 0, 0);
    return result;
};
