const chatContainer = document.getElementById('chat-container');
const choicesContainer = document.getElementById('choices-container');

const myName = localStorage.getItem('userName') || '俺';
const partnerName = localStorage.getItem('partnerName') || '彼女';

let selectedTypes = [];
let selectedTexts = [];

function animateTextLines(element, text1, text2, show = true, callback = null) {
  element.innerHTML = '<div class="line1"></div><div class="line2"></div>';
  const line1 = element.querySelector(".line1");
  const line2 = element.querySelector(".line2");

  const chars1 = text1.split("");
  const chars2 = text2.split("");

  if (show) {
    let index = 0;
    function typeLine1() {
      if (index < chars1.length) {
        line1.textContent += chars1[index++];
        setTimeout(typeLine1, 100);
      } else {
        index = 0;
        typeLine2();
      }
    }
    function typeLine2() {
      if (index < chars2.length) {
        line2.textContent += chars2[index++];
        setTimeout(typeLine2, 100);
      } else if (callback) {
        callback();
      }
    }
    typeLine1();
  } else {
    let index1 = chars2.length;
    function deleteLine2() {
      if (index1 >= 0) {
        line2.textContent = chars2.slice(0, index1).join("");
        index1--;
        setTimeout(deleteLine2, 60);
      } else {
        let index2 = chars1.length;
        function deleteLine1() {
          if (index2 >= 0) {
            line1.textContent = chars1.slice(0, index2).join("");
            index2--;
            setTimeout(deleteLine1, 60);
          } else if (callback) {
            callback();
          }
        }
        deleteLine1();
      }
    }
    deleteLine2();
  }
}

function addMessage(name, text, align = 'left', truth = '', callback = null) {
  const messageWrapper = document.createElement('div');
  messageWrapper.className = `message-wrapper ${align}`;

  const nameTag = document.createElement('div');
  nameTag.className = 'name-label';
  nameTag.textContent = name;

  const bubble = document.createElement('div');
  bubble.className = `bubble bubble-${align}`;

  if (truth && align === 'left') {
    const frontText = document.createElement('span');
    frontText.className = 'tameae';

    const backText = document.createElement('span');
    backText.className = 'honne';

    bubble.appendChild(frontText);
    bubble.appendChild(backText);

    const lines = truth.split(/\n|<br\s*\/>/);
    const line1 = lines[0] || '';
    const line2 = lines[1] || '';

    animateTextLines(backText, line1, line2, true, () => {
      setTimeout(() => {
        animateTextLines(backText, line1, line2, false, () => {
          typeEffect(frontText, text, 100, () => {
            if (callback) callback();
          });
        });
      }, 1500);
    });
  } else {
    bubble.textContent = text;
    if (callback) {
      setTimeout(callback, 0);
    }
  }

  messageWrapper.appendChild(nameTag);
  messageWrapper.appendChild(bubble);
  chatContainer.appendChild(messageWrapper);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function typeEffect(element, text, speed = 150, callback) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

function showChoices(options) {
  choicesContainer.innerHTML = '';
  choicesContainer.classList.remove('hidden');

  options.forEach(option => {
    const div = document.createElement('div');
    div.className = 'choice';
    div.textContent = option.label;

    div.addEventListener('click', () => {
      const allChoices = document.querySelectorAll('.choice');
      allChoices.forEach(btn => btn.style.pointerEvents = 'none');
    
      choicesContainer.classList.add('hidden');
      addMessage(myName, option.label, 'right');
    
      if (option.response) {
        setTimeout(() => {
          addMessage(partnerName, option.response, 'left', option.truth || '', () => {
            if (option.action) {
              option.action();
            }
          });
        }, 1000);
      } else if (option.action) {
        setTimeout(() => {
          option.action();
        }, 800);
      }
    });

    choicesContainer.appendChild(div);
  });
}

setTimeout(() => {
  addMessage(myName, '来月、会える日ある？', 'right');

  setTimeout(() => {
    addMessage(partnerName, 'もちろん！', 'left');

    setTimeout(() => {
      showChoices([
        {
          label: 'じゃあ月末とかで合わせようか',
          response: 'うんっ、楽しみにしてるね！',
          truth: '本当はもっと早く会いたいけど…',
          type: "建前型",
          action: () => {
            selectedTypes.push("建前型");
            selectedTexts.push("じゃあ月末とかで合わせようか");
            askWhereToGo()
          }
        },
        {
          label: 'とりあえず空いてる日わかったら連絡するわ',
          response: 'わかった！待ってるね！',
          truth: 'それってあんまり会いたくないってこと…？',
          type: "回避型",
          action: () => {
            selectedTypes.push("回避型");
            selectedTexts.push("とりあえず空いてる日わかったら連絡するわ");
            askWhereToGo()
          }
        },
        {
          label: '〇日なら空いてるけどどう？',
          response: '私もその日なら空いてるよ！',
          truth: '向こうも会いたがってくれてるのかも！',
          type: "本音型",
          action: () => {
            selectedTypes.push("本音型");
            selectedTexts.push("〇日なら空いてるけどどう？");
            askWhereToGo();
          }
        }
      ]);
    }, 1500);
  }, 1500);
}, 1500);

function askWhereToGo() {
  setTimeout(() => {
    addMessage(myName, 'どこ行く？', 'right');

    setTimeout(() => {
      addMessage(partnerName, 'うーん、どこでも嬉しいな〜♡', 'left');

      setTimeout(() => {
        showChoices([
          {
            label: '家でまったりでもいいけど',
            response: 'うん…それでも嬉しいよ',
            truth: 'ほんとは外にも出たいけど、嫌われたくないし…',
            type: "建前型",
            action: () => {
              selectedTypes.push("建前型");
              selectedTexts.push("家でまったりでもいいけど");
              askTimeToMeet()
            }
          },
          {
            label: '映画とかカフェとか？',
            response: 'それ最高！一日一緒にいたいな〜',
            truth: 'デートらしいデート…できるの嬉しい…！',
            type: "本音型",
            action: () => {
              selectedTypes.push("本音型");
              selectedTexts.push("映画とかカフェとか？");
              askTimeToMeet();
            }
          },
          {
            label: '俺はどこでもいいから、君が行きたいとこでいいよ',
            response: 'うん！じゃあ、どこか行きたいところ考えておくね',
            truth: 'やっぱり…私だけが好きなのかな…',
            type: "回避型",
            action: () => {
              selectedTypes.push("回避型");
              selectedTexts.push("俺はどこでもいいから、君が行きたいとこでいいよ");
              askTimeToMeet()
            }
          }
        ]);
      }, 1500);
    }, 1500);
  }, 1500);
}

function askTimeToMeet() {
  setTimeout(() => {
    addMessage(partnerName, '何時からがいいかな？', 'left');

    setTimeout(() => {
      showChoices([
        {
          label: '直前でまた決めよう',
          response: 'オッケー！なんでも合わせるよっ',
          truth: '約束忘れられたらどうしよう…',
          type: "回避型",
          action: () => {
            selectedTypes.push("回避型");
            selectedTexts.push("直前でまた決めよう");
            saveAndRedirect();
          }
        },
        {
          label: '夕方からでもいい？',
          response: 'もちろん！会えるだけで嬉しいよ',
          truth: 'ほんとはもっと一緒にいたいけど…',
          type: "建前型",
          action: () => {
            selectedTypes.push("建前型");
            selectedTexts.push("夕方からでもいい？");
            saveAndRedirect();
          }
        },
        {
          label: '昼から合流しよっか',
          response: 'うん！朝から準備して待ってるね',
          truth: '長い時間一緒にいれて嬉しい！',
          type: "本音型",
          action: () => {
            selectedTypes.push("本音型");
            selectedTexts.push("昼から合流しよっか");
            saveAndRedirect();
          }
        }
      ]);
    }, 1500);
  }, 1500);
}

function saveAndRedirect() {
  const honneMap = {
    "じゃあ月末とかで合わせようか": "本当はもっと早く会いたいけど…",
    "とりあえず空いてる日わかったら連絡するわ": "それってあんまり会いたくないってこと…？",
    "〇日なら空いてるけどどう？": "向こうも会いたがってくれてるのかも！",
    "家でまったりでもいいけど": "ほんとは外にも出たいけど、嫌われたくないし…",
    "映画とかカフェとか？": "デートらしいデート…できるの嬉しい…！",
    "俺はどこでもいいから、君が行きたいとこでいいよ": "やっぱり…私だけが好きなのかな…",
    "直前でまた決めよう": "約束忘れられたらどうしよう…",
    "夕方からでもいい？": "ほんとはもっと一緒にいたいけど…",
    "昼から合流しよっか": "長い時間一緒にいれて嬉しい！"
  };

  const convertedTypes = selectedTypes.map(type => {
    if (type === "本音型") return "本音型";
    if (type === "建前型") return "建前型";
    if (type === "回避型") return "回避型";
    return type;
  });

  localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes));
  localStorage.setItem('selectedTexts', JSON.stringify(selectedTexts));
  localStorage.setItem('convertedTypes', JSON.stringify(convertedTypes));
  localStorage.setItem('honneMap', JSON.stringify(honneMap));
  localStorage.setItem('perspective', 'his');

  setTimeout(() => {
    window.location.href = 'boy_result.html';
  }, 2000);
}