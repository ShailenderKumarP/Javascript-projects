const initialMsg = [
    {msgBy: 'bot', message: 'Hi, do you need help',buttons:['Yes', 'No'], time : new Date()}
];

const response = {
  'yes': {
    message: 'We are happy to help',
    buttons: ['issue with order', 'change address', 'Reach agent'],
  },
  'no':{
    message: 'Thankyou',
    buttons: []
  },
  'default': {
    message: 'Please wait while we are connecting you to next available agent',
    buttons: [],
    htmlContent: `<div>Please leave feedback
        <div>
          <input type='radio' name='feedback' value = '5'/>5</input>
          <input type='radio' name='feedback' value = '4'/>4</input>
        </div>
      </div>`
  }
}
let msgs;

document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('unload', () => {
      // window.localStorage.setItem('msgs', JSON.stringify(msgs));
    });

    document.getElementById('chatbot').addEventListener('click', (e) => {
      const target = e.target;
      if(e.target.id.includes('btn')) {
        const [btnName, action] = target.id.split('-');
        const content = response?.[action.toLowerCase()] || response['default'];
        const newMsgs = [];
        let newMsgsHtml = '';
        
        newMsgs.push({ msgBy: 'user', message: action, buttons: [], time: new Date() })
        newMsgs.push({ msgBy: 'bot', time: new Date(), ...content });
        msgs.push(...newMsgs);
        document.getElementById('messages').innerHTML += render(newMsgs);
      }

    });

    init();

    function init(){
      msgs = initialMsg || JSON.parse(localStorage.getItem('msgs'));
      document.getElementById('messages').innerHTML = render(msgs);
    };

    function render(msgList) {
      let msgHtml = '';
      msgList.forEach(msg => {
        msgHtml += renderMsg(msg)
      });
      return msgHtml;
    }

    function renderMsg(msg) {
      return `
      <div class='msg-${msg.msgBy}'>
        <span class='userIcon ${msg.msgBy}'>${msg.msgBy.charAt(0).toUpperCase()}</span>
        <div class='msg'>
          <p>${msg.message}</p>
          ${msg.buttons.length > 0 ? renderMsgButtons(msg) : ''}
          ${msg.htmlContent || ''}
        </div>
      </div>
    `
    }

    function renderMsgButtons(msg) {
      let buttonsHtml = '';
      msg.buttons.forEach(btn => {
        buttonsHtml +=`
        <button id='btn-${btn}' class='actionBtn'>${btn}</button>
      `});
      return buttonsHtml;
    }

})