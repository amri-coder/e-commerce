// On récupère l'ensemble des liens déguisés en bouton (a) et on applique un écouteur d'évènement sur chacun.
// Lorsque l'un d'eux est cliqué, on le passe en paramètre de la fonction displayCategory.
let categoryLinks = document.querySelectorAll('header .categories a');
categoryLinks.forEach(a => {
    a.addEventListener('click', () => displayCategory(a));
});


/**
 * Fonction qui permet d'afficher la rubrique associée au bouton cliqué
 * 
 * @param a  l'élément 'a' (lien déguisé en bouton du header) qui fait le lien vers une catégorie (Vélos Homme, Vélos Femme, Vélos Enfant)
 * 
 */
function displayCategory(a) {
    // On récupère l'élément parent du lien qui a été cliqué
    let li = a.parentNode;

    // Si le lien était déjà sélectionné, pas de traitement. On sort de la fonction.
    if (li.classList.contains('displayed')) {
        return false
    }
    
    // On retire la classe displayed du bouton qui était précédemment sélectionné
    document.querySelector('.categories .displayed').classList.remove('displayed');

    // On ajoute la classe displayed au bouton qui vient d'être cliqué
    li.classList.add('displayed');

    // On retire la class displayed sur la rubrique qui était précédemment sélectionné
    document.querySelector('.category.displayed').classList.remove('displayed');

    // On ajoute la class displayed sur la rubrique correspondant au bouton cliqué
    document.querySelector(a.getAttribute('href')).classList.add('displayed');

}





