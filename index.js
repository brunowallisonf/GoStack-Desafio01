const express = require("express");
const server = express();
let projects = [];
server.use(express.json());
let requestCount = 0;
server.use(requestCounter);
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});
server.put("/projects/:id", idExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const project = projects.find(value => {
    return value.id == id;
  });
  project.title = title;
  return res.json(project);
});

server.get("/projects/:id", idExists, (req, res) => {
  const { id } = req.params;

  return res.json(projects.find(value => value.id == id));
});

server.delete("/projects/:id", idExists, (req, res) => {
  const { id } = req.params;
  projects = projects.filter(value => {
    return value.id != id;
  });
  return res.send();
});

server.post("/projects/:id/tasks", idExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(value => value.id == id);
  project.tasks.push(title);
  res.json(projects);
});

function idExists(req, res, next) {
  const { id } = req.params;
  if (!projects.find(value => value.id == id))
    return res.status(400).json({ erro: "Id dont is present" });
  return next();
}
function requestCounter(req, res, next) {
  requestCount = requestCount + 1;
  console.log("Numero de requests: ", requestCount);
  return next();
}
server.listen(3000);
