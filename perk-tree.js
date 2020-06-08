const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const path = './Localization'
const { perks } = require(`${path}/english_xml/JSON_minified/extractedData_min.json`)

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
let Data = {}
function getID(name){
	return perks.name.indexOf(toTitleCase(name.split('Blase').join('Blasé')))
}

async function GetPerkTrees(){
	for(let i = 1; i < 8; i++){
		Data[`${i}`] = [];
		const res = await fetch(`https://www.luxordoesntframe.com/perk-tree-${i}.html`)
		const html = await res.text()

		const $ = cheerio.load(html);
		$('div#perk_tree > div').each(function(){
			let row = []
			$(this).children().each(function(e){
				row.push($(this).find('p').text())
			})
			Data[`${i}`].push(row.map(e => getID(e)));
		})
	}
	fs.writeFileSync('./all-perk-trees.json',JSON.stringify(Data))
	return Data;
}

async function GetPerkTree(i){
		Data = [];
		const res = await fetch(`https://www.luxordoesntframe.com/perk-tree-${i}.html`)
		const html = await res.text()

		const $ = cheerio.load(html);
		$('div#perk_tree > div').each(function(){
			let row = []
			$(this).children().each(function(e){
				row.push($(this).find('p').text())
			})
			Data.push(row.map(e => getID(e)));
		})
	return Data;
}

async function GetCurrentPerkTree(){
	const cpt = await CurrentPerkTree()
}
async function CurrentPerkTree(){
	const res = await fetch('https://www.luxordoesntframe.com/')
	const html = await res.text()
	const $ = cheerio.load(html);
	const title = $('head > title')
	return title.text().split('#').slice(1).join('')
}

async function main(){
	// const perk_trees = await GetPerkTrees()
	const current_perk_tree = await GetCurrentPerkTree();
	console.log(current_perk_tree)
	console.log(await GetPerkTree(3))

}
main()