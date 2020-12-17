
function registerDisplay(){
    $('#login-page').hide()
    $('#main-page').hide()
    $('#edit-todo-page').hide()
    $('#register-page').show()
}
function editTodoDisplay(id){
    $('#todos-from-edit').remove()
    $.ajax({
        method: 'GET',
        url: `https://tuyetuyefancytodo.herokuapp.com/todos/${id}`,
        headers: {
            token : localStorage.getItem('access_token')
        }
    })
    .done(value => {
        $('#login-page').hide()
        $('#main-page').hide()
        $('#register-page').hide()
        $('#edit-todo-page').show()
        $('#edit-todos-form').show().empty().append(`<form class="form-inline" id="todos-form-edit" method="POST">
    <label class="sr-only" for="title">Title</label>
    <input type="text" class="form-control mb-2 mr-sm-2" id="title-edit" name="title" placeholder="Title">
  
    <label class="sr-only" for="description">Description</label>
    <div class="input-group mb-2 mr-sm-2">
      <div class="input-group-prepend">
      </div>
      <input type="text" class="form-control" id="description-edit" name="description" placeholder="Description">
    </div>

    <label class="sr-only" for="status">Status</label>
    <div class="input-group mb-2 mr-sm-2">
      <div class="input-group-prepend">
      </div>
      <input type="text" class="form-control" id="status-edit" name="status" placeholder="Status">
    </div>

    <label class="sr-only" for="due_date">Due date</label>
    <div class="input-group mb-2 mr-sm-2">
      <div class="input-group-prepend">
      </div>
      <input type="date" class="form-control" id="due_date-edit" name="due_date" placeholder="Due Date">
    </div>
    <button type="submit" class="btn btn-primary mb-2"id="btn-submit-edit-todo">Submit</button>
  </form>`)
        $('#title-edit').val(`${value.title}`)
        $('#description-edit').val(`${value.description}`)
        $('#status-edit').val(`${value.status}`)
        $('#due_date-edit').val(`${value.due_date}`)
        $(`#todos-form-edit`).on('submit', (e) => {
            e.preventDefault()
            editTodo(value.id)
        })
    })
    .fail((xhr, textStatus) => {
        console.log(xhr, textStatus);
    })
    .always(() => {
        $('#todos-from-edit').empty()
    })
}
function onSignIn(googleUser) {
    console.log(`okk`);
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: 'https://tuyetuyefancytodo.herokuapp.com/user/googleLogin',
        method: 'POST',
        data: {
            googleToken: id_token
        }
    })
    .done(response => {
        localStorage.setItem('access_token', response)
        mainDisplay()
    })
    .fail(error => {
        console.log(error);
    })
}
function login(){
    const email = $('#login-email').val()
    const password = $('#login-password').val()
    $.ajax({
        method: 'POST',
        url: 'https://tuyetuyefancytodo.herokuapp.com/user/login',
        data: {
            email,
            password
        }
    })
    .done(value => {
       console.log(value);
       localStorage.setItem('access_token', value)
       swal({
        text: 'Login success',
        title: 'Welcome',
        icon: 'success'
      })
       mainDisplay()
    //    todo()
    })
    .fail((xhr, textStatus) => {
        console.log(xhr);
        swal('Error', xhr.responseText)
    })
    .always(() => {
        $('#login-email').val('')
        $('#login-password').val('')
    })
}
function register(){
    // $('#login-page').hide()
    $('#register-page').show()
    const name = $('#register-name').val()
    const email = $('#register-email').val()
    const password = $('#register-password').val()
    $.ajax({
        method: 'post',
        url: 'https://tuyetuyefancytodo.herokuapp.com/user/register',
        data: {
            email,
            name,
            password
        }
    })
    .done(value => {
        console.log(value);
        swal({
            text: 'Please Login for use our app',
            title: 'Register Success',
            icon: 'success'
          })
        loginDisplay()
    })
    .fail((xhr, textStatus) => {
        swal('Error', xhr.responseText)
        console.log(xhr.responseText);
    })
    .always(() => {
        $('#register-name').val('')
        $('#register-email').val('')
        $('#register-password').val('')
    })
}
function logout(){
    swal({
        title: 'Logout',
        icon: 'info',
        text: 'Are you sure wanna to logout?',
        buttons: true,
        dangerMode: true
      })
        .then(value => {
          if (value) {
            localStorage.clear()
            localStorage.removeItem("access_token");
            // ini untuk google log out
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            console.log('User signed out.');
            });
            loginDisplay()
          }
        })
}
function mainDisplay(){
    $('#edit-todo-page').hide()
    $('#main-page').show()
    $('#login-page').hide()
    $('#register-page').hide()
    todo()
}
function loginDisplay(){
    $('#edit-todo-page').hide()
    $('#login-page').show()
    $('#main-page').hide()
    $('#register-page').hide()
}
function createTodo(){
    const title = $('#title').val()
    const description = $('#description').val()
    const status = $('#status').val()
    const due_date = $('#due_date').val()
    $.ajax({
        method: 'POST',
        url: 'https://tuyetuyefancytodo.herokuapp.com/todos',
        data: {
            title,
            description,
            status,
            due_date
        },
        headers: {
            token : localStorage.getItem('access_token')
        }
    })
    .done(value => {
        // todo()
        swal({
            text: 'Todo has been added',
            title: 'Success',
            icon: 'success'
        })
        mainDisplay()
    })
    .fail((xhr, textStatus) => {
        swal('Error', xhr.responseText)
        console.log(xhr.responseText);
    })
    .always(_ => {
        $('#title').val('')
        $('#description').val('')
        $('#status').val('')
        $('#due_date').val('')
    })
}
function todo() {
    $('#table-todo').empty()
    $.ajax({
        url: 'https://tuyetuyefancytodo.herokuapp.com/todos',
        method: 'GET',
        headers: {
            token: localStorage.getItem('access_token')
        }
    })
    .done(response => {
        $('#table-todo').append(`<thead class="thead-dark"><tr>
        <th scope="col">Title</th>
        <th scope="col">Description</th>
        <th scope="col">Status</th>
        <th scope="col">Due Date</th>
        <th scope="col">Action</th>
        </tr></thead>`)
        response.forEach(todo => {
            $("#table-todo").append(`<tr>
            <th scope="row">${todo.title}</th>
            <td>${todo.description}</td>
            <td>${todo.status}</td>
            <td>${todo.due_date}</td>
            <td><button onClick="deleteTodo(${todo.id})" class="btn btn-danger">Delete</button> <button onClick="editTodoDisplay(${todo.id})" class="btn btn-primary">Edit</button></td>
                </tr>`);
        })
    })
     .fail((xhr, textStatus) => {
        console.log(xhr);
    })
}
function deleteTodo(id){
    $.ajax({
        url: `https://tuyetuyefancytodo.herokuapp.com/todos/${id}`,
        method: 'DELETE',
        headers: {
            token: localStorage.getItem('access_token')
        }
    })
    .done(response => {
        todo()
    })
    .fail((xhr, textStatus) => {
        console.log(xhr);
    })
}
function editTodo(id){
    const title = $('#title-edit').val()
    const description = $('#description-edit').val()
    const status = $('#status-edit').val()
    const due_date = $('#due_date-edit').val()
    $.ajax({
        method: 'PUT',
        url: "https://tuyetuyefancytodo.herokuapp.com/todos/" + `${id}`,
        data: {
            title,
            description,
            status,
            due_date
        },
        headers: {
            token : localStorage.getItem('access_token')
        }
    })
    .done(value => {
        console.log(value);
        mainDisplay()
    })
    .fail((xhr, textStatus) => {
        console.log(xhr.responseText);
    })
}