const STAMPS_KEY = 'myStamps';
const BENEFITS_KEY = 'myBenefits';
const ALIASES_KEY = 'myStampAliases';
const HIDDEN_KEY = 'myStampHidden';

export const getFilledCount = (card) => {
    return (card.records || []).reduce((sum, r) => sum + (Number(r.doubleStamp) || 1), 0);
};

export const loadAllStamps = () => {
    try {
        return JSON.parse(localStorage.getItem(STAMPS_KEY)) || {};
    } catch (e) {
        return {};
    }
};

export const exportStampsBackup = () => {
    const backup = {
        stamps: loadAllStamps(),
        benefits: loadBenefitStatus(),
        aliases: loadCardAliases(),
        hidden: loadCardHidden(),
    };
    return JSON.stringify(backup, null, 2);
};

export const restoreStampsBackup = (jsonString) => {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('올바른 백업 파일이 아닙니다.');
    }

    // 예전 백업 파일은 stamps 맵 하나뿐이라 { stamps, benefits, aliases } 모양이 아니다.
    const isBundledFormat = parsed.stamps && typeof parsed.stamps === 'object' && !Array.isArray(parsed.stamps);
    const stamps = isBundledFormat ? parsed.stamps : parsed;

    localStorage.setItem(STAMPS_KEY, JSON.stringify(stamps));

    if (isBundledFormat) {
        if (parsed.benefits && typeof parsed.benefits === 'object') {
            localStorage.setItem(BENEFITS_KEY, JSON.stringify(parsed.benefits));
        }
        if (parsed.aliases && typeof parsed.aliases === 'object') {
            localStorage.setItem(ALIASES_KEY, JSON.stringify(parsed.aliases));
        }
        if (parsed.hidden && typeof parsed.hidden === 'object') {
            localStorage.setItem(HIDDEN_KEY, JSON.stringify(parsed.hidden));
        }
    }
};

export const saveStamp = (playNum, coalesce, doubleWeight, record) => {
    const all = loadAllStamps();
    const cards = all[playNum] ? [...all[playNum]] : [];
    let card = cards.find((c) => Number(c.coalesce) === Number(coalesce));
    if (!card) {
        card = { coalesce: Number(coalesce), records: [] };
        cards.push(card);
    }
    if (!card.records) {
        card.records = [];
    }
    card.records.push(record);
    all[playNum] = cards;
    localStorage.setItem(STAMPS_KEY, JSON.stringify(all));
};

export const updateStamp = (playNum, coalesce, recordIndex, record) => {
    const all = loadAllStamps();
    const cards = all[playNum] ? [...all[playNum]] : [];
    const cardIndex = cards.findIndex((c) => Number(c.coalesce) === Number(coalesce));
    if (cardIndex === -1 || !cards[cardIndex].records || !cards[cardIndex].records[recordIndex]) {
        return;
    }
    const records = [...cards[cardIndex].records];
    records[recordIndex] = record;
    cards[cardIndex] = { ...cards[cardIndex], records };
    all[playNum] = cards;
    localStorage.setItem(STAMPS_KEY, JSON.stringify(all));
};

const benefitKey = (playNum, coalesce, benefitNum) => `${playNum}-${coalesce}-${benefitNum}`;

export const loadBenefitStatus = () => {
    try {
        return JSON.parse(localStorage.getItem(BENEFITS_KEY)) || {};
    } catch (e) {
        return {};
    }
};

// status shape: { selected: number|null, items: { [itemIdx]: { received: bool, used: bool[] } } }
// selected is only meaningful for "or" benefits (which item was chosen).
export const getBenefitStatus = (playNum, coalesce, benefitNum) => {
    const all = loadBenefitStatus();
    const raw = all[benefitKey(playNum, coalesce, benefitNum)];
    if (!raw) {
        return { selected: null, items: {} };
    }
    if (raw.items) {
        return { selected: raw.selected ?? null, items: raw.items };
    }
    // legacy shape from before per-item tracking: { received, used }
    return { selected: null, items: { 0: { received: !!raw.received, used: Array.isArray(raw.used) ? raw.used : [] } } };
};

export const setBenefitItemStatus = (playNum, coalesce, benefitNum, itemIdx, patch) => {
    const current = getBenefitStatus(playNum, coalesce, benefitNum);
    const items = { ...current.items, [itemIdx]: { ...current.items[itemIdx], ...patch } };
    const all = loadBenefitStatus();
    const key = benefitKey(playNum, coalesce, benefitNum);
    all[key] = { selected: current.selected, items };
    localStorage.setItem(BENEFITS_KEY, JSON.stringify(all));
    return all[key];
};

export const setBenefitSelected = (playNum, coalesce, benefitNum, itemIdx) => {
    const current = getBenefitStatus(playNum, coalesce, benefitNum);
    const all = loadBenefitStatus();
    const key = benefitKey(playNum, coalesce, benefitNum);
    all[key] = { selected: itemIdx, items: current.items };
    localStorage.setItem(BENEFITS_KEY, JSON.stringify(all));
    return all[key];
};

const aliasKey = (playNum, coalesce) => `${playNum}-${coalesce}`;

export const loadCardAliases = () => {
    try {
        return JSON.parse(localStorage.getItem(ALIASES_KEY)) || {};
    } catch (e) {
        return {};
    }
};

export const getCardAlias = (playNum, coalesce) => {
    const all = loadCardAliases();
    return all[aliasKey(playNum, coalesce)] || '';
};

export const setCardAlias = (playNum, coalesce, alias) => {
    const all = loadCardAliases();
    const key = aliasKey(playNum, coalesce);
    if (alias) {
        all[key] = alias;
    } else {
        delete all[key];
    }
    localStorage.setItem(ALIASES_KEY, JSON.stringify(all));
};

const hiddenKey = (playNum, coalesce) => `${playNum}-${coalesce}`;

export const loadCardHidden = () => {
    try {
        return JSON.parse(localStorage.getItem(HIDDEN_KEY)) || {};
    } catch (e) {
        return {};
    }
};

export const isCardHidden = (playNum, coalesce) => {
    const all = loadCardHidden();
    return !!all[hiddenKey(playNum, coalesce)];
};

export const setCardHidden = (playNum, coalesce, hidden) => {
    const all = loadCardHidden();
    const key = hiddenKey(playNum, coalesce);
    if (hidden) {
        all[key] = true;
    } else {
        delete all[key];
    }
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(all));
};

export const removeStamp = (playNum, coalesce, recordIndex) => {
    const all = loadAllStamps();
    const cards = all[playNum] ? [...all[playNum]] : [];
    const cardIndex = cards.findIndex((c) => Number(c.coalesce) === Number(coalesce));
    if (cardIndex === -1 || !cards[cardIndex].records) {
        return;
    }
    const records = cards[cardIndex].records.filter((_, i) => i !== Number(recordIndex));
    if (records.length === 0) {
        cards.splice(cardIndex, 1);
    } else {
        cards[cardIndex] = { ...cards[cardIndex], records };
    }
    all[playNum] = cards;
    localStorage.setItem(STAMPS_KEY, JSON.stringify(all));
};
