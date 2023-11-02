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

function securityToOptimalFraction($security) {
    $const = -0.01205449390140;
    $c0 = 0.00021672965052;
    $c1 = 0.00843001158271;
    $c2 = -0.31668853152981;
    $c3 = 3.15194385589535;
    $c4 = -12.93131277924088;
    $c5 = 25.02314857164244;
    $c6 = -22.70985422100839;
    $c7 = 7.78628320089075;
    
    return $const + $c0 * $security + $c1 * pow($security, 1/2) + $c2 * pow($security, 1/3) + $c3 * pow($security, 1/4) + $c4 * pow($security, 1/5) + $c5 * pow($security, 1/6) + $c6 * pow($security, 1/7) + $c7 * pow($security, 1/8);
}