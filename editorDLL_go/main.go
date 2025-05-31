package main

import "C"

func main() {

}

//export FileDownload

func FileDownload(url, localPath *C.char) *C.char {

	result := "aa"

	return C.CString(result)

}
