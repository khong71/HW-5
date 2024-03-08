import express from "express";
import { conn, queryAsync } from "../connDB";
import { movieReq } from "../model/movie";
import mysql from "mysql";

export const router = express.Router();

//มีเเค่หนัง
router.get("/", (req, res) => {
  const sql = "select * from HW_5_movie";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

//ตอนเพิ่มหนังยังไม่มีนักเเสดง
router.get("/:name", (req, res) => {
  const name = req.params.name;
  const sql = "select * from HW_5_movie WHERE HW_5_movie.name_movie = ?";
  conn.query(sql, [name], (err, result) => {
    res.status(200);
    res.json(result);
  });
});

//มีคนด้วย
router.get("/all", (req, res) => {
  const sql = "select * from HW_5_movie INNER JOIN `HW_5_person` ON HW_5_movie.id_movie = HW_5_person.id_movie";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

//ค้นหาชื่อ
router.get("/sert_nameMovie/:name", (req, res) => {
  const name = req.params.name;
  const sql = "select * from HW_5_movie INNER JOIN `HW_5_person` ON HW_5_movie.id_movie = HW_5_person.id_movie WHERE HW_5_movie.name_movie = ?";
  conn.query(sql, [name],(err, result) => {
    res.status(200);
    res.json(result);
  });
});

//ค้นหาคีย์
router.get("/sert_keyMovie/:key", (req, res) => {
  const key = req.params.key;
  const sql = "select * from HW_5_movie INNER JOIN HW_5_person ON HW_5_movie.id_movie = HW_5_person.id_movie WHERE name_movie Like ?";
  conn.query(sql, [`%${key}%`],(err, result) => {
    res.status(200);
    res.json(result);
  });
});

//เพิ่ม
router.post("/insert_movie", (req, res) => {
  const movie: movieReq = req.body;
  console.log(movie);
  let sql =
    "insert into HW_5_movie(name_movie, img_movie, trailer_movie, story_movie, score_movie) values (?,?,?,?,?)";
  sql = mysql.format(sql, [
    movie.name_movie,
    movie.img_movie,
    movie.trailer_movie,
    movie.story_movie,
    movie.score_movie
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.insertId
    });
  });
});

//delete
router.delete("/delete_movie/:id", async (req, res) => {
  const id = +req.params.id;
  let sql = "delete from HW_5_movie where id_movie = ?";
  conn.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.DeleteId,
    });
  });
});

//เเก้ไข
router.put("/update_movie/:id", async (req, res) => {
  const id = +req.params.id;
  const movie: movieReq = req.body;

  let movie_Orriginal: movieReq | undefined;
  let sql = mysql.format("select * from HW_5_movie where id_movie = ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  movie_Orriginal = rawData[0] as movieReq;
  console.log(movie_Orriginal);

  const updatemovie = { ...movie_Orriginal, ...movie };

  sql =
    "update HW_5_movie set name_movie = ?, img_movie = ?, trailer_movie = ?, story_movie = ?, score_movie = ? where id_movie = ?";
  sql = mysql.format(sql, [
    updatemovie.name_movie,
    updatemovie.img_movie,
    updatemovie.trailer_movie,
    updatemovie.story_movie,
    updatemovie.score_movie,
    id
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.updateId,
    });
  });
});