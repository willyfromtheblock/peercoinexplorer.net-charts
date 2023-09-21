<?php

function getData()
{
    global $db;
    $resultArray = array();
    $result = $db->query("SELECT type,difficulty,timeBlock,coinsupply,mint,RealTX,RealVOUT,FoundBy,txfee,blockSize FROM blocks");
    while ($res = $result->fetchArray(SQLITE3_ASSOC)) {
        $resultArray[] = $res;
    }
    return ($resultArray);
}

function array_trim_end($array)
{
    array_pop($array);
    return $array;
}
 
function saveArrayToJsonFile($fileName, $data) {
    global $dataDir;
    $filePath = "$dataDir/$fileName.json";
    file_put_contents($filePath, json_encode(array_trim_end($data)));
}