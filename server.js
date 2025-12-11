const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");

// 폴더 등록
app.use(express.static(__dirname + "/public"));
// ejs 세팅
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;
const url = `mongodb+srv://admin:${encodeURIComponent(
  ""
)}@cluster0.stp1mtt.mongodb.net/?appName=Cluster0`; // 특수문자 들어간 비밀번호 인코딩
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB 연결 성공");
    db = client.db("forum"); // 데이터베이스 이름
    // 8080 포트에서 서버 실행
    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// 라우팅
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/list", async (req, res) => {
  let result = await db.collection("post").find().toArray();
  //console.log(result[0]._id);
  res.render("list.ejs", { posts: result });
});

app.get("/write", (req, res) => {
  res.render("write.ejs");
});

app.post("/add", async (req, res) => {
  try {
    if (req.body.title == "") {
      res.redirect("/write");
    } else {
      await db.collection("post").insertOne({
        title: req.body.title,
        content: req.body.content,
      });
      res.redirect("/list");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error");
  }
});

app.get("/about", (req, res) => {
  db.collection("post").insertOne({ title: "testData" });
  res.sendFile(__dirname + "/about.html");
});

app.get("/time", (req, res) => {
  let time = new Date();
  res.render("time.ejs", { time: time });
});

app.get("/detail/:id", async (req, res) => {
  try {
    let result = await db
      .collection("post")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (result == null) {
      res.status(400).send("존재하지 않는 글");
    } else {
      res.render("detail.ejs", { result: result });
    }
  } catch {
    res.send("Error");
  }
});
