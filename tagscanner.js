(function() {
  'use strict';

  console.log("Up and running");

  var port;

  let textEncoder = new TextEncoder();

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector('#connect');

    function connect() {
      console.log('Connecting to ' + port.device_.productName + '...');
      port.connect().then(() => {
        console.log(port);
        console.log('Connected.');
        connectButton.textContent = 'Disconnect';
        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          console.log("Received data: ");
          let dataText = textDecoder.decode(data);
          console.log(dataText);
          document.getElementById("mcu").innerText = dataText;
          setTimeout(function(){document.getElementById("mcu").innerText="";}, 1000);
        }
        port.onReceiveError = error => {
          console.log('Receive error: ' + error);
        };
      }, error => {
        console.log('Connection error: ' + error);
      });
    };

    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          console.log('Connection error: ' + error);
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        console.log('No devices found.');
      } else {
        port = ports[0];
        connect();
      }
    });
  });
})();
