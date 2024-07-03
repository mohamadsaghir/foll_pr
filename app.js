const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const methodOverride = require("method-override");
const moment = require("moment");
const User = require("./models/customerSchema");

const app = express();
const port = 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To handle JSON bodies
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(connectLivereload());
app.set("view engine", "ejs");

// LiveReload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// View Routes
app.get("/", (req, res) => {
  User.find()
    .then((result) => {
      res.render("index", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/user/login.html", (req, res) => {
  res.render("user/login");
});

app.get("/user/invoice.html", (req, res) => {
  res.render("user/invoice");
});

app.get("/user/not.html", (req, res) => {
  res.render("user/not");
});

app.get("/user/add.html", (req, res) => {
  res.render("user/add");
});
app.get("/user/today.html", (req, res) => {
  res.render("user/today");
});

app.get("/edit/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/today/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/today", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/see/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/see", { obj: result });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/invoice/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/invoice", { obj: result });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});
app.get("/not/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/not", { obj: result });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/user/add.html", (req, res) => {
  User.create(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/serch", (req, res) => {
  const searchText = req.body.SearchText.trim();
  User.find({ $or: [{ Name_Products: searchText }] })
    .then((result) => {
      res.render("user/serch", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.delete("/edit/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.put("/edit/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// API Routes
app.get("/api/users", (req, res) => {
  User.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/api/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/api/users", (req, res) => {
  User.create(req.body)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.put("/api/users/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.delete("/api/users/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Connect to MongoDB
mongoose;
mongoose
  .connect(
    "mongodb+srv://sitsaghir:jDL2sDRo6hZy8iCO@cluster0.dyzqkuu.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
//
