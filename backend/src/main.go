package main

import (
	"fmt"
	"net/http"
	"os"
	"r/models"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func init() {
	loadEnv()
	models.InitDB()

}

func loadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Printf("読み込み出来ませんでした: %v", err)
	}
}

func main() {
	connectInfo := fmt.Sprintf(
		"%s:%s@tcp(db:3306)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("MYSQL_USER"),
		os.Getenv("MYSQL_PASSWORD"),
		os.Getenv("MYSQL_DATABASE"),
	)
	var err error
	db, err = gorm.Open(mysql.Open(connectInfo), &gorm.Config{})
	if err != nil {
		panic("DB connect Error " + err.Error())
	}

	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"},                              // すべてのオリジンを許可
		AllowMethods:     []string{echo.GET, echo.POST, echo.DELETE}, // すべてのHTTPメソッドを許可
		AllowHeaders:     []string{"*"},                              // すべてのヘッダーを許可
		AllowCredentials: true,                                       // 資格情報を許可
	}))

	g := e.Group("/api/v1")

	g.POST("/record/:uuid", CreateRecord)

	g.GET("/get/:uuid", GetAllRecord)

	g.GET("/get/:uuid/:year/:month/:day", GetDayRecord)

	g.POST("/set/:uuid/:year/:month/:day", setElimDate)

	g.DELETE("/set/:uuid/:year/:month/:day", resetElimDate)
	g.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, "health : OK")
	})

	e.Start(":1991")

}

func CreateRecord(c echo.Context) error {
	var d models.Count
	d.UUID = c.Param("uuid")
	d.Count = 1

	if err := db.Create(&d).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"message": "Error occurred",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusOK, d)
}

func GetAllRecord(c echo.Context) error {
	var user models.User
	uuid := c.Param("uuid")

	if err := db.Preload("Counts").Where("uuid = ?", uuid).First(&user).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{
			"message": "User not found or another error occurred",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusOK, user)

}

func GetDayRecord(c echo.Context) error {
	var uuid, year, month, day = c.Param("uuid"), c.Param("year"), c.Param("month"), c.Param("day")
	data := []int{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}
	var user models.User

	month = fmt.Sprintf("%02s", month)
	day = fmt.Sprintf("%02s", day)

	startTime, _ := time.Parse("2006-01-02 15:04:05", fmt.Sprintf("%s-%s-%s 00:00:00", year, month, day))
	endTime, _ := time.Parse("2006-01-02 15:04:05", fmt.Sprintf("%s-%s-%s 23:59:59", year, month, day))

	if err := db.Where("uuid = ?", uuid).
		Preload("Counts", "count = 1 AND created_at BETWEEN ? AND ?", startTime, endTime).
		Find(&user).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{
			"message": "User not found or another error occurred",
			"error":   err.Error(),
		})
	}

	for _, v := range user.Counts {
		// fmt.Println(i, v.CreatedAt.Hour())
		switch v.CreatedAt.Hour() {
		case 0:
			data[0] += 1
		case 1:
			data[1] += 1
		case 2:
			data[2] += 1
		case 3:
			data[3] += 1
		case 4:
			data[4] += 1
		case 5:
			data[5] += 1
		case 6:
			data[6] += 1
		case 7:
			data[7] += 1
		case 8:
			data[8] += 1
		case 9:
			data[9] += 1
		case 10:
			data[10] += 1
		case 11:
			data[11] += 1
		case 12:
			data[12] += 1
		case 13:
			data[13] += 1
		case 14:
			data[14] += 1
		case 15:
			data[15] += 1
		case 16:
			data[16] += 1
		case 17:
			data[17] += 1
		case 18:
			data[18] += 1
		case 19:
			data[19] += 1
		case 20:
			data[20] += 1
		case 21:
			data[21] += 1
		case 22:
			data[22] += 1
		case 23:
			data[23] += 1
		default:
			panic("Error")
		}
	}

	return c.JSON(http.StatusOK, data)
}

func setElimDate(c echo.Context) error {

	// 日付にcount=0のデータを挿入する
	var uuid, year, month, day = c.Param("uuid"), c.Param("year"), c.Param("month"), c.Param("day")

	month = fmt.Sprintf("%02s", month)
	day = fmt.Sprintf("%02s", day)

	date, _ := time.Parse("2006-01-02 15:04:05", fmt.Sprintf("%s-%s-%s 00:00:00", year, month, day))

	var d models.Count
	d.UUID = uuid
	d.Count = 0
	d.CreatedAt = date

	if err := db.Create(&d).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"message": "Error occurred",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusOK, d)
}

func resetElimDate(c echo.Context) error {
	var uuid, year, month, day = c.Param("uuid"), c.Param("year"), c.Param("month"), c.Param("day")

	month = fmt.Sprintf("%02s", month)
	day = fmt.Sprintf("%02s", day)

	date, _ := time.Parse("2006-01-02 15:04:05", fmt.Sprintf("%s-%s-%s 00:00:00", year, month, day))

	var d models.Count
	d.UUID = uuid
	d.CreatedAt = date

	if err := db.Where("uuid = ? AND created_at = ?", uuid, date).Delete(&d).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"message": "Error occurred",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusOK, d)
}
