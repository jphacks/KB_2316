package main

import (
	"r/models"

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
}
