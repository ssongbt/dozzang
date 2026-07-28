const STAMPS_KEY = 'myStamps';

const countStamps = (records) => {
    let nomal = 0;
    let double = 0;
    records.forEach((r) => {
        if (Number(r.doubleStamp) === 1) {
            nomal += 1;
        } else {
            double += 1;
        }
    });
    return { nomal, double };
};

export const loadAllStamps = () => {
    try {
        return JSON.parse(localStorage.getItem(STAMPS_KEY)) || {};
    } catch (e) {
        return {};
    }
};

export const saveStamp = (playNum, coalesce, doubleWeight, record) => {
    const all = loadAllStamps();
    const cards = all[playNum] ? [...all[playNum]] : [];
    let card = cards.find((c) => Number(c.coalesce) === Number(coalesce));
    if (!card) {
        card = { coalesce: Number(coalesce), nomal: 0, double: 0, records: [] };
        cards.push(card);
    }
    if (!card.records) {
        card.records = [];
    }
    if (doubleWeight === 1) {
        card.nomal = Number(card.nomal) + 1;
    } else {
        card.double = Number(card.double) + 1;
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
    cards[cardIndex] = { ...cards[cardIndex], records, ...countStamps(records) };
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
        cards[cardIndex] = { ...cards[cardIndex], records, ...countStamps(records) };
    }
    all[playNum] = cards;
    localStorage.setItem(STAMPS_KEY, JSON.stringify(all));
};
