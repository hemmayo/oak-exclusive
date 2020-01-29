<?php
$toEmail = "info@oakexclusive.com";
$mailHeaders = "From: " . $_POST["first_name"] . " " . $_POST["last_name"] . "<" . $_POST["email"] . ">\r\n";
if (mail($toEmail, $_POST["subject"], $_POST["body"], $mailHeaders)) {
    print "<p class='alert alert-success'>We've received your message and we'd respond to you as soon as possible.</p>";
} else {
    print "<p class='alert alert-danger'>An error occured.</p>";
}
