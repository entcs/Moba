<?php
$hit_count = @file_get_contents('wobcount.txt');
$hit_count++;
@file_put_contents('wobcount.txt', $hit_count);

header('Content-disposition: attachment; filename=wob.p3d');
header('Content-type: application/p3d');
readfile('wob.p3d');
?>