<?php
header('Content-Type: application/json');
function getXY($data)
{
   $dataar = explode(",",$data);
   $pos = [];
   $pos["x"] = intval($dataar[0]);
   $pos["y"] = intval($dataar[1]);
   return $pos;
}
function getPointsArray($a,$b)
{
	$dataA = explode(",",$a);
	$dataB = explode(",",$b);
	return array_merge($dataB,$dataA);
}

$level = "levels.xml";
$xml = simplexml_load_file($level);
$json = json_encode($xml);
$levelArr = json_decode($json,true)["level"];
foreach($levelArr as $levels){
	$levelObj = [];
	$stage = explode("_",$levels["name"]);
	$levelObj["itzi"] = getXY($levels["fuzzi"]["pos"]);
	$levelObj["gate"] = getXY($levels["goal"]["pos"]);
	$levelObj["ranks"] = $levels["ranks"]['@attributes'];
	$levelObj["showLevelMid"] = isset($levels["showLevelMid"]) ? $levels["showLevelMid"] : true;
	if($levels["goldCandy"]){
		if($levels["goldCandy"]["pos"]){
			$levelObj["goldFlies"][] = getXY($levels["goldCandy"]["pos"]);
		}else{
			foreach($levels["goldCandy"] as $gc){
				$levelObj["goldFlies"][] = getXY($gc["pos"]);
			}
		}
	}
	
	if($levels["pinkCandy"]){
		if($levels["pinkCandy"]["pos"]){
			$levelObj["blueFlies"][] = getXY($levels["pinkCandy"]["pos"]);
		}else{
			foreach($levels["pinkCandy"] as $gc){
				$levelObj["blueFlies"][] = getXY($gc["pos"]);
			}
		}
	}

	foreach($levels['line'] as $line){
	    $lineObj = [];
	    $lineObj['id'] = $line['@attributes']['id'];
	    $lineObj['type'] = $line['@attributes']['type'];
	    $lineObj["a"] = getXY($line["pointA"]);
	    $lineObj["b"] = getXY($line["pointB"]);
	    $lineObj["points"] = getPointsArray($line["pointA"],$line["pointB"]);
	    $levelObj["lines"][] = $lineObj;
	}

	foreach($levels["angle"] as $angle){
		$angleObj = [];
		$angleObj["id"] = $angle['@attributes']['id'];
		$angleObj["type"] = $angle['@attributes']['type'];
		$angleObj["lineA"] = $angle['lineA'];
		$angleObj["lineB"] = $angle['lineB'];
		$angleObj["alternateLine"] = $angle['alternateLine'];
		$angleObj["triggeredLine"] = $angle['triggeredLine'];
		$angleObj["interactive"] = $angle['interactive'];
		$angleObj["equalAngleSymbol"] = $angle['equalAngleSymbol'];
		$angleObj["customLabelText"] = $angle['customLabelText'];
		foreach($angle["value"] as $key=>$value){
			$angleObj["value"][$key] = $value;
		}

		$levelObj["angles"][] = $angleObj;
	}

	$output["levels"][$stage[0]][$stage[1]] = $levelObj;
	
}
$json = json_encode($output);
$myfile = fopen("../constants/level.json", "w") or die("Unable to open file!");
fwrite($myfile, $json);
fclose($myfile);
