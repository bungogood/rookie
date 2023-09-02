import { Engine } from "node-uci";
import { Chess } from "chess.js";
import express from "express";

const port = 80;

const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const app = express();
app.use(express.json());

const chess = new Chess();

// give a default request

app.get("/api/play", async (req, res) => {
  const engine = new Engine("stockfish");
  await engine.init();
  await engine.setoption("MultiPV", "4");
  await engine.isready();

  const fen = req.query.fen ? `${req.query.fen}` : startingFen;
  await engine.position(fen);
  const result = await engine.go({ nodes: 250000 });
  await engine.quit();

  console.log(req.query);

  chess.load(fen);
  chess.move(result.bestmove);
  const newFen = chess.fen();

  try {
    res.send({ bestmove: result.bestmove, fen: newFen });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e.message });
  }
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
