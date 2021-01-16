//Champ de recherche pour la ville
var rechercheVille = $('#rechercheVille');
//Liste déroulante pour la ville
var selectVille = $('#selectVille');

//Champ de recherche pour la rue
var rechercheRue = $('#rechercheRue');
//Liste déroulante pour la rue
var selectRue = $('#selectRue');

//Champ de recherche pour l'immeuble
var rechercheImmeuble = $('#rechercheImmeuble');
//Liste déroulante pour l'immeuble
var selectImmeuble = $('#selectImmeuble');

//Liste déroulante pour l'appartement
var selectAppartement = $('#selectAppartement');

//Champs à prendre en compte avant la validatio
var fieldNotSearchField = $(".champ:not(#ville, #rue, #immeuble, #appartement, #situation) input");

var estProprietaire = false;
var radioSituation = $("#situation");

var tableAppartement = $("#appartement");

var champs = $.merge($.merge([], fieldNotSearchField), $("select, input[type=radio]"));

var totalChamps = 11;
var nbChampsAttendus = 11;

var validBtn = $(":submit");
var form = $('#formInscription');

//timer identifier
var typingTimer = null;
//time in ms, 5 second for example
var doneTypingInterval = 500;

/*-------------------------------------------------------*/
/*-------------- VERIF FORM OK POUR ENVOI ---------------*/
/*-------------------------------------------------------*/

/**
 * Fonction qui active/désactive le bouton de validation du formulaire en fonction
 * du contenu du formulaire et de l'état du bouton de validation
 *  => Si l'un des champs est vide : on bloque le formulaire
 *  => Sinon on débloque le formulaire
 */
function changeFormState() {
    var isOk = true;
    var stateBtn = validBtn.attr("disabled");
    var notAppartement = estProprietaire ? ":not(#appartement)" : "";
    var selected = $.merge($.merge([], fieldNotSearchField), $("tr"+notAppartement+" option:selected, input[type=radio]:checked"));
    console.log(selected.length + " / " + nbChampsAttendus);
    if (selected.length == nbChampsAttendus) {
        //Parcours de tous les champs de saisie
        $.each($.merge($.merge([], fieldNotSearchField), selected), function (i, obj) {
            if (!$(obj).val() || $(obj).val() == "") {
                isOk = false;
                return;
            }
        });
    } else isOk = false;

    //Entrée : le formulaire est valide
    //      ET le bouton de validation est désactivé
    //  => on réactive le bouton
    if (isOk && stateBtn) {
        validBtn.removeAttr("disabled title");
    }
    //Entrée : le formulaire n'est pas valide
    //      ET le bouton de validation est cliquable
    //  => on désactive le bouton de validation du formulaire
    else if (!isOk && !stateBtn) {
        validBtn.attr({
            "disabled": "true",
            "title": "Veuillez remplir le formulaire"
        });
    }
}


$(radioSituation).change(function () {
    if (estProprietaire) {
        tableAppartement.removeClass("invisible");
        selectAppartement.attr('required', true);
        estProprietaire = false;
        nbChampsAttendus = totalChamps;
    } else {
        tableAppartement.addClass("invisible");
        selectAppartement.removeAttr('required');
        estProprietaire = true;
        --nbChampsAttendus;
    }
    changeFormState();

})

//Detection changements sur champs du formulaire
//Si l'un des champs est vide : on bloque le formulaire
$(champs).change(function () {
    changeFormState();
});



/*-------------------------------------------------------*/
/*---------------- AJAX RECHERCHE VILLE -----------------*/
/*-------------------------------------------------------*/

function ajaxVille() {
    var value = rechercheVille.val();

    //Entrée : le champ de recherche est n'est pas vide
    if (value != "") {
        resetRue();

        $.ajax({
            url: 'ajax/chercherVille.php',
            type: 'POST',
            dataType: 'text',
            data: "recherche=" + value,
            success: function (data) {
                try {
                    var output = JSON.parse(data);
                } catch (e) {
                    console.log(data);
                    selectVille.attr('disabled', true);
                    alert("Output is not valid JSON: " + data);
                    return;
                }

                selectVille.empty();
                selectVille.append(new Option('--- Veuillez choisir une ville ---', "", false, false));

                $.each(output, function (i, obj) {
                    selectVille.append(new Option(obj.cp + " - " + obj.nomVille, obj.idVille, false, false));
                });

                selectVille.removeAttr('disabled');

            },
            error: function (request, error) {
                selectVille.attr('disabled', true);
                alert("AJAX Call Error: " + error);
            }
        });
    }
}

/*
rechercheVille.bind("change paste", function () {
    ajaxVille();
});
*/

rechercheVille.bind("keyup paste", function () {
    clearTimeout(typingTimer);
    if (this.value) {
        typingTimer = setTimeout(ajaxVille, doneTypingInterval);
    }
});

selectVille.bind("change", function () {
    if ($(this).val() != "") {
        rechercheRue.removeAttr("disabled");
        ajaxRues();
    } else {
        resetRue();
    }
});



/*-------------------------------------------------------*/
/*----------------- AJAX RECHERCHE RUE ------------------*/
/*-------------------------------------------------------*/

function ajaxRues() {

    var value = rechercheRue.val();
    var valueVille = selectVille.find("option:selected").val();

    resetImmeuble();

    $.ajax({
        url: 'ajax/chercherRueDansVille.php',
        type: 'POST',
        dataType: 'text',
        data: "ville=" + valueVille + "&recherche=" + value,
        success: function (data) {
            try {
                var output = JSON.parse(data);
            } catch (e) {
                console.log(data);
                selectRue.attr('disabled', true);
                alert("Output is not valid JSON: " + data);
                return;
            }

            selectRue.empty();
            selectRue.append(new Option('--- Veuillez choisir une rue ---', "", false, false));

            $.each(output, function (i, obj) {
                selectRue.append(new Option(obj.nomRue, obj.idRue, false, false));
            });

            selectRue.removeAttr('disabled');
        },
        error: function (request, error) {
            selectRue.attr('disabled', true);
            alert("AJAX Call Error: " + error);
        }
    });

};

/*
rechercheRue.bind("change paste", function () {
    ajaxRues();
});
*/

rechercheRue.bind("keyup paste", function () {
    clearTimeout(typingTimer);
    if (this.value) {
        typingTimer = setTimeout(ajaxRues, doneTypingInterval);
    }
});

selectRue.bind("change", function () {
    if ($(this).val() != "") {
        rechercheImmeuble.removeAttr("disabled");
        ajaxImmeubles();
    } else {
        resetImmeuble();
    }
});


function resetRue() {
    rechercheRue.attr("disabled", true);
    rechercheRue.val("");
    selectRue.attr("disabled", true);
    selectRue.empty();
    resetImmeuble();
}



/*-------------------------------------------------------*/
/*--------------- AJAX RECHERCHE IMMEUBLE ---------------*/
/*-------------------------------------------------------*/

function ajaxImmeubles() {

    var value = rechercheImmeuble.val();
    var valueRue = selectRue.find("option:selected").val();

    changeFormState();
    resetAppartement();

    $.ajax({
        url: 'ajax/chercherImmeubleDansRue.php',
        type: 'POST',
        dataType: 'text',
        data: "rue=" + valueRue + "&recherche=" + value,
        success: function (data) {
            try {
                var output = JSON.parse(data);
            } catch (e) {
                console.log(data);
                selectImmeuble.attr('disabled', true);
                alert("Output is not valid JSON: " + data);
                return;
            }

            selectImmeuble.empty();
            selectImmeuble.append(new Option('--- Veuillez choisir un immeuble ---', "", false, false));

            $.each(output, function (i, obj) {
                selectImmeuble.append(new Option("Numéro " + obj.numeroImmeuble, obj.idImmeuble, false, false));
            });

            selectImmeuble.removeAttr('disabled');
        },
        error: function (request, error) {
            selectImmeuble.attr('disabled', true);
            alert("AJAX Call Error: " + error);
        }
    });
};

/*
rechercheImmeuble.bind("change paste", function () {
    ajaxImmeubles();
});
*/

rechercheImmeuble.bind("keyup paste", function () {
    clearTimeout(typingTimer);
    if (this.value) {
        typingTimer = setTimeout(ajaxImmeubles, doneTypingInterval);
    }
});

selectImmeuble.bind("change", function () {
    if ($(this).val() != "") {
        selectImmeuble.removeAttr("disabled");
        ajaxAppartements();
    } else {
        resetAppartement();
    }
});


function resetImmeuble() {
    rechercheImmeuble.attr("disabled", true);
    rechercheImmeuble.val("");
    selectImmeuble.attr("disabled", true);
    selectImmeuble.empty();
    resetAppartement();
}



/*-------------------------------------------------------*/
/*---------------- AJAX LISTER APPARTEMENT --------------*/
/*-------------------------------------------------------*/

function ajaxAppartements() {

    var valueImmeuble = selectImmeuble.find("option:selected").val();

    $.ajax({
        url: 'ajax/listerAppartementsDansImmeuble.php',
        type: 'POST',
        dataType: 'text',
        data: "immeuble=" + valueImmeuble,
        success: function (data) {
            try {
                var output = JSON.parse(data);
            } catch (e) {
                console.log(data);
                selectAppartement.attr('disabled', true);
                alert("Output is not valid JSON: " + data);
                return;
            }

            selectAppartement.empty();
            selectAppartement.append(new Option('--- Veuillez choisir un appartement ---', "", false, false));

            $.each(output, function (i, obj) {
                selectAppartement.append(new Option("Numéro " + obj.idAppartement, obj.idAppartement, false, false));
            });

            selectAppartement.removeAttr('disabled');
        },
        error: function (request, error) {
            selectAppartement.attr('disabled', true);
            alert("AJAX Call Error: " + error);
        }
    });

};

function resetAppartement() {
    selectAppartement.attr("disabled", true);
    selectAppartement.empty();
    changeFormState();
}

$(selectAppartement).bind("change", function () {
    if ($(this).val() != "") {
        changeFormState();
    }
});



changeFormState();

//On sauvegarde l'état du tableau lors du chargement
form.data('serialize', form.serialize());

//On sauvegarde l'état du tableau avant envoie (éviter message erreur)
form.bind('submit', function (e) {
    form.data('serialize', form.serialize());
});

//On affiche une popup quand tentative de fermeture alors que
//des modifications ont été effectuées
$(window).bind('beforeunload', function (e) {
    if (form.serialize() != form.data('serialize')) return true;
    else e = null;
});