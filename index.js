const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

const app = express();

app.use(express.static("dist"));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(cors());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const person = persons.find((person) => person.id === id);
  person ? res.json(person) : res.status(404).end();
});

app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number is missing",
    });
  }

  if (persons.map((person) => person.name).includes(body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = [...persons, person];

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
