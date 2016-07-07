<?php 
header('Content-Type: application/json');
if(count($_POST) === 0){
	echo file_get_contents("../constants/files/gameData.json");
}else{
	echo "aa";
}