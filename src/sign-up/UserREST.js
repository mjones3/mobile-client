import User from "./User";


export function addNewUser(user:User) {

    console.log('adding new user...')

    fetch("http://192.168.1.11:5555/api/registration/v1/user/832f3a1b-22a9-4bb9-a147-e3f3cb4e98b4", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                userId: "832f3a1b-22a9-4bb9-a147-e3f3cb4e98jg",
                userName: "mjones3@gmail.com",
                password: "$2y$12$2idGkq.eQyEBbrmXF6nL3Of90S4mrtZwfMgv/gBJBjarFbLLTSLuG",
                roleId: "6a8e4a82-7226-4eee-9e20-f65ff0f5457b",
                enabled: true,
                createdDate: "2018-11-25"
            })
    });

}
