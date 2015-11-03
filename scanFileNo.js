var fs = require('fs');
function scanFolder(path){
    var fileList = [],
        folderList = [],
		scanFileNo=function(path){
			var fileNo = 0;
			files = fs.readdirSync(path);
			files.forEach(function(item) {  
				var tmpPath = path + '/' + item,
					stats = fs.statSync(tmpPath);

				if (!stats.isDirectory()) {  
					fileNo++;
				}  
			});
			return fileNo
		},
        walk = function(path, folderList){
            files = fs.readdirSync(path);
            files.forEach(function(item) {  
                var tmpPath = path + '/' + item,
                    stats = fs.statSync(tmpPath);

                if (stats.isDirectory()) {
                    folderList.push({'path':item,'fileNo':scanFileNo(tmpPath)}); 
                }
            });  
        };
    walk(path, folderList);
    console.log('扫描' + path +'成功');
	console.log(folderList);
    return {
        'folders': folderList
    }
}
scanFolder('F:\\lesson_1_blue\\L4A');