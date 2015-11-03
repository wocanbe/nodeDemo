var jsonDoc = {
    "id": "jalsdfkjl300lj230jl-2342jl23",
    "name": "",
    "image": "",
    "type": "fill in the blank",
    "type id": "1104",
    "creator": "Hugo",
    "date of birth": "2013-12-21",
    "description": "",
    "tags": ["exercise", "test", "fill in the blank"],
    "estimated duration": "5",
    "count": "2",
    "content": []
};
var questionItem = {
    "order": "",
    "title": "",
    "text": "",
    "questions": [
        {
            "id": "blank_1",
            "answer": [],
            "order type": "1"
        }
    ]
};
var fs = require('fs');
var JsonFileName = "data.json";
var saveJson = fs.pathJoin(fs.workingDirectory, '', JsonFileName);
var JsFileName = "data.js";
var saveJs = fs.pathJoin(fs.workingDirectory, '', JsFileName);

var casper = require('casper').create();
var eles = [];
casper.echo("Casper CLI passed args:");
require("utils").dump(casper.cli.args);

casper.echo("Casper CLI passed options:");
require("utils").dump(casper.cli.options);
var inputHtmlFile = "core.html";
var outputHtmlFile = "core.htm";
if (casper.cli.args[0]&&casper.cli.args[0].indexOf(".htm") > 0) {
    inputHtmlFile = casper.cli.args[0];
}
if (casper.cli.args[1]&&casper.cli.args[1].indexOf(".htm") > 0) {
    outputHtmlFile = casper.cli.args[1];
}
var saveHtml = fs.pathJoin(fs.workingDirectory, '', outputHtmlFile);
var myBodyHtml = "";
var myCssHtml="";
var myCssLink=null;
casper.start(inputHtmlFile, function () {
    //读取core.html的body的html
    myBodyHtml = this.evaluate(function () {
        return $("body").html();
    });
    //this.echo(myBodyHtml);
    //读取core.html的common.css。
    myCssHtml=this.evaluate(function () {
        return $("head link")[0].outerHTML;
    });
    //this.echo(myCssHtml);
    //读取答案
    var anwsers = this.evaluate(function () {
        showAnswer();
        return readFn();
    });
    anwsers = JSON.parse(anwsers);
    this.echo(JSON.stringify(anwsers, null, '\t'));
    
    //读取每道填空题的题目文字部分，注意，需要根据具体题目的html调整下面第二行的css.
    var questionTexts = this.evaluate(function () {
        var questions = $($(".white_wrap p")[1]);
        var texts = [];
        for (var qId = 0; qId < questions.length; qId++) {
            var aInput = $(questions[qId]).find("input");
            var len = aInput.length;
            for (var i = 0; i < len; i++) {
                $(aInput[i]).replaceWith("#blank_" + (i + 1) + "#");
                //texts[i-1]=$(aInput[i-1]).prev().text()+"#blank_"+i+"#";
            }
            texts[qId] = $(questions[qId]).text();
        }
        return texts;
    });
    //this.echo(questionTexts);
    //根据抽取的标题生成题目的json，对应于activity.json的content:[]部分
    var questionItems = [];
    var answerId = 0;
    for (var i = 0; i < questionTexts.length; i++) {
        var question = {
            "order": "",
            "title": "",
            "text": questionTexts[i],
            "questions": []
        };
        this.echo("i=" + i + "\n");
        //this.echo(JSON.stringify(question));
        for (var k = 1; k < 20; k++) {
            if (questionTexts[i].indexOf("#blank_" + k + "#") >= 0) {
                this.echo("k=" + k + "\n");
                var anwser = {
                    "id": "blank_" + k,
                    "answer": anwsers[answerId].answer,
                    "order type": "1"
                };
                question.questions[k - 1] = anwser;
                answerId++;
            } else {
                break;
            }
        }
        questionItems[i] = question;
    }
    //this.echo(JSON.stringify(questionItems));
    //生成整个json。
    var myJsonDoc = {
        "id": "jalsdfkjl300lj230jl-2342jl23",
        "name": "",
        "image": "",
        "type": "fill in the blank",
        "type id": "1104",
        "creator": "Hugo",
        "date of birth": "2013-12-21",
        "description": "",
        "tags": ["exercise", "test", "fill in the blank"],
        "estimated duration": "5",
        "count": "2",
        "content": []
    };
    myJsonDoc.content = questionItems;
    var jsonText = JSON.stringify(myJsonDoc, null, '\t');
    this.echo(jsonText);
    //将生成的json写到data.json和data.js中。
    fs.write(saveJson, jsonText, 'w');
    var jsText = "var data=" + jsonText;
    fs.write(saveJs, jsText, 'w');
});
casper.thenOpen("index.html", function () {
    myHead = this.evaluate(function (myCssHtml) {
        //替换index.html中的common.css为core.html中的common.css
        $($("head link")[0]).replaceWith($(myCssHtml));
        var myHtml=$("head").html();
        return myHtml;
    },myCssHtml);
    //this.echo(myHead);
    //将前几部的html片段合成为一个新的core.htm文件。
    var myHtmlText='<!DOCTYPE html>\n<html lang="zh-cn">\n<head>\n'+myHead+'\n</head>\n<body>\n'+myBodyHtml+'\n</body>\n</html>';
    fs.write(saveHtml, myHtmlText, 'w');
});
casper.run(function () {
    this.exit();
});