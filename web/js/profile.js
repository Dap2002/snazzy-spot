function readURL(input) {
    if (input.files && input.files[0]) {

        const reader = new FileReader();

        reader.onload = function (e) {
            $('.image-upload-wrap').hide();

            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();

            $('.image-title').html(input.files[0].name.substring(0, 15));
        };

        reader.readAsDataURL(input.files[0]);

    } else {
        removeUpload();
    }
}

function upload(file) {
    const formData = new FormData();
    formData.append('file', file)
    console.log(file)
    fetch('/api/images', {
        method: 'POST',
        body: formData
    }).then(response => response.json()).then(response => {
        console.log(response)
    })
}

function removeUpload() {
    const fileUpload = $(".file-upload-input")
    fileUpload.replaceWith(fileUpload.clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}

$(document).ready(() => {
    const imageUpload = $(".image-upload-wrap")
    imageUpload.bind('dragover', function () {
        imageUpload.addClass('image-dropping');
    });
    imageUpload.bind('dragleave', function () {
        imageUpload.removeClass('image-dropping');
    });
})


