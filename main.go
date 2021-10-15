package main

import (
	"database/sql"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

const (
	userName = "admin"
	password = "cxcxcx4,"
	ip       = "localhost"
	port     = "3306"
	dbName   = "admin"
)

type typeUser struct {
	UserName string `json:"userName"`
	Password string `json:"password"`
	TidyName string `json:"tidyName"`
	uid      string
}
type typeConfess struct {
	TidyName  string `json:"tidyName"`
	Content   string `json:"content"`
	UserName  string `json:"userName"`
	Anonymous string `json:"anonymous"`
	Color     string `json:"color"`
	uid, id   string
}
type typeEdit struct {
	Id       string `json:"id"`
	ContentN string `json:"contentnew"`
}
type typeLogin struct {
	UserName string `json:"userName"`
	Password string `json:"password"`
}

type typeComment struct {
	TidyName string `json:"tidyName"`
	Content  string `json:"content"`
	UserName string `json:"userName"`
	Uid      string `json:"uid"`
	id       string
}
type typeEditComment struct {
	Id       string `json:"id"`
	ContentN string `json:"contentnew"`
}

var DB *sql.DB
var user [100000]typeUser
var confess [100000]typeConfess
var comment [100000]typeComment
var userEditConfess typeEdit
var userEditComment typeEditComment
var userLogin typeLogin
var contentR [10]string
var tidyNameR [10]string
var anonymousR [10]string
var usernameR [10]string
var colorR [10]string
var userId [100000]string
var userTidyName [100000]string
var userContent [100000]string
var userColor [100000]string
var commentId [100000]string
var commentTidyName [100000]string
var commentContent [100000]string
var ranStr [10]string
var ran [10]int
var userNum int
var confessNum int
var userConfessNum int
var confessCommentNum int
var commentNum int

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token")
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type")
		c.Header("Access-Control-Allow-Credentials", "true")

		//放行所有OPTIONS方法
		if method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
		}
		// 处理请求
		c.Next()
	}
}

func InitDB() {
	//打开数据库
	path := strings.Join([]string{userName, ":", password, "@tcp(", ip, ":", port, ")/", dbName, "?charset=utf8"}, "")
	DB, _ = sql.Open("mysql", path)
	DB.SetConnMaxLifetime(100)
	DB.SetMaxIdleConns(10)
	if err := DB.Ping(); err != nil {
		fmt.Println("打开数据库失败")
		return
	}
}

func readUserData() {
	//从userdata表中读取用户信息
	sqlStr := "select id, username, password, tidyname from userdata where id > ?"
	rows, err := DB.Query(sqlStr, 0)
	if err != nil {
		fmt.Printf("query failed, err:%v\n", err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		err := rows.Scan(&id, &user[userNum].UserName, &user[userNum].Password, &user[userNum].TidyName)
		user[userNum].uid = int2str(id)
		if err != nil {
			fmt.Printf("scan failed, err:%v\n", err)
			return
		}
		userNum++
	}
}

func readCommentData() {
	//从commentdata表中读取评论信息
	sqlStr := "select id, confessid, content, username, tidyname from commentdata where id > ?"
	rows, err := DB.Query(sqlStr, 0)
	if err != nil {
		fmt.Printf("query failed, err:%v\n", err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		err := rows.Scan(&id, &comment[commentNum].Uid, &comment[commentNum].Content, &comment[commentNum].UserName, &comment[commentNum].TidyName)
		if err != nil {
			fmt.Printf("scan failed, err:%v\n", err)
			return
		}
		comment[commentNum].id = int2str(id)
		commentNum++
	}
}

func readConfessData() {
	//从confessdata表中读取表白信息
	sqlStr := "select id, uid, username, content, tidyname, anonymous, color from confessdata where id > ?"
	rows, err := DB.Query(sqlStr, 0)
	if err != nil {
		fmt.Printf("query failed, err:%v\n", err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var id, anonymous, color int
		err := rows.Scan(&id, &confess[confessNum].uid, &confess[confessNum].UserName, &confess[confessNum].Content, &confess[confessNum].TidyName, &anonymous, &color)
		if anonymous == 1 {
			confess[confessNum].Anonymous = "y"
		} else {
			confess[confessNum].Anonymous = "n"
		}
		confess[confessNum].Color = strconv.Itoa(color)
		if err != nil {
			fmt.Printf("scan failed, err:%v\n", err)
			return
		}
		confess[confessNum].id = int2str(id)
		confessNum++
	}
}

func findUser(userName string, Type int) int {
	//用于注册时查询是否已有该用户
	for i := 0; i < userNum; i++ {
		if user[i].UserName == userName {
			if Type == 1 {
				return 0
			} else {
				return i
			}
		}
	}
	if Type == 1 {
		return 1
	} else {
		return -1
	}
}

func int2str(num int) string {
	//用于按格式将数字转换成五位字符串
	var ans string
	ans = strconv.Itoa(num)
	for len(ans) < 5 {
		ans = "0" + ans
	}
	return ans
}

func getUesrDate(userData typeUser) bool {
	//读入注册时传入的用户信息查重后保存
	if findUser(userData.UserName, 1) == 1 {
		user[userNum].UserName = userData.UserName
		user[userNum].Password = userData.Password
		user[userNum].TidyName = userData.TidyName
		addUesrData()
		userNum++
		return true
	} else {
		return false
	}
}

func addUesrData() {
	//用于新增用户信息
	sqlStr := "insert into userdata(username, password, tidyname) values (?,?,?)"
	ret, err := DB.Exec(sqlStr, user[userNum].UserName, user[userNum].Password, user[userNum].TidyName)
	if err != nil {
		fmt.Printf("insert failed, err:%v\n", err)
		return
	}
	theID, _ := ret.LastInsertId()
	user[userNum].uid = int2str(int(theID))
}

func login(userData typeLogin) int {
	//登录函数
	pos := findUser(userData.UserName, 2)
	if pos != -1 && user[pos].Password == userData.Password {
		return pos
	} else if pos == -1 {
		return -2
	} else {
		return -3
	}
}

func getConfess(confessData typeConfess) {
	//用于新增表白信息
	var anonymous, color int
	confess[confessNum].UserName = confessData.UserName
	confess[confessNum].Content = confessData.Content
	confess[confessNum].TidyName = confessData.TidyName
	confess[confessNum].Anonymous = confessData.Anonymous
	confess[confessNum].Color = confessData.Color
	confess[confessNum].uid = user[findUser(confessData.UserName, 2)].uid
	sqlStr := "insert into confessdata(uid, content, tidyname, username, anonymous, color) values (?,?,?,?,?,?)"
	if confess[confessNum].Anonymous == "y" {
		anonymous = 1
	} else {
		anonymous = 0
	}
	color, _ = strconv.Atoi(confess[confessNum].Color)
	ret, err := DB.Exec(sqlStr, confess[confessNum].uid, confess[confessNum].Content, confess[confessNum].TidyName, confess[confessNum].UserName, anonymous, color)
	if err != nil {
		fmt.Printf("insert failed, err:%v\n", err)
		return
	}
	theID, _ := ret.LastInsertId()
	confess[confessNum].id = int2str(int(theID))
	confessNum++
}

func getComment(commentData typeComment) {
	//用于新增评论信息
	comment[commentNum].UserName = commentData.UserName
	comment[commentNum].Content = commentData.Content
	comment[commentNum].TidyName = commentData.TidyName
	comment[commentNum].Uid = commentData.Uid
	sqlStr := "insert into commentdata(confessid, content, username, tidyname) values (?,?,?,?)"
	ret, err := DB.Exec(sqlStr, comment[commentNum].Uid, comment[commentNum].Content, comment[commentNum].UserName, comment[commentNum].TidyName)
	if err != nil {
		fmt.Printf("insert failed, err:%v\n", err)
		return
	}
	theID, _ := ret.LastInsertId()
	comment[commentNum].id = int2str(int(theID))
	commentNum++
}

func getRanNUM(lim int) {
	//获取九个不一样的随机数
	for i := 1; i <= min(9, confessNum); i++ {
		ran[i] = rand.Intn(lim)
		ranStr[i] = int2str(ran[i])
		for j := 1; j < i; j++ {
			if ran[i] == ran[j] {
				i--
			}
		}
	}
}

func min(a int, b int) int {
	if a > b {
		return b
	} else {
		return a
	}
}

func getRanConfess(lim int) {
	//获取九个不一样的随机表白信息
	getRanNUM(lim)
	for i := 1; i <= min(9, confessNum); i++ {
		contentR[i] = confess[ran[i]].Content
		tidyNameR[i] = confess[ran[i]].TidyName
		anonymousR[i] = confess[ran[i]].Anonymous
		usernameR[i] = confess[ran[i]].UserName
		colorR[i] = confess[ran[i]].Color
	}
}

func getConfessFromFile(userName string) {
	//用于获取某用户的表白内容
	userConfessNum = 0
	sqlStr := "select id, content, tidyname, color from confessdata where username = ?"
	rows, err := DB.Query(sqlStr, userName)
	if err != nil {
		fmt.Printf("query failed, err:%v\n", err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var id, color int
		err := rows.Scan(&id, &userContent[userConfessNum], &userTidyName[userConfessNum], &color)
		userColor[userConfessNum] = strconv.Itoa(color)
		if err != nil {
			fmt.Printf("scan failed, err:%v\n", err)
			return
		}
		userId[userConfessNum] = int2str(id)
		userConfessNum++
	}
}

func getConfessFromFileAll() {
	//用于获取全部用户的表白内容
	userConfessNum = 0
	sqlStr := "select id, content, tidyname, color from confessdata where id > ?"
	rows, err := DB.Query(sqlStr, 0)
	if err != nil {
		fmt.Printf("query failed, err:%v\n", err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var id, color int
		err := rows.Scan(&id, &userContent[userConfessNum], &userTidyName[userConfessNum], &color)
		userColor[userConfessNum] = strconv.Itoa(color)
		if err != nil {
			fmt.Printf("scan failed, err:%v\n", err)
			return
		}
		userId[userConfessNum] = int2str(id)
		userConfessNum++
	}
}

func getCommentFromFile(confessId string) {
	//用于获取某表白的评论内容
	confessCommentNum = 0
	sqlStr := "select content, tidyname from commentdata where confessid = ?"
	rows, err := DB.Query(sqlStr, userName)
	if err != nil {
		fmt.Printf("query failed, err:%v\n", err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&commentContent[confessCommentNum], &commentTidyName[confessCommentNum])
		if err != nil {
			fmt.Printf("scan failed, err:%v\n", err)
			return
		}
		commentId[confessCommentNum] = int2str(confessCommentNum)
		confessCommentNum++
	}
}

func editConfess(id string, contentN string) {
	//用于修改指定表白内容
	sqlStr := "update confessdata set content = ? where id = ?"
	_, err := DB.Exec(sqlStr, contentN, id)
	if err != nil {
		fmt.Printf("update failed, err:%v\n", err)
		return
	}
}

func deleteConfess(id string) {
	//用于删除指定表白内容
	sqlStr := "delete from confessdata where id = ?"
	_, err := DB.Exec(sqlStr, id)
	if err != nil {
		fmt.Printf("delete failed, err:%v\n", err)
		return
	}
	deleteComment(id, 2)
}

func deleteComment(id string, Type int) {
	//用于删除评论内容
	if Type == 1 {
		sqlStr := "delete from commentdata where id = ?"
		_, err := DB.Exec(sqlStr, id)
		if err != nil {
			fmt.Printf("delete failed, err:%v\n", err)
			return
		}
	} else {
		sqlStr := "delete from commentdata where confessid = ?"
		_, err := DB.Exec(sqlStr, id)
		if err != nil {
			fmt.Printf("delete failed, err:%v\n", err)
			return
		}
	}
}

func editComment(id string, contentN string) {
	//用于修改指定评论内容
	sqlStr := "update commentdata set content = ? where id = ?"
	_, err := DB.Exec(sqlStr, contentN, id)
	if err != nil {
		fmt.Printf("update failed, err:%v\n", err)
		return
	}
}

func readNew() {
	userNum = 0
	readUserData()
	confessNum = 0
	readConfessData()
	commentNum = 0
	readCommentData()
}

func main() {
	InitDB()
	router := gin.Default()
	router.Use(Cors())
	router.POST("/sign_up", func(c *gin.Context) {
		readNew()
		c.BindJSON(&user[userNum])
		if getUesrDate(user[userNum]) {
			c.JSON(http.StatusOK, gin.H{
				"back": "succeed",
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"back": "fail",
			})
		}
	})
	router.POST("/sign_in", func(c *gin.Context) {
		readNew()
		c.BindJSON(&userLogin)
		if login(userLogin) != -2 && login(userLogin) != -3 {
			c.JSON(http.StatusOK, gin.H{
				"back": "succeed",
			})
		} else if login(userLogin) == -2 {
			c.JSON(http.StatusOK, gin.H{
				"back": "unsigned",
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"back": "worsePassword",
			})
		}
	})
	router.POST("/send_confess", func(c *gin.Context) {
		readNew()
		c.BindJSON(&confess[confessNum])
		getConfess(confess[confessNum])
		c.JSON(http.StatusOK, gin.H{
			"back": "succeed",
		})
	})
	router.GET("/main", func(c *gin.Context) {
		readNew()
		userName := c.Query("user")
		myid := findUser(userName, 2)
		myTidyName := user[myid].TidyName
		getRanConfess(confessNum)
		c.JSON(http.StatusOK, gin.H{
			"content":    contentR,
			"tidyName":   tidyNameR,
			"id":         ranStr,
			"myTidyName": myTidyName,
			"anonymous":  anonymousR,
			"username":   usernameR,
			"color":      colorR,
		})
	})
	router.GET("/manage", func(c *gin.Context) {
		readNew()
		userName := c.Query("user")
		if userName == "admin" {
			getConfessFromFileAll()
		} else {
			getConfessFromFile(userName)
		}
		c.JSON(http.StatusOK, gin.H{
			"content":  userContent[0:userConfessNum],
			"tidyName": userTidyName[0:userConfessNum],
			"id":       userId[0:userConfessNum],
			"color":    userColor[0:userConfessNum],
		})
	})
	router.POST("/edit_confess", func(c *gin.Context) {
		readNew()
		c.BindJSON(&userEditConfess)
		editConfess(userEditConfess.Id, userEditConfess.ContentN)
		c.JSON(http.StatusOK, gin.H{
			"back": "succeed",
		})
	})
	router.GET("/edit_confess", func(c *gin.Context) {
		readNew()
		var content, tidyName string
		confessId := c.Query("id")
		for i := 0; i < confessNum; i++ {
			if confessId == confess[i].id {
				content = confess[i].Content
				tidyName = confess[i].TidyName
				break
			}
		}
		c.JSON(http.StatusOK, gin.H{
			"content":  content,
			"tidyname": tidyName,
		})
	})
	router.GET("/delete_confess", func(c *gin.Context) {
		readNew()
		deleteId := c.Query("id")
		deleteConfess(deleteId)
		c.JSON(http.StatusOK, gin.H{
			"back": "succeed",
		})
	})
	router.POST("/send_comment", func(c *gin.Context) {
		readNew()
		c.BindJSON(&comment[commentNum])
		getComment(comment[commentNum])
		c.JSON(http.StatusOK, gin.H{
			"back": "succeed",
		})
	})
	router.GET("/manage_comment", func(c *gin.Context) {
		readNew()
		commentNum = 0
		readCommentData()
		confessId := c.Query("confessid")
		getCommentFromFile(confessId)
		c.JSON(http.StatusOK, gin.H{
			"content":  commentContent[0:confessCommentNum],
			"tidyName": commentTidyName[0:confessCommentNum],
			"id":       confessId[0:confessCommentNum],
		})
	})
	router.GET("/edit_comment", func(c *gin.Context) {
		readNew()
		var content, tidyName string
		commentId := c.Query("id")
		for i := 0; i < commentNum; i++ {
			if commentId == comment[i].id {
				content = comment[i].Content
				tidyName = comment[i].TidyName
				break
			}
		}
		c.JSON(http.StatusOK, gin.H{
			"content":  content,
			"tidyname": tidyName,
		})
	})
	router.POST("/edit_comment", func(c *gin.Context) {
		readNew()
		c.BindJSON(&userEditComment)
		editConfess(userEditComment.Id, userEditConfess.ContentN)
		c.JSON(http.StatusOK, gin.H{
			"back": "succeed",
		})
	})
	router.GET("/delete_comment", func(c *gin.Context) {
		readNew()
		deleteId := c.Query("id")
		deleteComment(deleteId, 1)
		c.JSON(http.StatusOK, gin.H{
			"back": "succeed",
		})
	})
	router.GET("/tidyname", func(c *gin.Context) {
		readNew()
		userName := c.Query("user")
		myid := findUser(userName, 2)
		myTidyName := user[myid].TidyName
		c.JSON(http.StatusOK, gin.H{
			"myTidyName": myTidyName,
		})
	})
	router.Run(":8080")
}
