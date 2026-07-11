document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.getElementById('tab_switch').querySelectorAll("a");
    const contents = document.getElementById('tab_body').querySelectorAll(".content");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const href = button.getAttribute("href");
            const target = href.substring(href.indexOf("#")+1, href.length);

            buttons.forEach(btn => btn.classList.remove("active"));
            contents.forEach(content => content.classList.remove("active"));

            button.classList.add('active');
            console.log(target);
            document.getElementById(target).classList.add('active');
        });
    });
    buttons[0].click();
});




  const kind = 3; //兵士の種類の数
  const format = new Intl.NumberFormat('ja-JP');
  const calculate = () => {
    // 盾/槍/弓が実数の時の実装
    const s = valueOf(count);
    // 総力 = 基礎総力 * 総力倍率
    const a = Array.from({ length: kind }, (_, x) => valueOf(power[x])*buff[x+1].calc(buff[0]));
    const k = a[0] + a[1] + a[2];
    /*const max = Math.sqrt(s)*Math.sqrt(k)/10;
      out[0].innerText = Math.ceil(max);
      for(let i = 0; i < 3; ++i) {
        const val = s*a[i]/k;
        out[i+1].innerText = val;
      }
    */
    // 最大値を計算(小数を含むので切り下げる)
    // 覚えとけ: max(x) = 総数* xの割合/全ての割合
    const c = Array.from({ length: kind }, (_, x) => Math.floor(s*a[x]/k));
    // 盾/槍/弓が整数の時の実装
    const delta = s - c.reduce((j, k) => j+k, 0);
    //デバッグ用
    console.log(`delta=${delta}`);
    console.log(`c=${c}, reduce=${c.reduce((j, k) => j+k, 0)}`);
    // 差分を埋める
    for(let i = 0; i < delta; ++i) {
      const dx = Math.sqrt(a[0])*(Math.sqrt(c[0]+1) - Math.sqrt(c[0]));
      const dy = Math.sqrt(a[1])*(Math.sqrt(c[1]+1) - Math.sqrt(c[1]));
      const dz = Math.sqrt(a[2])*(Math.sqrt(c[2]+1) - Math.sqrt(c[2]));
      if(dx >= dy && dx >= dz) {
        c[0] += 1;
      } else if(dy >= dz) {
        c[1] += 1;
      } else {
        c[2] += 1;
      }
    }
    // 最大値の計算 & 出力
    let max = 0;
    for(let i = 0; i < kind; ++i) {
      const val = Math.sqrt(a[i]*c[i]);
      max += val;
      out[i+1].innerText = format.format(c[i]);
    }
    out[0].innerText = format.format(Math.ceil(max/10));
    alert("計算したお^o^");
  }

  const valueOf = (element) => {
    return Number(element?.value ?? "");
  }

  const asLabel = (tagName, prefix, element, suffix) => {
    const label = document.createElement(tagName);
    label.appendChild(document.createTextNode(prefix));
    label.appendChild(element);
    label.appendChild(document.createTextNode(suffix));
    return label;
  } 

  class Buff {
    constructor(label) {
      this.node = document.createElement("DIV");
      this.atk = document.createElement("INPUT");
      this.leth = document.createElement("INPUT");
      this.def = document.createElement("INPUT");
      this.hp = document.createElement("INPUT");
      this.#init(label);
    }

    #init(label) {
      this.node.classList.add("align");
      this.atk.value=0;
      this.atk.setAttribute("type", "number");
      this.atk.setAttribute("min", 0);
      this.leth.value=0;
      this.leth.setAttribute("type", "number");
      this.leth.setAttribute("min", 0);
      this.def.value=0;
      this.def.setAttribute("type", "number");
      this.def.setAttribute("min", 0);
      this.hp.value=0;
      this.hp.setAttribute("type", "number");
      this.hp.setAttribute("min", 0);

      this.node.appendChild(asLabel("P", `${label}攻撃力: `, this.atk, "%"));
      this.node.appendChild(asLabel("P", `${label}防御力: `, this.def, "%"));
      this.node.appendChild(asLabel("P", `${label}殺傷力: `, this.leth, "%"));
      this.node.appendChild(asLabel("P", `${label}HP: `, this.hp, "%"));
    }

    // 総力倍率の計算
    calc(base) {
      const atk = valueOf(this.atk) + valueOf(base?.atk);
      const leth = valueOf(this.leth) + valueOf(base?.leth);
      const def = valueOf(this.def) + valueOf(base?.def);
      const hp = valueOf(this.hp) + valueOf(base?.hp);
      return (100 + atk + leth + def + hp)/100; // 1に各バフの値(少数)を足すだけ
    }

  }


  const ant = document.getElementById("ant");
  const count = document.getElementById("count");
  const out = Array.from({ length: 4 }, (_, x) => document.getElementById(`out_${x}`));
  const power = Array.from({ length: 3 }, (_, x) => document.getElementById(`power_${x}`));
  const buff = [new Buff("部隊"),new Buff("盾兵"),new Buff("槍兵"),new Buff("弓兵")];
  for(const e of buff) {
    document.getElementById("buffs").appendChild(e.node, ant);
  }
