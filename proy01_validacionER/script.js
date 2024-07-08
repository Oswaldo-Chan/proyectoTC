document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#support-form');
    
    $(form).parsley();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
    });
});