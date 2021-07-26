var tikuCommon = require("./tikuCommon.js");

/*************************************************公共部分******************************************************/
/**
 * @description: 延时函数
 * @param: seconds-延迟秒数
 * @return: null
 */
function delay(seconds) {
    sleep(1000 * seconds); //sleep函数参数单位为毫秒所以乘1000
}

/**
 * @description: 生成从minNum到maxNum的随机数
 * @param: minNum-较小的数
 * @param: maxNum-较大的数
 * @return: null
 */
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
            return 0;
    }
}

/**
 * @description: 返回字段首字母序号
 * @param: str
 * @return: int 字母序号
 */
function indexFromChar(str) {
    return str.charCodeAt(0) - "A".charCodeAt(0);
}

/**
 * @description: 返回字段首字母
 * @param: int 字母序号
 * @return: str
 */
function charFromIndex(int) {
    return String.fromCharCode("A".charCodeAt(0) + int);
}

/*************************************************挑战答题部分******************************************************/
/**
 * @description: 答错后查找正确答案
 * @param: delayTime, myColor, myThreshold, listArray, options
 * @return: correctAns 正确答案
 */
function findCorrectAnswer(delayTime, myColor, myThreshold, listArray, options) {
    console.hide(); //隐藏console控制台窗口
    sleep(delayTime); //等待截屏
    var img = captureScreen(); //截个屏
    // let imgName = "./ddd" + new Date().getTime() + ".png";
    // let imgName = "./ddd.png";
    // captureScreen(imgName);//截个屏
    // var img = images.read(imgName);
    // toastLog(imgName);
    console.show(); //显示console控制台窗口
    //delay(3);
    // 查找绿色答案#f24650
    var correctAns = new Array();
    listArray.some(item => {
        var listBounds = item.bounds();
        // console.log(listBounds);
        var point = findColor(img, myColor, {
            region: [listBounds.left, listBounds.top, listBounds.right - listBounds.left, listBounds.bottom - listBounds.top],
            threshold: myThreshold
        });
        if (point) {
            correctAns.push(options[listArray.indexOf(item)]);
            correctAns.push(charFromIndex(listArray.indexOf(item)));
            toastLog(correctAns);
            return true;
        } else {
            // console.log("没找到");
        }
    });
    return correctAns;
}

/**
 * @description: 每次答题循环
 * @param: conNum 连续答对的次数
 * @return: null
 */
function challengeQuestionLoop(conNum, qCount) {
    if (conNum >= qCount) //答题次数足够退出，每轮5次
    {
        let listArray = className("ListView").findOnce().children(); //题目选项列表
        let i = random(0, listArray.length - 1);
        console.log("本轮次数足够，随机点击一个答案，答错进入下一轮");
        listArray[i].child(0).click(); //随意点击一个答案
        console.log("----------------------------------");
        return;
    }

    if (className("ListView").exists()) {
        var question = className("ListView").findOnce().parent().child(0).text();
        console.log((conNum + 1).toString() + ".题目：" + question);
    } else {
        console.error("提取题目失败!");
        let listArray = className("ListView").findOnce().children(); //题目选项列表
        let i = random(0, listArray.length - 1);
        console.log("随机点击一个");
        listArray[i].child(0).click(); //随意点击一个答案
        return;
    }

    var chutiIndex = question.lastIndexOf("出题单位");
    if (chutiIndex != -1) {
        question = question.substring(0, chutiIndex - 2);
    }

    question = question.replace(/\s/g, "");

    var options = []; //选项列表
    if (className("ListView").exists()) {
        className("ListView").findOne().children().forEach(child => {
            var answer_q = child.child(0).child(1).text();
            options.push(answer_q);
        });
    } else {
        console.error("答案获取失败!");
        return;
    }

    // 特殊情况外理
    let specialQuestion = ["选择词语的正确词形。", "选择正确的读音。", "下列词形正确的是。来源：《现代汉语词典》（商务印书馆2016年第7版）", "下列读音正确的是。来源：《现代汉语词典》（商务印书馆2016年第7版）", "选择正确的读音。来源：《现代汉语词典（第七版）》（商务印书馆2017年版）"]
    if (specialQuestion.indexOf(question) > -1) {
        question = question + options[0];
    }

    var answer = tikuCommon.getAnswer(question, '挑战题');
    /* if (answer.length == 0) { //tiku表中没有则到tikuNet表中搜索答案
        answer = getAnswer(question, 'tikuNet');
    } */

    if (/^[a-zA-Z]{1}$/.test(answer)) { //如果为ABCD形式
        var indexAnsTiku = indexFromChar(answer.toUpperCase());
        answer = options[indexAnsTiku];
        var url = "https://api.myue.gq/xuexi/renew.php";
        var res = http.post(url, {
            "question": question,
            "answer": answer
        });
        var html = res.body.string();
        console.log(answer);
    }

    let hasClicked = false;
    var listArray = className("ListView").findOnce().children(); //题目选项列表
    if ((answer == "") || !textEndsWith(answer).exists()) //如果没找到答案
    {
        let i = random(0, listArray.length - 1);
        console.error("没有找到答案，随机点击一个");
        listArray[i].child(0).click(); //随意点击一个答案

        var delayTime = 800;
        var myColor = "#44BF78";
        var myThreshold = 4;
        var correctAns = findCorrectAnswer(delayTime, myColor, myThreshold, listArray, options);
        console.info("正确答案是:" + correctAns[0]);

        /* console.hide(); //隐藏console控制台窗口
        sleep(100); //等待截屏
        var img = captureScreen();//截个屏
        // captureScreen("./ddd.png");//截个屏
        // var img = images.read("./ddd.png");
        console.show(); //显示console控制台窗口
        //delay(3);
        // 查找绿色答案#f24650
        var correctAns = false;
        listArray.forEach(item => {
            var listBounds = item.bounds();
            // console.log(listBounds);
            var point = findColor( img, "#44BF78", {
                region: [listBounds.left, listBounds.top, listBounds.right-listBounds.left, listBounds.bottom-listBounds.top],
                threshold: 4
            });
            if(point){
                correctAns = options[listArray.indexOf(item)];
                console.log("正确答案是:" + correctAns);
            }else{
                // console.log("没找到");
            }
        }); */

        hasClicked = true;
        // 更新题库
        // delay(1);
        if (correctAns) //如果答案不是null，就更新题库
        {
            if (answer == "") {
                if (correctAns[0] != undefined) {
                    var url = "https://api.myue.gq/xuexi/commit.php";
                    var res = http.post(url, {
                        "question": question,
                        "answer": correctAns[0],
                        "category": '挑战题'
                    });
                    var html = res.body.string();
                    console.log(correctAns[0]);
                    console.log(html);
                }
                //var sql = "INSERT INTO tiku (question, option, answer, wrongAnswer) VALUES ('" + question + "','" + correctAns[1] + "','" + correctAns[0] + "','')";
            } else {
                //var sql = "UPDATE tiku SET answer='" + correctAns[0] + "' option='" + correctAns[1] + "' WHERE question LIKE '" + question + "'";
                var url = "https://api.myue.gq/xuexi/renew.php";
                var res = http.post(url, {
                    "question": question,
                    "answer": correctAns[0]
                });
                var html = res.body.string();
                console.log(question);
                console.log(html);
            }
            // console.log(correctAns);
            console.log("更新题库答案...");
        }
        console.log("-------------------------------");
    } else //如果找到了答案
    {
        /* listArray.some(item => {
            var listDescStr = item.child(0).child(1).text();
            console.error(deleteNO(listDescStr));
            if (deleteNO(listDescStr) == answer) {
                item.child(0).click(); //点击答案
                hasClicked = true;
                rightCount++;
                console.log("-------------------------------");
                return true;
            }
        }); */
        console.info("答案：" + answer);
        var optletters = charFromIndex(options.indexOf(answer));
        // toastLog(optletters);
        //tikuCommon.insertOrUpdate(sql);
        // console.log("更新题库答案...");
        text(answer).click();
        hasClicked = true;
        console.log("-------------------------------");

        var delayTime = 120;
        var myColor = "#44BF78";
        var myThreshold = 4;
        // var correctAns = findCorrectAnswer(delayTime, myColor, myThreshold, listArray, options);

        delay(1);
        if (text("v5IOXn6lQWYTJeqX2eHuNcrPesmSud2JdogYyGnRNxujMT8RS7y43zxY4coWepspQkvw" +
                "RDTJtCTsZ5JW+8sGvTRDzFnDeO+BcOEpP0Rte6f+HwcGxeN2dglWfgH8P0C7HkCMJOAAAAAElFTkSuQmCC").exists()) //遇到❌号，则答错了,不再通过结束本局字样判断
        {
            // var sql = "DELETE FROM tiku WHERE question = '" + question + "'";
            // tikuCommon.insertOrUpdate(sql);
            // toastLog("答案有误，删除此题！");
            var correctAns = findCorrectAnswer(delayTime, myColor, myThreshold, listArray, options);
            console.info("正确答案是:" + correctAns);
            var url = "https://api.myue.gq/xuexi/renew.php";
            var res = http.post(url, {
                "question": question,
                "answer": correctAns[0]
            });
            var html = res.body.string();
            console.log(html);
            toastLog("答案有误，已更正答案！");
        }
    }
    if (!hasClicked) //如果没有点击成功
    {
        console.error("未能成功点击，随机点击一个");
        let i = random(0, listArray.length - 1);
        listArray[i].child(0).click(); //随意点击一个答案
        console.log("-------------------------------");
    }
}

/*************************************************争上游、双人对战部分*************************************************/
/**
 * @description: 答题争上游、双人对战，去掉题目和答案前面的序号
 * @param: str 问题或答案
 * @return: 去掉序号后的题目或答案
 */
function deleteNO(str) {
    /* if (className("android.view.View").textStartsWith("距离答题结束").exists()) {
        // console.log(str.slice(3));
        return str.slice(3);
    } else {
        return str;
    } */
    return str.slice(3);
}

/*************************************************争上游答题部分******************************************************/
/**
 * @description: 双人对战答题循环
 * @param: conNum 连续答对的次数
 * @return: null
 */
function competitionLoop(conNum) {
    var question = "";
    // className("android.view.View").depth(29).waitFor();
    while (question == "") {
        // console.error(conNum);
        // if (className("ListView").exists()) {
        // question = className("ListView").findOnce().parent().child(0).text();
        if (className("android.view.View").depth(29).exists() && !text("继续挑战").exists()) {
            question = className("android.view.View").depth(29).findOnce().text();
            // console.log(question);
            if (question == "") {
                return false;
            }
            if (question.slice(0, question.indexOf(".")) == conNum) {
                question = "";
            } else {
                question = deleteNO(question);
                console.log((conNum + 1).toString() + ".题目：" + question);

                var chutiIndex = question.lastIndexOf("出题单位");
                if (chutiIndex != -1) {
                    question = question.substring(0, chutiIndex - 2);
                }

                question = question.replace(/\s/g, "");


                // className("ListView").waitFor();
                sleep(500);
                var listArray = className("ListView").findOnce().children(); //题目选项列表
                // 特殊情况外理
                let specialQuestion = ["选择词语的正确词形。", "选择正确的读音。"]
                if (specialQuestion.indexOf(question) > -1) {
                    question = question + deleteNO(listArray[0].child(0).child(1).text());
                }

                var answer = tikuCommon.getAnswer(question, '对战题');
                /* if (answer.length == 0) { //tiku表中没有则到tikuNet表中搜索答案
                    answer = getAnswer(question, 'tikuNet');
                } */


                if (/^[a-zA-Z]{1}$/.test(answer)) { //如果为ABCD形式
                    var indexAnsTiku = indexFromChar(answer.toUpperCase());
                    answer = listArray[indexAnsTiku].child(0).child(1).text();
                    answer = deleteNO(answer);
                    var url = "https://api.myue.gq/xuexi/renew.php";
                    var res = http.post(url, {
                        "question": question,
                        "answer": answer
                    });
                    var html = res.body.string();
                    console.log(answer);
                }

                if (text("100").depth(24).exists()) {
                    toastLog("有人100了");
                    return;
                }


                let hasClicked = false;
                // let listArray = className("ListView").findOnce().children(); //题目选项列表
                if (answer == "") //如果没找到答案
                {
                    let i = random(0, listArray.length - 1);
                    console.error("没有找到答案，随机点击一个");
                    listArray[i].child(0).click(); //随意点击一个答案

                    var options = []; //选项列表
                    while (options.length == 0) {
                        if (className("ListView").exists()) {
                            className("ListView").findOne().children().forEach(child => {
                                var answer_q = child.child(0).child(1).text();
                                options.push(answer_q);
                            });
                        } else {
                            console.error("答案获取失败!");
                            return;
                        }
                    }

                    var delayTime = 1055;
                    var myColor = "#2BC87E";
                    var myThreshold = 25;
                    var correctAns = findCorrectAnswer(delayTime, myColor, myThreshold, listArray, options);

                    // 更新题库
                    // delay(1);
                    if (correctAns) //如果答案不是null，就更新题库
                    {
                        correctAns[0] = deleteNO(correctAns[0]);
                        console.info("正确答案是:" + correctAns[0]);
                        // console.log(correctAns);
                        var url = "https://api.myue.gq/xuexi/commit.php";
                        var res = http.post(url, {
                            "question": question,
                            "answer": correctAns[0],
                            "category": '对战题'
                        });
                        var html = res.body.string();
                        console.log(html);
                        console.log("更新题库答案...");
                    }
                    if (correctAns[0] == deleteNO(options[i])) { //listArray[i].child(0).child(1).text()
                        return true;
                    }
                    console.log("-------------------------------");
                    hasClicked = true;
                } else //如果找到了答案
                {
                    console.info("答案：" + answer);
                    /* listArray.some(item => {
                        var listDescStr = item.child(0).child(1).text();
                        console.error(deleteNO(listDescStr));
                        if (deleteNO(listDescStr) == answer) {
                            item.child(0).click(); //点击答案
                            hasClicked = true;
                            rightCount++;
                            console.log("-------------------------------");
                            return true;
                        }
                    }); */
                    if (textEndsWith(answer).exists()) {
                        /* var optletters = textEndsWith(answer).findOnce().text();
                        optletters = optletters[0];
                        toastLog(optletters); */
                        textEndsWith(answer).click();
                        hasClicked = true;
                        console.log("-------------------------------");
                        return true;
                    }
                }
                //console.error(hasClicked);
                if (!hasClicked) //如果没有点击成功
                {
                    console.error("未能成功点击，随机点击一个");
                    let i = random(0, listArray.length - 1);
                    listArray[i].child(0).click(); //随意点击一个答案
                    console.log("-------------------------------");
                }
                return false;
            }
        } else {
            // console.error("提取题目失败!");
            /* let listArray = className("ListView").findOnce().children(); //题目选项列表
            let i = random(0, listArray.length - 1);
            console.log("随机点击一个");
            listArray[i].child(0).click(); //随意点击一个答案 */
            // return false;
        }
        // delay(0.1);
    }


}

/**
 * @description: 双人对战答题循环
 * @param: conNum 连续答对的次数
 * @return: null
 */
function competitionLoopnew() {
    // var question = "";
    // className("android.view.View").depth(29).waitFor();
    while (className("android.view.View").depth(29).exists() && !text("继续挑战").exists()) {
        try {
            if (className("android.view.View").depth(29).exists() && !text("继续挑战").exists()) {
                var aquestion = className("android.view.View").depth(29).findOnce().text();
                var question = deleteNO(aquestion);
            }
            if (aquestion != oldaquestion && question != "") {

                console.log(aquestion.slice(0, aquestion.indexOf(".")) + ".题目：" + question);
                var chutiIndex = question.lastIndexOf("出题单位");
                if (chutiIndex != -1) {
                    question = question.substring(0, chutiIndex - 2);
                }

                question = question.replace(/\s/g, "");


                // className("ListView").waitFor();
                sleep(500);
                var listArray = className("ListView").findOnce().children(); //题目选项列表
                // 特殊情况外理
                let specialQuestion = ["选择词语的正确词形。", "选择正确的读音。"]
                if (specialQuestion.indexOf(question) > -1) {
                    question = question + deleteNO(listArray[0].child(0).child(1).text());
                }

                var answer = tikuCommon.getAnswer(question, '对战题');
                /* if (answer.length == 0) { //tiku表中没有则到tikuNet表中搜索答案
                    answer = getAnswer(question, 'tikuNet');
                } */


                /* 
                if (/^[a-zA-Z]{1}$/.test(answer)) { //如果为ABCD形式
                    var indexAnsTiku = indexFromChar(answer.toUpperCase());
                    answer = listArray[indexAnsTiku].child(0).child(1).text();
                    answer = deleteNO(answer);
                    toastLog("answer from char=" + answer);
                } */

                if (text("100").depth(24).exists()) {
                    toastLog("有人100了");
                    return;
                }


                let hasClicked = false;
                // let listArray = className("ListView").findOnce().children(); //题目选项列表
                if (answer == "") //如果没找到答案
                {
                    let i = random(0, listArray.length - 1);
                    console.error("没有找到答案，随机点击一个");
                    listArray[i].child(0).click(); //随意点击一个答案

                    var options = []; //选项列表
                    while (options.length == 0) {
                        if (className("ListView").exists()) {
                            className("ListView").findOne().children().forEach(child => {
                                var answer_q = child.child(0).child(1).text();
                                options.push(answer_q);
                            });
                        } else {
                            console.error("答案获取失败!");
                            return;
                        }
                    }

                    var delayTime = 1055;
                    var myColor = "#2BC87E";
                    var myThreshold = 25;
                    var correctAns = findCorrectAnswer(delayTime, myColor, myThreshold, listArray, options);

                    // 更新题库
                    // delay(1);
                    if (correctAns) //如果答案不是null，就更新题库
                    {
                        correctAns[0] = deleteNO(correctAns[0]);
                        console.info("正确答案是:" + correctAns[0]);
                        var sql = "INSERT INTO tiku (question, option, answer, wrongAnswer) VALUES ('" + question + "','" + correctAns[1] + "','" + correctAns[0] + "','')";
                        // console.log(correctAns);
                        var url = "https://api.myue.gq/xuexi/commit.php";
                        var res = http.post(url, {
                            "question": question,
                            "answer": correctAns[0]
                        });
                        var html = res.body.string();
                        console.log(html);
                        tikuCommon.insertOrUpdate(sql);
                        console.log("更新题库答案...");
                    }
                    /* if (correctAns[0] == deleteNO(options[i])) { //listArray[i].child(0).child(1).text()
                        return true;
                    } */
                    console.log("-------------------------------");
                    hasClicked = true;
                } else //如果找到了答案
                {
                    console.info("答案：" + answer);
                    /* listArray.some(item => {
                        var listDescStr = item.child(0).child(1).text();
                        console.error(deleteNO(listDescStr));
                        if (deleteNO(listDescStr) == answer) {
                            item.child(0).click(); //点击答案
                            hasClicked = true;
                            rightCount++;
                            console.log("-------------------------------");
                            return true;
                        }
                    }); */

                    if (textEndsWith(answer).exists()) {
                        /* var optletters = textEndsWith(answer).findOnce().text();
                        optletters = optletters[0];
                        toastLog(optletters); */
                        textEndsWith(answer).click();
                        hasClicked = true;
                        console.log("-------------------------------");
                        // return true;
                    }
                }
                //console.error(hasClicked);
                if (!hasClicked) //如果没有点击成功
                {
                    console.error("未能成功点击，随机点击一个");
                    let i = random(0, listArray.length - 1);
                    listArray[i].child(0).click(); //随意点击一个答案
                    console.log("-------------------------------");
                }
                // return false;
                var oldaquestion = aquestion; //对比新旧题目
            }
        } catch (e) {
            logDefault(e); //输出错误信息，调试用
            logError("出现错误，请检查3!");
            return;
        }
    }
}

/*************************************************每日答题部分***************************************************/
/**
 * @description: 获取填空题题目数组
 * @param: null
 * @return: questionArray
 */
function getFitbQuestion() {
    var questionCollections = className("EditText").findOnce().parent().parent();
    var questionArray = [];
    var findBlank = false;
    var blankCount = 0;
    var blankNumStr = "";
    var i = 0;
    questionCollections.children().forEach(item => {
        if (item.className() != "android.widget.EditText") {
            if (item.text() != "") { //题目段
                if (findBlank) {
                    blankNumStr = "|" + blankCount.toString();
                    questionArray.push(blankNumStr);
                    findBlank = false;
                }
                questionArray.push(item.text());
            } else {
                findBlank = true;
                blankCount = (className("EditText").findOnce(i).parent().childCount() - 1);
                i++;
            }
        }
    });
    /* questionArray.forEach( item=> {
        console.log(item);
    }) */
    return questionArray;
}

/**
 * @description: 获取选择题题目数组
 * @param: null
 * @return: questionArray
 */
function getChoiceQuestion() {
    var questionCollections = className("ListView").findOnce().parent().child(1);
    var questionArray = [];
    questionArray.push(questionCollections.text());
    return questionArray;
}


/**
 * @description: 获取提示字符串
 * @param: null
 * @return: tipsStr
 */
function getTipsStr() {
    var tipsStr = "";
    while (tipsStr == "") {
        if (text("查看提示").exists()) {
            var seeTips = text("查看提示").findOnce();
            seeTips.click();
            delay(1);
            click(device.width * 0.5, device.height * 0.41);
            delay(1);
            click(device.width * 0.5, device.height * 0.35);
        } else {
            console.error("未找到查看提示");
        }
        if (text("提示").exists()) {
            var tipsLine = text("提示").findOnce().parent();
            //获取提示内容
            if (tipsLine.parent().child(1).child(0).text() == "") {
                var tipsViewArray = tipsLine.parent().child(1).child(0).children();
            } else {
                var tipsViewArray = tipsLine.parent().child(1).children();
            }
            tipsViewArray.forEach(item => {
                if (item.text().substr(0, 2) != "--" || item.text().substr(0, 2) != "来源") {
                    tipsStr += item.text();
                }
            })
            // console.log("提示：" + tipsStr);
            //关闭提示
            tipsLine.child(1).click();
            break;
        }
        delay(1);
    }
    return tipsStr;
}


/**
 * @description: 从提示中获取填空题答案
 * @param: timu, tipsStr
 * @return: ansTips
 */
function getAnswerFromTips(timu, tipsStr) {
    var ansTips = "";
    for (var i = 1; i < timu.length - 1; i++) {
        if (timu[i].charAt(0) == "|") {
            var blankLen = timu[i].substring(1);
            var indexKey = tipsStr.indexOf(timu[i + 1]);
            var ansFind = tipsStr.substr(indexKey - blankLen, blankLen);
            ansTips += ansFind;
        }
    }
    return ansTips;
}

/**
 * @description: 根据提示点击选择题选项
 * @param: tipsStr
 * @return: clickStr
 */
function clickByTips(tipsStr) {
    var clickStr = "";
    var correctAnswerStr = "";
    var isFind = false;
    if (className("ListView").exists()) {
        var listArray = className("ListView").findOne().children();
        listArray.forEach(item => {
            var ansStr = item.child(0).child(2).text();
            if (tipsStr.indexOf(ansStr) >= 0) {
                item.child(0).click();
                clickStr += item.child(0).child(1).text().charAt(0);
                correctAnswerStr = ansStr;
                isFind = true;
            }
        });
        if (!isFind) { //没有找到 随机点击一个
            console.error("未能成功点击，随机点击一个");
            let i = random(0, listArray.length - 1);
            listArray[i].child(0).click();
            clickStr += listArray[i].child(0).child(1).text().charAt(0);
            correctAnswerStr = listArray[i].child(0).child(2).text();
        }
    }
    if (textStartsWith("单选题").exists()) {
        return correctAnswerStr;
    } else {
        return clickStr;
    }
}


/**
 * @description: 根据答案点击选择题选项
 * @param: answer
 * @return: null
 */
function clickByAnswer(answer) {
    var hasClicked = false;
    if (className("ListView").exists()) {
        var listArray = className("ListView").findOnce().children();
        listArray.forEach(item => {
            var listIndexStr = item.child(0).child(1).text().charAt(0);
            //单选答案为非ABCD
            var listDescStr = item.child(0).child(2).text();
            // console.log(listDescStr)
            if (answer == listDescStr) {
                item.child(0).click();
                hasClicked = true;
            } else if (answer.indexOf(listIndexStr) >= 0) {
                item.child(0).click();
                hasClicked = true;
            }
        });
        if (!hasClicked) { //没有找到 随机点击一个
            console.error("未能成功点击，随机点击一个");
            let i = random(0, listArray.length - 1);
            listArray[i].child(0).click();
            // clickStr += listArray[i].child(0).child(1).text().charAt(0);
            // correctAnswerStr = listArray[i].child(0).child(2).text();
        }
    }
}

/**
 * @description: 检查答案是否正确，并更新数据库
 * @param: question, ansTiku, answer
 * @return: null
 */
function checkAndUpdate(question, ansTiku, answer) {
    if (text("下一题").exists() || text("完成").exists()) { //答错了
        swipe(100, device.height - 100, 100, 100, 500);
        var nCount = 0
        while (nCount < 5) {
            if (textStartsWith("正确答案").exists()) {
                var correctAns = textStartsWith("正确答案").findOnce().text().substr(6);
                if (textStartsWith("单选题").exists()) {
                    //单选题选项
                    var optletters = correctAns;
                    // 单选题答案
                    var alpha = "ABCDEF";
                    let indexList = alpha.indexOf(correctAns);
                    var listArray = className("ListView").findOne().children();
                    // 找到答案项
                    correctAns = listArray[indexList].child(0).child(2).text();
                }
                console.info("正确答案是：" + correctAns);
                if (ansTiku == "") { //题库为空则插入正确答案                
                    var url = "https://api.myue.gq/xuexi/commit.php";
                    var res = http.post(url, {
                        "question": question,
                        "answer": correctAns,
                        "category": "填空题"
                    });
                    var html = res.body.string();
                    console.log(html);
                } else { //更新题库答案
                    //var sql = "UPDATE tiku SET answer='" + correctAns + "' option='" + optletters + "' WHERE question LIKE '" + question + "'";
                    var url = "https://api.myue.gq/xuexi/renew.php";
                    var res = http.post(url, {
                        "question": question,
                        "answer": correctAns
                    });
                    var html = res.body.string();
                    console.log(question);
                    console.log(html);
                }
                console.log("更新题库答案...");
                delay(1);
                break;
            } else {
                var clickPos = className("android.webkit.WebView").findOnce().child(2).child(0).child(1).bounds();
                click(clickPos.left + device.width * 0.13, clickPos.top + device.height * 0.1);
                console.error("未捕获正确答案，尝试修正");
            }
            nCount++;
        }
        if (className("Button").exists()) {
            className("Button").findOnce().click();
        } else {
            click(device.width * 0.85, device.height * 0.06);
        }
    } else { //正确后进入下一题，或者进入再来一局界面
        if (ansTiku == "" && answer != "") { //正确进入下一题，且题库答案为空              
            var url = "https://api.myue.gq/xuexi/commit.php";
            var res = http.post(url, {
                "question": question,
                "answer": answer,
                "category": '填空题'
            });
            var html = res.body.string();
            console.log(html);
            console.log("更新题库答案...");
        }
    }
}


/**
 * @description: 每日答题循环
 * @param: null
 * @return: null
 */
function dailyQuestionLoop() {
    if (textStartsWith("填空题").exists()) {
        var questionType = "填空题："; //questionType题型是什么
        var questionArray = getFitbQuestion();
        //console.log('填空题')
    } else if (textStartsWith("多选题").exists()) {
        var questionType = "多选题：";
        var questionArray = getChoiceQuestion();
        //console.log('选择题')
    } else if (textStartsWith("单选题").exists()) {
        var questionType = "单选题：";
        var questionArray = getChoiceQuestion();
    }

    var blankArray = [];
    var question = "";
    questionArray.forEach(item => {
        if (item != null && item.charAt(0) == "|") { //是空格数
            blankArray.push(item.substring(1));
        } else { //是题目段
            question += item;
        }
    });
    question = question.replace(/\s/g, "");
    console.log(questionType + question);

    // 特殊情况外理
    let specialQuestion = ["选择词语的正确词形。", "选择正确的读音。"]
    if (specialQuestion.indexOf(question) > -1) {
        question = question + className("ListView").findOnce().child(0).child(0).child(2).text();
    }
    var ansTiku = tikuCommon.getAnswer(question, '填空题');

    /* if (ansTiku.length == 0) {//tiku表中没有则到tikuNet表中搜索答案
        ansTiku = getAnswer(question, 'tikuNet');
    } */
    var answer = ansTiku.replace(/(^\s*)|(\s*$)/g, "");

    if (textStartsWith("填空题").exists()) {
        if (answer == "") {
            var tipsStr = getTipsStr();
            answer = getAnswerFromTips(questionArray, tipsStr);
            console.info("提示中的答案：" + answer);
            setText(0, answer.substr(0, blankArray[0]));
            if (blankArray.length > 1) {
                for (var i = 1; i < blankArray.length; i++) {
                    setText(i, answer.substr(blankArray[i - 1], blankArray[i]));
                }
            }
        } else {
            console.info("答案：" + answer);
            setText(0, answer.substr(0, blankArray[0]));
            if (blankArray.length > 1) {
                for (var i = 1; i < blankArray.length; i++) {
                    setText(i, answer.substr(blankArray[i - 1], blankArray[i]));
                }
            }
        }
    } else if (textStartsWith("多选题").exists() || textStartsWith("单选题").exists()) {
        if (answer == "") {
            var tipsStr = getTipsStr();
            answer = clickByTips(tipsStr);
            console.info("提示中的答案：" + answer);
        } else {
            console.info("答案：" + ansTiku);
            clickByAnswer(answer);
        }
    }

    delay(1.5);

    if (text("确定").exists()) {
        text("确定").click();
        delay(0.5);
    } else if (text("下一题").exists()) {
        click("下一题");
        delay(0.5);
    } else if (text("完成").exists()) {
        text("完成").click();
        delay(0.5);
    } else {
        console.warn("未找到右上角确定按钮控件，根据坐标点击");
        click(device.width * 0.85, device.height * 0.06); //右上角确定按钮，根据自己手机实际修改
    }

    checkAndUpdate(question, ansTiku, answer);
    console.log("---------------------");
    delay(2);
}

exports.randomNum = randomNum;
exports.challengeQuestionLoop = challengeQuestionLoop;
exports.competitionLoop = competitionLoop;
exports.dailyQuestionLoop = dailyQuestionLoop;