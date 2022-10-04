import { port } from "../config.json";
import { Engine } from "node-uci";
import express from "express";

const app = express();
app.use(express.json());

app.get("/api/play", async ( req, res ) => {
  const engine = new Engine("engine/executable/path");
  await engine.init();
  await engine.setoption("MultiPV", "4");
  await engine.isready();
  console.log("engine ready");
  await engine.position("r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3")
  const result = await engine.go({ nodes: 2500000 });
  console.log("result", result);
  await engine.quit();

  try {
    res.send({});
  } catch (e) {
    // console.log(e)
    res.status(400).send({message: e.message})
  }
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
