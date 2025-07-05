// 🔗 Coloca aqui o IP do teu ESP32:
const esp32IP = 'http://192.168.1.9';

function atualizarStatus() {
  fetch(esp32IP + '/status')
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < 4; i++) {
        document.getElementById('janela' + i).innerText =
          `Janela ${i+1}: ${data.janelas[i] ? 'ABERTA' : 'FECHADA'}`;
      }
      document.getElementById('atendente').innerText =
        `Atendente: ${data.atendente ? 'AUSENTE' : 'PRESENTE'}`;
    })
    .catch(err => {
      console.error(err);
      document.getElementById('atendente').innerText = 'ESP32 Offline';
    });
}

setInterval(atualizarStatus, 1000);
