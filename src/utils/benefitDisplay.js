// 회차 하나의 혜택을 보여줄 텍스트를 만든다.
// stamp_benefit이 있으면 그대로 쓰고(문구를 직접 다듬어야 하는 예외 케이스용),
// 없으면 stamp_or_benefit은 "A 또는 B", stamp_and_benefit은 "A + B"로 조립한다.
// 이렇게 하면 새 혜택을 등록할 때 stamp_benefit 문구 없이 배열만 채워도 화면에 표시된다.
const formatAndItem = (item) => (Array.isArray(item) ? `(${item.join(' or ')})` : item);

export const getBenefitDisplayText = (entry) => {
    if (entry.stamp_benefit) {
        return entry.stamp_benefit;
    }
    if (Array.isArray(entry.stamp_or_benefit) && entry.stamp_or_benefit.length > 0) {
        return `${entry.stamp_or_benefit.join(' or ')} 중 택 1`;
    }
    if (Array.isArray(entry.stamp_and_benefit) && entry.stamp_and_benefit.length > 0) {
        return entry.stamp_and_benefit.map(formatAndItem).join(' + ');
    }
    return '';
};
