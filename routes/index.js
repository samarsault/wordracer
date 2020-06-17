const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { words } = require('../words');
const Score = require('../models/Score');
const faker = require('faker');

function generateRandom(limit, length) {
    var arr = [];
    var n;
    for(var i=0; i<length; i++){
        do {
            n = Math.floor(Math.random()*limit+1);
        }while(arr.indexOf(n) !== -1)
       arr[i] = n;
    }

    return arr;
}

function generateToken() {
  return crypto.randomBytes(64).toString('hex')
}

// Small app, can do with using JSON file 
function getWords(count) {
  const random = generateRandom(words.length, count);
  return random.map(index => words[index].toLowerCase())
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Nothing here.')
});

router.post('/start', async function(req, res) {
  const { token, numberOfWords } = req.body;
  const  noWords = numberOfWords || 10;
  let user ;

  if (token) {
    user = await Score.findOne({
      token
    });
  } 
  const words = getWords(noWords); 
  if (!user) {
    // Unable to generate/retrieve one, propose one
    user = {
      user: faker.internet.userName()
    }
  }

  return res.status(200).json({
    words,
    user
  })
});


router.get('/score/top', async function (req, res) {
  const scores = await Score.find({ }, [ 'user', 'score'], {
    limit: 10,
    sort: {
      score: -1
    }
  })
  return res.status(200).json(scores);
});

router.put('/score', async function(req, res) {
  const { user, score, token } = req.body;
  const userScore = await Score.findOne({ user, token });
  if (score > userScore.score) {
    // Only update score if its greater
    await Score.updateOne({
      _id: userScore._id
    }, {
      score
    })
    return res.status(200).send('OK');
  }
  else {
    return res.status(200).send('High');
  }
});

router.post('/score', async function(req, res) {
  const { user, score } = req.body;
  const token = generateToken();
  const scoreObject = await Score.create({
    user,
  	score,
  	token
  });
  return res.status(200).json(scoreObject);
});

module.exports = router;
