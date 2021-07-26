importClass(android.database.sqlite.SQLiteDatabase);

var questionCommon = require("./questionCommon.js");

var lCount = 1; //挑战答题轮数
var qCount = random(6, 8); //挑战答题每轮答题数
/**
 * @description: 挑战答题
 * @param: null
 * @return: null
 */
function challengeQuestion(lNum) {
    let conNum = 0; //连续答对的次数
    // let lNum = 0;//轮数
    while (true) {
        // sleep(1000)
        if (!className("RadioButton").exists()) {
            console.error("没有找到题目！请检查是否进入答题界面！");
            console.log("停止");
            break;
        }
        // while(!className("ListView").exists());
        questionCommon.challengeQuestionLoop(conNum, qCount);
        sleep(questionCommon.randomNum(2, 5) * 1000);
        // sleep(4000);
        if (text("v5IOXn6lQWYTJeqX2eHuNcrPesmSud2JdogYyGnRNxujMT8RS7y43zxY4coWepspQkvw" +
                "RDTJtCTsZ5JW+8sGvTRDzFnDeO+BcOEpP0Rte6f+HwcGxeN2dglWfgH8P0C7HkCMJOAAAAAElFTkSuQmCC").exists()) //遇到❌号，则答错了,不再通过结束本局字样判断
        {
            if (conNum >= qCount) {
                lNum++;
                if (lNum >= lCount) {
                    console.verbose("挑战答题结束！");
                } else {
                    console.verbose("等5秒开始下一轮...");
                }
                back();
                sleep(1000);
                back();
                break;
            } else {
                console.error("出现错误，等5秒重新开始...");
                sleep(3000); //等待5秒才能开始下一轮
                back();
                //desc("结束本局").click();//有可能找不到结束本局字样所在页面控件，所以直接返回到上一层
                sleep(2000);
                text("再来一局").click();
                sleep(4000);
                conNum = 0;
            }
        } else //答对了
        {
            conNum++;
        }
    }
}

function main() {
    console.setPosition(0, device.height / 2); //部分华为手机console有bug请注释本行
    console.show();
    if (text("每日答题").exists()) {
        for (i = 0; i < lCount; i++) {
            let myImage = className("android.view.View").text("每日答题").findOne();
            // console.log(myImage.parent().parent().childCount());
            myImage = myImage.parent().parent().child(10);
            myImage.click();
            console.warn("第" + (i + 1) + "轮挑战答题");
            sleep(6000);
            challengeQuestion(i);
        }
    } else {
        console.verbose("开始挑战答题");
        sleep(1000);
        challengeQuestion(1);
    }
    // answerWrong();
    console.hide()
}

module.exports = main;