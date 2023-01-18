const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const cors = require('cors');

app.use(cors({
	origin : 'http://localhost:3000',
	credentials: true,
	methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
	headers: 'Origin, Pragma, Cache-control, X-Requested-With, Content-Type, Accept, Authorization'
}));

// Read
app.get('/kockak', (req, res) => {
	fs.readFile('./data/kocka.json' , (err, file) => {
		res.send(JSON.parse(file));
  });
});

// Read by marka 
app.get('/kockak/:egyediAzonosito', (req, res) => {
	const marka = req.params.egyediAzonosito;

	fs.readFile('./data/kocka.json', (err, file) => {
		const kockak = JSON.parse(file);
		const kockaByMarka = kockak.find(kocka => kocka.marka == marka);

		if(!kockaByMarka) {
			res.status(404);
			res.send({error: `brand: ${marka} not found`});
			return;
		}
		
		res.send(kockaByMarka)	
	});
});

// Create
app.post('/kockak', bodyParser.json(), (req, res) => {
	const newkocka = {
		marka: req.body.marka,
		ara: req.body.ara,
		tipusa: req.body.tipusa
	};

	fs.readFile('./data/kocka.json' , (err, file) => {
		const kockak = JSON.parse(file);
		kockak.push(newkocka);
		fs.writeFile('./data/kocka.json', JSON.stringify(kockak), (err) => {
			res.send(newkocka);
		})
	})
});

// Update
app.put('/kockak/:egyediAzonosito', bodyParser.json(), (req, res) => {
	const marka = req.params.egyediAzonosito;

	fs.readFile('./data/kocka.json', (err, file) => {
		const kockak = JSON.parse(file);
		const kockaIndexByMarka = kockak.findIndex(kocka => kocka.marka === marka);
		
		if(kockaIndexByMarka === -1) {
			res.status(404);
			res.send({error: `brand: ${marka} not found`});
			return;
		}
		console.log(req);

		const updatedKocka = {               
			marka: req.body.marka,
			ara: req.body.ara,
			tipusa: req.body.tipusa
		};                             
		kockak[kockaIndexByMarka] = updatedKocka;
		fs.writeFile('./data/kocka.json', JSON.stringify(kockak), () => {
			res.send(updatedKocka);
		});
	});
});

// Delete
app.delete('/kockak/:egyediAzonosito', (req, res) => {
	const marka = req.params.egyediAzonosito;

	fs.readFile('./data/kocka.json', (err, file) => {
		const kockak = JSON.parse(file);
		const kockaIndexByMarka= kockak.findIndex(kocka => kocka.marka == marka);
		

		if(kockaIndexByMarka === -1) {
			res.status(404);
			res.send({error: `brand: ${marka} not found`});
			return;
		}

		kockak.splice(kockaIndexByMarka, 1);
		fs.writeFile('./data/kocka.json', JSON.stringify(kockak), () => {
			res.send({marka: marka});
		});
	});
});


app.listen(9000);