// AIの自動補完便利すぎる^o^

// 訓練に関する各種データ
// "Tier x"のインデックスは"x-1"
const trainData = {
    // 訓練に必要な各種資源のデータ。
    // 打ち込むのがとてもめんどくさかったです。
    resource: {
        // "盾兵/槍兵/弓兵"のインデックスは"0/1/2"
        meat: [
            [36,58,92,120,156,186,279,558,1394,2788,6970,-1],
            [32,51,81,105,136,163,244,488,1220,2440,6099,-1],
            [23,36,58,75,97,117,175,349,872,1743,4357,-1]
        ],
        wood: [
            [27,44,69,90,117,140,210,419,1046,2091,5228,-1],
            [30,48,76,99,129,154,231,461,1151,2301,5751,-1],
            [34,54,86,111,144,173,258,516,1290,2579,6448,-1]
        ],
        coal: [
            [7,10,17,21,27,33,49,98,244,488,1220,-1],
            [7,10,16,21,27,32,48,95,237,474,1185,-1],
            [6,9,15,19,24,29,44,87,217,433,1081,-1]
        ],
        iron: [
            [2,3,4,5,6,7,11,21,51,102,253,-1],
            [2,3,4,5,7,8,11,22,55,109,271,-1],
            [2,4,5,6,8,10,14,28,70,140,349,-1]
        ]
    },
    // 訓練に掛かる時間。単位は"秒"
    time: [ 12, 17, 24, 32, 44, 60, 83, 113, 131, 152, 180, -1 ],
    // イベントでのポイント換算の倍率
    point: {
        // 氷原支配者
        koi: {
            train: [ 1, 2, 3, 5, 7, 11, 16, 23, 30, 39, 49, -1 ],
            speedup: 30
        },
        // 季節/周年イベント
        season: {
            train: [ 5, 7, 10, 16, 23, 36, 50, 68, 90, 118, 140, -1 ],
            speedup: 60,
            power: 1
        }
    }
}

// 兵士単体の戦力データ
// "Fc y, Tier x"のインデックスは"[y,x] = [y,x-1]" (火晶兵士ではない場合はy=0とする)
const powerData = [
        [ 3, 4, 6, 9, 13, 20, 28, 38, 50, 66, 80, -1 ], // Lv.1~30
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1 ], // fc1
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1 ], // fc2
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1 ], // fc3
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1 ], // fc4
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 -1 ], // fc5
        [ 4, 5, 9, 14, 19, 30, 43, 57, 77, 99, 120, -1 ], // fc6
        [ 4, 5, 10, 15, 20, 32, 46, 60, 82, 104, 126, -1 ], // fc7
        [ 5, 6, 11, 16, 21, 34, 49, 63, 87, 110, 135, -1 ], // fc8
        [ 5, 6, 11, 16, 22, 35, 51, 66, 91, 115, 141, -1 ], // fc9
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1 ] // fc10
];

// ----"trainData"に関する関数群----
// 引数に関してはJSON内のコメントを参照してください。
function getReqRes(resource, kind, tier) {
    return trainData.resource[resource][kind][tier-1] ?? 0;
}
// 生肉
function getReqMeats(kind, tier) {
    return getReqRes("meat", kind, tier);
}
function getPromoteMeats(kind, fromTier, toTier) {
    return getReqMeats(kind, toTier) - getReqMeats(kind, fromTier);
}
// 木材
function getReqWoods(kind, tier) {
    return getReqRes("wood", kind, tier);
}
function getPromoteWoods(kind, fromTier, toTier) {
    return getReqWoods(kind, toTier) - getReqWoods(kind, fromTier);
}
// 石炭
function getReqCoals(kind, tier) {
    return getReqRes("coal", kind, tier);
}
function getPromoteCoals(kind, fromTier, toTier) {
    return getReqCoals(kind, toTier) - getReqCoals(kind, fromTier);
}
// 鉄鉱
function getReqIrons(kind, tier) {
    return getReqRes("iron", kind, tier);
}
function getPromoteIrons(kind, fromTier, toTier) {
    return getReqIrons(kind, toTier) - getReqIrons(kind, fromTier);
}
// 訓練時間
function getTrainTime(tier) {
    return trainData.time[tier-1] ?? 0;
}
function getPromoteTime(fromTier, toTier) {
    return getTrainTime(toTier) - getTrainTime(fromTier);
}
// ポイント
function getPoint(event, type, tier) {
    return trainData.point[event][type][tier-1] ?? 0;
}
// 訓練ポイント
function getTrainPoint(event, tier) {
    return getPoint(event, "train", tier);
}
function getPromotePoint(event, fromTier, toTier) {
    return getTrainPoint(event, toTier) - getTrainPoint(event, fromTier);
}
// 時間短縮ポイント
function getSpeedupPoint(event) {
    return trainData.point[event]["speedup"] ?? 0;
}
// 総力上昇ポイント
function getPowerPoint(event) {
    return trainData.point[event]["power"] ?? 0;
}

// ----"powerData"に関する関数群----
// 引数に関してはJSON内のコメントを参照してください。
function getPower(fc, tier) {
    return powerData[fc][tier-1] ?? 0;
}
function getDeltaPower(fromFc, fromTier, toFc, toTier) {
    return getPower(toFc, toTier) - getPower(fromFc, fromTier);
}

// 終わり