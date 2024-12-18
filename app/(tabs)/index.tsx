import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import ProductsContext from '../ProductsContext';
import Product from '../Product';
import { observer } from 'mobx-react-lite';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const ProductList = observer(() => {
  const productsStore = useContext(ProductsContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      await productsStore.fetchProducts();
    };
    fetchProducts();
  }, [productsStore]);

  const onRefresh = async () => {
    setRefreshing(true);
    await productsStore.fetchProducts();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    console.log(item.title, "rendered");
    return (
      <Product
        title={item.title}
        price={item.price}
        description={item.description}
        image={item.image}
        itemId={item.id}
        onAddToCart={() => {
          productsStore.addItemToCart(item.id);
        }}
        onIncrease={() => {
          productsStore.increaseCartItemNumber(item.id);
        }}
        onDecrease={() => {
          productsStore.decreaseCartItemNumber(item.id);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Товары</Text>
      <FlatList
        data={productsStore.products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ProductList;
