const ws = new WebSocket("ws://localhost:3000");
ws.onmessage = (msg) => {
  renderMessages();
};

const renderMessages = () => {
  let url = "http://localhost:3000/chat/api/messages";

  fetch(url).then(function (response) {
    response.json().then(function (json) {
      data = json;
      const html = data.map((item) => `<p>${item.message}</p>`).join(" ");
      document.getElementById("messages").innerHTML = html;
    });
  });
};

const handleSubmit = async (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  const author = document.getElementById("author");

  let ts = Date.now();

  url = "http://localhost:3000/chat/api/messages/" + ts;

  ts = ts + "";

  var data = {
    message: message.value,
    author: author.value,
    id: ts,
  };

  console.log(data);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 400) {
        console.log("entra");
        console.log(response);
        throw new Error();
      }
    })
    .catch((error) => {
      window.alert(
        "El nombre debe tener nombre y apellido separados por espacio. La longitud mínima del mensaje = 5"
      );
    });

  renderMessages();
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);
