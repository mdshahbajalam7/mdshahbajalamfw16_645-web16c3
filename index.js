const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("hello Evaluation");
});

app.get("/user", (req, res) => {
  fs.readFile("./db.json", "utf-8", (err, data) => {
    res.setHeader("content-type", "application/json");
    res.send(data);
  });
});
app.post("/user", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    const parsed = JSON.parse(data);
    parsed.user = [...parsed.user, req.body];

    fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
      res.send("users successful created ");
    });
  });
});
app.post("/user/create", (req, res) => {
  if (req.body.id && req.body.name && req.body.age && req.body.role) {
    fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
      const parsed = JSON.parse(data);
      parsed.user = [...parsed.user, req.body];

      fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
        return res.status(201).send("voter added sucessfull");
      });
    });
  } else {
    res.status(402).send("please provided all the details mendtory");
  }
});

// login

app.post("/user/login", (req, res) => {
  if (req.body.username && req.body.password) {
    console.log(req.body);
    fs.readFile("./db.json", "utf-8", (err, data) => {
      const parsed = JSON.parse(data);
      parsed.user = parsed.user.map((el) => {
        if (
          el.username == req.body.username &&
          el.password == req.body.password
        ) {
          {
            req.body.token = uuid();
          }
        }
      });
    //   fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
    //     res.status(201).send(`Login sucessfully ${req.body.token}`);
    //   });
    });
  } else {
    res.status(400).send("please provide username and password");
  }
});

//   logout

app.post("/user/logout", (req, res) => {
  if (req.body.username && req.body.password) {
    fs.readFile("./db.json", "utf-8", (err, data) => {
      const parsed = JSON.parse(data);
      parsed.user = parsed.user.map((el) => {
        if (
          el.username == req.body.username &&
          el.password == req.body.password
        ) {
          {
            req.body.token = null;
          }
        }
      });
      fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
        res.status(201).send(`logout sucessfully ${req.body.token}`);
      });
    });
  } else {
    res.status(400).send("please provide username and password");
  }
});

app.get("/votes/party/:party", (req, res) => {
  const { party } = req.params;
  fs.readFile("./db.json", "utf-8", (err, data) => {
    const parsed = JSON.parse(data);
    parsed.user = parsed.user.filter((elem) => elem.party == party);

    let list = JSON.stringify(parsed);
    console.log(list);
    res.status(200).send("candidate list is get" + list);
  });
});
app.get("/votes/voters", (req, res) => {
  fs.readFile("./db.json", "utf-8", (err, data) => {
    const parsed = JSON.parse(data);
    parsed.user = parsed.user.filter((elem) => elem.voters == voters);

    let list = JSON.stringify(parsed);
    console.log(list);
    res.status(200).send("candidate list is get" + list);
  });
});

app.patch("/votes/vote/:user", (req, res) => {
  const { user } = req.params;

  fs.readFile("./db.json", "utf-8", (err, data) => {
    const parsed = JSON.parse(data);
    parsed.user = parsed.user.map((elem) =>
      elem.name == user ? { ...elem, vote: vote++ } : elem
    );
    fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
      return res.status(201).send(`Vote added sucessfully`);
    });
  });
  res.status(401).send(`Vote not counted`);
});

app.get("/votes/count/:user", (req, res) => {
  const { user } = req.params;
  console.log(user);
  fs.readFile("./db.json", "utf-8", (err, data) => {
    const parsed = JSON.parse(data);
    parsed.user = parsed.user.filter((elem) => elem.name == user);
    console.log(parsed.user[1].votes);
    res.status(200).send(`Total Votes of${user} ${parsed.user[0].votes}`);
  });
});

app.listen(PORT, () => {
  console.log(`server start ${PORT}`);
});
