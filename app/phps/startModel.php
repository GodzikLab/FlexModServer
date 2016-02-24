<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Credentials: true ");
	header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
	header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size,     X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
	header('Content-Type: application/json');
	
	//need this to be able to get POST data sent by AngularJS
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	$fullSequence 	= $request->sequence;
	$modelPDBID 	= $request->pdbID;
	$modelChain 	= $request->chainID;
	$sessionID 		= $request->sessionID;
	// $modelPDBID = '1a50';
	// $modelChain = 'A';
	// $fullSequence = ">1A50:A|PDBID|CHAIN|SEQUENCE\nMERYENLFAQLNDRREGAFVPFVTLGDPGIEQSLKIIDTLIDAGADALELGVPFSDPLADGPTIQNANLRAFAAGVTPAQCFEMLALIREKHPTIPIGLLMYANLVFNNGIDAFYARCEQVGVDSVLVADVPVEESAPFRQAALRHNIAPIFICPPNADDDLLRQVASYGRGYTYLLSRSGVTGAENRGALPLHHLIEKLKEYHAAPALQGFGISSPEQVSAAVRAGAAGAISGSAIVKIIEKNLASPKQMLAELRSFVSAMKAASRA";

	if(is_null($fullSequence) || is_null($modelPDBID) || is_null($modelChain) || is_null($sessionID)){
		$errorMessage = array();
	    $errorMessage['script'] = 'checkModelStatus.php';
	    $errorMessage['title'] = 'Parameter error';
	    $errorMessage['message'] = 'POST parameters sequence : '.$fullSequence.', pdbID : '.$modelPDBID.' ,chainID : '.$modelChain.' or sessionID : '.$sessionID.' were not set properly!';
	    echo(json_encode($errorMessage));
	    exit();
	}

	$url = 'http://pdbflex.org/fsn/php/alignSequences.php';
	// $url = 'http://localhost/FSN/public_html/php/alignSequences.php';
	$data = array('sequence' => $fullSequence,'pdbID' => '1a50','chainID' => 'A');
	// print_r($data);
	// use key 'http' even if you send the request to https://...
	$options = array(
	    'http' => array(
	        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
	        'method'  => 'POST',
	        'content' => http_build_query($data),
	    ),
	);
	$context  = stream_context_create($options);
	
	$blastAlignmentJSON = file_get_contents($url, false, $context);

	if ($blastAlignmentJSON === FALSE) {
	    $errorMessage = array();
	    $errorMessage['script'] = 'alignSequences.php';
	    $errorMessage['title'] = 'Pairwise alignment failed';
	    $errorMessage['message'] = 'Pairwise alignment failed!';
	    echo(json_encode($errorMessage));
	    exit();
	}

	// echo($blastAlignmentJSON);

	// [{
	// 	"queryKey": "1A50:A|PDBID|CHAIN|SEQUENCE",
	// 	"templateKey": "Frame:0",
	// 	"score": "0.000e+00",
	// 	"identity": 100.00,
	// 	"similarity": 100.00,
	// 	"identAA": 268,
	// 	"simAA": 268,
	// 	"aliLen": 268,
	// 	"queryStart": 1,
	// 	"queryEnd": 268,
	// 	"queryAA": "MERYENLFAQLNDRREGAFVPFVTLGDPGIEQSLKIIDTLIDAGADALELGVPFSDPLADGPTIQNANLRAFAAGVTPAQCFEMLALIREKHPTIPIGLLMYANLVFNNGIDAFYARCEQVGVDSVLVADVPVEESAPFRQAALRHNIAPIFICPPNADDDLLRQVASYGRGYTYLLSRSGVTGAENRGALPLHHLIEKLKEYHAAPALQGFGISSPEQVSAAVRAGAAGAISGSAIVKIIEKNLASPKQMLAELRSFVSAMKAASRA",
	// 	"templateStart": 1,
	// 	"templateEnd": 268,
	// 	"templateAA": "MERYENLFAQLNDRREGAFVPFVTLGDPGIEQSLKIIDTLIDAGADALELGVPFSDPLADGPTIQNANLRAFAAGVTPAQCFEMLALIREKHPTIPIGLLMYANLVFNNGIDAFYARCEQVGVDSVLVADVPVEESAPFRQAALRHNIAPIFICPPNADDDLLRQVASYGRGYTYLLSRSGVTGAENRGALPLHHLIEKLKEYHAAPALQGFGISSPEQVSAAVRAGAAGAISGSAIVKIIEKNLASPKQMLAELRSFVSAMKAASRA",
	// 	"templateCutAA": "MERYENLFAQLNDRREGAFVPFVTLGDPGIEQSLKIIDTLIDAGADALELGVPFSDPLADGPTIQNANLRAFAAGVTPAQCFEMLALIREKHPTIPIGLLMYANLVFNNGIDAFYARCEQVGVDSVLVADVPVEESAPFRQAALRHNIAPIFICPPNADDDLLRQVASYGRGYTYLLSRSGVTGAENRGALPLHHLIEKLKEYHAAPALQGFGISSPEQVSAAVRAGAAGAISGSAIVKIIEKNLASPKQMLAELRSFVSAMKAASRA"
	// }]

	$blastAlignment = json_decode($blastAlignmentJSON, TRUE)[0];

	//http://ffas.burnham.org/protmod-cgi/qryByAliForm.pl?pdbId=&chain=&targetStart=&templateStart=qs&ali=qs%20ts 

	$url = "http://ffas.godziklab.org/protmod2-cgi/protmod2.pl";

	$data = array();

	// print_r($blastAlignment);

	$data["queryStart"]=$blastAlignment["queryStart"];
	$data["templateStart"]=$blastAlignment["templateStart"];
	$data["pdbId"]=$modelPDBID;
	$data["chainId"]=$modelChain;
	$data["qs"]=$blastAlignment["queryAA"];
	$data["ts"]=$blastAlignment["templateAA"];
	$data["modMethod"]="Modeller";
	$data["service"]="Restful";

	// print_r($data);

	$options = array(
	    'http' => array(
	        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
	        'method'  => 'POST',
	        'content' => http_build_query($data),
	    ),
	);

	$context  = stream_context_create($options);
		
	// {"JobId": "Test10.436552852.24574", "Status": "submitted" }
	$returnArray = file_get_contents($url, false, $context);
	
	echo($returnArray);

?>

