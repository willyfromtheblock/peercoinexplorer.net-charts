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
 