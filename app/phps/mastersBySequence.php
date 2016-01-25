<?php

///data/www/FSN/data/pdb_seqres.txt
	// require_once('blastXML.php');

	$fullSequence 	= $_POST['sequence'];

	$url = 'http://pdbflex.org/fsn/php/sequenceToPDB.php';
	$data = array('sequence' => $fullSequence);

	// use key 'http' even if you send the request to https://...
	$options = array(
	    'http' => array(
	        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
	        'method'  => 'POST',
	        'content' => http_build_query($data),
	    ),
	);
	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);
	if ($result === FALSE) { /* Handle error */ }

	var_dump($result);
	


?>