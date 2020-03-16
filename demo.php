<?php
include("db_connect.php");
	$db=new DB_connect();
	$con=$db->connect();
// array for JSON response
$response = array();
 
// check for required fields
	if ((isset($_REQUEST['Name']) && isset($_REQUEST['Password']) && isset($_REQUEST['Age'])) {
	
		$Name = $_REQUEST['Name'];
		$Password = $_REQUEST['Password'];
		$Age = $_REQUEST['Age'];
		
		
		
		
		$count = 0;
		$result = mysqli_query($con,"select count(*) from UserRegister where Name='".$Name."'");
		$row = mysqli_fetch_array($result);
		$count = $row[0];
		
		if ($count==0){	
 
 	   // mysql inserting a new row
	    $res = mysqli_query($con,"INSERT INTO UserRegister (Name,Password,Age) VALUES('".$Name."','".$Password."','".$Age."')");
 
 	   // check if row inserted or not
	    if ($res) {
        	// successfully inserted into database
	        $response["success"] = 1;
        	$response["message"] = "New Account Successfully !!";
 
        	// echoing JSON response
        	echo json_encode($response);
    	} 
		else {
        	// failed to insert row
        	$response["success"] = 0;
        	$response["message"] = "Oops! An error occurred.";
 
        	// echoing JSON response
        	echo json_encode($response);
    		}
		}

		else{
		// User already exits
        	$response["success"] = 2;
        	$response["message"] = "Sorry !! UserName in use.";
 
        	// echoing JSON response
        	echo json_encode($response);
		}
	}
		else {
			// required field is missing
			$response["success"] = 0;
			$response["message"] = "Required field(s) is missing.";
 
			// echoing JSON response
			echo json_encode($response);
		}
?>