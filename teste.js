const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const path = './Localization'
const extractedData = require(`${path}/english_xml/JSON_minified/extractedData_min.json`)

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
const json = { "imgURL":[] }
async function Pudim() {
	for (let i = 0; i < extractedData.perks.name.length; i++) {
		let name = extractedData.perks.name[i];
		if(name !== null) {
			name = toTitleCase(name.split(' ').join('').split('!').join('').split('é').join('e'));
			if(name == 'Treadlightly' || name == 'Escapeartist' || name == 'Heightenedsenses') name = `Perk_${name.toLowerCase()}`
			const res = await fetch(`https://deceit.gamepedia.com/File:${name}.png`);
			const html = await res.text()
			
			const $ = cheerio.load(html);
			json.imgURL[i] = $('div.fullMedia > p > a').attr('href')
			if(typeof json.imgURL[i] == 'undefined') json.imgURL[i] = null;
		};
	}
	// Read and Write to every file
}

Pudim()


async function Perks(){
	for (let e of Object.keys(json)) {
		if(!e.startsWith(prefix)) return;
		if(isNaN(e.split(prefix)[1])) return;
		const id = e.split(prefix)[1]
		const value = json[e]
		extractedData.perks[key.toLowerCase()][id] = value;
		
		// Img URL
		let searchKey = english.json[e];
		if(e == null) return;
		// Fix Search Key
		searchKey = toTitleCase(searchKey.split(/ +/).join('').split('!').join('').split('é').join('e'));
		if(searchKey.match(/^(Treadlightly|Escapeartist|Heightenedsenses)$/)) searchKey = `Perk_${searchKey.toLowerCase()}`;
		
		
		console.log(html)
		const res = await fetch(`https://deceit.gamepedia.com/File:${name}.png`);
		const html = await res.text()
		const $ = cheerio.load(html);
		
		// Save URL
		extractedData.perks.URL[id] = $('div.fullMedia > p > a').attr('href');
		if(typeof extractedData.perks.URL[id] == 'undefined') extractedData.perks.URL[id] = null;
	};
}
Perks();




Object.keys(json).forEach(e => {
	if(!e.startsWith(prefix)) return;
	if(isNaN(e.split(prefix)[1])) return;
	const id = e.split(prefix)[1]
	const value = json[e]
	extractedData.perks[key.toLowerCase()][id] = value;

	// Img URL
	let searchKey = english.json[e];
	if(e == null) return;
	// Fix Search Key
	searchKey = toTitleCase(searchKey.split(/ +/).join('').split('!').join('').split('é').join('e'));
	if(searchKey.match(/^(Treadlightly|Escapeartist|Heightenedsenses)$/)) searchKey = `Perk_${searchKey.toLowerCase()}`;
	
	console.log(html)
	const res = await fetch(`https://deceit.gamepedia.com/File:${name}.png`);
	const html = await res.text()
	const $ = cheerio.load(html);
	
	// Save URL
	extractedData.perks.URL[id] = $('div.fullMedia > p > a').attr('href');
	if(typeof extractedData.perks.URL[id] == 'undefined') extractedData.perks.URL[id] = null;
});