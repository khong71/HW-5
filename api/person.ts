import express from "express";
import { conn, queryAsync } from "../connDB";
import { personReq } from "../model/person";
import mysql from "mysql";

export const router = express.Router();

router.get("/sert_all", (req, res) => {
  const sql = "select * from HW_5_person";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

router.get("/sert_type/stars", (req, res) => {
  const sql = "select * from HW_5_person where type = 'stars'";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

router.get("/sert_type/creator", (req, res) => {
  const sql = "select * from HW_5_person where type = 'creator'";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

router.post("/insert_person", (req, res) => {
  const person: personReq = req.body;
  console.log(person);
  let sql =
    "insert into HW_5_person(name_person, img_person, info_person, type, id_movie) values (?,?,?,?,?)";
  sql = mysql.format(sql, [
    person.name_person,
    person.img_person,
    person.info_person,
    person.type,
    person.id_movie,
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.insertId,
    });
  });
});

//delete
router.delete("/delete_person/:id", (req, res) => {
  const id = +req.params.id;
  let sql = "delete from HW_5_person where id_person = ?";
  conn.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.DeleteId,
    });
  });
});

//เเก้ไข
router.put("/update_person/:id", async (req, res) => {
    const id = +req.params.id;
    const person: personReq = req.body;
  
    let movie_Orriginal: personReq | undefined;
    let sql = mysql.format("select * from HW_5_person where id_person = ?", [id]);
  
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    movie_Orriginal = rawData[0] as personReq;
    console.log(movie_Orriginal);
  
    const updateperson = { ...movie_Orriginal, ...person };
  
    sql =
      "update HW_5_person set name_person = ?, img_person = ?, info_person = ?, type = ?, id_movie = ? where id_person = ?";
    sql = mysql.format(sql, [
        updateperson.name_person,
        updateperson.img_person,
        updateperson.info_person,
        updateperson.type,
        updateperson.id_movie,
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

// SELECT *
// FROM `HW_5_movie`
// INNER JOIN `HW_5_person` ON HW_5_movie.id_movie = HW_5_person.id_movie
// WHERE HW_5_movie.id_movie = 1;
