<?php
$css = file_get_contents("https://raw.githubusercontent.com/The2b/Fall-2017-LewisU-Web-And-Dist-Programming/master/projects/p-04-contact-manager/contact-manager.css");
$html = file_get_contents("https://raw.githubusercontent.com/The2b/Fall-2017-LewisU-Web-And-Dist-Programming/master/projects/p-04-contact-manager/contact-manager.php");

$fullStyle = "<style> " . $css . " </style>";
$styledHtml = str_replace("<link rel=\"stylesheet\" type=\"text/css\" href=\"./contact-manager.css\" />",$fullStyle,$html);

$fullHtml = str_replace("contact-manager.js","contact-manager-js.php",$styledHtml);

echo $fullHtml
?>
