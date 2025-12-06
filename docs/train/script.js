// HTMLの要素たち。とても多いです。
// コンフィグ
const point = document.getElementById("event"); // イベントタイプ (input)
const cap = document.getElementById("cap"); // 訓練容量 (input)
const buff = document.getElementById("buff"); // 訓練速度(%) (input)
// 訓練関係
const tLevel = document.getElementById("levelTrain"); // 兵舎レベル (input)
const tTier = document.getElementById("trainTier"); // 訓練ティア (input)
const tNum = document.getElementById("trainNum"); // 訓練人数 (input)
const tCap = document.getElementById("trainCap"); // 訓練容量 (output)
const tTap = document.getElementById("trainTap"); // 必要訓練回数 (output)
const tTime = document.getElementById("trainTime"); // 訓練時間 (output)
const tPowerup = document.getElementById("trainPowerup"); // 訓練での上昇総力 (output)
const tPoint = document.getElementById("trainPoint"); // 訓練ポイント (output)
const tSpeedup = document.getElementById("trainSpeedup"); // 訓練加速ポイント (output)
const tPower = document.getElementById("trainPower"); // 訓練総力ポイント (output)
const tSoldier = document.getElementById("trainSoldier"); // 訓練兵種 (input)
const tMeat = document.getElementById("trainMeat");// 訓練に必要な生肉 (output)
const tWood = document.getElementById("trainWood");// 訓練に必要な木材 (output)
const tCoal = document.getElementById("trainCoal");// 訓練に必要な石炭 (output)
const tIron = document.getElementById("trainIron");// 訓練に必要な鉄鉱 (output)
// 昇格関係
const pLevel = document.getElementById("levelPromote"); // 兵舎レベル (input)
const pTierFrom = document.getElementById("tierFrom"); // 昇格元ティア (input)
const pTierTo = document.getElementById("tierTo"); // 昇格先ティア (input)
const pNum = document.getElementById("promoteNum"); // 昇格人数 (input)
const pCap = document.getElementById("promoteCap"); // 昇格容量 (output)
const pTap = document.getElementById("promoteTap"); // 昇格回数 (output)
const pTime = document.getElementById("promoteTime"); // 昇格時間 (output)
const pPowerup = document.getElementById("promotePowerup"); // 昇格での上昇総力 (output)
const pPoint = document.getElementById("promotePoint"); // 昇格ポイント (output)
const pSpeedup = document.getElementById("promoteSpeedup"); // 昇格加速ポイント (output)
const pPower = document.getElementById("promotePower"); // 昇格総力ポイント (output)
const pSoldier = document.getElementById("promoteSoldier"); // 昇格兵種 (input)
const pMeat = document.getElementById("promoteMeat");// 昇格に必要な生肉 (output)
const pWood = document.getElementById("promoteWood");// 昇格に必要な木材 (output)
const pCoal = document.getElementById("promoteCoal");// 昇格に必要な石炭 (output)
const pIron = document.getElementById("promoteIron");// 昇格に必要な鉄鉱 (output)

// ユーティリティ
function getCapability() {
    return Number(cap.value ?? 0);
}
// It's so funny that
// PromoteCapability = time(to)/{time(to)-time(from)}*trainCapability
function getPromoteCapability(fromTier, toTier) {
    const baseCap = getCapability();
    const amp = getTrainTime(toTier) / getPromoteTime(fromTier, toTier);
    return Math.ceil(baseCap * amp);
}
function getTrainBuff() {
    return 1 + (Number(buff.value ?? 0) / 100);
}
const formatter = new Intl.NumberFormat('ja-JP');
function format(num) {
    return formatter.format(num);
}
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${format(hrs*60 + mins)}分 ${secs}秒 (${hrs}時間 ${mins}分 ${secs}秒)`;
}

function calculate() {
    // 共通定数
    const capability = getCapability();
    const trainBuff = getTrainBuff();
    const eventType = point.value;

    // 訓練
    const trainFc = Number(tLevel.value);
    const tier = Number(tTier.value);
    const train = Number(tNum.value);
    const trainTime = Math.floor(getTrainTime(tier) / trainBuff * train);
    tCap.innerText = format(capability);
    tTap.innerText = format(Math.ceil(train / capability));
    tTime.innerText = formatTime(trainTime);
    tPowerup.innerText = format(getPower(trainFc, tier) * train);
    tPoint.innerText = format(getTrainPoint(eventType, tier) * train);
    tSpeedup.innerText = format(getSpeedupPoint(eventType) * Math.ceil(trainTime/60));
    tPower.innerText = format(getPowerPoint(eventType) * getPower(trainFc, tier) * train);
    calcResources("train");

    // 昇格
    const promoteFc = Number(pLevel.value);
    const fromTier = Number(pTierFrom.value);
    const toTier = Number(pTierTo.value);
    const promote = Number(pNum.value);
    const promoteCap = getPromoteCapability(fromTier, toTier);
    const promoteTime = Math.floor(getPromoteTime(fromTier, toTier) / trainBuff * promote);
    pCap.innerText = format(promoteCap);
    pTap.innerText = format(Math.ceil(promote / promoteCap));
    pTime.innerText = formatTime(promoteTime);
    pPowerup.innerText = format(getDeltaPower(promoteFc, fromTier, promoteFc, toTier) * promote);
    pPoint.innerText = format(getPromotePoint(eventType, fromTier, toTier) * promote);
    pSpeedup.innerText = format(getSpeedupPoint(eventType) * Math.ceil(promoteTime/60));
    pPower.innerText = format(getPowerPoint(eventType) * getDeltaPower(promoteFc, fromTier, promoteFc, toTier) * promote);
    calcResources("promote");
}

function calcResources(type) {
    // 訓練
    switch (type) {
        case "train": {
            const trainSoldier = tSoldier.value;
            const tier = Number(tTier.value);
            const train = Number(tNum.value);
            tMeat.innerText = format(getReqMeats(trainSoldier, tier) * train);
            tWood.innerText = format(getReqWoods(trainSoldier, tier) * train);
            tCoal.innerText = format(getReqCoals(trainSoldier, tier) * train);
            tIron.innerText = format(getReqIrons(trainSoldier, tier) * train);
        }
        break;
        case "promote":{
            const promoteSoldier = pSoldier.value;
            const fromTier = Number(pTierFrom.value);
            const toTier = Number(pTierTo.value);
            const promote = Number(pNum.value);
            pMeat.innerText = format(getPromoteMeats(promoteSoldier, fromTier, toTier) * promote);
            pWood.innerText = format(getPromoteWoods(promoteSoldier, fromTier, toTier) * promote);
            pCoal.innerText = format(getPromoteCoals(promoteSoldier, fromTier, toTier) * promote);
            pIron.innerText = format(getPromoteIrons(promoteSoldier, fromTier, toTier) * promote);
        }
        break;
        default:
            break;
    }
}

// データストレージ (inputのみ保存)
function loadInputs(e) {
    const savedData = localStorage.getItem("pipi_Wos_Calc_TrainInputs");
    if (savedData) {
        const inputs = JSON.parse(savedData);
        // コンフィグ
        point.selectedIndex = inputs.config.event ?? 0;
        cap.value = inputs.config.cap ?? 0;
        buff.value = inputs.config.buff ?? 0;
        // 訓練
        tLevel.selectedIndex = inputs.train.level ?? 0;
        tTier.value = inputs.train.tier ?? "";
        tNum.value = inputs.train.num ?? "";
        // 昇格
        pLevel.selectedIndex = inputs.promote.level ?? 0;
        pTierFrom.value = inputs.promote.from ?? "";
        pTierTo.value = inputs.promote.to ?? "";
        pNum.value = inputs.promote.num ?? "";
    }
}

function saveInputs(e) {
    const inputs = {
        config: {
            event: point.selectedIndex,
            cap: cap.value,
            buff: buff.value,
        },
        train: {
            level: tLevel.value,
            tier: tTier.value,
            num: tNum.value,
        },
        promote: {
            level: pLevel.value,
            from: pTierFrom.value,
            to: pTierTo.value,
            num: pNum.value,
        },
    };
    localStorage.setItem("pipi_Wos_Calc_TrainInputs", JSON.stringify(inputs));
}

window.addEventListener("DOMContentLoaded", loadInputs);

// ----AI Generated----

// beforeunload が全ての環境で発火するとは限らないため、
// ヒューリスティックに判定してから適切なイベントを登録する。
function isBeforeUnloadReliable() {
    const ua = navigator.userAgent || "";
    const isIOS = /iP(hone|od|ad)/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isMobile = /Mobi|Android|iP(hone|od)/.test(ua);
    // WebView を示すトークンの簡易検出
    const isWebView = /; wv\)|Android.*WebView|Version\/.*Safari/.test(ua) && !/Chrome\//.test(ua);

    // iOS の Safari / WebView は beforeunload が信頼できないことが多い
    if (isIOS) return false;
    // Android の WebView も beforeunload を呼ばない/不安定な場合がある
    if (isAndroid && isWebView) return false;
    // モバイル全般はブラウザやOSの挙動差が大きいため、デスクトップ以外は保守的に false とする
    if (isMobile) return false;

    // それ以外（主にデスクトップ）は beforeunload を使う想定で true を返す
    return true;
}

function registerUnloadSave() {
    if (isBeforeUnloadReliable()) {
        window.addEventListener("beforeunload", saveInputs);
    } else {
        // beforeunload が期待どおり発火しない端末向けのフォールバック
        // `pagehide` はモバイルや PWA で使えることが多く、visibilitychange の hidden も補助として利用する
        window.addEventListener("pagehide", saveInputs);
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "hidden") saveInputs();
        });
    }
}

registerUnloadSave();
