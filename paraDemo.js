/**
 * Module dependencies.
 * 依赖commander组件，安装方式npm install commander
 */

var program = require('commander');

program
  .version('0.0.1')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbq) console.log('  - bbq');
/*if (program.help){
	console.log('-p Add peppers');
	console.log('-P Add pineapple');
	console.log('-b Add bbq sauce');
	console.log('-c [type] Add the specified type of cheese [marble]');
};

program.on('--help', function(){
	console.log('-p Add peppers');
	console.log('-P Add pineapple');
	console.log('-b Add bbq sauce');
	console.log('-c [type] Add the specified type of cheese [marble]');
});*/

console.log('  - %s cheese', program.cheese);