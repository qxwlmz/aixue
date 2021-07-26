importClass(android.database.sqlite.SQLiteDatabase);

var questionCommon = require("./questionCommon.js");

var lCount = 2; //挑战答题轮数
var rightCount; //正确答题次数

/**
 * @description: 争上游答题
 * @param: null
 * @return: null
 */
function competition(lNum) {
    let conNum = 0; //连续答对的次数
    // let lNum = 10; //轮数
    if (text("网络较差").exists()) {
        toastLog("网络较差！下次再战！");
        return;
    }
    for (i = 0; i < lNum; i++) {
        if (lNum > 1) {
            console.warn("第" + (i + 1) + "轮争上游答题");
            text("开始比赛").click();
            while (!text("开始").exists());
        } else if (text("开始比赛").exists()) {
            console.verbose("开始争上游答题");
            text("开始比赛").click();
            while (!text("开始").exists());
        } else if (className("android.view.View").text("").exists()) {
            console.verbose("开始双人对战");
            className("android.view.View").text("").findOne().click();
            while (!text("开始").exists());
            // text("").click();
            // while (text("邀请对手").exists());
            // text("开始对战").click();
        }
        //sleep(4000);
        conNum = 0; //连续答对的次数
        rightCount = 0; //答对题数
        /* if (!className("android.view.View").depth(29).exists()) {
            while (!text("开始").exists()); 
        } */
        // while(!className("RadioButton").exists());
        while (rightCount < 5) {
            // sleep(1000)
            // while (!className("ListView").exists());
            /*if (!className("RadioButton").exists()) {
                console.error("没有找到题目！请检查是否进入答题界面！");
                console.log("停止");
                break;
            }*/
            try {
                // var isRight = false;
                // isRight = questionCommon.competitionLoop(conNum);
                if (questionCommon.competitionLoop(conNum)) {
                    rightCount++;
                }
            } catch (error) {
                // console.error(error);
            }

            // console.error("正确题数：" + rightCount)
            if (text("100").depth(24).exists() || text("继续挑战").exists()) {
                toastLog("有人100了");
                break;
            }
            //sleep(randomNum(4, 6) * 1000);
            //sleep(3000);
            conNum++;

        }
        sleep(5000);
        if ((lNum - i) > 1) {
            text("继续挑战").click();
            sleep(1000);
        }
    }
    let listPepole = className("android.widget.Image").depth(29).find();
    if (listPepole.length > 2) {
        console.verbose("争上游答题结束");
        for (i = 0; i < 2; i++) {
            sleep(1000);
            back();
        }
    } else {
        console.verbose("双人对战结束");
        sleep(5000);
        back();
        sleep(1000);
        back();
        text("退出").click();
    }
}

/**
 * @description: 争上游答题
 * @param: null
 * @return: null
 */
function competitionnew(lNum) {
    let conNum = 0; //连续答对的次数
    // let lNum = 10; //轮数
    if (text("网络较差").exists()) {
        toastLog("网络较差！下次再战！");
        return;
    }
    for (i = 0; i < lNum; i++) {
        if (lNum > 1) {
            console.warn("第" + (i + 1) + "轮争上游答题");
            text("开始比赛").click();
            while (!text("开始").exists());
        } else if (text("开始比赛").exists()) {
            console.verbose("开始争上游答题");
            text("开始比赛").click();
            while (!text("开始").exists());
        } else if (className("android.view.View").text("").exists()) {
            console.verbose("开始双人对战");
            className("android.view.View").text("").findOne().click();
            while (!text("开始").exists());
            // text("").click();
            // while (text("邀请对手").exists());
            // text("开始对战").click();
        }
        //sleep(4000);
        conNum = 0; //连续答对的次数
        rightCount = 0; //答对题数
        /* if (!className("android.view.View").depth(29).exists()) {
            while (!text("开始").exists());
        } */
        // while(!className("RadioButton").exists());

        questionCommon.competitionLoop()
        sleep(5000);
        if ((lNum - i) > 1) {
            text("继续挑战").click();
            sleep(1000);
        }
    }
    let listPepole = className("android.widget.Image").depth(29).find();
    if (listPepole.length > 2) {
        console.verbose("争上游答题结束");
        for (i = 0; i < 2; i++) {
            sleep(1000);
            back();
        }
    } else {
        console.verbose("双人对战结束");
        sleep(5000);
        back();
        sleep(1000);
        back();
        text("退出").click();
    }
}

function main() {
    console.setPosition(0, device.height * 0.5); //部分华为手机console有bug请注释本行
    console.show();
    if (text("每日答题").exists()) {
        let myImage = className("android.view.View").text("每日答题").findOne();
        // console.log(myImage.parent().parent().childCount());
        myImage = myImage.parent().parent().child(8);
        myImage.click();
        //sleep(1000);
        //className("android.view.View").text("").findOne().click();
        // console.log("开始争上游答题")
        sleep(1000);
        // challengeQuestion();
        competition(lCount);
    } else {
        competition(1);
    }

    // answerWrong();
    //console.hide()
    allCount = 0;
}

module.exports = main;