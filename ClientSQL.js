//ClientSQL.js
var ClientSQL = function(){
	var base = new Object();
	base.tables = new Object();
	function resolve(){
		for(i in base.tables){
			console.log(i+":tabla");
			table = base.tables[i];
			for(j = 0; j < table.structure.length; j++){
				struc = table.structure[j];
				for(k = 0; k < table.data.length; k++){
					row = table.data[k];
					if(typeof row[j] === "undefined"){
						base.tables[i].data[k][j] = "";
					}
				}
			}
		}
	}
	this.query = function(query){
		query = query.split(/\s+/g);
		if(query[0] === "CREATE" && query[1] === "TABLE"){
			var structure = query[3].replace(/[()]/g,'').split(",");
			base.tables[query[2]] = {
				structure: structure, 
				data: new Array()
			};
			return true;
		} else if(query[0] === "INSERT" && query[1] === "INTO"){
			var keys = query[3].replace(/[()]/g,'').split(",");
			for(i = 0; i < keys.length; i++){
				keys[i] = base.tables[query[2]].structure.indexOf(keys[i]);
			}
			var values = query[5].replace(/[()]/g,'').split(",");
			for(i = 0; i < keys.length; i++){
				keys[i] = values[i].replace(/["']/g,""); 
			}
			base.tables[query[2]].data.push(keys);
			resolve();
			return true;
		} else if(query[0] === "SELECT"){
			var items = query[1].split(",");
			for(i = 0; i < items.length; i++){
				items[i] = base.tables[query[3]].structure.indexOf(items[i]);
			}
			var table = base.tables[query[3]];
			var where = query[5].replace(/["']/g,"").split("=");
			var rows = new Array();
			where[0] = base.tables[query[3]].structure.indexOf(where[0]);
			for(i = 0; i < table.data.length; i++){
				el = table.data[i];
				if(el[where[0]] == where[1]){
					rows.push(i);
				}
			}
			var results = new Array();
			var tmp = new Array();
			for(i = 0; i < rows.length; i++){
				for(j = 0; j < items.length; j++){
					tmp.push(base.tables[query[3]].data[i][j]);
				}
				results.push(tmp);
			}
			return results;
		}
		return false;
	}
}