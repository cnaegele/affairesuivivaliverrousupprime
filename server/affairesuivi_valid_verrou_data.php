<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$idAffaireSuivi = 0;
if (isset($_GET['idaffairesuivi'])) {
    $idAffaireSuivi = $_GET['idaffairesuivi'];
}
$dbgo = new DBGoeland();
$bret = $dbgo->queryRetJson2("cn_affairesuivi_data_valid_verrou $idAffaireSuivi");
if ($bret === true) {
    $oAffSuivi = json_decode($dbgo->resString);
    if (count($oAffSuivi) > 0) {
        $success = true;
        $message = 'ok';
        $strjson = $dbgo->resString;
    } else {
        $success = false;
        $message = 'le suivi n\'existe pas';
        $strjson = '[]';
    }
} else {
    http_response_code(400);
    $success = false;
    $message = 'cn_affairesuivi_data_valid_verrou:' . $dbgo->resErreur;
    $strjson = '[]';
}
unset($dbgo);
$affaireSuiviValidVerrou = [
    'success' => $success,
    'message' => $message,
    'id' => $idAffaireSuivi,
    'strjson' => $strjson
];
echo json_encode($affaireSuiviValidVerrou);
