const STAMPS_KEY = 'myStamps';
const BENEFITS_KEY = 'myBenefits';
const ALIASES_KEY = 'myStampAliases';

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
    return JSON.stringify(loadAllStamps(), null, 2);
};

export const restoreStampsBackup = (jsonString) => {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('올바른 백업 파일이 아닙니다.');
    }
    localStorage.setItem(STAMPS_KEY, JSON.stringify(parsed));
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

export const getBenefitStatus = (playNum, coalesce, benefitNum) => {
    const all = loadBenefitStatus();
    return all[benefitKey(playNum, coalesce, benefitNum)] || { received: false, used: false };
};

export const setBenefitStatus = (playNum, coalesce, benefitNum, status) => {
    const all = loadBenefitStatus();
    const key = benefitKey(playNum, coalesce, benefitNum);
    all[key] = { ...all[key], ...status };
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
