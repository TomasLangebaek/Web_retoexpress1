var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Joi = require("joi");
var fs = require("fs");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;

app.get("/chat/api/messages", (req, res) => {
  const messages = getJson();
  res.send(messages);
});

app.get("/chat/api/messages/:id", (req, res) => {
  const messages = getJson();
  const message = messages.find((message) => message.id === req.params.id);
  if (!message)
    return res.status(404).send("The message with the given id was not found.");
  res.send(message);
});

app.post("/chat/api/messages/:id", (req, res) => {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .regex(/([a-zA-Z])*\s{1}([a-zA-Z])*/)
      .required(),
    id: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const messages = getJson();
  const NewMessage = req.body;
  messages.push(NewMessage);
  saveOnJson(messages);
  res.send({ success: true, msg: "Message added successfully" });
});

app.delete("/chat/api/messages/:id", (req, res) => {
  const id = req.params.id;
  const messages = getJson();
  const filteredMessages = messages.filter((user) => user.id !== id);
  if (messages.length === filteredMessages.length) {
    return res.status(409).send({ error: true, msg: "id does not exist" });
  }
  saveOnJson(filteredMessages);
  res.send({ success: true, msg: "Message removed successfully" });
});

app.put("/chat/api/messages/:id", (req, res) => {
  const messages = getJson();
  let message = messages.find((message) => message.id === req.params.id);
  if (!message)
    return res.status(404).send("The message with the given id was not found.");
  const filteredMessages = messages.filter(
    (message) => message.id !== req.params.id
  );
  message.message = req.body.message;
  filteredMessages.push(message);
  saveOnJson(filteredMessages);
  res.send({
    success: true,
    msg:
      "Message updated successfully! Content: " +
      message.message +
      " ," +
      message.author,
  });
});

const saveOnJson = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("myjsonfile.json", stringifyData);
};

const getJson = () => {
  const jsonData = fs.readFileSync("myjsonfile.json");
  return JSON.parse(jsonData);
};
