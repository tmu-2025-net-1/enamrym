const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function addTypingMessage(text, align = 'left', speed = 100, callback) {
  // シンプルなタイプエフェクト関数の代替案
  const messageWrapper = document.createElement('div');
  messageWrapper.className = `message-wrapper ${align}`;
  const bubble = document.createElement('div');
  bubble.className = `bubble bubble-${align}`;
  messageWrapper.appendChild(bubble);
  chatContainer.appendChild(messageWrapper);

  let i = 0;
  function type() {
    if (i < text.length) {
      bubble.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      if (callback) callback();
    }
  }
  type();
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// データ取得
const selectedTypes = JSON.parse(localStorage.getItem('selectedTypes') || '[]');
const selectedTexts = JSON.parse(localStorage.getItem('selectedTexts') || '[]');
const perspective = localStorage.getItem('perspective') || 'her'; 

// カウント
const countMap = { "本音型": 0, "建前型": 0, "回避型": 0 };
convertedTypes.forEach(type => {
  if (countMap[type] !== undefined) countMap[type]++;
});

// 最終タイプ判定
let finalType = "";
if (countMap["本音型"] >= 2) finalType = "本音型";
else if (countMap["建前型"] >= 2) finalType = "建前型";
else if (countMap["回避型"] >= 2) finalType = "回避型";
else finalType = "バランス型";

// フィードバック定義
const feedbacks = {
  "本音型": {
    tameae: "これからもその素直さを大切にしていきましょう。",
    honne: "あなたの素直さは、誰かの優しい嘘をも破壊してしまうかもしれない。"
  },
  "建前型": {
    tameae: "その気づかいが関係を穏やかにしてくれますね。",
    honne: "いつまで本音を飲み込めば、あなたは自分を守れるの？"
  },
  "回避型": {
    tameae: "うまく距離感を保てるのはあなたの長所です。",
    honne: "逃げることで、何も失わずに済むと思ってる？"
  },
  "バランス型": {
    tameae: "状況に合わせて柔軟に振る舞えるあなたは素敵です。",
    honne: "器用すぎるあなたは、本当の気持ちにすら気づかなくなるかもしれない。"
  }
};

const tameae = feedbacks[finalType].tameae;
const honne = feedbacks[finalType].honne;

const honneMap = {
  "すぐ会いたいな〜（笑）": "ほんとはもうずっと我慢してた。声も顔も、今すぐ感じたいの。",
  "最近お互い忙しいし、落ち着いたらでいいよ": "ほんとは今すぐ会いたいけど、重いって思われたくなくて…",
  "また連絡もらえたら嬉しいな": "自分から求めたくない。期待して傷つくくらいなら、待つ方が楽…",
  "久しぶりに遊園地とか行きたいな": "手を繋いで笑って、写真撮って、そんな“恋人らしい日”が欲しいんだ。",
  "近場でゆっくりでもいいかも？": "ほんとは遠出もしたい。でも、君にとって面倒って思われたくないから…",
  "そっちに合わせるよ〜": "自分の希望を伝えるのが怖い。ワガママって思われたくない…",
  "せっかくだしお昼から会おう！": "朝から夜まで、一日中あなたと一緒にいたいの。",
  "無理しなくていいから、ゆっくり会おう": "本音は早く会いたいけど、あなたの都合が優先でしょ？",
  "うーん、その日はちょっとまだわからないかも": "会いたい気持ちより、断られるのが怖くて踏み込めない…"
};

//アニメーション関数
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
  function addGraphBubble(data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper left';
  
    const bubble = document.createElement('div');
    bubble.className = 'bubble bubble-left bubble-graph';
  
    const chart = document.createElement('div');
    chart.className = 'bar-chart';
  
    const types = ['本音型', '建前型', '回避型'];
  
    // data の最大値を取得（0除外のため最大値が0なら1に設定）
    const maxCount = Math.max(...types.map(type => data[type] || 0), 1);
  
    types.forEach(type => {
      const row = document.createElement('div');
      row.className = 'bar-row';
  
      const label = document.createElement('span');
      label.className = 'bar-label';
      label.textContent = type;
  
      const count = data[type] || 0;
      const countText = document.createElement('span');
      countText.className = `count-text ${
        type === '本音型' ? 'sunao' :
        type === '建前型' ? 'tatemae' : 'kaihi'
      }`;
      countText.textContent = `${count}回`;
      
      row.appendChild(label);
      row.appendChild(countText);
      chart.appendChild(row);
    });
  
    bubble.appendChild(chart);
    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

// DOMContentLoaded 処理本体
console.log('selectedTypes:', selectedTypes);
console.log('convertedTypes:', convertedTypes);
console.log('countMap:', countMap);
window.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName') || '彼女';

  addMessage('bot', 'いかがでしたか？', 'left');

  setTimeout(() => {
    addMessage('bot', `${userName}さんのタイプ診断をお伝えします。`, 'left');

    setTimeout(() => {
      const message = `${userName}さんのタイプは「${finalType}」でした。`;
      addTypingMessage(message, 'left', 100, () => {

        setTimeout(() => {
          addGraphBubble(countMap);

          setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble bubble-left animate-transition';
            const span = document.createElement('span');
            span.textContent = tameae;
            bubble.appendChild(span);

            const wrapper = document.createElement('div');
            wrapper.className = 'message-wrapper left';
            wrapper.appendChild(bubble);
            chatContainer.appendChild(wrapper);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            setTimeout(() => {
              let index = tameae.length;

              function deleteText() {
                if (index >= 0) {
                  span.textContent = tameae.slice(0, index);
                  index--;
                  setTimeout(deleteText, 100);
                } else {
                  typeHonne(0);
                }
              }

              function typeHonne(i) {
                if (i < honne.length) {
                  span.textContent += honne.charAt(i);
                  setTimeout(() => typeHonne(i + 1), 100);
                } else {
                  setTimeout(() => {
                    addMessage('bot', `次に${userName}さんが選択したチャットの本音を予想してみました。`, 'left');
                    setTimeout(() => {
                      animateHonneReveal(0);
                    }, 2000);
                  }, 1500);
                }
              }

              deleteText();
            }, 1500);
          }, 1500);
        }, 1500);
      });
    }, 1500);
  }, 1500);
});


function animateHonneReveal(index) {
  if (index >= selectedTexts.length || index >= 3) {
    setTimeout(() => {
      const userName = localStorage.getItem('userName') || '彼女';
      addMessage('bot', `最後に${userName}さんが伝えたかった言葉を入力してください。`, 'left');
      userInput.disabled = false;
      sendBtn.disabled = false;
    }, 1500);
    return;
  }

  const userText = selectedTexts[index];
  const trueText = honneMap[userText];
  const userType = convertedTypes[index];

  if (!trueText) {
    setTimeout(() => animateHonneReveal(index + 1), 1500);
    return;
  }

  // ① ラベル吹き出し（右）
  const labelWrapper = document.createElement('div');
  labelWrapper.className = 'message-wrapper right';

  const labelBubble = document.createElement('div');
  labelBubble.className = 'bubble bubble-right animate-transition';
  labelBubble.textContent = `${userType}回答`;

  labelWrapper.appendChild(labelBubble);
  chatContainer.appendChild(labelWrapper);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // ② 表の言葉吹き出し（右）
  setTimeout(() => {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper right';

    const bubble = document.createElement('div');
    bubble.className = 'bubble bubble-right animate-transition';

    bubble.textContent = userText;

    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // ③ 左に本音表示
    setTimeout(() => {
      const leftWrapper = document.createElement('div');
      leftWrapper.className = 'message-wrapper left';

      const leftBubble = document.createElement('div');
      leftBubble.className = 'bubble bubble-left animate-transition';

      let i = 0;
      function type() {
        if (i < trueText.length) {
          leftBubble.textContent += trueText.charAt(i);
          i++;
          setTimeout(type, 100);
        } else {
          setTimeout(() => animateHonneReveal(index + 1), 1500);
        }
      }

      leftWrapper.appendChild(leftBubble);
      chatContainer.appendChild(leftWrapper);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      type();

    }, 2000); // 表→本音の間隔
  }, 1500); // ラベル→表の間隔
}

// ✅ 入力送信後の処理 + 選択肢表示
sendBtn.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (message !== "") {
    userInput.disabled = true;
    sendBtn.disabled = true;

    const bubble = document.createElement('div');
    bubble.className = 'bubble bubble-right fade-float';
    bubble.textContent = message;

    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper right';
    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    localStorage.setItem('finalMessage', message);
    userInput.value = "";

    setTimeout(() => {
      const choiceWrapper = document.createElement('div');
      choiceWrapper.className = 'bubble bubble-left choice-bubble';

      const question = document.createElement('div');
      question.className = 'choice-question';
      question.textContent = 'どこに進みますか？';
      choiceWrapper.appendChild(question);

      const options = ['彼氏視点に進む', 'トップページに戻る', 'もう一度彼女視点をやり直す'];

      options.forEach(choice => {
        const option = document.createElement('div');
        option.className = 'choice-option';
        option.textContent = choice;

        option.addEventListener('click', () => {
          if (choice === '彼氏視点に進む') {
            window.location.href = 'boy_main.html';
          } else if (choice === 'トップページに戻る') {
            window.location.href = 'index.html';
          } else if (choice === 'もう一度彼女視点をやり直す') {
            window.location.href = 'girl_main.html';
          }
        });

        choiceWrapper.appendChild(option);
      });

      const choiceWrapperOuter = document.createElement('div');
      choiceWrapperOuter.className = 'message-wrapper left';
      choiceWrapperOuter.appendChild(choiceWrapper);
      chatContainer.appendChild(choiceWrapperOuter);
      chatContainer.scrollTop = chatContainer.scrollHeight;

    }, 5000);
  }
});