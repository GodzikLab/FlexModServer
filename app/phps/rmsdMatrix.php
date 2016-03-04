<?php

	// http://localhost/modflex/app/phps/rmsdMatrix.php?pdbs=1dfjI,2z64A,4fs7A,4df0A&jobID=123456

	require_once('functions.php');
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Credentials: true ");
	header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
	header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size,     X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");
	header('Content-Type: application/json');

	$pdbList= $_GET['pdbs'];
	$jobID 	= $_GET['jobID'];

	if (strlen($pdbList) == 0) {
	    $errorMessage = array();
	    $errorMessage['script'] = 'rmsdMatrix.php';
	    $errorMessage['title'] = 'No pdbs';
	    $errorMessage['message'] = 'The script did not recieve any pdbs.';
	    echo(json_encode($errorMessage));
	    exit();
	}

	if (strlen($jobID) == 0) {
	    $errorMessage = array();
	    $errorMessage['script'] = 'rmsdMatrix.php';
	    $errorMessage['title'] = 'No jobID';
	    $errorMessage['message'] = 'The script did not recieve any jobID.';
	    echo(json_encode($errorMessage));
	    exit();
	}

	// http://pdbflex.org/php/rmsdMatrix.php?pdbs=1dfjI,2z64A,4df0A&jobID=123456
	$url = 'http://pdbflex.org/php/rmsdMatrix.php?pdbs='.$pdbList.'&jobID='.$jobID;

    $options = array(
          'http' => array(
            // 'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'GET'
          // 'content' => http_build_query($data),
          ),
    );

    $context = stream_context_create($options);
    $resultJSON = file_get_contents($url, false, $context);

    if (json_decode($resultJSON) === null && json_last_error() !== JSON_ERROR_NONE) {
    	$errorMessage = array();
	    $errorMessage['script'] = 'rmsdMatrix.php';
	    $errorMessage['title'] = 'Bad result';
	    $errorMessage['message'] = 'The returned result was not a JSON.';
	    echo(json_encode($errorMessage));
	    exit();
	}

    echo($resultJSON);

?>