const chatContainer = document.getElementById('chat-container');
const choicesContainer = document.getElementById('choices-container');

const myName = localStorage.getItem('userName') || '私';
const partnerName = localStorage.getItem('partnerName') || '彼氏';

// === 追加：選択記録用 ===
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
    
      // === 記録処理は action の中に統一する！ ===
    
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

// --- 会話の流れ開始 ---
setTimeout(() => {
  addMessage(myName, 'ねー、来月いつ空いてる？', 'right');

  setTimeout(() => {
    addMessage(partnerName, 'んー、最近ちょっと忙しくて。月末とかになるかも', 'left');

    setTimeout(() => {
      showChoices([
        {
          label: 'すぐ会いたいな〜（笑）',
          response: '今月の末なら時間作れるかも',
          truth: 'うわ…来たよ会いたい圧',
          type: "本音型",
          action: () => {
            selectedTypes.push("本音型");
            selectedTexts.push("すぐ会いたいな〜（笑）");
            askWhereToGo();
          }
        },
        {
          label: 'また連絡もらえたら嬉しいな',
          response: 'おっけ、また連絡するわ',
          truth: 'これは自然消滅チャンスかも',
          type: "回避型",
          action: () => {
            selectedTypes.push("回避型");
            selectedTexts.push("また連絡もらえたら嬉しいな");
            askWhereToGo();
          }
        },
        {
          label: '最近お互い忙しいし、落ち着いたらでいいよ',
          response: 'じゃあ月末にでも',
          truth: '助かる、何も考えなくていいわ',
          type: "建前型",
          action: () => {
            selectedTypes.push("建前型");
            selectedTexts.push("最近お互い忙しいし、落ち着いたらでいいよ");
            askWhereToGo();
          }
        },
      ]);
    }, 1500);
  }, 1500);
}, 1000);

function askWhereToGo() {
  setTimeout(() => {
    addMessage(myName, 'ちなみにどこ行きたいとかある？', 'right');

    setTimeout(() => {
      addMessage(partnerName, 'どうしよっか', 'left');

      setTimeout(() => {
        showChoices([
          {
            label: '近場でゆっくりでもいいかも？',
            response: '近場、いいかもね',
            truth: 'ラッキー、楽できそう',
            type: "建前型",
            action: () => {
              selectedTypes.push("建前型");
              selectedTexts.push("近場でゆっくりでもいいかも？");
              askTimeToMeet()
            }
          },
          {
            label: 'そっちに合わせるよ〜',
            response: 'じゃあ家とか？',
            truth: '金使わなくていいならアツい',
            type: "回避型",
            action: () => {
              selectedTypes.push("回避型");
              selectedTexts.push("そっちに合わせるよ〜");
              askTimeToMeet()
            }
          },
          {
            label: '久しぶりに遊園地とか行きたいな',
            response: 'あーごめん、そこ前に行ったことあるわ',
            truth: '高そうだし、絶対ムリ。勘弁してくれ',
            type: "本音型",
            action: () => {
              selectedTypes.push("本音型");
              selectedTexts.push("久しぶりに遊園地とか行きたいな");
              askTimeToMeet()
            }
          },
        ]);
      }, 1500);
    }, 1500);
  }, 1500);
}

function askTimeToMeet() {
  setTimeout(() => {
    addMessage(partnerName, '何時から会う？', 'left');

    setTimeout(() => {
      showChoices([
        {
          label: 'うーん、その日はちょっとまだわからないかも',
          response: 'じゃあLINEで決めよっか',
          truth: '無くなったらラッキー、会わなくて済むし',
          type: "回避型",
            action: () => {
              selectedTypes.push("回避型");
              selectedTexts.push("うーん、その日はちょっとまだわからないかも");
            localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes));
            localStorage.setItem('selectedTexts', JSON.stringify(selectedTexts));

            setTimeout(() => {
              localStorage.setItem('perspective', 'her');
              window.location.href = 'girl_result.html';
            }, 2000);
          }
        },
        {
          label: 'せっかくだしお昼から会おう！',
          response: 'いいね、そうしよっか',
          truth: 'マジかー早起きすんのだるいな、',
          type: "本音型",
          action: () => {
            selectedTypes.push("本音型");
              selectedTexts.push("せっかくだしお昼から会おう！");
            localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes));
            localStorage.setItem('selectedTexts', JSON.stringify(selectedTexts));

            setTimeout(() => {
              localStorage.setItem('perspective', 'her');
              window.location.href = 'girl_result.html';
            }, 2000);
          }
        },
        {
          label: '無理しなくていいから、ゆっくり会おう',
          response: 'ありがと、夕方くらいからにしよっか',
          truth: '助かるー昼まで寝てられんじゃん',
          type: "建前型",
          action: () => {
            selectedTypes.push("建前型");
              selectedTexts.push("無理しなくていいから、ゆっくり会おう");
            localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes));
            localStorage.setItem('selectedTexts', JSON.stringify(selectedTexts));

            setTimeout(() => {
              localStorage.setItem('perspective', 'her');
              window.location.href = 'girl_result.html';
            }, 2000);
          }
        }
      ]);
    }, 1500);
  }, 1500);
}
// 彼女視点のとき
localStorage.setItem('perspective', 'her');