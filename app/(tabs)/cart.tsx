import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, RefreshControl } from 'react-native';
import ProductsContext from '../ProductsContext';
import Product from '../Product';
import { observer } from 'mobx-react-lite';
import { ThemeContext } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const Cart = observer(() => {
  const productsStore = useContext(ProductsContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    productsStore.fetchCart();
    console.log(productsStore.cart);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    productsStore.fetchCart();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    const product = productsStore.products.find(el => el.id === item.item_id);
    if (!product) {
      return null; // или любой другой компонент/сообщение об ошибке
    }
    console.log(product?.id, productsStore.takeNumberOfCatItem(item.item_id));

    return (
      <Product
        title={product.title}
        price={product.price * productsStore.takeNumberOfCatItem(item.item_id)}
        description={product.description}
        image={product.image}
        itemId={item.item_id}
        onAddToCart={() => {
          productsStore.addItemToCart(product.id);
        }}
        onIncrease={() => {
          productsStore.increaseCartItemNumber(item.item_id);
        }}
        onDecrease={() => {
          productsStore.decreaseCartItemNumber(item.item_id);
        }}
      />
    );
  };

  const totalPrice = productsStore.cart.reduce((total, item) => 
    (total + item.price
   * +item.count), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Корзина</Text>
      <FlatList
        data={productsStore.cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Text style={styles.total}>Итого: ${totalPrice}.</Text>
      <Button title="Оформить заказ" onPress={() => alert('Заказ оформлен!')} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#e91e63',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  total: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'right',
  },
});

export default Cart;
