// @flow
import * as React from "react";
import {View, StyleSheet, Image, SafeAreaView} from "react-native";
import {Button, Footer, FooterTab, Text, Icon} from "native-base";
import Swiper from "react-native-swiper";

import {Styles, Images, WindowDimensions} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class WalkthroughInstruments extends React.Component<ScreenProps<>> {

    swiper: Swiper;

    home = () => this.props.navigation.navigate("Main")

    renderPagination = (): React.Node => (
        <View>
            <Footer style={{ borderTopWidth: variables.borderWidth, borderBottomWidth: variables.borderWidth }}>
                <FooterTab>
                    <Button onPress={this.home} transparent>
                        <Text>SKIP</Text>
                    </Button>
                    <Button transparent onPress={() => this.swiper.scrollBy(1)} style={style.next}>
                        <Text>NEXT</Text>
                    </Button>
                </FooterTab>
            </Footer>
        </View>
    )

    render(): React.Node {
        const {renderPagination} = this;
        return (
            <SafeAreaView style={style.container}>
                <Image source={Images.walkthrough} style={style.img} />
                <Swiper
                    ref={swiper => this.swiper = swiper}
                    height={swiperHeight}
                    dot={<Icon name="ios-radio-button-off-outline" style={style.dot} />}
                    activeDot={<Icon name="ios-radio-button-on" style={style.dot} />}
                    {...{ renderPagination }}
                >
                    <View style={[Styles.center, Styles.flexGrow]}>
                        <Text>How many instruments do you practice?</Text>
                    </View>
                    <View style={[Styles.center, Styles.flexGrow]}>

                        <Text>What are your instruments?</Text>
                    </View>
                    <View style={[Styles.center, Styles.flexGrow]}>
                        <Text>Goals explanation is here.</Text>
                    </View>
                    <View style={[Styles.center, Styles.flexGrow]}>
                        <Text>What are your goals for this year?</Text>
                    </View>
                    <View style={[Styles.center, Styles.flexGrow]}>
                        <Text>What pieces are you actively working on right now?</Text>
                    </View>
                    <View style={[Styles.center, Styles.flexGrow]}>
                        <Text>What techniques (if any) are you practicing? (Scales, Arpeggios, Sightreading) </Text>
                    </View>
                    <View style={[Styles.center, Styles.flexGrow]}>
                        <Text>You can connect with your teacher if they are using this app.  Would you like to invite your teacher to connect?</Text>
                    </View>
                </Swiper>
            </SafeAreaView>
        );
    }
}

// eslint-disable-next-line react/prefer-stateless-function
class Phone extends React.PureComponent<{}> {
    render(): React.Node {
        return (
            <View style={style.phone}>
                <View style={style.phoneContainer}>
                    <Icon name="ios-checkmark-circle-outline" style={style.phoneContainerIcon} />
                </View>
                <View style={style.phoneFooter}>
                    <Icon name="ios-radio-button-off" style={style.phoneFooterIcon} />
                </View>
            </View>
        );
    }
}

const {height} = WindowDimensions;
const borderWidth = variables.borderWidth * 2;
const swiperHeight = height;
const style = StyleSheet.create({
    container: {
        flex: 1
    },
    img: {
        ...WindowDimensions,
        ...StyleSheet.absoluteFillObject
    },
    next: {
        borderRadius: 0,
        borderLeftWidth: variables.borderWidth,
        marginLeft: variables.borderWidth,
        borderColor: "white"
    },
    phone: {
        borderColor: "white",
        borderWidth,
        borderRadius: 4,
        height: 175,
        width: 100,
        marginBottom: variables.contentPadding
    },
    phoneContainer: {
        flex: 0.8,
        justifyContent: "center",
        alignItems: "center"
    },
    phoneFooter: {
        flex: 0.2,
        borderColor: "white",
        borderTopWidth: borderWidth,
        justifyContent: "center",
        alignItems: "center"
    },
    dot: {
        fontSize: 12,
        margin: 4
    },
    phoneContainerIcon: {
        fontSize: 45
    },
    phoneFooterIcon: {
        fontSize: 15
    }
});
