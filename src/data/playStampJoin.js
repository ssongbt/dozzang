import searchPlayList from "./searchPlayList.json";
import playStampList from "./playStampList.json";

export const getPlayStampJoin = (keyword) => {
    const matchedPlays = keyword
        ? searchPlayList.filter((play) => play.play_name.includes(keyword))
        : searchPlayList;

    return matchedPlays.flatMap((play) => {
        const stamps = playStampList.filter((stamp) => stamp.stamp_play_num === play.play_num);

        if (stamps.length === 0) {
            return [{
                ...play,
                stamp_play_num: null,
                stamp_num: null,
                stamp_benefit_num: null,
                stamp_benefit: null,
                stamp_url: null,
                stamp_getstartdate: null,
                stamp_getenddate: null,
                stamp_usestartdate: null,
                stamp_useenddate: null,
                stamp_memo: null,
            }];
        }

        return stamps.map((stamp) => ({ ...play, ...stamp }));
    });
};
