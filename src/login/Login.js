// @flow
import * as React from "react";
import {StyleSheet, Image, View, TextInput, SafeAreaView} from "react-native";
import {H1, Button, Text, Content} from "native-base";

import {Constants, Facebook} from "expo";
import {registerAndStoreToken, getToken} from "../service/registration";
import Mark from "./Mark";

import {Images, WindowDimensions, Field, Small, Styles} from "../components";
import {AnimatedView} from "../components/Animations";
import type {ScreenProps} from "../components/Types";
import variables from "../../native-base-theme/variables/commonColor";
// import bcrypt from "bcrypt";

import base64 from "base-64";

import {AsyncStorage} from "react-native";
import Store from "react-native-store";
import {storeItem, getItem, getAllKeys} from "../service/storage";


export default class Login extends React.Component<ScreenProps<>> {


    constructor(props) {
        super(props);
        this.state = {form: {username: "", password: "", errors: ""}};

        this.DB = {
            "user": Store.model("user")
        };
    }


    password: TextInput;

    setPasswordRef = (input: TextInput) => this.password = input._root;
    goToPassword = () => this.password.focus();


    signIn = () => {

        getToken(this.state.form.username, this.state.form.password)
            .then(
                (response) => {
                    console.log("response status: " + response.status);
                    response.text()
                        .then(body => {

                            storeItem("username", this.state.form.username);
                            storeItem("password", this.state.form.password);
                            if (body.access_token != undefined) {
                                storeItem("token", body.access_token);
                            }

                            // console.log(body);
                            let jsonBody = JSON.parse(body);

                            if (jsonBody.hasOwnProperty("access_token")) {
                                let token = jsonBody["access_token"];
                                console.log("token: " + token);
                                storeItem("token", token);
                            }

                            getAllKeys();

                        });

                });

    }


    signUp = () => this.props.navigation.navigate("SignUp");

    render(): React.Node {

        return (<View style={styles.container}>

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
        )
            ;
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


