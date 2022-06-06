const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let dbPath = path.join(__dirname, "cricketTeam.db");
//console.log(dbPath);
app.use(express.json());
module.exports = app;

let db = null;

const initializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is running at http://localhost:3000/`);
    });
  } catch (e) {
    console.log(`DB Server error : ${e.message}`);
    process.exit(1);
  }
};

initializeDatabaseAndServer();

//Get Players list
app.get("/players/", async (request, response) => {
  let sql_query = `SELECT
    *
    FROM 
    cricket_team
    ;`;
  let dbResponse = await db.all(sql_query);
  let Response = dbResponse.map((eachPlayerObject) => {
    return {
      playerId: eachPlayerObject.player_id,
      playerName: eachPlayerObject.player_name,
      jerseyNumber: eachPlayerObject.jersey_number,
      role: eachPlayerObject.role,
    };
  });
  response.send(Response);
});

app.post("players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  let post_sql_query = `
    INSERT INTO cricket_team (player_name, jersey_number, role)
    VALUES('${playerName}', ${jerseyNumber}, '${role}');`;
  let dbResponse = await db.run(post_sql_query);
  response.send("Player Added To Team");
});
