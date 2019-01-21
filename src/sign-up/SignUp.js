// @flow
import * as React from "react";
import {View, Image, StyleSheet, TextInput, AsyncStorage} from "react-native";
import {Button, Header, Left, Right, Body, Icon, Title, Text, Content} from "native-base";
import {Constants} from "expo";

import {Container, Images, Field, Styles, SingleChoice, WindowDimensions} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";
import addNewUser from "./UserREST";

import validate from "validate.js"
import base64 from "base-64";

var HttpStatus = require('http-status-codes');


// var validate = require("validate.js");

// import uuid from "uuid/v4";

const uuidv4 = require('uuid/v4');

// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

export default class SignUp extends React.Component<ScreenProps<>> {

    constructor(props) {
        super(props);
        this.state = {form: {firstName: '', lastName: '', emailAddress: '', password: ''}, errors: ''};
    }

    firstName: TextInput;
    lastName: TextInput;
    emailAddress: TextInput;
    password: TextInput;

    async getItem(key) {
        try {
            //we want to wait for the Promise returned by AsyncStorage.setItem()
            //to be resolved to the actual value before returning the value
            var jsonOfItem = JSON.stringify(await AsyncStorage.getItem(key));
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }


    setFirstNameRef = (input: TextInput) => this.firstName = input._root;
    goToFirstName = () => this.firstName.focus();

    setLastNameRef = (input: TextInput) => this.lastName = input._root;
    goToLastName = () => this.lastName.focus();

    setEmailAddressRef = (input: TextInput) => this.emailAddress = input._root;
    goToEmailAddress = () => this.emailAddress.focus();

    setPasswordRef = (input: TextInput) => this.password = input._root;
    goToPassword = () => this.password.focus();


    back = () => this.props.navigation.navigate("Login");
    signIn = () => this.props.navigation.navigate("Walkthrough");

    async storeItem(key, item) {
        try {
            //we want to wait for the Promise returned by AsyncStorage.setItem()
            //to be resolved to the actual value before returning the value
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }


    addNewUser = () => {

        let constraints = {
            emailAddress: {
                // Email is required
                presence: true,
                // and must be an email
                email: true
            },
            firstName: {
                presence: true
            },
            lastName: {
                presence: true
            },
            password: {
                presence: true,
                length: {
                    minimum: 6
                }
            }
        }




        let errors = validate(this.state.form, constraints)

        console.log(this.state.form)
        console.log(errors);

        if (errors != undefined) {
            this.setState({errors: "Please fix errors to continue." })
        } else {

            this.state.errors = "";

            let uuid = uuidv4();

            // let hashPassword
            //
            // bcrypt.hash(this.password.toString(), saltRounds, function(err, hash) {
            //     hashPassword = hash
            // });


            console.log("adding new user ('" + uuid + "')")

            let body =
                JSON.stringify(
                    {
                        userId: uuid,
                        emailAddress: this.state.form.emailAddress,
                        firstName:  this.state.form.firstName,
                        lastName: this.state.form.lastName,
                        password: this.state.form.password,
                        roleId: "6a8e4a82-7226-4eee-9e20-f65ff0f5457b",
                        enabled: true,
                        createdDate: new Date()
                    });

            fetch("http://localhost:5555/api/registration/v1/user/" + uuid, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: body
            }).then(response => {
                console.log('posted: ' + body);
                console.log("register response: " + JSON.stringify(response));


                if (response.status == HttpStatus.CONFLICT) {
                    this.setState({errors: "There is already a user registered with this email address." })
                }



                //log in and get token

                let headers = new Headers();
                headers.append('Authorization', 'Basic ' + base64.encode('practicejournal' + ":" + 'thisissecret'));
                headers.append('Content-Type', 'application/json')

                var formData  = new FormData();
                formData.append('grant_type', 'password');
                formData.append('scope', 'mobileclient');
                formData.append('username', this.state.form.emailAddress);
                formData.append('password', this.state.form.password);

                fetch('http://localhost:8901/auth/oauth/token', {
                    method: 'POST',
                    headers: headers,
                    body: formData
                }).then(response => {

                    console.log(JSON.stringify(response));

                    response.text().then( body => {


                        this.storeItem("username", this.state.form.emailAddress);
                        this.storeItem("password", this.state.form.password);


                        if (body.access_token != undefined) {
                            this.storeItem("token", body.access_token);
                        }

                        console.log(body);
                        let jsonBody = JSON.parse(body);

                        if (jsonBody.hasOwnProperty('access_token')) {
                            let token = jsonBody['access_token'];
                            console.log(token);
                            this.storeItem("token", token);
                        }

                    })

                    console.log(response);
                });

            });

        }

    }

    // addNewUser = this.addNewUser.bind(this);


    // addNewUser

    render(): React.Node {
        return (
            <Container safe>
                <Image source={Images.signUp} style={style.img}/>
                <Content style={Styles.flexGrow}>
                    <Header noShadow>
                        <Left>
                            <Button onPress={this.back} transparent>
                                <Icon name="close"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>Sign Up</Title>
                        </Body>
                        <Right/>
                    </Header>
                    <View style={style.row}>
                        <Text style={[Styles.redText, Styles.center]}>{this.state.errors}</Text>
                    </View>
                    <View style={Styles.form}>
                        <Field
                            style={Styles.blackText}
                            label="First Name"
                            textInputRef={this.setFirstNameRef}
                            onSubmitEditing={this.goToLastName}
                            onChangeText={(text) => this.state.form.firstName = text}
                            returnKeyType="next"
                            inverse
                        />
                        <Field
                            label="Last Name"
                            textInputRef={this.setLastNameRef}
                            onSubmitEditing={this.goToEmailAddress}
                            onChangeText={(text) => this.state.form.lastName = text}
                            returnKeyType="next"
                            inverse
                        />
                        <Field
                            label="E-Mail Address"
                            textInputRef={this.setEmailAddressRef}
                            onSubmitEditing={this.goToPassword}
                            onChangeText={(text) => this.state.form.emailAddress = text}
                            returnKeyType="next"
                            inverse
                        />
                        <Field
                            label="Password"
                            secureTextEntry
                            textInputRef={this.setPasswordRef}
                            onSubmitEditing={this.goToPassword}
                            onChangeText={(text) => this.state.form.password = text}
                            returnKeyType="go"
                            inverse
                        />
                    </View>
                </Content>
                <Button primary block onPress={this.addNewUser} style={{height: variables.footerHeight}}>
                    <Text>CONTINUE</Text>
                </Button>
            </Container>
        );
    }
}

const style = StyleSheet.create({
    img: {
        ...StyleSheet.absoluteFillObject,
        width: WindowDimensions.width,
        height: WindowDimensions.height - Constants.statusBarHeight,
        top: Constants.statusBarHeight
    },
    row: {
        flexDirection: "row"
    },
    btn: {
        flex: 1,
        margin: 0,
        borderRadius: 0,
        justifyContent: "center",
        alignItems: "center",
        height: 125,
        flexDirection: "column"
    },
    facebook: {
        borderLeftWidth: variables.borderWidth,
        borderColor: "black"
    },
    email: {
        borderTopWidth: variables.borderWidth,
        borderBottomWidth: variables.borderWidth,
        borderColor: "black",
        flexDirection: "row",
        height: 87
    },
    icon: {
        color: "black",
        marginRight: 5
    }
});
