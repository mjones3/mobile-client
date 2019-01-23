import base64 from "base-64";

var HttpStatus = require("http-status-codes");



export function registerAndStoreToken(body, errors) {

    let strBody = JSON.stringify(body);

    return fetch("http://localhost:5555/api/registration/v1/user/" + body.userId, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: strBody
    });

};


export function getToken(emailAddress, password) {

    //log in and get token

    let headers = new Headers();
    headers.append("Authorization", "Basic " + base64.encode("practicejournal" + ":" + "thisissecret"));
    headers.append("Content-Type", "application/json");

    var formData = new FormData();
    formData.append("grant_type", "password");
    formData.append("scope", "mobileclient");
    formData.append("username", emailAddress);
    formData.append("password", password);

    return fetch("http://localhost:8901/auth/oauth/token", {
        method: "POST",
        headers: headers,
        body: formData
    });
}
