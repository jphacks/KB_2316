package main

import (
	"r/models"

	"github.com/labstack/echo/v4"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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

	e.Start(":1991")
}
