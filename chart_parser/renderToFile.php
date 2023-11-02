<?php
require_once("config.php");
require_once("functions.php");

//init db
$db = new Sqlite3($dbFile);

$data = getData();
$coinSupplyNew = array();
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
$PowReward = array();
$DailyFeesAverage = array();
$TotalFees = array();
$DailyBlockSizeAverage = array();
$TotalBlockSize = array();
$StaticReward = array();
$BlockTiming = array();
$SecurityParamter = array();
$OptimalFraction = array();

foreach ($data as $index => $block) {
    $blockTime = $block["timeBlock"];
    $day = date("Y-m-d", $blockTime);
    //coinsupply

    $coinSupplyNew[$day]["total"] = $block["coinsupply"];
    $coinSupplyNew[$day]["mining"] = 0;
    $coinSupplyNew[$day]["minting"] = 0;
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
    $PowReward[$day] = 0;
    $dailyFees = 0;
    $dailyBlockSize = 0;

    if (array_key_exists("pow", $block)) {
        $dailyPoWCount = count($block["pow"]);

        foreach ($block["pow"] as $index => $powBlock) {
            $dailyPoWSum += $powBlock["difficulty"];
            $dailyPoWMint += $powBlock["mint"];
            $dailyRealTX += $powBlock["RealTX"];
            $dailyVOUT += $powBlock["RealVOUT"];
            $dailyFees += $powBlock["txfee"];
            $dailyBlockSize += $powBlock["blockSize"];

            if (!in_array($powBlock["FoundBy"], $PoWAddressArray)) {
                $PoWAddressArray[] = $powBlock["FoundBy"];
            }
        }
        $PoWDifficulty[$day] = $dailyPoWSum / $dailyPoWCount;
        $PowReward[$day] = round($dailyPoWMint / $dailyPoWCount, 2);
    }
    if (array_key_exists("pos", $block)) {
        $dailyPoSCount = count($block["pos"]);

        foreach ($block["pos"] as $index => $posBlock) {
            $dailyPoSSum += $posBlock["difficulty"];
            $dailyPoSMint += $posBlock["mint"];
            $dailyRealTX += $posBlock["RealTX"];
            $dailyVOUT += $posBlock["RealVOUT"];
            $dailyFees += $posBlock["txfee"];
            $dailyBlockSize += $posBlock["blockSize"];

            if (!in_array($posBlock["FoundBy"], $PoSAddressArray)) {
                $PoSAddressArray[] = $posBlock["FoundBy"];
            }
        }
        $PoSDifficulty[$day] = $dailyPoSSum / $dailyPoSCount;

        if ($dailyPoWCount) {
            $blockRatio[$day] = round(($dailyPoSCount / $dailyPoWCount), 2);
        } else {
            //no PoW blocks that day, remove 0 value and use last days value for PowReward
            array_pop($PowReward);
            $PowReward[$day] = array_values(array_slice($PowReward, -1))[0];
        }
    }
    $realTX[$day] = $dailyRealTX;
    $realVOUT[$day] = $dailyVOUT;
    $MintingMining[$day]["minting"] = $dailyPoSMint;
    $MintingMining[$day]["mining"] = $dailyPoWMint;
    $AddrMintingMining[$day]["minting"] = count($PoSAddressArray);
    $AddrMintingMining[$day]["mining"] = count($PoWAddressArray);
    $DailyFeesAverage[$day] = round($dailyFees, 6);
    $TotalFees[$day] = round($DailyFeesAverage[$day] + end($TotalFees), 6);
    $DailyBlockSizeAverage[$day] = round(($dailyBlockSize / ($dailyPoSCount + $dailyPoWCount)), 0);
    $TotalBlockSize[$day] = round((($dailyBlockSize / 1000000) + end($TotalBlockSize)), 2);
}

foreach ($MintingMining as $day => $block) {
    $oneDayAgo = date("Y-m-d", strtotime($day) - 86400);
    if (array_key_exists($oneDayAgo, $coinSupplyNew)) {
        $coinSupplyNew[$day]["mining"] = $block["mining"] + $coinSupplyNew[$oneDayAgo]["mining"];
        $coinSupplyNew[$day]["minting"] = $block["minting"] + $coinSupplyNew[$oneDayAgo]["minting"];
    } else {
        $coinSupplyNew[$day]["mining"] = $block["mining"];
        $coinSupplyNew[$day]["minting"] = $block["minting"];
    }
}

foreach ($timing as $day => $timeDifference) {
    $BlockTiming[$day] = round(((array_sum($timeDifference) / count($timeDifference)) / 60), 2);

    //inflation rate
    $oneYearAgo = date("Y-m-d", strtotime($day) - 31556926);
    if (array_key_exists($oneYearAgo, $coinSupplyNew)) {
        $InflationRate[$day]["total"] = round((($coinSupplyNew[$day]["total"] - $coinSupplyNew[$oneYearAgo]["total"]) / $coinSupplyNew[$oneYearAgo]["total"]) * 100, 3);
        $InflationRate[$day]["mining"] = round((($coinSupplyNew[$day]["mining"] - $coinSupplyNew[$oneYearAgo]["mining"]) / $coinSupplyNew[$oneYearAgo]["total"]) * 100, 3);
        $InflationRate[$day]["minting"] = round((($coinSupplyNew[$day]["minting"] - $coinSupplyNew[$oneYearAgo]["minting"]) / $coinSupplyNew[$oneYearAgo]["total"]) * 100, 3);
    }

    //static reward
    $StaticReward[$day] = round(($coinSupplyNew[$day]["total"] * (0.0025 * (33 / (365 * 33 + 8)) * 10 / (24 * 60))), 2);

    //security parameter
    //SECURITY = (DIFF * 2**32 / (SUPPLY * maxDayWeight * BLOCK_INTERVAL_SECS)) * 100
    //maxDayWeight const 60
    //BLOCK_INTERVAL_SECS const 600

    //cut off values before 1st Nov 2012 in SecurityParamater and OptimalFraction
    $cutoffDate = "2012-11-01";
    if (strtotime($day) < strtotime($cutoffDate)) {
        // Skip this iteration and move to the next one
        continue;
    }

    if (array_key_exists($day, $PoSDifficulty)) { //avoid division by zero
        $securityAsFraction = ($PoSDifficulty[$day] * pow(2, 32)) / ($coinSupplyNew[$day]["total"] * 60 * 600);

        $SecurityParamter[$day] = round($securityAsFraction * 100, 2);
        $OptimalFraction[$day] = round(securityToOptimalFraction($securityAsFraction) * $coinSupplyNew[$day]["total"], 2);
    } else {
        //no pos blocks that day
        $SecurityParamter[$day] = 0;
        $OptimalFraction[$day] = 0;
    }

}

//add series
$series1 = array("series" => array("minting", "mining"));
$series2 = array("series" => array("total", "mining", "minting"));
$AddrMintingMining = $series1 + $AddrMintingMining;
$MintingMining = $series1 + $MintingMining;
$coinSupplyNew = $series2 + $coinSupplyNew;
$InflationRate = $series2 + $InflationRate;


//remove last day, make json and write
saveArrayToJsonFile("powdifficulty", $PoWDifficulty);
saveArrayToJsonFile("posdifficulty", $PoSDifficulty);
saveArrayToJsonFile("coinsupply", $coinSupplyNew);
saveArrayToJsonFile("blocktiming", $BlockTiming);
saveArrayToJsonFile("blockratio", $blockRatio);
saveArrayToJsonFile("realtx", $realTX);
saveArrayToJsonFile("realvalue", $realVOUT);
saveArrayToJsonFile("mintingmining", $MintingMining);
saveArrayToJsonFile("addrmintingmining", $AddrMintingMining);
saveArrayToJsonFile("annualinflation", $InflationRate);
saveArrayToJsonFile("powreward", $PowReward);
saveArrayToJsonFile("dailyfees", $DailyFeesAverage);
saveArrayToJsonFile("totalfees", $TotalFees);
saveArrayToJsonFile("dailyblocksize", $DailyBlockSizeAverage);
saveArrayToJsonFile("totalblocksize", $TotalBlockSize);
saveArrayToJsonFile("staticreward", $StaticReward);
saveArrayToJsonFile("securityparameter", $SecurityParamter);
saveArrayToJsonFile("optimalfraction", $OptimalFraction);