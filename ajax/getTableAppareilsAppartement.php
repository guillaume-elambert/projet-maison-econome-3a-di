<?php
require_once("../util/config.php");
require_once("util/class.PdoProjet3A.inc.php");
$pdo = PdoProjet3A::getPdo();

$appareils = array();
$pieces = array();

$idImmeuble = $_REQUEST['idImmeuble'];
$idAppartement = $_REQUEST['idAppartement'];

$appareils = $pdo->getAppareilsAppart($idImmeuble, $idAppartement);
$pieces = $pdo->getPiecesAppart($idImmeuble, $idAppartement);

$printIfEmpty = "Il n'y a aucun appareil dans cet appartement...<br/>
<a href='" . HOME . "?uc=espace&action=ajouter-un-appareil&immeuble=$idImmeuble&appartement=$idAppartement'>Ajouter un appareil à l'appartement</a>";

require_once("util/configActionsTables.inc.php");
include("vues/v_listeAppareils.php");
