// ### FETCHING ZONE ###


// => fetch all users from jsonplaceholder
const fetchAllUsers = async()=>{
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    console.log('type of response.ok =>', typeof response.ok)

    if(response.ok){
        const data = await response.json()
        return data
    }
    else{
        throw new Error(`Etwas ist schief gelaufen => Status Code : ${response.status}`)
    }
}



// ### WORKING ZONE ###


// 'DOM ELEMENTS'
const 
    domUserList = document.querySelector('.index_user-list')

    
// => fill the DOM userlist
fetchAllUsers()
    .then(data =>{
        console.log(data)

        data.forEach(user =>{
            const {name} = user

            domUserList.innerHTML += 
                `<li>
                    <a href="user.html?name=${name}">${name}</a>
                </li>`
        })
    })
    .catch(error =>{
        alert(error)
    })


