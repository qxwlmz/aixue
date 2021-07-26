importClass(android.database.sqlite.SQLiteDatabase);

/**
 * @description: 判断题库是否存在
 * @param: null
 * @return: boolean
 */
function judge_tiku_existence() {
    var dbName = "tiku.db"; //题库文件名
    var path = files.path(dbName);
    if (!files.exists(path)) {
        //files.createWithDirs(path);
        console.error("未找到题库！请将题库文件放置与js文件同一目录下再运行！");
        return false;
    }
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    var createTable = "\
    CREATE TABLE IF NOT EXISTS tiku(\
    question CHAR(253),\
    option CHAR(10),\
    answer CHAR(100),\
    wrongAnswer CHAR(100)\
    );";
    db.execSQL(createTable);
    db.close();
    return true;
}

/**
 * @description: 返回数据库列名
 * @param: columnName
 * @return: boolean
 */
function judge_tiku_columnName_existence(columnName) {
    var dbName = "tiku.db"; //题库文件名
    var path = files.path(dbName);
    if (!files.exists(path)) {
        //files.createWithDirs(path);
        console.error("未找到题库！请将题库文件放置与js文件同一目录下再运行！");
        return false;
    }
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    /* cursor.execute("PRAGMA table_info(t1)")
    name = cursor.fetchall()
    print name
    # [(0, u'f1', u'integer', 0, None, 0)]
    cursor.execute("SELECT sql FROM sqlite_master WHERE tbl_name = 't1' and type = 'table'")
    name = cursor.fetchall()
    print name
    # [(u'CREATE TABLE t1(f1 integer)',)] */
    // cursor.execute("SELECT * FROM tiku");
    let sql = "SELECT count(*) from sqlite_master where name = 'tiku' and sql like '%" + columnName + "%'";
    toastLog
    let cursor = db.rawQuery(sql, null);
    cursor.moveToFirst();
    var count = cursor.getLong(0);
    // toastLog(count); 
    var isFind = false;
    if (count > 0) {
        isFind = true;
    }
    cursor.close();
    db.close();
    return isFind;
}

/**
 * @description: 从数据库中搜索答案
 * @param: question 问题
 * @return: answer 答案
 */
function getAnswer(question, types) {
    console.log("题目类型 :" + types);
    var url = "https://api.myue.gq/xuexi/answer.php";
    var res = http.post(url, {
        "question": question,
        "category": types,
        "version": app.versionName
    });
    var res = res.body.json();
    if (res.length != 0) {
        console.verbose('Get Success');
        return res[0].answer;
    } else {
        console.error("题库中未找到答案");
        return '';
    }
}

/**
 * @description: 增加或更新数据库
 * @param: sql
 * @return: null
 */
function insertOrUpdate(sql) {
    /* var dbName = "tiku.db";
    var path = files.path(dbName);
    if (!files.exists(path)) {
        //files.createWithDirs(path);
        console.error("未找到题库!请将题库放置与js同一目录下");
    }
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    // toastLog(sql);
    db.execSQL(sql);
    // db.commit();
    db.close(); */
}

function searchTiku(keyw) {
    //表名
    var tableName = "tiku";
    var ansArray = searchDb(keyw, tableName, "");
    return ansArray;

}

function searchDb(keyw, _tableName, queryStr) {
    var tableName = _tableName;
    //数据文件名
    var dbName = "tiku.db";
    //文件路径
    var path = files.path(dbName);
    //确保文件存在
    if (!files.exists(path)) {
        files.createWithDirs(path);
    }
    //创建或打开数据库
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    var query = "";
    if (queryStr == "") {
        query = "SELECT question,answer FROM " + tableName + " WHERE question LIKE '" + keyw + "%'"; //前缀匹配
    } else {
        query = queryStr;
    }

    log(query);
    //query="select * from tiku"
    //db.execSQL(query);

    var cursor = db.rawQuery(query, null);
    cursor.moveToFirst();
    var ansTiku = [];
    if (cursor.getCount() > 0) {
        do {
            var timuObj = {
                "question": cursor.getString(0),
                "answer": cursor.getString(1)
            };
            ansTiku.push(timuObj);
        } while (cursor.moveToNext());
    } else {
        log("题库中未找到: " + keyw);
    }
    cursor.close();
    db.close();
    return ansTiku;

}

function countDb(keyw, _tableName, queryStr) {
    var tableName = _tableName;
    //数据文件名
    var dbName = "tiku.db";
    //文件路径
    var path = files.path(dbName);
    //确保文件存在
    if (!files.exists(path)) {
        files.createWithDirs(path);
    }
    //创建或打开数据库
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    var query = "";
    if (queryStr == "") {
        query = "SELECT question,answer FROM " + tableName + " WHERE question LIKE '" + keyw + "%'"; //前缀匹配
    } else {
        query = queryStr;
    }

    // log(query);
    query = "select * from tiku";
    //db.execSQL(query);

    var cursor = db.rawQuery(query, null);
    cursor.moveToFirst();
    let count = cursor.getLong(0);
    /* var ansTiku = [];
    if (cursor.getCount() > 0) {
        do {
            var timuObj={"question" : cursor.getString(0),"answer":cursor.getString(1)};
            ansTiku.push(timuObj);
        } while (cursor.moveToNext());
    } else {
        log("题库中未找到: " + keyw);
    } */
    cursor.close();
    db.close();
    // return ansTiku.length;
    return count;
}

/**
 * 查询数据库中的总条数.
 * @return count
 */
function allCaseNum(tableName) {
    let dbName = "tiku.db";
    let path = files.path(dbName);
    if (!files.exists(path)) {
        files.createWithDirs(path);
    }
    let count = 0;
    if (judge_tiku_existence()) {
        let db = SQLiteDatabase.openOrCreateDatabase(path, null);
        let sql = "select count(*) from " + tableName;
        let cursor = db.rawQuery(sql, null);
        cursor.moveToFirst();
        count = cursor.getLong(0);
        cursor.close();
        db.close();
    }
    return count;
}

function executeSQL(sqlstr) {
    //数据文件名
    var dbName = "tiku.db";
    //文件路径
    var path = files.path(dbName);
    //确保文件存在
    if (!files.exists(path)) {
        files.createWithDirs(path);
    }
    //创建或打开数据库
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    db.execSQL(sqlstr);
    toastLog(sqlstr);
    db.close();
}

function searchNet(keyw) {
    var tableName = "tikuNet";
    var ansArray = searchDb(keyw, tableName, "");
    return ansArray;
}

exports.judge_tiku_existence = judge_tiku_existence;
exports.judge_tiku_columnName_existence = judge_tiku_columnName_existence;
exports.getAnswer = getAnswer;
exports.insertOrUpdate = insertOrUpdate;
exports.searchTiku = searchTiku;
exports.searchNet = searchNet;
exports.searchDb = searchDb;
exports.countDb = countDb;
exports.allCaseNum = allCaseNum;
exports.executeSQL = executeSQL;