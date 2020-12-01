const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const path = './Localization'
const { perks } = require(`${path}/english_xml/JSON_minified/extractedData_min.json`)
const perk_tree_type = {"0":[[1,0],[2,3],[1,1],[2,0],[1,4],[3,0],[3,3],[2,1],[4,0],[2,4],[3,0],[3,3],[2,2]],"1":[[1,0],[2,3],[3,1],[2,0],[2,4],[1,0],[2,3],[3,1],[4,0],[3,4],[2,0],[1,3],[3,2]],"2":[[1,0],[3,3],[2,1],[1,0],[2,4],[3,0],[2,3],[2,1],[3,0],[2,4],[3,0],[2,3],[3,2]],"3":[[1,0],[2,3],[2,1],[1,0],[3,4],[2,0],[3,3],[3,1],[2,0],[3,4],[2,0],[3,3],[2,2]],"4":[[1,0],[2,3],[2,1],[3,0],[2,4],[3,0],[2,3],[2,1],[4,0],[2,4],[1,0],[3,3],[2,2]],"5":[[1,0],[2,3],[2,1],[3,0],[2,4],[3,0],[2,3],[2,1],[3,0],[2,4],[2,0],[3,3],[2,2]],"6":[[1,0],[2,3],[2,1],[3,0],[2,4],[2,0],[3,3],[2,1],[3,0],[2,4],[2,0],[3,3],[2,2]]};

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
	for(let i = 0; i < 7; i++){
		Data[`${i}`] = [];
		const res = await fetch(`https://www.luxordoesntframe.com/perk-tree-${i + 1}.html`)
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
	fs.writeFileSync('./all-perk-trees.json',JSON.stringify({ "perk-trees": Data, "tree-shapes": perk_tree_type }))
	return Data;
}

async function GetPerkTree(i){
		Data = [];
		const res = await fetch(`https://www.luxordoesntframe.com/perk-tree-${i + 1}.html`)
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
	const perk_trees = await GetPerkTrees()
	const current_perk_tree = await GetCurrentPerkTree();
	console.log(current_perk_tree)
	console.log(await GetPerkTree(3))

}
main()