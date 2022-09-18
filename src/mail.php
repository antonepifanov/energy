<meta http-equiv='refresh' content='3; url=.'>
<meta charset="UTF-8" />

<?php

$email = "calc_sme_credit@energotransbank.com";
$tel = $_POST['tel'];
$time = $_POST['time'];
$header = "Новая заявка";

$mes = "Телефон: " . $tel . "\nУдобное время для звонка: " . $time;

$send = mail($email, $header, $mes, "Content-type:text/plain; charset = UTF-8\r\nFrom:test@goryachev-nash.ru");

?>
