import { useState } from "react";
import playStampList from "../../data/playStampList.json";
import Linkimg from "../../assets/free-icon-link-2089782.png";
import { getBenefitStatus, setBenefitItemStatus, setBenefitSelected } from "../../utils/stampStorage";
import { formatStampDate } from "../../utils/formatStampDate";
import { getBenefitDisplayText } from "../../utils/benefitDisplay";

const getCouponCount = (text) => {
    if (!text || !text.includes("할인권")) {
        return 0;
    }
    const occurrences = (text.match(/할인권/g) || []).length;
    const qtyMatch = text.match(/(\d+)\s*(매|장|종)/);
    const qty = qtyMatch ? Number(qtyMatch[1]) : 0;
    return Math.max(occurrences, qty, 1);
};

// 회차 하나의 혜택 구성을 판별한다.
// stamp_and_benefit: 여러 항목을 모두 지급 (각 항목별로 수령체크)
// stamp_or_benefit: 여러 항목 중 하나만 지급 (선택 후 수령체크)
// 둘 다 없으면 stamp_benefit 텍스트 하나를 그대로 사용 (기존 방식)
const getBenefitItems = (benefit) => {
    if (Array.isArray(benefit.stamp_and_benefit) && benefit.stamp_and_benefit.length > 0) {
        return { mode: 'and', items: benefit.stamp_and_benefit };
    }
    if (Array.isArray(benefit.stamp_or_benefit) && benefit.stamp_or_benefit.length > 0) {
        return { mode: 'or', items: benefit.stamp_or_benefit };
    }
    return { mode: 'single', items: [benefit.stamp_benefit] };
};

const BenefitCheck = ({ playNum, coalesce, mySum }) => {

    const [, forceUpdate] = useState(0);

    const benefits = playStampList
        .filter((b) => b.stamp_play_num === Number(playNum))
        .sort((a, b) => a.stamp_benefit_num - b.stamp_benefit_num);

    if (benefits.length === 0) {
        return <p className="no-benefit">등록된 혜택이 없습니다</p>;
    }

    const toggleReceived = (benefitNum, itemIdx) => {
        const status = getBenefitStatus(playNum, coalesce, benefitNum);
        const current = !!(status.items[itemIdx] && status.items[itemIdx].received);
        setBenefitItemStatus(playNum, coalesce, benefitNum, itemIdx, { received: !current });
        forceUpdate((n) => n + 1);
    };

    const toggleUsed = (benefitNum, itemIdx, usedIdx, couponCount) => {
        const status = getBenefitStatus(playNum, coalesce, benefitNum);
        const itemStatus = status.items[itemIdx] || {};
        const usedArr = Array.isArray(itemStatus.used) && itemStatus.used.length === couponCount
            ? [...itemStatus.used]
            : Array(couponCount).fill(false);
        usedArr[usedIdx] = !usedArr[usedIdx];
        setBenefitItemStatus(playNum, coalesce, benefitNum, itemIdx, { used: usedArr });
        forceUpdate((n) => n + 1);
    };

    const selectOrItem = (benefitNum, itemIdx) => {
        setBenefitSelected(playNum, coalesce, benefitNum, itemIdx);
        forceUpdate((n) => n + 1);
    };

    // and 배열 안에 [옵션들] 형태로 중첩된 or 그룹에서 실제로 받은 옵션을 선택
    const selectSubItem = (benefitNum, itemIdx, subIdx) => {
        setBenefitItemStatus(playNum, coalesce, benefitNum, itemIdx, { selected: subIdx });
        forceUpdate((n) => n + 1);
    };

    const renderCouponRow = (benefitNum, itemIdx, itemText, itemStatus) => {
        const couponCount = getCouponCount(itemText);
        if (couponCount === 0) {
            return null;
        }
        const usedArr = Array.isArray(itemStatus.used) ? itemStatus.used : [];
        return (
            <div className="couponRow">
                {Array.from({ length: couponCount }).map((_, i) => (
                    <label className="benefitCheck" key={i}>
                        <input
                            type="checkbox"
                            checked={!!usedArr[i]}
                            disabled={!itemStatus.received}
                            onChange={() => toggleUsed(benefitNum, itemIdx, i, couponCount)}
                        />
                        할인권{couponCount > 1 ? `${i + 1}` : ''} 사용
                    </label>
                ))}
            </div>
        );
    };

    return (
        <div className="benefitCheckList">
            {benefits.map((list) => {
                const achieved = Number(mySum) >= Number(list.stamp_benefit_num);
                const status = getBenefitStatus(playNum, coalesce, list.stamp_benefit_num);
                const { mode, items } = getBenefitItems(list);

                return (
                    <div className={`benefitlist ${achieved ? 'achieved' : 'locked'}`} key={list.stamp_num}>
                        <div className="benefitNum">
                            <span>{list.stamp_benefit_emoji || '🎁'} {list.stamp_benefit_num}회차</span>
                        </div>
                        <div className="benefitBody">
                            <div className="benefit">
                                <span className="benefitName">{getBenefitDisplayText(list)}</span>
                                {list.stamp_url ?
                                    <img className="linkImg" src={Linkimg} alt="link" onClick={() => window.open(`${list.stamp_url}`, "_blank")} />
                                    : ''}
                            </div>

                            {(list.stamp_usestartdate || list.stamp_useenddate) &&
                                <div className="useDate">
                                    사용기간 {formatStampDate(list.stamp_usestartdate)}
                                    {' ~ '}
                                    {formatStampDate(list.stamp_useenddate)}
                                </div>
                            }

                            {list.stamp_memo ?
                                <div className="memo">({list.stamp_memo.trim()})</div>
                                : ''}

                            {achieved && mode === 'single' &&
                                <div className="benefitCheckRow">
                                    <label className="benefitCheck">
                                        <input
                                            type="checkbox"
                                            checked={!!(status.items[0] && status.items[0].received)}
                                            onChange={() => toggleReceived(list.stamp_benefit_num, 0)}
                                        />
                                        수령완료
                                    </label>
                                    {renderCouponRow(list.stamp_benefit_num, 0, items[0], status.items[0] || {})}
                                </div>
                            }

                            {achieved && mode === 'and' &&
                                <div className="benefitItems">
                                    {items.map((item, idx) => {
                                        const itemStatus = status.items[idx] || {};

                                        // and 배열 안에 [옵션1, 옵션2] 형태로 중첩된 or 그룹 (예: "A or B" + "C")
                                        if (Array.isArray(item)) {
                                            const subSelected = itemStatus.selected;
                                            return (
                                                <div className="benefitItem orGroup" key={idx}>
                                                    {item.map((subItem, subIdx) => {
                                                        const selected = subSelected === subIdx;
                                                        return (
                                                            <div className={`benefitItem ${selected ? 'selected' : ''}`} key={subIdx}>
                                                                <label className="benefitCheck">
                                                                    <input
                                                                        type="radio"
                                                                        name={`or-${playNum}-${coalesce}-${list.stamp_benefit_num}-${idx}`}
                                                                        checked={selected}
                                                                        onChange={() => selectSubItem(list.stamp_benefit_num, idx, subIdx)}
                                                                    />
                                                                    {subItem}
                                                                </label>
                                                                {selected &&
                                                                    <div className="benefitCheckRow">
                                                                        <label className="benefitCheck">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={!!itemStatus.received}
                                                                                onChange={() => toggleReceived(list.stamp_benefit_num, idx)}
                                                                            />
                                                                            수령완료
                                                                        </label>
                                                                        {renderCouponRow(list.stamp_benefit_num, idx, subItem, itemStatus)}
                                                                    </div>
                                                                }
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="benefitItem" key={idx}>
                                                <div className="benefitCheckRow">
                                                    <label className="benefitCheck">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!itemStatus.received}
                                                            onChange={() => toggleReceived(list.stamp_benefit_num, idx)}
                                                        />
                                                        {item} 수령완료
                                                    </label>
                                                    {renderCouponRow(list.stamp_benefit_num, idx, item, itemStatus)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            }

                            {achieved && mode === 'or' &&
                                <div className="benefitItems orGroup">
                                    {items.map((item, idx) => {
                                        const itemStatus = status.items[idx] || {};
                                        const selected = status.selected === idx;
                                        return (
                                            <div className={`benefitItem ${selected ? 'selected' : ''}`} key={idx}>
                                                <label className="benefitCheck">
                                                    <input
                                                        type="radio"
                                                        name={`or-${playNum}-${coalesce}-${list.stamp_benefit_num}`}
                                                        checked={selected}
                                                        onChange={() => selectOrItem(list.stamp_benefit_num, idx)}
                                                    />
                                                    {item}
                                                </label>
                                                {selected &&
                                                    <div className="benefitCheckRow">
                                                        <label className="benefitCheck">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!itemStatus.received}
                                                                onChange={() => toggleReceived(list.stamp_benefit_num, idx)}
                                                            />
                                                            수령완료
                                                        </label>
                                                        {renderCouponRow(list.stamp_benefit_num, idx, item, itemStatus)}
                                                    </div>
                                                }
                                            </div>
                                        );
                                    })}
                                </div>
                            }
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default BenefitCheck;
