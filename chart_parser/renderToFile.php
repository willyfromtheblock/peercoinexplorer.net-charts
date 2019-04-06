<?php
require_once("config.php");
require_once("functions.php");

//init db
$db = new Sqlite3($dbFile);

$data = getData();
$coinSupply = array();
$dailyBlocks = array();
$PoWDifficulty = array();
$PoSDifficulty = array();
$blockRatio = array();
$timing = array();
$realTX = array();
$realVOUT = array();
$AddrMintingMining = array();
$MintingMining = array();
$InflationRate = array();

foreach ($data as $index => $block) {
    $blockTime = $block["timeBlock"];
    $day = date("Y-m-d", $blockTime);
    //coinsupply

    $coinSupply[$day] = $block["coinsupply"];
    if (preg_match("/proof-of-work/", $block["type"])) {
        //found pow block
        $dailyBlocks[$day]["pow"][] = $block;
    } else {
        //found pos block
        $dailyBlocks[$day]["pos"][] = $block;
    }

    if ($index) { //don't wanna go -1 on the genesis block
        $previousBlockTime = $data[$index - 1]["timeBlock"];
        $timeDifference = $blockTime - $previousBlockTime;
        $timing[$day][] = $timeDifference;
    }
}
$AddrMintingMining["series"] = array("minting", "mining");
$MintingMining["series"] = array("minting", "mining");

foreach ($dailyBlocks as $day => $block) {
    $dailyPoWCount = 0;
    $dailyPoSCount = 0;
    $dailyPoWMint = 0;
    $dailyPoSMint = 0;
    $dailyPoWSum = 0;
    $dailyPoSSum = 0;
    $blockRatio[$day] = 0;
    $dailyRealTX = 0;
    $dailyVOUT = 0;
    $PoWAddressArray = array();
    $PoSAddressArray = array();

    if (array_key_exists("pow", $block)) {
        $dailyPoWCount = count($block["pow"]);

        foreach ($block["pow"] as $index => $powBlock) {
            $dailyPoWSum += $powBlock["difficulty"];
            $dailyPoWMint += $powBlock["mint"];
            $dailyRealTX += $powBlock["RealTX"];
            $dailyVOUT += $powBlock["RealVOUT"];

            if (!in_array($powBlock["FoundBy"], $PoWAddressArray)) {
                $PoWAddressArray[] = $powBlock["FoundBy"];
            }
        }
        $PoWDifficulty[$day] = $dailyPoWSum / $dailyPoWCount;
    }
    if (array_key_exists("pos", $block)) {
        $dailyPoSCount = count($block["pos"]);

        foreach ($block["pos"] as $index => $posBlock) {
            $dailyPoSSum += $posBlock["difficulty"];
            $dailyPoSMint += $posBlock["mint"];
            $dailyRealTX += $posBlock["RealTX"];
            $dailyVOUT += $posBlock["RealVOUT"];

            if (!in_array($posBlock["FoundBy"], $PoSAddressArray)) {
                $PoSAddressArray[] = $posBlock["FoundBy"];
            }
        }
        $PoSDifficulty[$day] = $dailyPoSSum / $dailyPoSCount;

        if ($dailyPoWCount) {
            $blockRatio[$day] = round(($dailyPoSCount / $dailyPoWCount), 2);
        }
    }
    $realTX[$day] = $dailyRealTX;
    $realVOUT[$day] = $dailyVOUT;
    $MintingMining[$day]["minting"] = $dailyPoSMint;
    $MintingMining[$day]["mining"] = $dailyPoWMint;
    $AddrMintingMining[$day]["minting"] = count($PoSAddressArray);
    $AddrMintingMining[$day]["mining"] = count($PoWAddressArray);
}


foreach ($timing as $day => $timeDifference) {
    $blockTiming[$day] = round(((array_sum($timeDifference) / count($timeDifference)) / 60), 2);

    //inflation rate
    $oneYearAgo =  date("Y-m-d", strtotime($day) - 31556926);
    if (array_key_exists($oneYearAgo, $coinSupply)) {
        $InflationRate[$day] = round((($coinSupply[$day] - $coinSupply[$oneYearAgo]) / $coinSupply[$oneYearAgo]) * 100, 3);
    }
}

//remove last day, make json and write
file_put_contents("$dataDir/powdifficulty.json", json_encode(array_trim_end($PoWDifficulty)));
file_put_contents("$dataDir/posdifficulty.json", json_encode(array_trim_end($PoSDifficulty)));
file_put_contents("$dataDir/coinsupply.json", json_encode(array_trim_end($coinSupply)));
file_put_contents("$dataDir/blocktiming.json", json_encode(array_trim_end($blockTiming)));
file_put_contents("$dataDir/blockratio.json", json_encode(array_trim_end($blockRatio)));
file_put_contents("$dataDir/realtx.json", json_encode(array_trim_end($realTX)));
file_put_contents("$dataDir/realvalue.json", json_encode(array_trim_end($realVOUT)));
file_put_contents("$dataDir/mintingmining.json", json_encode(array_trim_end($MintingMining)));
file_put_contents("$dataDir/addrmintingmining.json", json_encode(array_trim_end($AddrMintingMining)));
file_put_contents("$dataDir/annualinflation.json", json_encode(array_trim_end($InflationRate)));
