const fs = require('fs')
const xml2js = require('xml2js');
 
const parser = new xml2js.Parser();

const path = './Localization'

const folders = fs.readdirSync(path)
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
				const value = (typeof row.Cell[2].Data == 'undefined') ? ((typeof row.Cell[1].Data == 'undefined') ? '' : row.Cell[1].Data[0]._) : row.Cell[2].Data[0]._;
				unordered[key] = value
			})

			let json = {};
			Object.keys(unordered).sort().forEach(key => {
				json[key] = unordered[key];
			});	
	
			if (!fs.existsSync(directory + 'JSON/')) fs.mkdirSync(directory + 'JSON/')
			if (!fs.existsSync(directory + 'JSON_minified/')) fs.mkdirSync(directory + 'JSON_minified/')

			fs.writeFileSync(directory + 'JSON/' + file.split('.xml').join('.json'), JSON.stringify(json, null, 4));
			fs.writeFileSync(directory + 'JSON_minified/' + file.split('.xml').join('_min.json'), JSON.stringify(json));

			if(file !== 'text_ui_deceitmenu.xml') return;
			
			const extractedData = {"cosmetics":[], "perks":{"name":[], "description":[], "englishName":[], "imgURL":[]}}
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
			keys = ['Hair', 'Accessories', 'Clothes', 'Wrist', 'Pistol', 'Knife', 'VP', 'DP']
			keys.forEach(key => {
				const prefix = `UI_Perk${key}_`;
				Object.keys(json).forEach(e => {
					if(!e.startsWith(prefix)) return;
					if(isNaN(e.split(prefix)[1])) return;
					const id = e.split(prefix)[1]
					const name = json[e]
					extractedData.perks[id] = name;
				});
			})

			fs.writeFileSync(directory + 'JSON/' + 'extractedData.json', JSON.stringify(extractedData, null, 4));
			fs.writeFileSync(directory + 'JSON_minified/' + 'extractedData_min.json', JSON.stringify(extractedData));
		})
	})
})
console.log('ended')