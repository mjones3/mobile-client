import {User} from "../model/user";



export function createUserDB() {
    let userDB = Expo.SQLite.openDatabase("user.db");

    userDB.transaction(tx => {
        tx.executeSql(
            "drop table if exists user;"
        );

        tx.executeSql(
            "create table if not exists user (id text primary key not null, email_address text, password text, first_name text, last_name text, token text);"
        );

    }, (error => {
    }), success => {
    });
}


export function saveUserDetails(user:User) {

    let userDB = Expo.SQLite.openDatabase("user.db");

    userDB.transaction(tx => {
        tx.executeSql(
            "insert into user (id, email_address, password, first_name, last_name, token) values (?, ?, ?, ?, ?, ?)", [user.id, user.emailAddress, user.password, user.firstName, user.lastName, user.token])

        tx.executeSql("select * from user", [], (_, {rows}) => console.log(JSON.stringify(rows)));


    }, (error => {
        console.log("Transaction failed: " + error.message);
        error.message;
    }), success => {
        console.log("Transaction successful.");
    });

}


export function isUserLoggedIn() {

    let userDB = Expo.SQLite.openDatabase("user.db");

    userDB.transaction(tx => {
        tx.executeSql("select * from user", [], (_, {rows}) => {
            console.log(JSON.stringify(rows))
            if (rows['length'] > 0) {
                console.log("User is logged in. rows=" + rows['length'])
                return true;
            }
            else {
                console.log("User is not logged in.")
                return false;
            }

        });


    }, (error => {
        console.log("Transaction failed: " + error.message);
        error.message;
    }), success => {
        console.log("Transaction successful.");
    });

}
