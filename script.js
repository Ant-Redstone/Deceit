const fs = require('fs')
const xml2js = require('xml2js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
 
const parser = new xml2js.Parser();

const path = './Localization'

const folders = fs.readdirSync(path)

// To Title Case Function
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

folders.forEach(folder => {
	const files = fs.readdirSync(`${path}/${folder}`);
	files.forEach(file => {
		if(!file.endsWith('.xml')) return;
		const directory = `${path}/${folder}/`
		const data = fs.readFileSync(`${directory}${file}`)
		parser.parseString(data, function (err, result) {
			if(err) return console.log('erro');
			let unordered = {}
			const Row = result.Workbook.Worksheet[0].Table[0].Row;
			Row.forEach(row => {
				if(typeof row.Cell == 'undefined') return;
				if(typeof row.Cell[0].Data == 'undefined') return;
				const key = row.Cell[0].Data[0]._
				const value = (typeof row.Cell[2].Data == 'undefined') ? ((typeof row.Cell[1].Data == 'undefined') ? null : row.Cell[1].Data[0]._) : row.Cell[2].Data[0]._;
				unordered[key] = value
			})

			// Order json
			let json = {};
			Object.keys(unordered).sort().forEach(key => {
				json[key] = unordered[key];
			});	
	
			if (!fs.existsSync(directory + 'JSON/')) fs.mkdirSync(directory + 'JSON/')
			if (!fs.existsSync(directory + 'JSON_minified/')) fs.mkdirSync(directory + 'JSON_minified/')

			fs.writeFileSync(directory + 'JSON/' + file.split('.xml').join('.json'), JSON.stringify(json, null, 4));
			fs.writeFileSync(directory + 'JSON_minified/' + file.split('.xml').join('_min.json'), JSON.stringify(json));

			if(file !== 'text_ui_deceitmenu.xml') return;
			
			const extractedData = {"cosmetics":[], "perks":{"name":[], "description":[], "URL":[] }}
			let keys = []
			
			// Extract Translated Cosmetics
			keys = ['Hair', 'Accessories', 'Clothes', 'Wrist', 'Pistol', 'Knife', 'VP', 'DP']
			keys.forEach(key => {
				const prefix = `ui_${key}`
				Object.keys(json).forEach(e => {
					if(!e.startsWith(prefix)) return;
					if(isNaN(e.split(prefix)[1])) return;
					const id = e.split(prefix)[1]
					const name = json[e]
					extractedData.cosmetics[id] = name;
				})				
			});
			
			// Extract Perks
			keys = ['Name', 'Description']
			keys.forEach((key, i) => {
				const prefix = `UI_Perk${key}_`;
				Object.keys(json).forEach(e => {
					if(!e.startsWith(prefix)) return;
					if(isNaN(e.split(prefix)[1])) return;
					const id = e.split(prefix)[1]
					const value = json[e]
					extractedData.perks[key.toLowerCase()][id] = value;
				});
			})
			fs.writeFileSync(directory + 'JSON/' + 'extractedData.json', JSON.stringify(extractedData, null, 4));
			fs.writeFileSync(directory + 'JSON_minified/' + 'extractedData_min.json', JSON.stringify(extractedData));
		})
	})
})
console.log('Ended Files Generation\nStarting Perk Image URL Grabber')

const extractedData = require(`${path}/english_xml/JSON_minified/extractedData_min.json`)
const json = { "imgURL":[] }

async function PerksURLGrabber() {
	// Grab Image URLs
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
	folders.forEach(folder => {
		const directory = `${path}/${folder}/`
		const file = require(`${directory}/JSON/extractedData.json`);
		file.perks.URL = json.imgURL;
		fs.writeFileSync(directory + 'JSON/' + 'extractedData.json', JSON.stringify(file, null, 4));
		fs.writeFileSync(directory + 'JSON_minified/' + 'extractedData_min.json', JSON.stringify(file));
	});
}

PerksURLGrabber()
console.log('Ended.')