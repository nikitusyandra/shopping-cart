import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import ProductsContext from './ProductsContext';
import { observer } from 'mobx-react-lite';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface ProductProps {
  title: string;
  price: number;
  description: string;
  image: string;
  itemId: number;
  onAddToCart: (id: number) => void | undefined;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void
}

const Product: React.FC<ProductProps> = observer(({ title, price, description, image, itemId, onAddToCart, onIncrease, onDecrease }) => {
  const productsStore = useContext(ProductsContext);
  const isMobile = Dimensions.get('window').width < 768;
  const count = productsStore.takeNumberOfCatItem(itemId);

  return (
    <View style={[styles.card, isMobile ? styles.mobileCard : styles.desktopCard]}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>${price}</Text>
        {count === 0 ? (
          <TouchableOpacity style={styles.addToCartButton} onPress={() => onAddToCart(itemId)}>
            <Ionicons name="cart-outline" size={20} color="white" />
            <Text style={styles.addToCartText}>Добавить в корзину</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.plusMinContainer}>
            <TouchableOpacity style={styles.button} onPress={() => onDecrease(itemId)}>
              <Ionicons name="remove-circle-outline" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{count}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => onIncrease(itemId)}>
              <Ionicons name="add-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
  },
  mobileCard: {
    width: "90%",
    alignSelf: "center",
  },
  desktopCard: {
    width: '80%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    objectFit: "contain"
    },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ba55d3',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#e600e6',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  plusMinContainer: {
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    gap: "5"
  },
  button: {
    backgroundColor: '#e600e6',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countImage: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  countText: {
    fontSize: 16,
    color: 'black',
  },
});

export default Product;
