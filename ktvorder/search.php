<?php
header('Content-type:application/json');

$response = array(
	'totalCount' => '89',
	'ktvOrderList' => array(
		array(
			'id' => '16',
			'userid' => 'chenxin21',
			'phone' => '10101010101',
			'city' => '北京',
			'KTV' => '温莎KTV',
			'starttime' => '2014-09-11',
			'endtime' => '2014-'			
				
		),
		
	),

);
echo json_encode($response);

?>
