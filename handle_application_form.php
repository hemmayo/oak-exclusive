<?php

//Recepient Email Address
$to_email = "info@oakexclusive.com";
$eol = "<br/>";

//check if its an ajax request, exit if not
if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) and strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
    $output = json_encode(array( //create JSON data
        'type' => 'error',
        'text' => 'Sorry Request must be Ajax POST',
    ));
    die($output); //exit script outputting json data
}

//Sanitize input data using PHP filter_var().
$name = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
$email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
$cover_letter = $_POST['cover_letter'];
$phone = $_POST['phone'];
$position = $_POST['position'];
$subject = "Job Application - " . $position;

//Textbox Validation
if (strlen($name) < 4) { // If length is less than 4 it will output JSON error.
    $output = "<p class='alert alert-warning'>Name is too short or empty!</p>";
    die($output);
}
$message = "Name: " . $name . $eol;
$message .= "Email Address: " . $email . $eol;
$message .= "Phone number: " . $phone . $eol . $eol;
$message .= $cover_letter . $eol;

$file_attached = false;

if (isset($_FILES['file_attach'])) //check uploaded file
{
    //get file details we need
    $file_tmp_name = $_FILES['file_attach']['tmp_name'];
    $file_name = $_FILES['file_attach']['name'];
    $file_size = $_FILES['file_attach']['size'];
    $file_type = $_FILES['file_attach']['type'];
    $file_error = $_FILES['file_attach']['error'];

    //exit script and output error if we encounter any
    if ($file_error > 0) {
        $mymsg = array(
            1 => "The uploaded file exceeds the upload_max_filesize directive in php.ini",
            2 => "The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form",
            3 => "The uploaded file was only partially uploaded",
            4 => "No file was uploaded",
            6 => "Missing a temporary folder");

        $output = "<p class='alert alert-danger'>" . $mymsg[$file_error] . "</p>";
        die($output);
    }
    // $allowedExts = array("pdf", "doc", "docx");
    // $extension = end(explode(".", $_FILES['file_attach']['name']));

    // if (!(in_array($extension, $allowedExts))) {
    //     $output = json_encode(array('type' => 'error', 'text' => 'Only PDF, DOC and DOCX extensions are allowed'));
    //     die($output);
    // }

    //read from the uploaded file & base64_encode content for the mail
    $handle = fopen($file_tmp_name, "r");
    $content = fread($handle, $file_size);
    fclose($handle);
    $encoded_content = chunk_split(base64_encode($content));
    //now we know we have the file for attachment, set $file_attached to true
    $file_attached = true;

}

if ($file_attached) //continue if we have the file
{

    // a random hash will be necessary to send mixed content
    $separator = md5(time());

    // carriage return type (RFC)
    $eol = "\r\n";

    // main header (multipart mandatory)
    $headers = "From:" . $name . " <" . $email . ">" . $eol;
    $headers .= "MIME-Version: 1.0" . $eol;
    $headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"" . $eol;
    $headers .= "Content-Transfer-Encoding: 7bit" . $eol;
    $headers .= "This is a MIME encoded message." . $eol;

    // message
    $body .= "--" . $separator . $eol;
    $body .= "Content-type:text/html; charset=utf-8\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $message . $eol . $eol;

    // attachment
    $body .= "--" . $separator . $eol;
    // $body .= "Content-Type:" . $file_type . " ";
    $body .= "Content-Type: application/octet-stream; name=\"" . $file_name . "\"" . $eol;
    $body .= "Content-Disposition: attachment; filename=\"" . $file_name . "\"" . "; size=\"" . $file_size . "\"" . $eol;
    $body .= "Content-Transfer-Encoding: base64" . $eol . $eol;
    $body .= $encoded_content . $eol . $eol;
    $body .= "--" . $separator . "--";

} else {

    $eol = "\r\n";
    $headers = "From:" . $name . " <" . $email . ">" . $eol;
    $headers .= "Reply-To: " . strip_tags($email) . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
    $body .= $message . $eol;

}

$send_mail = mail($to_email, $subject, $body, $headers);

if (!$send_mail) {
    //If mail couldn't be sent output error. Check your PHP email configuration (if it ever happens)
    $output = "<p class='alert alert-success'>Could not send mail! Please check your PHP mail configuration.";
    die($output);
} else {
    $output = "<p class='alert alert-success'>Thank you for your application, we will get back to you shortly!</p>";
    die($output);
}
