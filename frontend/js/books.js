// function to add all books to booklist
function showBooks(data){
    for (var i =0; i< data.success.length; i++){

        var newBook = $(`

                                    <li class="list-group-item">
                                        <div class="panel panel-default">
                                            <div class="panel-heading">
                                                <span class="bookTitle">${data.success[i].title} (${data.success[i].author.name+' '+ data.success[i].author.surname })</span>
                                                <button data-id="${data.success[i].id}"
                                                        class="btn btn-danger pull-right btn-xs btn-book-remove"><i
                                                        class="fa fa-trash"></i>
                                                </button>
                                                <button data-id="${data.success[i].id}"
                                                        class="btn btn-primary pull-right btn-xs btn-book-show-description"><i
                                                        class="fa fa-info-circle"></i>
                                                </button>
                                            </div>
                                            <div class="panel-body book-description">${data.success[i].description}</div>
                                        </div>
                                    </li>
                                  
                
               `);
        $('#booksList').append(newBook);
    }
}

// function add books to options in select
function addBookToSelect(data){
    for(var i = 0; i < data.success.length; i++){

        var newElement = $(`<option value="${data.success[i].id}">${data.success[i].title}</option>`);
        $('#bookEditSelect').append(newElement);
    }
}


// ajax - add all books to booklist and option in select
$.ajax({
    url: 'http://localhost/Bookstore/rest/rest.php/book/',
    method: 'GET'
}).done(function(data){
    showBooks(data);
    addBookToSelect(data);
});


// add book to database from form
var form = $('#bookAdd');

form.on('submit', function (event) {
    event.preventDefault();

    var title = $('#title').val();
    var description = $('#description').val();
    var idAuthor = $('#author_id option:selected').attr('value');

    if(title !=='' && description !== ''){
        var objBook = {
            title : title,
            description: description,
            author_id: idAuthor
        };

        $.ajax({
            url: 'http://localhost/Bookstore/rest/rest.php/book/',
            method: 'POST',
            data: objBook,
            contentType: "application/json",
            dataType: "json"
        }).done(function(data) {
            $('#title').val('');
            $('#description').val('');
            $('#author_id').val('');
            showBooks(data);
            addBookToSelect(data);
        }).fail(function (err) {
            console.log(err);
        });

    }else{
        showModal('Nie wszystkie pola zostały wypełnione!');
    }
});

// show description of book
var list = $('#booksList');
list.on('click', 'button.btn-primary', function(){

    var description = $(this).parent().siblings().eq(0);
    description.slideToggle();
});


// remove book from option and booklist
list.on('click', 'button.btn-danger', function(){

    var id = $(this).attr('data-id');
    var bookToRemove = $(this).parent().parent().parent();
    var optionToRemove = $('option[value='+id+']');

    $.ajax({
        url: 'http://localhost/Bookstore/rest/rest.php/book/'+id,
        method: 'DELETE'
    }).done( function (data){
        $(bookToRemove).remove();
        $(optionToRemove).remove();
    }).fail(function (err){
        console.log(err);
    });
});

// all elements of form to edit book
var formToEdit = $('#bookEdit');
var titleEditForm= formToEdit.find('#title');
var descriptionEditForm = formToEdit.find('#description');
var authorInEdit = $('#author_id_edit');
var submit = formToEdit.children().last();

// edit book
var id;
var selectToEdit = $('#bookEditSelect');
selectToEdit.on('change', function(){
    id= $('#bookEditSelect option:selected').attr('value');

    //if we don't choose book the form will be hidden
    if(id !== ''){
        formToEdit.css('display', 'block');

        // add title, description and author of book to form
        $.ajax({
            url: 'http://localhost/Bookstore/rest/rest.php/book/'+id,
            method: 'GET'
        }).done(function (data){
            titleEditForm.val(data.success[0].title);
            descriptionEditForm.val(data.success[0].description);
            authorInEdit.val(data.success[0].author_id);
        }).fail(function(err){
            console.log(err);
        });

        // save changed title and description to db, booklist and option in select
        submit.on('click', function(event){
            event.preventDefault();

            var changedTitle = titleEditForm.val();
            var changedDescription = descriptionEditForm.val();
            var changedIdAuthor = $('#author_id_edit option:selected').attr('value');

            var objBook ={
                title: changedTitle,
                description: changedDescription,
                author_id: changedIdAuthor
            };

            // all elements which need to be update
            var spanWithTitle = $('button[data-id='+id+']').eq(0).prev();
            var divWithDescription = $('button[data-id='+id+']').parent().next();
            var optionWithTitle = $('option[value='+id+']');

            $.ajax({
                url: 'http://localhost/Bookstore/rest/rest.php/book/'+id,
                method: 'PATCH',
                data: objBook,
                contentType: "application/json",
                dataType: "json"
            }).done(function(data){
                spanWithTitle.text(data.success[0].title +' ('+ data.success[0].author.name+' '+ data.success[0].author.surname + ') ');
                optionWithTitle.text(data.success[0].title);
                divWithDescription.text(data.success[0].description);

                formToEdit.css('display', 'none');
                selectToEdit.val('');
                id = '';
            }).fail(function (err){
                console.log(err);
            });
        });

    }else{
        formToEdit.css('display', 'none');
    }
});

// function add all authors to select
function addAuthorsToSelect(data){
    for( var i = 0; i < data.success.length; i++){

        var newElement = (` <option value="${data.success[i].id}"> ${data.success[i].name} ${data.success[i].surname}</option>`);

        $('#author_id').append(newElement);
        $('#author_id_edit').append(newElement);
    }
}

// add all authors to select in add book form and select in edit book form
$.ajax({
    url: 'http://localhost/Bookstore/rest/rest.php/author/',
    method: 'GET'
}).done(function (data){
    addAuthorsToSelect(data);
}).fail(function (err){
    console.log(err)
});






