const chatContainer = document.getElementById('chat-container');
const choicesContainer = document.getElementById('choices-container');

const myName = localStorage.getItem('userName') || '俺';
const partnerName = localStorage.getItem('partnerName') || '彼女';

// === 選択記録用 ===
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
          typeEffect(frontText, text, 50, () => {
            if (callback) callback();
          });
        });
      }, 1000);
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

function typeEffect(element, text, speed = 100, callback) {
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

  options.forEach((option, index) => {
    const div = document.createElement('div');
    div.className = 'choice';
    div.textContent = option.label;

    div.addEventListener('click', () => {
      const allChoices = document.querySelectorAll('.choice');
      allChoices.forEach(btn => btn.style.pointerEvents = 'none');

      choicesContainer.classList.add('hidden');
      addMessage(myName, option.label, 'right');

      // === 選択記録 ===
      selectedTexts.push(option.label);
      const type = index === 0 ? "建前型" : index === 1 ? "本音型" : "回避型";
      selectedTypes.push(type);

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

// --- 会話のスタート ---
setTimeout(() => {
  addMessage(myName, '来月、会える日ある？', 'right');

  setTimeout(() => {
    addMessage(partnerName, 'もちろん！', 'left');

    setTimeout(() => {
      showChoices([
        {
          label: '〇日なら空いてるけどどう？',
          response: '私もその日なら空いてるよ！',
          truth: '向こうも会いたがってくれてるのかも！',
          action: () => askWhereToGo()
        },
        {
          label: 'じゃあ月末とかで合わせようか',
          response: 'うんっ、楽しみにしてるね！',
          truth: '本当はもっと早く会いたいけど…',
          action: () => askWhereToGo()
        },
        {
          label: 'とりあえず空いてる日わかったら連絡するわ',
          response: 'わかった！待ってるね！',
          truth: 'それってあんまり会いたくないってこと…？',
          action: () => askWhereToGo()
        }
      ]);
    }, 1000);
  }, 1000);
}, 1000);

function askWhereToGo() {
  setTimeout(() => {
    addMessage(myName, 'どこ行く？', 'right');

    setTimeout(() => {
      addMessage(partnerName, 'うーん、どこでも嬉しいな〜♡', 'left');

      setTimeout(() => {
        showChoices([
          {
            label: '映画とかカフェとか？',
            response: 'それ最高！一日一緒にいたいな〜',
            truth: 'デートらしいデート…できるの嬉しい…！',
            action: () => askTimeToMeet()
          },
          {
            label: '家でまったりでもいいけど',
            response: 'うん…それでも嬉しいよ',
            truth: 'ほんとは外にも出たいけど、嫌われたくないし…',
            action: () => askTimeToMeet()
          },
          {
            label: '俺はどこでもいいから、君が行きたいとこでいいよ',
            response: 'うん！じゃあ、どこか行きたいところ考えておくね',
            truth: 'やっぱり…私だけが好きなのかな…',
            action: () => askTimeToMeet()
          }
        ]);
      }, 1000);
    }, 1000);
  }, 1000);
}

function askTimeToMeet() {
  setTimeout(() => {
    addMessage(partnerName, '何時からがいいかな？', 'left');

    setTimeout(() => {
      showChoices([
        {
          label: '昼から合流しよっか',
          response: 'うん！朝から準備して待ってるね',
          truth: '長い時間一緒にいれて嬉しい！',
          action: () => {
            localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes));
            localStorage.setItem('selectedTexts', JSON.stringify(selectedTexts));
            window.location.href = 'result.html';
          }
        },
        {
          label: '夕方からでもいい？',
          response: 'もちろん！会えるだけで嬉しいよ',
          truth: 'ほんとはもっと一緒にいたいけど…',
          action: () => {
            localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes));
            localStorage.setItem('selectedTexts', JSON.stringify(selectedTexts));
            window.location.href = 'result.html';
          }
        },
        {
          label: '直前でまた決めよう',
          response: 'オッケー！なんでも合わせるよっ',
          truth: '約束忘れられたらどうしよう…',
          action: () => {
            localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes));
            localStorage.setItem('selectedTexts', JSON.stringify(selectedTexts));
            window.location.href = 'result.html';
          }
        }
      ]);
    }, 1000);
  }, 1000);
}
// 彼氏視点のとき
localStorage.setItem('perspective', 'his');