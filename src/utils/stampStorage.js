const STAMPS_KEY = 'myStamps';

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
