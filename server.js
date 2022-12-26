const process = require("process");
const jsonServer = require("json-server");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8000;
const authUser = {
  userId: "1",
  groupId: "1",
  authType: "0",
  userName: "Koichiro Kudo",
  password: "test",
  cancel: "FALSE",
};

server.use(cookieParser());
server.use(express.json());

// ログイン
server.post("/auth/login", (req, res) => {
  if (
    !(req.body["username"] === "user" && req.body["password"] === "password")
  ) {
    return res
      .status(401)
      .json({ message: "Username or password are incorrent" });
  }

  res.cookie("token", "dummy_token", {
    maxAge: 3600 * 1000,
    httpOnly: true,
  });
  res.status(201).json(authUser);
});

// ログアウト
server.post("/auth/logout", (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json({
    message: "Sign out successfully",
  });
});

// 収支登録
server.post("/capitals", (req, res) => {
  if (req.cookie["token"] !== "dummy_token") {
    return res.status(401).json({
      message: "unauthorized",
    });
  }

  res.status(201).json({
    message: "ok",
  });
});

// ユーザー登録
server.post("/users", (req, res) => {
  if (req.cookie["token"] !== "dummy_token") {
    return res.status(401).json({
      message: "unauthorized",
    });
  }

  res.status(201).json({
    message: "ok",
  });
});

// 認証済みユーザー取得
server.get("/users/me", (req, res) => {
  if (req.cookies["token"] !== "dummy_token") {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  res.status(200).json(authUser);
});

server.use(middlewares);
server.use(router);
server.listen(port, (err) => {
  if (err) {
    console.error(err);
    process.exit();
    return;
  }
  console.log("Start listening...");
  console.log("http://localhost:" + port);
});
