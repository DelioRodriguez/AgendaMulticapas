const apiUrl = "http://www.raydelto.org/agenda.php";

const fetchContacts = async () => {
    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error("Error fetching contacts: ", error);
        return null;
    }
};

const addContact = async (contact) => {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(contact)
        });
        return await response.json();
    } catch (error) {
        console.error("Error adding contact: ", error);
        return null;
    }
};

const getContactList = async () => {
    const contacts = await fetchContacts();
    return contacts || [];
};

const createContact = async (contact) => {
    const result = await addContact(contact);
    return result;
};

// Función para mostrar mensajes con íconos
const showMessage = (text, type) => {
    const messageElement = document.getElementById("message");
    messageElement.innerHTML = ''; // Limpiar contenido anterior

    // Crear icono
    const icon = document.createElement("i");
    icon.classList.add("icon-circle");
    
    // Asignar el ícono según el tipo de mensaje
    if (type === "success") {
        icon.classList.add("fas", "fa-check-circle"); // Ícono de check
    } else if (type === "error") {
        icon.classList.add("fas", "fa-times-circle"); // Ícono de X
    }

    messageElement.appendChild(icon);
    messageElement.appendChild(document.createTextNode(` ${text}`));

    messageElement.classList.remove("success", "error");
    messageElement.classList.add(type, "show");

    setTimeout(() => {
        messageElement.classList.remove("show");
    }, 3000);
};

document.addEventListener("DOMContentLoaded", async () => {
    const contactListElement = document.getElementById("contact-list");
    const contactForm = document.getElementById("contact-form");
    const showContactsButton = document.getElementById("show-contacts");
    const modal = document.getElementById("contact-modal");
    const closeModalButton = document.getElementById("close-modal");

    const displayContacts = (contacts) => {
        contactListElement.innerHTML = '';
        if (contacts.length === 0) {
            contactListElement.innerHTML = '<p>No hay contactos disponibles.</p>';
            return;
        }
        contacts.forEach(contact => {
            const contactItem = document.createElement("div");
            contactItem.classList.add("contact-card");

            contactItem.innerHTML = `
                <h3>${contact.nombre} ${contact.apellido}</h3>
                <p>Teléfono: ${contact.telefono}</p>
            `;

            contactListElement.appendChild(contactItem);
        });
    };

    const loadContacts = async () => {
        const contacts = await getContactList();
        if (contacts) {
            displayContacts(contacts);
        } else {
            displayContacts([]);
            showMessage("No se ha podido cargar la lista de contactos.", "error");
        }
    };

    const showModal = () => {
        modal.style.display = "block";
        loadContacts();
    };

    const closeModal = () => {
        modal.style.display = "none";
    };

    // Evento para el formulario de agregar contacto
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        if (!nombre || !apellido || !telefono) {
            showMessage("Por favor, completa todos los campos.", "error");
            return;
        }

        const newContact = { nombre, apellido, telefono };
        const result = await createContact(newContact);

        if (result) {
            showMessage("Se ha enviado correctamente.", "success");
            contactForm.reset();
            loadContacts();
        } else {
            showMessage("No se ha podido enviar.", "error");
        }
    });

    showContactsButton.addEventListener("click", showModal);
    closeModalButton.addEventListener("click", closeModal);

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });
});
