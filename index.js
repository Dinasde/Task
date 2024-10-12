const express = require('express');
const app = express();
const data = require('./herd.json')
const port = 3000;

let herd = [];
let currentDay = 0;

app.use(express.json());


let result = data.herd;

for(let item of result){
    herd.push(item)
}
const calculateStock = (days) => {
    let totalMilk = 0;
    let totalSkins = 0;

    herd.forEach(yak => {
        const ageInDays = yak.age * 100 + days; // Convert years to days
        if (ageInDays < 1000) { // Yak dies after 10 years (1000 days)
            // Milk calculation
            const dailyMilk = 50 - (ageInDays * 0.03);
            if (dailyMilk > 0) {
                totalMilk += dailyMilk;
            }
            // Check for skins (shaving eligibility)
            const nextShaveDay = 8 + (yak.age * 0.01);
            if (ageInDays >= 365 && (Math.floor(days / nextShaveDay) > 0)) {
                totalSkins++;
            }
        }
    });

    return { milk: parseFloat(totalMilk.toFixed(2)), skins: totalSkins };
};

// Calculate herd status after T days
const calculateHerdStatus = (days) => {
    return herd.map(yak => {
        const newAge = yak.age + (days / 100);
        return {
            name: yak.name,
            age: parseFloat(newAge.toFixed(2)), // Keep two decimal places
            "age-last-shaved": yak.age // Placeholder for last shaved age
        };
    });
};

// Endpoint to get stock
app.get('/yak-shop/stock/:days', (req, res) => {
    const days = parseInt(req.params.days);
    const stock = calculateStock(days);
    res.json(stock);
});

// Endpoint to get herd status
app.get('/yak-shop/herd/:days', (req, res) => {
    const days = parseInt(req.params.days);
    const herdStatus = calculateHerdStatus(days);
    res.json({ herd: herdStatus });
});



app.listen(port, () => {
    console.log(`YakShop app listening at http://localhost:${port}`);
});
