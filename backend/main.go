package main

import (
	"net/http"
	"r/models"

	"github.com/labstack/echo/v4"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func init() {
	models.InitDB()
}

func main() {

	var err error
	_, err = gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("DB connect Error " + err.Error())
	}

	e := echo.New()

	e.GET("/health", func(c echo.Context) error {
		return c.String(200, "OK")
	})

	g := e.Group("/api/v1")

	g.POST("/record/:uuid", CreateRecord)

	e.Start(":1991")
}

func CreateRecord(c echo.Context) error {
	var d models.Count
	d.UUID = c.Param("uuid")

	if err := db.Create(&d).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"message": "Error occurred",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusOK, d)
}
