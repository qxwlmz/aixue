importClass(android.database.sqlite.SQLiteDatabase);

var questionCommon = require("./questionCommon.js");

/**
 * @description: 每日答题
 * @param: null
 * @return: null
 */
function dailyQuestion() {
    let dlNum = 0;//每日答题轮数
    while (true) {
        sleep(questionCommon.randomNum(1, 4) * 1000);
        while(!(textStartsWith("填空题").exists() || textStartsWith("多选题").exists() || textStartsWith("单选题").exists()));
        if (!(textStartsWith("填空题").exists() || textStartsWith("多选题").exists() || textStartsWith("单选题").exists())) {
            console.error("没有找到题目！请检查是否进入答题界面！");
            console.log("停止");
            break;
        }
        questionCommon.dailyQuestionLoop();
        while ((!(textStartsWith("+").exists())) && (dlNum > 4)){
            if (id("message").exists()) {
                id("button1").findOne().click();
            }
        }
        if (text("再练一次").exists()) {
            console.verbose("每周答题结束！");
            text("返回").click(); sleep(2000);
            back();
            break;
        } else if (text("查看解析").exists()) {
            console.verbose("专项答题结束！");
            back();sleep(500);
            back();sleep(500);
            break;
        } else if (text("再来一组").exists()) {
            sleep(2000);
            dlNum++;
            if (!text("领取奖励已达今日上限").exists()) {
                text("再来一组").click();
                console.warn("第" + (dlNum + 1).toString() + "轮答题:");
                sleep(1000);
            }
            else {
                console.verbose("每日答题结束！");
                while(!text("返回").exists());
                text("返回").click(); sleep(2000);
                break;
            }
        }
    }
}

function main() {
    console.setPosition(0, device.height * 0.5);
    console.show();
    if (text("每日答题").exists()) {
        for (i = 0 ; i < 1 ; i++) {
            console.warn("第" + (i + 1) + "轮每日答题");
            text("每日答题").click();
            sleep(1000);
            dailyQuestion();
        }
    } else {
        console.verbose("开始每日答题");
        sleep(1000);
        dailyQuestion();
    }
    console.hide();
}
// 双填空需要两个空字数相等
// 双填空测试四月第二周（正常）
// 复杂填空民法典专项一（已支持）
// main() // 调试完记得注释掉
module.exports = main;
// exports.dailyQuestionLoop = dailyQuestionLoop;