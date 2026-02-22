const step = 20;
//Thanks for Tokumei!
const costs = [20,50,100,130,160];
const getCostAt = (times) => costs[Math.floor((times-1)/step)] ?? 0;
//[maximumReward, expectedRewards, MinimumRewards]
const rewards = [ [3,3,6,9,12], [1.45,2.15,3.18,3.435,3.71], [1,2,3,3,3] ]; //期待値ga醜い

function compute() {
    const value = Number(input.value);
    let cost = 0;
    let reward = [0,0,0]; //[max,exp,min]
    // 精錬回数が0以下の時は計算しなくてええねん
    if(value <= 0) {
        tip.innerText = "";
    } else {
        // 固定5回ループ('26/02/22現在)
        for(let i = 0; i < costs.length; ++i) { 
            times = clamp(0, value - step*i, step);
            cost += costs[i] * times;
            for(let j = 0; j < 3; ++j) {
                reward[j] += rewards[j][i] * times;
            }
        }
        // 初めの1回はいくら足掻こうが値引きになります
        cost -= (costs[0] >> 1)*clamp(0,value,1);
        tip.innerText = "1";
        // 1~7回目の値引き
        const great = clamp(0, value-1, 6);
        for(let k = 0; k < great; ++k) {
            cost -= getCostAt(value-k) / 2;
            tip.innerText += `,${(value-great)+(k+1)}`;
        }
    }
    //Outputs
    document.getElementById("cost").innerText = cost;
    for(let l = 0; l < 3; ++l) {
        document.getElementById(`rew_${l}`).innerText = parseFloat(reward[l].toFixed(2));
        document.getElementById(`rfcpfc_${l}`).innerText = parseFloat((cost/reward[l]).toFixed(2));
    }
}

const input = document.getElementById("seiren");
input.addEventListener("change", compute);

const tip = document.getElementById("great");

function clamp(min, val, max) {
    if(min > max) return clamp(max, val, min);
    return val < min ? min : (val > max ? max : val);
}
