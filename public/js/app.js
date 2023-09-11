$(document).ready(function () {
    const dataTable = $('#userTable').DataTable({
        responsive: true,
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'email' },
            { data: null, defaultContent: '<button class="btn updateBtn"><i class="fas fa-edit"></i></button><button class="btn deleteBtn"><i class="fas fa-trash-alt"></i></button>' }
        ],
    });

    //Fetches data from the database and populate the DataTable
    function fetchUsers() {
        $.get('/read', function (res) {
            if (res.statusCode === 200) {
                dataTable.clear();
                dataTable.rows.add(res.data);
                dataTable.draw();
            }
        });
    }

    fetchUsers();

    ///Clears or resets all form data when addUserBtn is clicked
    $('#addUserBtn').click(function () {
        $('#idInput').val('');
        $('#nameInput').val('');
        $('#emailInput').val('');
        $('#updateBtn').hide();
        $('#saveBtn').show();
        $('#userModal').modal('show');
    });

    // Creates new record into the database
    $('#saveBtn').click(function () {
        const name = $('#nameInput').val();
        const email = $('#emailInput').val();

        // Perform validation here
        if (!name || !email) {
            Swal.fire('Validation Error', 'Name and Email fields are required', 'error');
            return;
        }

        const userData = {
            name: name,
            email: email
        };

        $.ajax({
            url: '/create',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (res) {
                if (res.statusCode === 200) {
                    $('#userModal').modal('hide');
                    fetchUsers();
                    Swal.fire('Success', 'User created successfully', 'success');
                } else {
                    Swal.fire('Error', 'An error occurred', 'error');
                }
            }
        });
    });

    // Updates form data
    $('#updateBtn').click(function () {
        const id = $('#idInput').val();
        const name = $('#nameInput').val();
        const email = $('#emailInput').val();

        // Perform validation here
        if (!id || !name || !email) {
            Swal.fire('Validation Error', 'ID, Name, and Email fields are required', 'error');
            return;
        }

        const userData = {
            id: id,
            name: name,
            email: email
        };

        $.ajax({
            url: '/update',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (res) {
                if (res.statusCode === 200) {
                    $('#userModal').modal('hide');
                    fetchUsers();
                    Swal.fire('Success', 'User updated successfully', 'success');
                } else {
                    Swal.fire('Error', 'An error occurred', 'error');
                }
            }
        });
    });

    // Populates form data from database
    $('body').on('click', '.updateBtn', function () {
        const rowData = dataTable.row($(this).closest('tr')).data();
        $('#idInput').val(rowData.id);
        $('#nameInput').val(rowData.name);
        $('#emailInput').val(rowData.email);
        $('#updateBtn').show();
        $('#saveBtn').hide();
        $('#userModal').modal('show');
    });

    $('body').on('click', '.deleteBtn', function () {
        const rowData = dataTable.row($(this).closest('tr')).data();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/delete',
                    type: 'DELETE',
                    contentType: 'application/json',
                    data: JSON.stringify({ id: rowData.id }),
                    success: function (res) {
                        if (res.statusCode === 200) {
                            fetchUsers();
                            Swal.fire('Success', 'User deleted successfully', 'success');
                        } else {
                            Swal.fire('Error', 'An error occurred', 'error');
                        }
                    }
                });
            }
        });
    });
});
