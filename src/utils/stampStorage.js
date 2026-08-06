const STAMPS_KEY = 'myStamps';

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
