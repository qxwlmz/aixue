"ui";
//auto("fast");
importClass(android.view.View);
var tikuCommon = require("./tikuCommon.js");
let deviceWidth = device.width;

let margin = parseInt(deviceWidth * 0.02);

//记录集数组 重要！！！
let qaArray = [];

ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title={app.getAppName("cc.myue.aixue")} />
            </appbar>
            <viewpager id="viewpager">
                <frame>
                    <img src={"https://api.dujin.org/bing/m.php"} scaleType="centerCrop" alpha="0.5" />
                    <button id="showFloating" text="打开悬浮窗" w="150" h="60" circle="true" layout_gravity="center" style="Widget.AppCompat.Button.Colored" />
                </frame>
            </viewpager>
        </vertical>
        <vertical layout_gravity="left" bg="#ffffff" w="230">
            <img w="400" h="200" scaleType="fitXY" src="https://ae01.alicdn.com/kf/HTB1hsD4XEWF3KVjSZPh760clXXaP.png"/>
            <list id="menu">
                <horizontal bg="?selectableItemBackground" w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" tint="#009688"/>
                    <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center"/>
                </horizontal>
            </list>
            <frame h="*" w="*">
                <relative gravity="bottom|right">
                    <horizontal>
                        <text textSize="14sp" textColor="gray" text="软件版本：" />
                        <text textSize="14sp" textColor="red" text={app.versionName} />
                    </horizontal>
                </relative>
            </frame>
        </vertical>
    </drawer>
);


ui.emitter.on("create_options_menu", menu => {
    menu.add("关于");
});
//监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "关于":
            alert("关于", "Power By Myue");
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);

ui.toolbar.setupWithDrawer(ui.drawer);

ui.menu.setDataSource([{
        title: "帮助",
        icon: "@drawable/ic_chat_black_48dp"
    },
    {
        title: "退出",
        icon: "@drawable/ic_exit_to_app_black_48dp"
    }
]);

ui.menu.on("item_click", item => {
    switch (item.title) {
        case "帮助":
            app.startActivity({
                action: "android.intent.action.VIEW",
                data: "mqqapi://card/show_pslcard?src_type=internal&source=sharecard&version=1&uin=874745954"
            });
            break;
        case "退出":
            ui.finish();
            break;
    }
});
//标签名
// ui.viewpager.setTitles(["功能", "题库", "帮助与更新"]);

// ui.viewpager.setTitles(["功能"]);

//联动
// ui.tabs.setupWithViewPager(ui.viewpager);

//帮助页加载
// var src = "https://github.com/james-bond-007/lovexuexi/blob/master/README.md";
// ui.webview.loadUrl(src);

ui.showFloating.click(() => {
    engines.execScriptFile("floating.js");
});

// 题库条数
let sqlStr = util.format("SELECT * FROM tiku");
//var dbCount = tikuCommon.countDb("", "tiku", sqlStr);
let dbCount = tikuCommon.allCaseNum("tiku");
// log(dbCount);
//进度条不可见
/*ui.run(() => {
    //ui.pbar.setVisibility(View.INVISIBLE);
    ui.total.setText(""+dbCount);
});  */

//阅读模式切换
/*ui.amsw.click(() => {
    var amode = files.read("./article.txt");
    toastLog("当前阅读模式为“" + amode + "”")
    dialogs.select("请选择文章阅读模式：", ["推荐", "订阅"])
        .then(i => {
            if (i == 0) {
                files.write("./article.txt", "推荐")
                toastLog("阅读模式已改为推荐！")
            } else if (i == 1) {
                files.write("./article.txt", "订阅")
                toastLog("阅读模式已改为订阅！")
            } else {
                toastLog("你没有选择！")
            }
        });
});

//加载悬浮窗


//查询
ui.search.click(() => {
    //预先初始化
    qaArray = [];
    threads.shutDownAll();
    ui.run(() => {
        ui.question.setText("");
        ui.answer.setText("");
        ui.questionIndex.setText("0");
        ui.questionCount.setText("0");
    });
    //查询开始
    threads.start(function () {
        if (ui.keyword.getText() != "") {
            var keyw = ui.keyword.getText();
            if (ui.rbQuestion.checked) {//按题目搜
                var sqlStr = util.format("SELECT question,answer FROM tiku WHERE %s LIKE '%%%s%'", "question", keyw);
            } else {//按答案搜
                var sqlStr = util.format("SELECT question,answer FROM tiku WHERE %s LIKE '%%%s%'", "answer", keyw);
            }
            qaArray = tikuCommon.searchDb(keyw, "tiku", sqlStr);
            var qCount = qaArray.length;
            if (qCount > 0) {
                ui.run(() => {
                    ui.question.setText(qaArray[0].question);
                    ui.answer.setText(qaArray[0].answer);
                    ui.questionIndex.setText("1");
                    ui.questionCount.setText(String(qCount));
                });
            } else {
                toastLog("未找到");
                ui.run(() => {
                    ui.question.setText("未找到");
                });
            }
        } else {
            toastLog("请输入关键字");
        }
    });
});

//最近十条
ui.lastTen.click(() => {
    threads.start(function () {
        var keyw = ui.keyword.getText();
        qaArray = tikuCommon.searchDb(keyw, "", "SELECT question,answer FROM tiku ORDER BY rowid DESC limit 20");
        var qCount = qaArray.length;
        if (qCount > 0) {
            //toastLog(qCount);
            ui.run(() => {
                ui.question.setText(qaArray[0].question);
                ui.answer.setText(qaArray[0].answer);
                ui.questionIndex.setText("1");
                ui.questionCount.setText(qCount.toString());
            });
        } else {
            toastLog("未找到");
            ui.run(() => {
                ui.question.setText("未找到");
            });
        }
    });
});

//上一条
ui.prev.click(() => {
    threads.start(function () {
        if (qaArray.length > 0) {
            var qIndex = parseInt(ui.questionIndex.getText()) - 1;
            if (qIndex > 0) {
                ui.run(() => {
                    ui.question.setText(qaArray[qIndex - 1].question);
                    ui.answer.setText(qaArray[qIndex - 1].answer);
                    ui.questionIndex.setText(String(qIndex));
                });
            } else {
                toastLog("已经是第一条了！");
            }
        } else {
            toastLog("题目为空");
        }
    });
});

//下一条
ui.next.click(() => {
    threads.start(function () {
        if (qaArray.length > 0) {
            //toastLog(qaArray);
            var qIndex = parseInt(ui.questionIndex.getText()) - 1;
            if (qIndex < qaArray.length - 1) {
                //toastLog(qIndex);
                //toastLog(qaArray[qIndex + 1].question);
                ui.run(() => {
                    ui.question.setText(qaArray[qIndex + 1].question);
                    ui.answer.setText(qaArray[qIndex + 1].answer);
                    ui.questionIndex.setText(String(qIndex + 2));
                });
            } else {
                toastLog("已经是最后一条了！");
            }
        } else {
            toastLog("题目为空");
        }
    });
});

//修改
ui.update.click(() => {
    threads.start(function () {
        if (ui.question.getText() && qaArray.length > 0 && parseInt(ui.questionIndex.getText()) > 0) {
            var qIndex = parseInt(ui.questionIndex.getText()) - 1;
            var questionOld = qaArray[qIndex].question;
            var questionStr = ui.question.getText();
            var answerStr = ui.answer.getText();
            var sqlstr = "UPDATE tiku SET question = '" + questionStr + "' , answer = '" + answerStr + "' WHERE question=  '" + questionOld + "'";
            tikuCommon.executeSQL(sqlstr);
        } else {
            toastLog("请先查询");
        }
    });
});

//删除
ui.delete.click(() => {
    threads.start(function () {
        if (qaArray.length > 0 && parseInt(ui.questionIndex.getText()) > 0) {
            var qIndex = parseInt(ui.questionIndex.getText()) - 1;
            var questionOld = qaArray[qIndex].question;
            var sqlstr = "DELETE FROM tiku WHERE question = '" + questionOld + "'";
            tikuCommon.executeSQL(sqlstr);
        } else {
            toastLog("请先查询");
        }
    });
});

//新增
ui.insert.click(() => {
    threads.start(function () {
        if (ui.question.getText() != "" && ui.answer.getText() != "") {
            var questionStr = ui.question.getText();
            var answerStr = ui.answer.getText();
            var sqlstr = "INSERT INTO tiku VALUES ('" + questionStr + "','" + answerStr + "','')";
            tikuCommon.executeSQL(sqlstr);
        } else {
            toastLog("请先输入 问题 答案");
        }
    });
});

function reset() {

}
//重置
ui.reset.click(() => {
    threads.shutDownAll();
    threads.start(function () {
        qaArray = [];
        ui.run(() => {
            ui.keyword.setText("");
            ui.question.setText("");
            ui.answer.setText("");
            ui.questionIndex.setText("0");
            ui.questionCount.setText("0");
            ui.rbQuestion.setChecked(true);
        });
        toastLog("重置完毕!");
    });
});

//更新网络题库
ui.updateTikuNet.click(() => {
    dialogs.build({
        title: "更新网络题库",
        content: "确定更新？",
        positive: "确定",
        negative: "取消",
    })
        .on("positive", update)
        .show();

    function update() {
        threads.start(function () {
            ui.run(() => {
                ui.resultLabel.setText("正在更新网络题库...");
                ui.pbar.setVisibility(View.VISIBLE);
            });
            var ss = "./updateTikuNet.js";
            let begin = require(ss);
            var resultNum = begin();
            var resultStr = "更新" + resultNum + "道题！";
            ui.run(() => {
                ui.resultLabel.setText("");
                ui.pbar.setVisibility(View.INVISIBLE);
                ui.resultLabel.setVisibility(View.INVISIBLE);
            });
            alert(resultStr);
        });
    }
});*/