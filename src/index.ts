import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'
import db from "./db/db";
import { cors } from '@elysiajs/cors'
let game = 0
const app = new Elysia()
  .use(cors())
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .post("/players", ({ body }) => createPlayers(body as Person[]))
  .get("/game/:id", ({ params: { id } }) => startGame(id as any))
  .post("/game/:id", ({ params: { id }, body}) => submitScore(id,body as Player[]),{ 
    params: t.Object({ id: t.Numeric() }),
  })
  .get("/scores", () => getScores())
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

function createPlayers(list: Person[]): number {
  game++
  list.forEach((player) => {
    db.query(
      "INSERT INTO players (name, game) VALUES ('"+player.name+"',"+game+") RETURNING *").run();
  });

  return game;
}

function startGame(id:Number): any {
  const players = db.query("SELECT name,id,game FROM players WHERE game =" +id+";").all();
  return players;
}

function submitScore(id:Number, body:Array<Player>): string {
  let highscore=0
  let winner="Nobody"
  body.forEach(player => {
    if (player.score > highscore) {
      highscore=player.score
      winner=player.name
    }
  });
  const players = db.query("INSERT INTO games (id,name,highscore) VALUES ("+id+",'"+winner+"',"+highscore+") RETURNING *;").run();
  return winner;
}

function getScores(): any {
  const scores = db.query("SELECT * from games;").all()
  return scores;
}

export interface Player {
  name: string;
  id: number;
  game: number;
  score: number;
}

export interface Person {
  name: string;
}


