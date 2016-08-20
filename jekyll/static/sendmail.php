<?php
	// Sanitation check
	if(empty($_POST['name'])		||
   	empty($_POST['phone']) 		||
   	empty($_POST['email']) 		||
   	empty($_POST['subject']) 	||
   	empty($_POST['message'])	||
   	!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL))
	{
    echo json_encode(array(
			'result' => 'error',
		));
	}

	// Create email
	$to 			= "postmaster@groveld.com";

	$subject  = strip_tags($_POST['subject']);

	$headers .= "Reply-To: ". strip_tags($_POST['name']) . " <" . strip_tags($_POST['email']) . ">\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

	$message  = "<html>";
	$message .= "<body>";
	$message .= "<h2>" . strip_tags($_POST['name']) . "</h2>";
	$message .= '<p><strong>Phone: <a href="tel:' . strip_tags($_POST['phone']) . '">' . strip_tags($_POST['phone']) . "</a></strong><br>";
	$message .= '<strong>Email: <a href="mailto:' . strip_tags($_POST['email']) . '">' . strip_tags($_POST['email']) . "</a></strong></p>";
	$message .= '<hr width="100%" color="#3f51b5" size="2">';
	$message .= "<h3>" . strip_tags($_POST['subject']) . "</h3>";
	$message .= "<p>" . nl2br(htmlspecialchars($_POST['message'])) . "</p>";
	$message .= '<hr width="100%" color="#3f51b5" size="2">';
	$message .= "</body>";
	$message .= "</html>";

	// Send email
	if(mail($to, $subject, $message, $headers))
	{
		echo json_encode(array(
			'result' => 'ok',
		));
	}
	else
	{
		echo json_encode(array(
			'result' => 'error',
		));
	}
?>
