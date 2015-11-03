var fs = require('fs');
/**
path 要替换的目录
file 要替换的文件内容
fileName 要替换的文件名称
replace keyboard.js IELTS_Writing /s
*/
function replaceFiles(path,file,fileName){
	var scanPath=function(temppath){
		files = fs.readdirSync(temppath);
		files.forEach(function(item) {  
			//var tmpPath = temppath + '/' + item;
			replaceFile(temppath,item);
		});
	};
	var replaceFile=function(path,will_file){
		var stats = fs.statSync(path + '/' + will_file);

		if (stats.isDirectory()) {
			scanPath(path + '/' + will_file);
		}else{
			if(will_file==fileName){
				// 创建读取流
				readable = fs.createReadStream(file,{
					flags : 'r',
					encoding : null,
					mode : 0666
				});
				// 创建写入流
				writable = fs.createWriteStream(path + '/' + will_file,{
					flags: 'w',
					encoding: null,
					mode: 0666   
				});   
				// 通过管道来传输流
				readable.pipe(writable);
			}
		}
	};
	scanPath(path);
}
replaceFiles('F:\\lesson_1_blue','F:\\keyboard.js','jquery.keyboard.js');