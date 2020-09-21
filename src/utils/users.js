const users=[]
const addUser=({id,username,room})=>{
    //Clean data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //Validate data
    if (!username||!room) {
        return{
            error:'Username and room are required'
        }
    }

    //Check for existing user
    const existingUser=users.find(user=>{
        return user.room===room&&user.username===username
    })

    //Validate Username
    if (existingUser) {
        return {
            error:'Username in use'
        }
    }

    //Store User
    const user={id,username,room}
    users.push(user)
    return {user}
}
const removeUser=(id)=>{
    const index=users.findIndex(user=>{
        return user.id===id
    })
    if (index!==-1) {
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    return users.find(user=>{
        user.id===id
    })
}
const getUsersInRoom=(room)=>{
    return users.filter(user=>{
        user.room===room
    })
}

module.exports={addUser,removeUser,getUser,getUsersInRoom}