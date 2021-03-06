/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Cons from '../../shared/Constants';
import ActivityIndicator from '../../UI/ActivityIndicator';
import { httpUrl } from '../../../urlServer';
import { setData } from '../../store/actions/pharmacy';
import handleAxiosErrors from '../../shared/HandleAxiosErrors';
import { Pharmacy } from '../../shared/Interfaces';

const Home = () => {

    useEffect(() => {
        fetchPharmacy();
        fetchKPIs();
    }, []);

    const dispatch = useDispatch();
    const [isLoading, setIsLoding] = useState<boolean>(false);
    const [openOrdersPrice, setOpenOrdersPrice] = useState<string>('...');
    const [openOrdersPreparation, setOpenOrdersPreparation] = useState<string>('...');

    const fetchPharmacy = async () => {
        const pharma: Pharmacy = JSON.parse(await AsyncStorage.getItem('pharmacy') || '{}');
        const token = await AsyncStorage.getItem('token');
        const pharmacy = {
            pharmacy_id: pharma.pharmacy_id,
            token: token,
        };
        await axios.get(`${httpUrl}/pharmacy/profile/get`, {
            params: { pharmacy_id: pharmacy.pharmacy_id },
            headers: { authorization: pharmacy.token },
        })
            .then(response => {
                const res = response.data;
                if (res.length) {
                    dispatch(setData(
                        pharma.pharmacy_id,
                        token || '',
                        res[0].status,
                        res[0].pharmacy_code,
                        res[0].pharmacy_desc,
                        res[0].owner_name,
                        res[0].nif,
                        res[0].phone_number,
                        res[0].email,
                        res[0].web,
                        res[0].street,
                        res[0].zip_code,
                        res[0].locality,
                        res[0].country,
                        res[0].eth_address,
                    ));
                }
            })
            .catch(err => {
                //handleAxiosErrors(err);
                console.log('Error in Home.tsx -> fetchPharmacy():', err);
            });
    };

    const fetchKPIs = async () => {

        setIsLoding(true);

        const pharma: Pharmacy = JSON.parse(await AsyncStorage.getItem('pharmacy') || '{}');
        const token = await AsyncStorage.getItem('token');
        const pharmacy = {
            pharmacy_id: pharma.pharmacy_id,
            token: token,
        };

        //Get orders by status
        await axios.get(`${httpUrl}/pharmacy/orders/get`, {
            params: { pharmacy_id: pharmacy.pharmacy_id },
            headers: { authorization: pharmacy.token },
        })
            .then(response => {
                const res = response.data;
                setOpenOrdersPrice('0');
                setOpenOrdersPreparation('0');
                for (let i = 0; i < res.length; i++) {
                    if (res[i].status === 1) { setOpenOrdersPrice(res[i].total); }
                    if (res[i].status === 3) { setOpenOrdersPreparation(res[i].total); }
                }
            })
            .catch(err => {
                //handleAxiosErrors(err);
                console.log('Error in Home.tsx -> fetchKPIs():', err);
            });

        setIsLoding(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.textHeader}> Orders </Text>
                </View>
                <View style={[styles.containerItems, styles.color1]}>
                    <Text style={styles.number}>{openOrdersPrice} </Text>
                    <Text style={styles.text}>waiting on</Text>
                    <Text style={styles.textBold}> confirmation </Text>
                </View>
                <View style={[styles.containerItems, styles.color2]}>
                    <Text style={styles.number}>{openOrdersPreparation} </Text>
                    <Text style={styles.text}> waiting on </Text>
                    <Text style={styles.textBold}> preparation </Text>
                </View>
                <ActivityIndicator isLoading={isLoading} />
                <TouchableOpacity
                    onPress={() => fetchKPIs()}
                    style={styles.button}
                >
                    <View style={styles.containerIconButton}>
                        <Ionicons name="ios-refresh" size={20} color={Cons.COLORS.BLUE} />
                        <Text style={styles.textRefresh}> Refresh </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Cons.COLORS.WHITE,
    },
    containerItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
        height: 50,
        borderRadius: 10,
    },
    containerIconButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        marginTop: 30,
        alignItems: 'center',
    },
    color1: {
        backgroundColor: '#578CA9',
    },
    color2: {
        backgroundColor: '#AD5D5D',
    },
    color3: {
        backgroundColor: '#88B04B',
    },
    header: {
        alignItems: 'flex-start',
    },
    textHeader: {
        fontFamily: 'HelveticaNeue',
        fontSize: 28,
        marginTop: 15,
        marginLeft: 5,
    },
    number: {
        marginLeft: 20,
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'HelveticaNeue',
        color: Cons.COLORS.WHITE,
    },
    text: {
        fontFamily: 'HelveticaNeue',
        color: Cons.COLORS.WHITE,
        fontSize: 16,
    },
    textBold: {
        fontFamily: 'HelveticaNeue',
        color: Cons.COLORS.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
    textRefresh: {
        fontFamily: 'HelveticaNeue',
        color: Cons.COLORS.BLUE,
        fontSize: 16,
    },
});

export default Home;
