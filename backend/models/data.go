package models

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Count struct {
	gorm.Model
	Count int    `gorm:"default:1" json:"count"`
	UUID  string `gorm:"not null" json:"uuid" param:"uuid"`
}

type User struct {
	gorm.Model
	UUID     string  `json:"uuid" param:"uuid"`
	UserName string  `gorm:"type:varchar(100);not null"`
	Counts   []Count `gorm:"foreignKey:UUID;references:UUID"`
}

func InitDB() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("DB connect Error " + err.Error())
	}

	err = db.AutoMigrate(&Count{})
	if err != nil {
		panic("マイグレーションに失敗しました: " + err.Error())
	}

	err = db.AutoMigrate(&User{})
	if err != nil {
		panic("マイグレーションに失敗しました: " + err.Error())
	}

	fmt.Println("マイグレーションが成功しました！")
}
