<?php


	function pdbChainFromPDBID($fullName){
		$pdbID = substr($fullName, 0, 4);
		$chainID=substr($fullName,4,strlen($fullName)-4);
		return array('pdbID' => $pdbID,'chain' => $chainID);
	}


?>