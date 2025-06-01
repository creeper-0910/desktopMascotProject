package main

import "C"
import (
	"fmt"

	"github.com/ncruces/zenity"
)

func main() {

}

//export FileSelect
func FileSelect(path *C.char) *C.char {

	result, err := zenity.SelectFile(
		zenity.Filename(C.GoString(path)),
		zenity.FileFilters{
			{"All", []string{"*"}, false},
		})
	if err != nil {
		if err == zenity.ErrCanceled {
			fmt.Println("キャンセルされました。")
		} else {
			zenity.Error(fmt.Sprintf("%v\n", err),
				zenity.Title("エラー"),
				zenity.ErrorIcon)
		}
		return C.CString("")
	}
	return C.CString(result)
}
