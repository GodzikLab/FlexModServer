<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Credentials: true ");
	header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
	header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size,     X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
	header('Content-Type: application/json');

	$modelJobID = $_GET['modelID'];
	$sessionID = $_GET['sessionID'];

	$url = "http://ffas.godziklab.org/protmod2-cgi/check_protmod2.pl";

	$data = array('jobId' => $modelJobID);
	// print_r($data);
	// use key 'http' even if you send the request to https://...
	$options = array(
	    'http' => array(
	        // 'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
	        'method'  => 'POST',
	        'content' => http_build_query($data),
	    ),
	);

	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);

	$resultObject = json_decode($result, TRUE);

	if(strcmp($resultObject["Status"] , "Done") == 0){
		$url = $resultObject["url"];

		$sessionFolder = "../jobs/".$sessionID;
		if(!is_dir($sessionFolder))
			mkdir($sessionFolder);

		file_put_contents($sessionFolder."/".$modelJobID.".pdb", file_get_contents($url));

		$resultObject["url"] = "/jobs/".$sessionID."/".$modelJobID."model.pdb";
		echo(json_encode($resultObject));

	}else{
		// {"JobId": "query.436554299.24757"}, {"Status": "Progress"}}
		echo($result);
	}
?>