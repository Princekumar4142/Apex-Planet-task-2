document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const optionsMenu = document.getElementById('optionsMenu');
    const mainHeading = document.getElementById('main-heading');
    const contactFormSection = document.getElementById('contactFormSection');
    const todoFormSection = document.getElementById('todoFormSection');
    const backButtons = document.querySelectorAll('.back-button');

    const contactForm = document.getElementById('contactForm');
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactSubject = document.getElementById('contactSubject');
    const contactMessage = document.getElementById('contactMessage');

    const todoInput = document.getElementById('todoInput');
    const addTodoButton = document.getElementById('addTodoButton');
    const todoList = document.getElementById('todoList');

    const reminderPopup = document.getElementById('reminderPopup');
    const reminderText = document.getElementById('reminderText');
    const closePopupButton = document.querySelector('.popup .close-button');

    // --- Utility Functions ---
    function showSection(sectionToShow) {
        optionsMenu.classList.add('hidden');
        mainHeading.classList.add('hidden');
        contactFormSection.classList.add('hidden');
        todoFormSection.classList.add('hidden');
        sectionToShow.classList.remove('hidden');
    }

    function showReminder(message) {
        reminderText.textContent = message;
        reminderPopup.classList.remove('hidden');
    }

    function hideReminder() {
        reminderPopup.classList.add('hidden');
    }

    function validateField(inputElement, errorElement, errorMessage) {
        if (inputElement.value.trim() === '') {
            errorElement.textContent = errorMessage;
            inputElement.classList.add('invalid');
            return false;
        } else {
            errorElement.textContent = '';
            inputElement.classList.remove('invalid');
            return true;
        }
    }

    function validateEmail(emailInput, errorElement) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validateField(emailInput, errorElement, 'Email is required.')) {
            return false;
        }
        if (!emailRegex.test(emailInput.value.trim())) {
            errorElement.textContent = 'Please enter a valid email address.';
            emailInput.classList.add('invalid');
            return false;
        } else {
            errorElement.textContent = '';
            emailInput.classList.remove('invalid');
            return true;
        }
    }

    function clearForm(formElement) {
        formElement.reset(); // Resets all form fields
        // Clear any error messages
        formElement.querySelectorAll('.error-message').forEach(span => span.textContent = '');
        formElement.querySelectorAll('input, textarea').forEach(input => input.classList.remove('invalid'));
    }

    // --- Event Listeners ---

    // Option Buttons Click
    optionsMenu.addEventListener('click', (event) => {
        if (event.target.classList.contains('option-button')) {
            const formType = event.target.dataset.form;
            if (formType === 'contact') {
                showSection(contactFormSection);
            } else if (formType === 'todo') {
                showSection(todoFormSection);
            }
        }
    });

    // Back Buttons Click
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            contactFormSection.classList.add('hidden');
            todoFormSection.classList.add('hidden');
            optionsMenu.classList.remove('hidden');
            mainHeading.classList.remove('hidden');
            clearForm(contactForm); // Clear contact form when going back
            todoInput.value = ''; // Clear todo input
            document.getElementById('todoInputError').textContent = ''; // Clear todo error
        });
    });

    // Contact Form Submission
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        let isValid = true;

        isValid = validateField(contactName, document.getElementById('contactNameError'), 'Name is required.') && isValid;
        isValid = validateEmail(contactEmail, document.getElementById('contactEmailError')) && isValid;
        isValid = validateField(contactSubject, document.getElementById('contactSubjectError'), 'Subject is required.') && isValid;
        isValid = validateField(contactMessage, document.getElementById('contactMessageError'), 'Message is required.') && isValid;

        if (isValid) {
            showReminder('Thank you for contacting us! We will get back to you soon.');
            clearForm(contactForm);
            // In a real application, you would send this data to a server here
            console.log('Contact Form Submitted:', {
                name: contactName.value,
                email: contactEmail.value,
                subject: contactSubject.value,
                message: contactMessage.value
            });
        }
    });

    // Reminder Popup Close Button
    closePopupButton.addEventListener('click', hideReminder);
    reminderPopup.addEventListener('click', (event) => {
        if (event.target === reminderPopup) {
            hideReminder(); // Close if clicked outside the content
        }
    });

    // To-Do List Functionality
    addTodoButton.addEventListener('click', () => {
        const taskText = todoInput.value.trim();
        const errorElement = document.getElementById('todoInputError');

        if (taskText === '') {
            errorElement.textContent = 'Please enter a task.';
            todoInput.classList.add('invalid');
            return;
        }

        errorElement.textContent = '';
        todoInput.classList.remove('invalid');

        const listItem = document.createElement('li');

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.addEventListener('click', () => {
            listItem.classList.toggle('completed'); // Toggle 'completed' class for styling
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            todoList.removeChild(listItem);
        });

        listItem.appendChild(taskSpan);
        listItem.appendChild(deleteButton);
        todoList.appendChild(listItem);

        todoInput.value = ''; // Clear input field
        showReminder('Task added successfully!');
    });

    // Optional: Allow adding todo with Enter key
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodoButton.click();
        }
    });
});