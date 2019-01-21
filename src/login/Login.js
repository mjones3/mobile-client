// @flow
import * as React from "react";
import {StyleSheet, Image, View, TextInput, SafeAreaView} from "react-native";
import {H1, Button, Text, Content} from "native-base";

import { Constants, Facebook } from 'expo';

import Mark from "./Mark";

import {Images, WindowDimensions, Field, Small, Styles} from "../components";
import {AnimatedView} from "../components/Animations";
import type {ScreenProps} from "../components/Types";
import variables from "../../native-base-theme/variables/commonColor";
// import bcrypt from "bcrypt";

import base64 from "base-64";

import { AsyncStorage } from "react-native"
import Store from 'react-native-store';


export default class Login extends React.Component<ScreenProps<>> {


    constructor(props) {
        super(props);
        this.state = {form: {username: '', password: '', errors: ''}};

        this.DB = {
            "user": Store.model("user")
        };
    }


    password: TextInput;

    setPasswordRef = (input: TextInput) => this.password = input._root
    goToPassword = () => this.password.focus()


    saveToken = async (token) => {
        try {
            await AsyncStorage.setItem('authtoken', token);
        } catch (error) {
            // Error saving data
        }
    }


    saveUsernameAndPassword = async (username, password) => {
        try {
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('password', password);
        } catch (error) {
            // Error saving data
        }
    }


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


    async getAllKeys() {
        try {
            const value = await AsyncStorage.getAllKeys();
            if (value !== null) {
                // We have data!!
                console.log(value);
            }
        } catch (error) {
            // Error retrieving data
        }
    }




    signIn = (username, password) => {

        var formData  = new FormData();
        formData.append('grant_type', 'password');
        formData.append('scope', 'mobileclient');
        formData.append('username', this.state.form.username);
        formData.append('password', this.state.form.password);

        console.log(JSON.stringify(formData));

        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + base64.encode('practicejournal' + ":" + 'thisissecret'));
        headers.append('Content-Type', 'application/json')


        fetch('http://localhost:8901/auth/oauth/token', {
            method: 'POST',
            headers: headers,
            body: formData
        }).then(response => {

            console.log(JSON.stringify(response));

            response.text().then( body => {


                // this.DB.user.add({username: this.state.form.username});
                // this.DB.user.add({password: this.state.form.password});
                // this.DB.user.find().then(resp => console.log(resp))

                this.storeItem("username", this.state.form.username);
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

                this.getAllKeys();

            })

            console.log(response);
        });


    }
    signUp = () => this.props.navigation.navigate("SignUp")

    render(): React.Node {

        return (
            <View style={styles.container}>

                <SafeAreaView style={StyleSheet.absoluteFill}>
                    <Content style={[StyleSheet.absoluteFill, styles.content]}>
                        <AnimatedView style={styles.innerContent}>
                            <View style={styles.logo}>
                                <View>
                                    <H1 style={styles.title}>Get Started!</H1>
                                </View>
                            </View>
                            <View>
                                <Field
                                    label="Username"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onChangeText={(text) => this.state.form.username = text}
                                    onSubmitEditing={this.goToPassword}
                                    inverse
                                />
                                <Field
                                    label="Password"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    returnKeyType="go"
                                    onChangeText={(text) => this.state.form.password = text}
                                    textInputRef={this.setPasswordRef}
                                    onSubmitEditing={this.signIn()}
                                    last
                                    inverse
                                />
                                <View>
                                    <View>
                                        <Button primary full onPress={this.signIn}>
                                            <Text>Sign In</Text>
                                        </Button>
                                    </View>
                                    <View>
                                        <Button transparent full onPress={this.signUp}>
                                            <Small style={Styles.blackText}>Don&apos;t have an account? Sign Up</Small>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </AnimatedView>
                    </Content>
                </SafeAreaView>
            </View>
        );
    }
}

const {height, width} = WindowDimensions;
const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        height,
        width
    },
    content: {
        flexGrow: 1
    },
    innerContent: {
        height: height - Constants.statusBarHeight,
        justifyContent: "flex-end"
    },
    logo: {
        marginVertical: variables.contentPadding * 2,
        alignItems: "center"
    },
    title: {
        marginVertical: variables.contentPadding * 2,
        color: "black",
        textAlign: "center"
    }
});


