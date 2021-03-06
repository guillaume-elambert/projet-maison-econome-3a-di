<?php
session_start();
date_default_timezone_set('Europe/Paris');
setlocale(LC_ALL, 'fr_FR.UTF8', 'fr.UTF8', 'fr_FR.UTF-8', 'fr.UTF-8');

require_once("util/config.php");
require_once("util/class.PdoProjet3A.inc.php");
require_once('util/fonctions.inc.php');


ob_start();

$pdo = PdoProjet3A::getPdo();

include_once("vues/v_header.php");

if (!isset($_GET['uc'])) {
	$uc = 'accueil'; // si $_GET['uc'] n'existe pas , $uc reçoit une valeur par défaut
} else {
	$uc = $_GET['uc'];
}

switch ($uc) {
	case "accueil":
		include("vues/v_accueil.php");
		break;


	case "info":
		include("controlleurs/c_informations.php");
		break;


	case "utilisateur":
		include("controlleurs/c_gestionUtilisateurs.php");
		break;

	case "espace":
		include("controlleurs/c_espaceUtilisateur.php");
		break;

	case "administrateur":
		include("controlleurs/c_admin.php");
		break;


	/*case "test":
		//insertPiecesAppartSansPiece($pdo);
		break;*/

	default:
		$redirect = HOME;
		break;
}

include("vues/v_footer.php");



if (isset($success)) {
	$_SESSION['success'] = $success;
}

if (isset($erreurs)) {
	$_SESSION['erreurs'] = $erreurs;
}

if (isset($messages)) {
	$_SESSION['messages'] = $messages;
}



if (isset($redirect)) {
	ob_end_clean();
	header("Location: " . $redirect);
}

ob_end_flush();
