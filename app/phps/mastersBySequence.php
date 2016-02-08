<?php

///data/www/FSN/data/pdb_seqres.txt
require_once('functions.php');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size,     X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
header('Content-Type: application/json');

//need this to be able to get POST data sent by AngularJS
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$fullSequence = $request->sequence;

// $fullSequence = ">1A50:A|PDBID|CHAIN|SEQUENCE\nMERYENLFAQLNDRREGAFVPFVTLGDPGIEQSLKIIDTLIDAGADALELGVPFSDPLADGPTIQNANLRAFAAGVTPAQCFEMLALIREKHPTIPIGLLMYANLVFNNGIDAFYARCEQVGVDSVLVADVPVEESAPFRQAALRHNIAPIFICPPNADDDLLRQVASYGRGYTYLLSRSGVTGAENRGALPLHHLIEKLKEYHAAPALQGFGISSPEQVSAAVRAGAAGAISGSAIVKIIEKNLASPKQMLAELRSFVSAMKAASRA";
// echo($fullSequence);
if (strlen($fullSequence) == 0) {
    $errorMessage = array();
    $errorMessage['script'] = 'mastersBySequence.php';
    $errorMessage['title'] = 'No sequence';
    $errorMessage['message'] = 'The script did not recieve a sequence.';
    echo(json_encode($errorMessage));
    exit();
}
$url = 'http://pdbflex.org/fsn/php/sequenceToPDB.php';
$data = array('sequence' => $fullSequence);

// use key 'http' even if you send the request to https://...
$options = array(
  'http' => array(
    'header' => "Content-type: application/x-www-form-urlencoded\r\n",
    'method' => 'POST',
    'content' => http_build_query($data),
  ),
);
$context = stream_context_create($options);

$masterIDsJSONString = file_get_contents($url, false, $context);

if ($masterIDsJSONString === FALSE) {
    $errorMessage = array();
    $errorMessage['script'] = 'mastersBySequence.php';
    $errorMessage['title'] = 'Blast fail';
    $errorMessage['message'] = 'An error occured while comparing your sequence to our database. Please make sure your sequence is correct.';
    echo(json_encode($errorMessage));
}
else {
    header('Content-Type: application/json');
    $hitIDs = json_decode($masterIDsJSONString, TRUE);
    $allMasters = array();
    #{"queryKey":"1A50:A|PDBID|CHAIN|SEQUENCE","templateKey":"1wxj_A","score":"4.000e-26","identity":32.02,"similarity":52.71,"identAA":65,"simAA":107,"aliLen":203}
    $foundMasterIDs = array();
    foreach ($hitIDs as $hitObject) {
        $matchID = $hitObject["templateKey"];
        $matchScore = $hitObject['score'];
        $matchIdentity = $hitObject['identity'];
        $matchSimilarity = $hitObject['similarity'];
        $matchSplit = explode('_', $matchID);
        $pdbID = $matchSplit[0];
        $chain = $matchSplit[1];

        $pdbHitID = $pdbID . $chainID;

        $url = 'http://pdbflex.org/fsn/php/pdbChainGetCluster.php?pdb=' . $pdbID . '&chain=' . $chain;
        // echo($url);

        $options = array(
          'http' => array(
            // 'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'GET',
          // 'content' => http_build_query($data),
          ),
        );

        $context = stream_context_create($options);
        $clusterInfoJSONString = file_get_contents($url, false, $context);
        if (strcmp($clusterInfoJSONString, '{"sender":"pdbChainGetCluster.php",message":"No cluster found."}') == 0) {
            $errorMessage = array();
            $errorMessage['script'] = 'pdbChainGetCluster.php';
            $errorMessage['title'] = 'No cluster found';
            $errorMessage['message'] = 'No matching cluster was detected for your input sequence.';
            echo(json_encode($errorMessage));
            exit();
        }

        // echo($clusterInfoJSONString);
        // {"pdbID":"1ujp","chainID":"A","clusterID":"13292","masterID":"45197","queryPDB":"1wxj","queryChain":"A"}
        $clusterDetails = json_decode($clusterInfoJSONString, TRUE);

        $masterPDBID = $clusterDetails["pdbID"];
        $masterChainID = $clusterDetails["chainID"];
        $masterClusterID = $clusterDetails["clusterID"];

        $clusterName = $masterPDBID . $masterChainID;

        if(in_array($clusterName,$foundMasterIDs)){
            continue;
        }

        $url = "http://pdbflex.org/fsn-data/rmsdClusters/representatives/" . $clusterName . "centers.json";

        $options = array(
          'http' => array(
            // 'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'GET',
          // 'content' => http_build_query($data),
          ),
        );

        $context = stream_context_create($options);
        $subClustersJSONString = file_get_contents($url, false, $context);
        // echo($subClustersJSONString);
        $subClusters = json_decode($subClustersJSONString, TRUE);

        // print_r($subClusters);

        $subClusterArray = array();
        foreach ($subClusters as $subCluster) {
            // echo($subCluster);
            $subClusterID = $subCluster['name'];
            // $subClusterPDB = substr($subClusterID, 0, 4);
            // $subClusterChain = substr($subClusterID, 4, 1);

            $parts = pdbChainFromPDBID($subClusterID);
            // print_r($parts);
            $subClusterPDB = $parts['pdbID'];
            $subClusterChain = $parts['chain'];

            $url = "http://pdbflex.org/fsn/php/getPDBInfo.php?pdb=" . $subClusterPDB . "&chain=" . $subClusterChain;
            // print_r($url);
            $options = array(
              'http' => array(
                // 'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'GET',
              // 'content' => http_build_query($data),
              ),
            );

            $context = stream_context_create($options);
            $pdbInfoJSONString = file_get_contents($url, false, $context);
            
            $pdbInfo = json_decode($pdbInfoJSONString, TRUE);
            $ligands = $pdbInfo["ligands"];

            // echo($subClusterID);
            if(!in_array($pdbInfo, $subClusterArray))
                array_push($subClusterArray, $pdbInfo);
        }

        // print_r($subClusterArray);

        $masterInfo = array();
        $masterInfo['PDB'] = $masterPDBID;
        $masterInfo['chain'] = $masterChainID;
        $masterInfo['masterID'] = $clusterName;
        $masterInfo['masterDbID'] = $masterClusterID;
        $masterInfo['score'] = $matchScore;
        $masterInfo['ident'] = $matchIdentity;
        $masterInfo['flex'] = 5;
        $masterInfo['rmsd'] = 2.467;
        $masterInfo['size'] = count($subClusterArray);
        $masterInfo['representatives'] = $subClusterArray;
        // echo($masterInfo);
        array_push($allMasters, $masterInfo);
        array_push($foundMasterIDs, $clusterName);
        // break;
    }
    echo(json_encode($allMasters));
}

#"http://pdbflex.org/fsn-data/rmsdClusters/fullPlots/".$clusterName."result.json";
?>