<form id="formModifInfos" method="POST" action="?uc=<?php echo $uc; ?>&action=<?php echo $action; ?>">
    <fieldset>
        <legend>
            <h3>Modifier mes informations</h3>
        </legend>

        <table>
            <tbody>
                <tr class="champ">
                    <td>
                        Nom <span class="red">*</span>
                    </td>

                    <td>
                        <input id="nom" name="nom" maxlength="255" value="<?php echo $nom; ?>" placeholder="Saisissez votre nom" required>
                    </td>
                </tr>

                <tr class="champ">
                    <td>
                        Prénom <span class="red">*</span>
                    </td>

                    <td>
                        <input id="prenom" name="prenom" maxlength="255" value="<?php echo $prenom; ?>" placeholder="Saisissez votre prénom" required>
                    </td>
                </tr>

                <tr class="champ">
                    <td>
                        Date de naissance <span class="red">*</span>
                    </td>
                    <td>
                        <input id="dateNaiss" type="date" name="dateNaiss" value="<?php echo $dateNaiss ?>" max="<?php echo date("Y-m-d"); ?>" required>
                    </td>
                </tr>

                <tr class="champ">
                    <td>
                        Mot de passe <span class="red">*</span>
                    </td>

                    <td>
                        <input id="mdp" type="password" name="mdp" maxlength="255" placeholder="Saisissez votre mot de passe">
                    </td>
                </tr>

                <tr class="champ">
                    <td>
                        Vérification mot de passe <span class="red">*</span>
                    </td>

                    <td>
                        <input id="verifMdp" type="password" name="verifMdp" maxlength="255" placeholder="Re-saisissez votre mot de passe">
                    </td>
                </tr>

                <tr>
                    <td>
                        <input type="submit" value="Valider" name="valider">
                        <input type="reset" value="Annuler" name="annuler">
                    </td>
                </tr>

            </tbody>
        </table>
    </fieldset>
</form>