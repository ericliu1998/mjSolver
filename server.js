const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

const app = express();
// const urlencodedparser = bodyParser.urlencoded({extended: true})
// const jsonparser = bodyParser.json()
const textparser = bodyParser.text({ type: "*/*" });
app.use(textparser);
app.use(cors());

const {
  Tile,
  Meld,
  Hand,
  ExplorerOfWinningPermutations,
  WinningHand,
} = require("hk-mahjong");

var honor9 = { suit: "honor", value: 9 };

var allTiles = [
  new Tile({ suit: "dot", value: 1 }),
  new Tile({ suit: "dot", value: 2 }),
  new Tile({ suit: "dot", value: 3 }),
  new Tile({ suit: "dot", value: 4 }),
  new Tile({ suit: "dot", value: 5 }),
  new Tile({ suit: "dot", value: 6 }),
  new Tile({ suit: "dot", value: 7 }),
  new Tile({ suit: "dot", value: 8 }),
  new Tile({ suit: "dot", value: 9 }),
  new Tile({ suit: "bamboo", value: 1 }),
  new Tile({ suit: "bamboo", value: 2 }),
  new Tile({ suit: "bamboo", value: 3 }),
  new Tile({ suit: "bamboo", value: 4 }),
  new Tile({ suit: "bamboo", value: 5 }),
  new Tile({ suit: "bamboo", value: 6 }),
  new Tile({ suit: "bamboo", value: 7 }),
  new Tile({ suit: "bamboo", value: 8 }),
  new Tile({ suit: "bamboo", value: 9 }),
  new Tile({ suit: "character", value: 1 }),
  new Tile({ suit: "character", value: 2 }),
  new Tile({ suit: "character", value: 3 }),
  new Tile({ suit: "character", value: 4 }),
  new Tile({ suit: "character", value: 5 }),
  new Tile({ suit: "character", value: 6 }),
  new Tile({ suit: "character", value: 7 }),
  new Tile({ suit: "character", value: 8 }),
  new Tile({ suit: "character", value: 9 }),
  new Tile({ suit: "honor", value: 1 }),
  new Tile({ suit: "honor", value: 2 }),
  new Tile({ suit: "honor", value: 3 }),
  new Tile({ suit: "honor", value: 4 }),
  new Tile({ suit: "honor", value: 5 }),
  new Tile({ suit: "honor", value: 6 }),
  new Tile({ suit: "honor", value: 7 }),
];
app.get("/", function (request, response) {
  response.send("Hello");
});

app.post("/isWinningHand", function (req, res) {
  var hasWongTile = false;
  console.log("is winning hand called");
  var jsonParsedBody = JSON.parse(req.body);
  var tiles = [];
  //   var testing = [];
  //   console.log(jsonParsedBody);
  jsonParsedBody.forEach((element) => {
    // { suit: 'dot', value: 1 }
    if (element.suit == "honor" && element.value == 9) {
      console.log("wong matched");
      hasWongTile = true;
    } else {
      tiles.push(new Tile(element));
    }
    // testing.push(`new Tile(${JSON.stringify(element)})`);
  });
  if (hasWongTile) {
    if (jsonParsedBody.length == 14) {
      res.send(iswinningHandWithWong(tiles));
    } else {
      res.send(findTilesToWin(tiles, true));
    }

    //fdsfsdfsdfsd
  } else {
    console.log("no wong");
    if (jsonParsedBody.length == 14) {
      const hand = new Hand({ tiles, melds: [] });
      const explorer = new ExplorerOfWinningPermutations(hand);
      var winningPerm = explorer.getWinningPermutations();
      winningPerm.forEach((e) => {
        console.log(e.toString());
      });
      console.log(winningPerm.length);

      if (winningPerm.length == 0) {
        res.send(false);
      } else {
        res.send(true);
      }
    } else {
      res.send(findTilesToWin(tiles, false));
    }
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
  console.log("http://localhost:3000/");

  const dot1 = new Tile({ suit: "dot", value: 1 });
  const dot2 = new Tile("🀚");
  const dot3 = new Tile("🀛");
  const dot4 = new Tile("🀜");
  const dot9 = new Tile("🀡");
  const tiles = [
    dot1,
    dot1,
    dot1,
    dot2,
    dot2,
    dot2,
    dot3,
    dot3,
    dot3,
    dot4,
    dot4,
    dot4,
    dot9,
    dot9,
  ];

  const hand = new Hand({ tiles, melds: [] });
  const explorer = new ExplorerOfWinningPermutations(hand);
  var winningPerm = explorer.getWinningPermutations();
  //   winningPerm.forEach((e) => {
  //     console.log(e.toString());
  //   });
  //   console.log("12345678901234");
  //   console.log(hand.toString());
  //   console.log(hand.isWinningHand());
  //   var winningPerm = explorer.getWinningPermutations();
  //   winningPerm.forEach((e) => {
  //     console.log(e.toString());
  //   });
  //   console.log(winningPerm);
  //   console.log(winningPerm.length);
});

function iswinningHandWithWong(tiles) {
  console.log("is winning with wong");
  var tilesWithWong = [];
  for (let i = 0; i < allTiles.length; i++) {
    tilesWithWong = [...tiles];
    // tilesWithWong.forEach((e) => {
    //   console.log(`${e.getSuit()} - ${e.getValue()}`);
    // });
    tilesWithWong.push(allTiles[i]);

    var winningPerm = checkIfHandIsWinning(tilesWithWong);
    winningPerm.every((e) => {
      console.log(e.toString());
    });

    if (winningPerm.length > 0) {
      console.log("found win with wong");
      return true;
    } else {
      console.log("not yet");
    }
  }
  return false;
}

function checkIfHandIsWinning(tiles) {
  const hand = new Hand({ tiles: tiles, melds: [] });

  const explorer = new ExplorerOfWinningPermutations(hand);
  var winningPerm = explorer.getWinningPermutations();

  return winningPerm;
}
function findTilesToWin(tiles, hasWong) {
  if (hasWong) {
    var winningTiles = [];
    var winningTiles2 = [];
    allTiles.forEach((element1) => {
      var tilesToCheck = [...tiles];
      tilesToCheck.push(element1);

      allTiles.forEach((element2) => {
        var tilesToCheck2 = [...tilesToCheck];
        if (!winningTiles2.includes(element2)) {
          tilesToCheck2.push(element2);

          var winningPerm = checkIfHandIsWinning(tilesToCheck2);
          // winningPerm.every((e) => {
          //   console.log(e.toString());
          // });

          if (winningPerm.length > 0) {
            console.log(
              `found a tile to win: ${element2.getSuit()} - ${element2.getValue()}`
            );
            winningTiles.push({
              suit: element2.getSuit(),
              value: element2.getValue(),
            });
            winningTiles2.push(element2);
          }
        }
      });
    });
  } else {
    var tilesToCheck = [];

    var winningTiles = [];
    allTiles.forEach((element) => {
      tilesToCheck = [...tiles];
      tilesToCheck.push(element);

      var winningPerm = checkIfHandIsWinning(tilesToCheck);

      if (winningPerm.length > 0) {
        console.log("found a tile to win");
        console.log(`${element2.getSuit()} - ${element2.getValue()}`);
        winningTiles.push({
          suit: element.getSuit(),
          value: element.getValue(),
        });
      }
    });
  }
  return winningTiles;
}
