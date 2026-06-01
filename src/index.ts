import express from "express";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const todos: Todo[] = [
  { id: 1, title: "Buy groceries", completed: false },
];

let nextId = 2;

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, _res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/todos", (_req, res) => {
  res.status(200).json(todos);
});

app.get("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  res.status(200).json(todo);
});

app.post("/todos", (req, res) => {
  const { title, completed } = req.body;

  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  const newTodo: Todo = {
    id: nextId,
    title,
    completed: completed ?? false,
  };
  nextId += 1;
  todos.push(newTodo);

  res.status(201).json(newTodo);
});

app.put("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  const { title, completed } = req.body;

  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  todos[index] = {
    id,
    title,
    completed: completed ?? false,
  };

  res.status(200).json(todos[index]);
});

app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  todos.splice(index, 1);
  res.status(200).json({ message: "Todo deleted" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
