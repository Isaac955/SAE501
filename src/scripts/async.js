import validator from "validator";

const submitForm = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les données du formulaire sous forme d'objet
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    console.log(formValues); // Affiche les valeurs du formulaire dans la console

    // Validation du champ "lastname"
    if (validator.isEmpty(formValues.lastname.trim())) {
        document.querySelector("[data-error-message='lastname']").classList.remove("hidden");
        return; // Stoppe l'exécution en cas d'erreur
    } else {
        document.querySelector("[data-error-message='lastname']").classList.add("hidden");
    }

    // Envoi des données à l'API
    try {
        const response = await fetch("http://localhost:3900/api/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        });

        const result = await response.json();

        // Affichage du message de succès ou d'erreur
        const messageResponse = document.getElementById("messageResponse");
        if (response.ok) {
            messageResponse.innerText = "Message envoyé avec succès !";
            e.target.reset(); // Réinitialise le formulaire
        } else {
            messageResponse.innerText = "Erreur : " + result.error;
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire :", error);
        document.getElementById("messageResponse").innerText = "Erreur lors de l'envoi du message.";
    }
};

// Sélectionner tous les formulaires avec data-async-form et ajouter l'événement "submit"
document.querySelectorAll("[data-async-form]").forEach((item) => {
    item.addEventListener("submit", submitForm);
});
