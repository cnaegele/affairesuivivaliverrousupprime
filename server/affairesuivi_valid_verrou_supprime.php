<?php
//require 'gdt/gautentificationf5.php';
require_once '/data/dataweb/GoelandWeb/webservice/employe/clCNWSEmployeSecurite.php';
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:  *");
header("Access-Control-Allow-Methods:  POST, OPTIONS");
$idCaller = 0;
$idCaller = 6;
//if (array_key_exists('empid', $_SESSION)) {
//    $idCaller = $_SESSION['empid'];
//}
if ($idCaller > 0) {
    $pseudoWSEmployeSecurite = new CNWSEmployeSecurite();
    if ($pseudoWSEmployeSecurite->isInGroupe($idCaller, 'GoelandManager')) {
        $jsonData = file_get_contents('php://input');
        $oData = json_decode($jsonData);
        $dbgo = new DBGoeland();
        $idAffaireSuivi = $oData->idaffairesuivi;

        //Supprime validation et verrou
        $sSql = "cn_affairesuivi_supprime_valid_verrou $idAffaireSuivi, $idCaller, 'oui', 'oui'";
        $dbgo->queryRetNothing($sSql, 'W');

        //Data suivi
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
            $success = false;
            $message = 'cn_affairesuivi_data_valid_verrou:' . $dbgo->resErreur;
            $strjson = '[]';
        }
        unset($dbgo);
    } else {
        $success = false;
        $message = 'ERREUR GoelandManager requis';
        $strjson = '[]';
    }
} else {
    $success = false;
    $message = 'ERREUR athentification F5';
    $strjson = '[]';
}

$affaireSuiviValidVerrou = [
    'success' => $success,
    'message' => $message,
    'id' => $idAffaireSuivi,
    'strjson' => $strjson
];
echo json_encode($affaireSuiviValidVerrou);

