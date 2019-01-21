import React, { Component } from 'react';
import { Alert, Button, View } from 'react-native';
import { Facebook } from 'expo';

export class FacebookLogin extends Component {

    //1201211719949057
    //582787468813986
    _handleFacebookLogin = async () => {
        try {
            const { type, token } = await Facebook.logInWithReadPermissionsAsync(
                '582787468813986', // Replace with your own app id in standalone app
                { permissions: ['email'] }
            );

            switch (type) {
                case 'success': {
                    // Get the user's name using Facebook's Graph API
                    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                    const profile = await response.json();
                    Alert.alert(
                        'Logged in!',
                        `Hi ${profile.name}!`,
                    );
                    break;
                }
                case 'cancel': {
                    Alert.alert(
                        'Cancelled!',
                        'Login was cancelled!',
                    );
                    break;
                }
                default: {
                    Alert.alert(
                        'Oops!',
                        'Login failed!',
                    );
                }
            }
        } catch (e) {
            Alert.alert(
                'Oops!',
                'Login failed!',
            );
        }
    };

    render() {
        return (
            <View>
                <Button
                    title="Login with Facebook"
                    onPress={this._handleFacebookLogin}
                />
            </View>
        )
    }

}
