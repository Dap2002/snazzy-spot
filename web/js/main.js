/**
 * Script to include on each page
 * Manages account details
 **/
$(document).ready(function () {
    $('#nav_toggle').click(() => {
        const dropdown = $(".dropdown")
        dropdown.toggleClass('down').toggleClass('gone');
    })
})
