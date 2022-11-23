// ### WORK WITH THE QUERY STRING ###

// 'ELEMENTS'
const
    queryString = window.location.search, // => grab the query string
    urlParams = new URLSearchParams(queryString), // => create a new URLSearchParams object
    searchedUserName = urlParams.get('name') // => get the first match the parameter


console.log('the query string =>', queryString)
console.log('the new URLSearchParams instance =>', urlParams)
console.log('the typeof this =>', typeof urlParams)
console.log('the user', searchedUserName)



// ### FETCHING ZONE ###

// => fetch all users
const fetchAllUsers = async ()=>{
    const response = await fetch('https://jsonplaceholder.typicode.com/users')

    if(response.ok){
        const data = await response.json()
        return data
    } 
    else{
        throw new Error('Error by fetching all users =>' + response.status )
    }
}

// => fetch all albums
const fetchAllAlbums = async()=>{
    const response = await fetch('https://jsonplaceholder.typicode.com/albums')
    
    if(response.ok){
        const data = await response.json()
        return data
    }
    else{
        throw new Error('Error by fetching all albums =>' + response.status )
    }
}

// => fetch albums of the searched user
const fetchSearchedUserAlbums = async(userID)=>{
    const response = await fetch('https://jsonplaceholder.typicode.com/albums')
    
    if(response.ok){
        const data = await response.json()
        const searchedUserAlbums = await data.filter(album => album.userId === userID)
        return searchedUserAlbums
    }
    else{
        throw new Error('Error by fetching all albums =>' + response.status )
    }
}

// => fetch the photos for a specific album
const fetchSpecificPhotoCollection = async (albumID)=>{
    const response = await fetch('https://jsonplaceholder.typicode.com/photos')

    if(response.ok){
        const photoCollections = await response.json()
        const searchedPhotoCollection = await photoCollections.filter(collection => collection.albumId == albumID)
        return searchedPhotoCollection
    }
    else{
        throw new Error('Error by fetching photo collections =>' + response.status)
    }
}

// => fetch the todos of the searched user
const fetchUserTodos = async(userID)=>{
    const response = await fetch ('https://jsonplaceholder.typicode.com/todos')
    
    if(response.ok){
        const allTodos= await response.json()
        const searchedUserTodos = allTodos.filter(todoItem => todoItem.userId === userID)
        return searchedUserTodos
    }
    else{
        throw new Error('Error by fetching the todo list' + response.status)
    }
}



// ### WORK WITH THE FETCH FUNCTIONS // CREATE DOM CONTENT ###

// 'DOM ELEMENTS'
const
    main = document.querySelector('.user'),
    headingTwo = document.querySelector('.user_h2'),
    generalUserDataList = document.querySelector('.user_data-list'),
    userAlbumLinksHeading = document.querySelector('.user_album-activators-container h3'),
    userAlbumLinksContainer = document.querySelector('.user_album-activators-container div'),
    userAlbumSectionsPositionPoint = document.querySelector('.user_todo-section'),
    todoHeading = document.querySelector('.user_todo-section h3'),
    todoListDisplay = document.querySelector('.user_todo-section_list')


// 'FUNCTIONS FOR THIS AREA'

// => create the user data list content
let loopCount = 0 // is needed to count the recursive calls 

const createGeneralUserDataListItems = (user, displayElement)=>{

    for(const userProperty in user){
        // console.log('---')
        // console.log('user key =>')
        // console.log('user value =>', user[userProperty])
        // console.log('typeof =>', typeof user[userProperty])
        // console.log('---')

        // => if the value is no object, create the li
        if( (typeof user[userProperty]) !== 'object'){
            // console.log('no object detected =>', user[userProperty])

            displayElement.innerHTML +=
            `<li>
                ${userProperty} => ${user[userProperty]}
            </li>`
           
        }
        // => else call the function recursively
        else{
            // console.log('object detected =>', user[userProperty])
            // console.log('loop count =>', loopCount)

            loopCount++

            displayElement.innerHTML +=
            `<li>
                ${userProperty} => 
                    <ul style='list-style:none' class='user_data-list${loopCount}'>`

            let newList = document.querySelector(`.user_data-list${loopCount}`)

            createGeneralUserDataListItems(user[userProperty], newList)

            generalUserDataList.innerHTML +=`</ul></li>`
 
        }

    }
}

// => create user album links
const createUserAlbumLinks = (userAlbums, displayElement) =>{
    let count = 1

    userAlbums.forEach(album =>{
        displayElement.innerHTML +=
        `<a href="#album-${album.id}" onClick="fetchTheRightPictures(this)" data-album-id="${album.id}">
            Album ${count}
        </a>`

        count++
    })

}

// => create user album sections
const createUserAlbumSections = (userAlbums, parent, positionPoint) =>{
    userAlbums.forEach(album =>{
        const newSection = document.createElement('section')

        newSection.classList.add('user_photo-section')
        newSection.setAttribute('id', `album-${album.id}`)

        // newSection.innerHTML = `XXX ${album.id}`

        parent.insertBefore(newSection, positionPoint)
    })
}

// => create user todo list items
const createUserTodoListItems = (todoList)=>{
    todoList.forEach(listItem =>{

        listItem.completed
        ?
            todoListDisplay.innerHTML += 
            `<li class="completed">
                ${listItem.title}
            </li>`
        :
            todoListDisplay.innerHTML += 
            `<li class="not-completed" onclick="todoDone(this)">
                ${listItem.title}
            </li>` 
    })
}


// 'EXECUTE CREATION OF DOM CONTENT'

fetchAllUsers()
.then(data =>{
    // console.log('all users =>', data)


    // => get the datas of our searched user
    let searchedUser

    data.forEach(user =>{
        user.name === searchedUserName && (searchedUser = user)
    })

    // => if the user exists, work with his datas
    if(searchedUser){
        // console.log('user found')

        // => write the heading 2
        headingTwo.innerHTML = searchedUser.name

        // => create the user data list items
        createGeneralUserDataListItems(searchedUser, generalUserDataList)

        // => work with the user albums
        fetchSearchedUserAlbums(searchedUser.id)
        .then(searchedUserAlbums =>{
            // console.log('albums of this user =>', searchedUserAlbums)

            // => create the content for the user album links section

                // => write the heading for this section
                userAlbumLinksHeading.innerHTML = searchedUser.name + "`s pictures"

                // => create the links
                createUserAlbumLinks(searchedUserAlbums, userAlbumLinksContainer)

            // => create the user album sections and their content

                // => create the user album sections
                createUserAlbumSections(searchedUserAlbums, main, userAlbumSectionsPositionPoint)

                // => place the right pictures in the right section
                // this is executed by an album link onclick event handler => fetchTheRightPictures()
    
        })
        .catch(error => alert(error))

        // => work with the user todo list
        fetchUserTodos(searchedUser.id)
        .then(todoList =>{
            console.log('the todo list of the user =>', todoList)

            // => create the todo list items
            createUserTodoListItems(todoList)
        })
        .catch(error => allert(error))

    }
    else{
        alert(`User ${searchedUserName} wurde nicht gefunden`)
        window.open('index.html', '_self')
    }

    // console.log('the searched user', searchedUser)

})
.catch(error =>{
    alert(error)
})





// ### EVENT LISTENER / HANDLERS ###

// 'DOM ELEMENTS TO LISTEN'
const 
    headingOne = document.querySelector('h1')

// => open index.html
headingOne.addEventListener('click', ()=> window.open('index.html', '_self'))

// => fill an album section with the right pics => called by click on an album link
const fetchTheRightPictures = (element)=>{
    // console.log('event handler from =>', element)

    const 
        albumID = element.dataset.albumId,
        theRightSection = document.querySelector(`#album-${albumID}`)

    // console.log('albumID =>', albumID)

    fetchSpecificPhotoCollection(albumID)
    .then(photoCollection =>{
        console.log('the photo collection =>', photoCollection)

        photoCollection.forEach(photo =>{
            theRightSection.innerHTML += 
                `<img src="${photo.thumbnailUrl}" alt="ein Bild">`
        })

        theRightSection.innerHTML +=
        `<span>
            In <span> ${element.innerHTML} </span>
            befinden sich ${photoCollection.length} Bilder
        </span>`
    })
    .catch(error => alert(error))
}

// => mark a todo item as done => called by click on a list item
const todoDone = (element)=>{
    element.classList.remove('not-completed')
    element.classList.add('completed')
}


