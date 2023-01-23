$(document).ready(function () {

    //    ФОРМА В МОДАЛКЕ

    $('#editUserDlg').on('show.bs.modal', function (event) {
        var dlg = $(this);

        var user_id = $(event.relatedTarget).data('id');

        dlg.find('form').trigger('reset');

        $.ajax({
            url: '/adminPage/userById/' + user_id,
            method: 'get',
            dataType: 'json'
        })
            .done(function (user) {
                dlg.find('#editID').val(user.id);
                dlg.find('#editName').val(user.name);
                dlg.find('#editSurname').val(user.lastName);
                dlg.find('#editYearOfBirth').val(user.age);
                dlg.find('#editUsername').val(user.userName);
                dlg.find('#editPassword').val(user.password);


                dlg.find('#roleSet option').each(function (role) {
                    var option = $(this);
                    //берем атрибут value и парсим в int
                    var role_id = parseInt(option.attr('value'));
                    //отключаем кнопку
                    option.prop('selected', false);
                    for (role of user.roleSet) {
                        if (role.id == role_id) {
                            option.prop('selected', true);
                        }
                    }
                });
                console.log(user);
            });
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //   КНОПКА ДЛЯ МОДАЛКИ (EDIT)

    $('#editUserDlg .btn-save').on('click', function () {
        var dlg = $(this).parents("#editUserDlg");

        $.ajax({
            url: '/adminPage/updateUser',
            method: 'post',
            dataType: 'json',
          //  contentType: 'application/json;charset=UTF-8',
            data: {
                "id": dlg.find('#editID').val(),
                "name": dlg.find('#editName').val(),
                "lastName": dlg.find('#editSurname').val(),
                "age": dlg.find('#editYearOfBirth').val(),
                "userName": dlg.find('#editUsername').val(),
                "password": dlg.find('#editPassword').val(),
                "roleSet": dlg.find('#roleSet').val().toString()
            }
        })
            .done(function (user) {
                var tr = $('#usersList').find('td[scope="row"]:contains("' + user.id + '")').parent('tr');
                tr.children('td').each(function (i, el) {
                    var td = $(el);
                    switch (i) {
                        case 1: { //name
                            td.text(user.name);
                            break;
                        }
                        case 2: { //surname
                            td.text(user.lastName);
                            break;
                        }
                        case 3: { //yearOfBirth
                            td.text(user.age);
                            break;
                        }
                        case 4: { //username
                            td.text(user.userName);
                            break;
                        }
                        case 5: { //roles
                            var html = '';
                            for (var prop in user.roleSet) {
                                html += '<span class="mr-1">' + user.roleSet[prop].name + '</span>';
                            }
                            td.html(html);
                            break;
                        }
                    }
                });
                console.log(user);
            });
        dlg.modal('hide');
    });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // МОДАЛКА ДЛЯ УДАЛЕНИЯ

    $('#deleteUserDlg').on('show.bs.modal', function (event) {
        var dlg = $(this);
        var user_id = $(event.relatedTarget).data('id');

        dlg.find('form').trigger('reset');

        $.ajax({
            url: '/adminPage/userById/' + user_id,
            method: 'get',
            dataType: 'json'
        })
            .done(function (user) {
                dlg.find('#deleteID').val(user.id);
                dlg.find('#deleteName').val(user.name);
                dlg.find('#deleteSurname').val(user.lastName);
                dlg.find('#deleteYearOfBirth').val(user.age);
                dlg.find('#deleteUsername').val(user.userName);
                dlg.find('#deletePassword').val(user.password);
                dlg.find('#role-del option').each(function (role) {
                    var option = $(this);
                    var role_id = parseInt(option.attr('value'));
                    option.prop('selected', false);
                    for (role of user.roleSet) {
                        if (role.id === role_id) {
                            option.prop('selected', true);
                        }
                    }
                });
                console.log(user);
            });
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //КНОПКА ДЛЯ МОДАЛКИ (DELETE)

    $('#deleteUserDlg').on('click', '.btn-delete', function (event) {
        var dlg = $(this).parents('#deleteUserDlg');
        var user_id = dlg.find('#deleteID').val();
        var tr = $('#usersList').find('td[scope="row"]:contains("' + user_id + '")').parent('tr');

        $.ajax({
            url: '/adminPage/deleteUser/' + user_id,
            method: 'get',
            dataType: 'json'
        })

            .done(function (access) {
                tr.remove();
            })
        dlg.modal('hide');
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //СОХРАНЕНИЕ ЮЗЕРА

    $('#saveUserCard .btn-save').on('click', function (event) {
        event.preventDefault();
        var card = $(this).parents('#saveUserCard');

        $.ajax({
            url: '/adminPage/createUser',
            method: 'POST',
            dataType: 'json',
            data: {
                "name": card.find('#name').val(),
                "lastName": card.find('#surname').val(),
                "age": card.find('#yearOfBirth').val(),
                "userName": card.find('#username').val(),
                "password": card.find('#password').val(),
                "roleSet": card.find('#addRoles').val().toString()
            }
        })
            .done(function (user) {
                card.find('form').trigger('reset');
                var roleStr = '';
                for (var role of user.roleSet) {
                    roleStr += '<span class="mr-1">' + role.name + '</span>';
                }
                $('<tr>' +
                    '<td scope="row">' + user.id + '</td>' +
                    '<td>' + user.name + '</td>' +
                    '<td>' + user.lastName + '</td>' +
                    '<td>' + user.age + '</td>' +
                    '<td>' + user.userName + '</td>' +
                    '<td>' + roleStr + '</td>' +
                    '<td>' +
                    '<a href="#" class="btn btn-info" data-toggle="modal" data-target="#editUserDlg"'
                    + ' data-id="' + user.id + '" role="button">Edit</a>' +
                    '</td>' +
                    '<td>' +
                    '<a href="#" class="btn btn-danger ml-1 btn-delete" data-toggle="modal"'
                    + ' data-target="#deleteUserDlg" data-id="'
                    + user.id + '" role="button">Delete</a>' +
                    '</td>' +
                    '</tr>'
                ).appendTo('#usersList tbody');
                $('#nav-users_table').tab('show');
            });

    });
})