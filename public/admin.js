
function fetch_users(){
    $.get('/get_all_users', (users) => {
        //console.log(users);
        table = `<table>
        <tr>
          <th>Users</th>
          <th>Actions</th>
        </tr>`
        for(count = 0; count < users.length; count ++){
            if(users[count].title == "admin"){
                table += `<tr>
                <td>Name: ${users[count].first} ${users[count].last}<br>
                Email: ${users[count].email}<br>
                Items in cart: ${users[count].shoppingCart.lengthlength}<br>
                Pending amount: ${users[count].price}</td>
                <td><button class='edit' id=${users[count]['_id']}>Edit</button></td>
              </tr>`
            }else{
                table += `<tr>
                <td>Name: ${users[count].first} ${users[count].last}<br>
                Email: ${users[count].email}<br>
                Items in cart: ${users[count].shoppingCart.lengthlength}<br>
                Pending amount: ${users[count].price}</td>
                <td><button class='edit' id=${users[count]['_id']}>Edit</button> <button class='delete' data=${users[count]['_id']}>Delete</button> </td>
              </tr>`
            }
        }
        table += `</table>`
        $("#users_display").append(table);
    })
}

function delete_user(){
    $.ajax({
        url: `/delete_user`,
        type: 'delete',
        data: {
            id: $(this).attr("data")
        },
        success: (message) => {
            location.reload();
        }
    })
}

function setup(){
    fetch_users();
    $('body').on('click', '.delete', delete_user);
}

$(document).ready(setup);