<?php

$myFile = "wobcount.txt";
$fh = fopen($myFile, 'w');
$count="Floppy Jalopy\n";
fwrite($fh, $count);
fclose($fh);

header('Content-disposition: attachment; filename=wob.p3d');
header('Content-type: application/p3d');
readfile('wob.p3d');
?>