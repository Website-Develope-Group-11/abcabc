// 引入 Express 模組
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
--
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const baseCharacters = [
  { id: 1, name: "戰神奎托斯", img: "/images/char1.png" },
  { id: 2, name: "女武神布倫希爾德", img: "/images/char2.png" },
  { id: 3, name: "吟遊詩人奧德賽", img: "/images/char3.png" },
  { id: 4, name: "雷神索爾", img: "/images/char4.png" }, 
  { id: 5, name: "魔法師甘道夫", img: "/images/char5.png" }      
];

const MIN_POWER = 5000;
const MAX_POWER = 15000;

let userInventory = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/api/gacha', express.json(), (req, res) => {
    const { times } = req.body;

    const results = [];
    
    for (let i = 0; i < times; i++) {
        const randomIndex = getRandomInt(0, baseCharacters.length - 1);
        const baseCharacter = baseCharacters[randomIndex];
        
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2);

        const character = {
            uid: uniqueId,          
            id: baseCharacter.id,   
            name: baseCharacter.name,
            img: baseCharacter.img,
            combatPower: getRandomInt(MIN_POWER, MAX_POWER), 
            obtainTime: new Date().toLocaleString()
        };
        
        results.push(character);
      
        userInventory.push(character);
    }
    
    res.json({ results, totalCount: userInventory.length });
    
    console.log(`抽卡 ${times} 次完成，目前庫存總數: ${userInventory.length}`);
});

app.get('/api/inventory', (req, res) => {
    res.json([...userInventory].reverse());
});

app.get('/api/characters', (req, res) => {
  const charactersWithRandomPower = baseCharacters.map(char => ({
    ...char, 
    combatPower: getRandomInt(MIN_POWER, MAX_POWER) 
  }));
  res.json(charactersWithRandomPower);
});

app.get('/api/characters/:id', (req, res) => {
  const characterId = parseInt(req.params.id);
  const baseCharacter = baseCharacters.find(c => c.id === characterId);

  if (baseCharacter) {
    const character = {
        ...baseCharacter,
        combatPower: getRandomInt(MIN_POWER, MAX_POWER) 
    };
    res.json(character);
  } else {
    res.status(404).json({ message: 'Character not found' });
  }
});

app.listen(port, () => {
  console.log(`遊戲 API 伺服器正在 http://localhost:${port} 運行`);
});