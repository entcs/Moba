<?php
header('Content-disposition: attachment; filename=Myopia.p3d');
header('Content-type: application/p3d');
readfile('Myopia.p3d');
?>