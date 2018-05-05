// function to add author to authorslist
function addAuthor(data) {

    for (var i = 0; i < data.success.length; i++) {

        var newAuthor = $(`        
                    <li class="list-group-item">
                        <div class="panel panel-default">
                            <div class="panel-heading"><span class="authorTitle">${data.success[i].name} ${data.success[i].surname}</span>
                                <button data-id="${data.success[i].id}" class="btn btn-danger pull-right btn-xs btn-author-remove"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>
                    </li>
            `);

        $('#authorsList').append(newAuthor);
    }
}

// function to add all authors to select
function addAuthorToSelect(data){

    for( var i = 0; i < data.success.length; i++) {

        var newElement = $(`
        <option value="${data.success[i].id}">${data.success[i].name} ${data.success[i].surname}</option>
        `);

        $('#authorEditSelect').append(newElement);
    }
}

// show all authors in authorlist and add all authors to select
$.ajax({
    url: 'http://localhost/Bookstore/rest/rest.php/author/',
    method: 'GET'
}).done(function (data){
    addAuthor(data);
    addAuthorToSelect(data);
}).fail(function (err){
    console.log(err);
});

// add new author
var form = $('#authorAdd');
form.on('submit', function (event){
    event.preventDefault();

    var name = form.find('#name').val();
    var surname = form.find('#surname').val();

    if(name !== '' && surname !== ''){
        var objAuthor = {
            name: name,
            surname: surname
        };

        $.ajax({
            url: 'http://localhost/Bookstore/rest/rest.php/author/',
            method: 'POST',
            data: objAuthor,
            contentType: "application/jason",
            dataType: "json"
        }).done(function (data){
            // console.log(data.success);
            addAuthor(data);
            addAuthorToSelect(data);

            form.find('#name').val('');
            form.find('#surname').val('');
        }).fail(function (err){
            console.log(err);
        });

    };
});

// delete author from database, select and authorslist
var authorList = $('#authorsList');
authorList.on('click', 'button.btn-author-remove', function(){
    var id = $(this).attr('data-id');

    var authorToDelete = $(this).parent().parent().parent();
    var optionToDelete = $('option[value='+id+']');

    $.ajax({
        url: 'http://localhost/Bookstore/rest/rest.php/author/'+id,
        method: 'DELETE'
    }).done(function(data){
        $(authorToDelete).remove();
        $(optionToDelete).remove();
    }).fail(function(err){
        console.log(err);
    });
});

//select all element in edit form
var authorEditForm = $('#authorEdit');
var authorEditName = authorEditForm.find('#name');
var authorEditSurname = authorEditForm.find('#surname');
var submit = authorEditForm.find('.btn-primary');

// edit author
var authorEditSelect = $('#authorEditSelect');
authorEditSelect.on('change', function (){
    var id= $('#authorEditSelect option:selected').attr('value');

   if(id !== ''){
       authorEditForm.css('display', 'block');

       // filling edit form with data of author
       $.ajax({
           url: 'http://localhost/Bookstore/rest/rest.php/author/'+id,
           method: 'GET'
       }).done(function (data){
           authorEditName.val(data.success[0].name);
           authorEditSurname.val(data.success[0].surname);
       }).fail(function (err){
           console.log(err);
       });


       submit.on('click', function(event){
           event.preventDefault();
           var changedname = authorEditName.val();
           var changedSurname = authorEditSurname.val();

           var objAuthor = {
               name: changedname,
               surname: changedSurname
           };

           // all element which need to be update
           var spanWithAuthor = $('button[data-id='+id+']').eq(0).prev();
           var optionWithAuthor = $('option[value='+id+']');

           // update changed data to database, option and authorslist
           $.ajax({
               url: 'http://localhost/Bookstore/rest/rest.php/author/'+id,
               method: 'PATCH',
               data: objAuthor,
               dataType: 'json',
               contentType: 'application/jason'
           }).done(function (data){
               authorEditForm.css('display', 'none');
               spanWithAuthor.text(data.success[0].name + " " + data.success[0].surname);
               optionWithAuthor.text(data.success[0].name + " " + data.success[0].surname);

               authorEditSelect.val('');
               authorEditName.val('');
               authorEditSurname.val('');
               id = '';
           }).fail(function (err){
               console.log(err);
           });
       });

   }else{
       authorEditForm.css('display', 'none');
   }
});




