const express = require("express");
const app = express();

// 폴더 등록
app.use(express.static(__dirname + "/public"));

const { MongoClient } = require("mongodb");

let db;
const url = `mongodb+srv://admin:${encodeURIComponent(
  "Tjwns?0324"
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

app.get("/about", (req, res) => {
  db.collection("post").insertOne({ title: "testData" });
  res.sendFile(__dirname + "/about.html");
});

app.get("/list", async (req, res) => {
  let result = await db.collection("post").find().toArray();
  console.log(result);
  res.send("DB에 있던 게시물");
});
