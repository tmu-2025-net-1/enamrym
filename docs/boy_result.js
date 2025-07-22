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
const perspective = localStorage.getItem('perspective') || 'his'; 

// 型の逆変換処理（彼氏視点なら、本音型↔建前型）
const convertedTypes = selectedTypes.map(type => {
  if (perspective === 'his') {
    if (type === "本音型") return "建前型";
    if (type === "建前型") return "本音型";
  }
  return type;
});

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
    tameae: "気持ちをストレートに伝えられるのは大きな魅力です。",
    honne: "その正直さ、相手を黙らせる武器になってない？"
  },
  "建前型": {
    tameae: "そのやさしさがきっと相手を安心させています。",
    honne: "やさしさという名の仮面、外せなくなってない？"
  },
  "回避型": {
    tameae: "無理をしないスタンスはあなたらしさです。",
    honne: "関わらなければ傷つかない。それで本当にいいの？"
  },
  "バランス型": {
    tameae: "場に応じた判断ができる柔軟さがあなたの強みです。",
    honne: "全部わかってる風の顔、本当は何も言えてないだけかもよ？"
  }
};

const tameae = feedbacks[finalType].tameae;
const honne = feedbacks[finalType].honne;

const honneMap = {
  "〇日なら空いてるけどどう？": "本当はその日も疲れてて会いたくないけど…断るのも気まずいから空いてるふりしてる。",
  "じゃあ月末とかで合わせようか": "できるだけ先延ばしにしたい。正直もう気持ちは冷めてるし、会う意味もない。",
  "とりあえず空いてる日わかったら連絡するわ": "会う気はないけど、断るのも面倒。自然消滅狙いでフェードアウトしよう。",
  "映画とかカフェとか？": "“デートっぽいこと”してればごまかせるかな。でも気持ちは全然乗ってない。",
  "家でまったりでもいいけど": "外出るのも面倒。なんなら会わずに済めば最高。家デートなら寝てるだけで済む。",
  "俺はどこでもいいから、君が行きたいとこでいいよ": "何も決めたくないし、責任も持ちたくない。どうでもいいと思ってる。",
  "昼から合流しよっか": "どうせなら一日付き合って“彼氏っぽいこと”して、うまくやり過ごすか。",
  "夕方からでもいい？": "最低限の時間で済ませたい。少しでも会う時間が短くなれば気が楽。",
  "直前でまた決めよう": "多分ドタキャンすると思う。ギリギリまで様子見て、うまく逃げたい。"
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
  
    types.forEach(type => {
      const row = document.createElement('div');
      row.className = 'bar-row';
  
      const label = document.createElement('span');
      label.className = 'bar-label';
      label.textContent = type;
  
      const count = data[type] || 0;
const countText = document.createElement('span');
countText.className = `count-text ${
  type === '本音型' ? 'honne' :
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
window.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName') || '彼氏';

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

                    function animateHonneReveal(index) {
                      if (index >= selectedTexts.length || index >= 3) {
                        setTimeout(() => {
                          addMessage('bot', `最後に${userName}さんが伝えたかった言葉を入力してください。`, 'left');
                          userInput.disabled = false;
                          sendBtn.disabled = false;
                        }, 1500);
                        return;
                      }

                      const userText = selectedTexts[index];
                      const trueText = honneMap[userText];

                      if (!trueText) {
                        setTimeout(() => animateHonneReveal(index + 1), 1500);
                        return;
                      }

                      const bubble = document.createElement('div');
                      bubble.className = 'bubble bubble-right animate-transition';
                      const span = document.createElement('span');
                      span.textContent = userText;
                      bubble.appendChild(span);

                      const wrapper = document.createElement('div');
                      wrapper.className = 'message-wrapper right';
                      wrapper.appendChild(bubble);
                      chatContainer.appendChild(wrapper);
                      chatContainer.scrollTop = chatContainer.scrollHeight;

                      setTimeout(() => {
                        let deleteIndex = userText.length;

                        function deleteText() {
                          if (deleteIndex >= 0) {
                            span.textContent = userText.slice(0, deleteIndex);
                            deleteIndex--;
                            setTimeout(deleteText, 100);
                          } else {
                            typeHonne(0);
                          }
                        }

                        function typeHonne(i) {
                          if (i < trueText.length) {
                            span.textContent += trueText.charAt(i);
                            setTimeout(() => typeHonne(i + 1), 100);
                          } else {
                            setTimeout(() => animateHonneReveal(index + 1), 1500);
                          }
                        }

                        deleteText();
                      }, 1500);
                    }

                    setTimeout(() => {
                      animateHonneReveal(0);
                    }, 1500);

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

      const options = ['彼女視点に進む', 'トップページに戻る', 'もう一度彼氏視点をやり直す'];

      options.forEach(choice => {
        const option = document.createElement('div');
        option.className = 'choice-option';
        option.textContent = choice;

        option.addEventListener('click', () => {
          if (choice === '彼女視点に進む') {
            window.location.href = 'girl_main.html';
          } else if (choice === 'トップページに戻る') {
            window.location.href = 'index.html';
          } else if (choice === 'もう一度彼氏視点をやり直す') {
            window.location.href = 'boy_main.html';
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