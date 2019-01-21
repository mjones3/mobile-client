import {AsyncStorage} from "react-native";


export async function storeItem(key, item) {
    try {
        //we want to wait for the Promise returned by AsyncStorage.setItem()
        //to be resolved to the actual value before returning the value
        var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
        return jsonOfItem;
    } catch (error) {
        console.log(error.message);
    }
}


export async function getItem(key) {
    try {
        //we want to wait for the Promise returned by AsyncStorage.setItem()
        //to be resolved to the actual value before returning the value
        var jsonOfItem = JSON.stringify(await AsyncStorage.getItem(key));
        return jsonOfItem;
    } catch (error) {
        console.log(error.message);
    }
}


export async function getAllKeys() {
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
