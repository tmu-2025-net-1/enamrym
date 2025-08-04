const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let currentStep = 0;
let userData = [];
let userView = ""; // '彼女' or '彼氏'

// ✅ ステップ定義（先頭に概要フェーズを追加）
const steps = [
  {
    from: 'left',
    text: 'ようこそ「ことばの影、こころの光」へ。',
    expectsInput: false
  },
  {
    from: 'left',
    text: 'これは、「本音と建前」に着目した、チャット形式の診断・対話型ウェブサイトです。',
    expectsInput: false
  },
  {
    from: 'right',
    text: 'どういうこと？って感じだけど、やってみたらわかるらしいよ。',
    expectsInput: false
  },
  {
    from: 'left',
    text: 'ストーリー設定：',
    expectsInput: false
  },
  {
    from: 'left',
    text: '「彼女は彼氏のことが大好き。でも彼氏の気持ちは少し冷めてきていて…」',
    expectsInput: false
  },
  {
    from: 'left',
    text: 'そんな、すれ違い始めた2人会話をLineのチャット形式で体験していただきます。',
    expectsInput: false
  },
  {
    from: 'right',
    text: 'どんな感じなんだろう？ワクワクしてきた…！',
    expectsInput: false
  },
  { 
    from: 'left', 
    text: 'あなたの名前を入力してください', 
    expectsInput: true 
  },
  {
    from: 'left',
    text: (name) => `${name}さん、ありがとうございます`,
    expectsInput: false
  },
  {
    from: 'left',
    text: 'どちらの視点で会話を体験しますか？',
    expectsInput: false,
    isChoice: true,
    choices: ['彼女として', '彼氏として']
  },
  {
    from: 'left',
    text: () => userView === '彼女'
      ? '彼氏側の名前を入力してください'
      : '彼女側の名前を入力してください',
    expectsInput: true
  },
  {
    from: 'left',
    text: 'ありがとうございます',
    expectsInput: false
  },
  {
    from: 'left',
    text: (partnerName) => `それでは${partnerName}さんとの会話をお楽しみください`,
    expectsInput: false
  },
  {
    from: 'left',
    text: '',
    expectsInput: false,
    isAutoRedirect: true
  }
];

function appendBubble(text, from) {
  if (!text) return;
  const bubble = document.createElement('div');
  bubble.classList.add(from === 'right' ? 'bubble-right1' : 'bubble-left1');
  bubble.textContent = text;
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function appendChoiceBubble(choices, questionText) {
  const bubbleWrapper = document.createElement('div');
  bubbleWrapper.classList.add('choice-bubble');

  const question = document.createElement('div');
  question.classList.add('choice-question');
  question.textContent = questionText;
  bubbleWrapper.appendChild(question);

  choices.forEach(choice => {
    const option = document.createElement('div');
    option.classList.add('choice-option');
    option.textContent = choice;

    option.addEventListener('click', () => {
      appendBubble(choice, 'right');
      userData.push(choice);

      if (choice === '彼女として') userView = '彼女';
      if (choice === '彼氏として') userView = '彼氏';

      const allOptions = bubbleWrapper.querySelectorAll('.choice-option');
      allOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.style.opacity = '0.5';
      });

      currentStep++;

      setTimeout(() => {
        const next = steps[currentStep];
        const text = typeof next.text === 'function'
          ? next.text()
          : next.text;

        appendBubble(text, 'left');

        if (next.expectsInput) {
          userInput.disabled = false;
          sendBtn.disabled = false;
          userInput.placeholder = 'メッセージを入力してください';
        } else {
          userInput.disabled = true;
          sendBtn.disabled = true;
        }
      }, 1000);
    });

    bubbleWrapper.appendChild(option);
  });

  chatContainer.appendChild(bubbleWrapper);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleNextStep() {
  const current = steps[currentStep];
  if (!current) return;

  if (current.expectsInput) {
    const input = userInput.value.trim();
    if (input === '') return;

    appendBubble(input, 'right');
    userData.push(input);
    userInput.value = '';

    if (currentStep === 10) {
      const myName = userData[0];
      const partnerName = userData[2];
      localStorage.setItem('userName', myName);
      localStorage.setItem('partnerName', partnerName);
    }
  }

  currentStep++;

  if (currentStep < steps.length) {
    const next = steps[currentStep];
    const recentInput = userData[userData.length - 1] || '';
    const text = typeof next.text === 'function' ? next.text(recentInput) : next.text;

    setTimeout(() => {
      if (next.isChoice) {
        appendChoiceBubble(next.choices, text);
        userInput.disabled = true;
        sendBtn.disabled = true;
      } else {
        appendBubble(text, next.from || 'left');

        if (next.isAutoRedirect) {
          setTimeout(() => {
            const destination = userView === '彼氏' ? 'boy_main.html' : 'girl_main.html';
            window.location.href = destination;
          }, 3000);
          return;
        }

        if (next.expectsInput) {
          userInput.disabled = false;
          sendBtn.disabled = false;
          userInput.placeholder = 'メッセージを入力してください';
        } else {
          userInput.disabled = true;
          sendBtn.disabled = true;

          setTimeout(() => {
            handleNextStep();
          }, 1000);
        }
      }
    }, 1000);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const first = steps[currentStep];
  appendBubble(first.text, first.from);
  userInput.disabled = !first.expectsInput;
  sendBtn.disabled = first.expectsInput ? false : true;

  if (!first.expectsInput) {
    setTimeout(() => handleNextStep(), 1000);
  }
});

sendBtn.addEventListener('click', () => {
  if (!steps[currentStep]) return;
  handleNextStep();
});

