import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { createContext } from 'react';
import * as SQLite from 'expo-sqlite';

const apiUrl = 'https://fakestoreapi.com';

export type RatingData = {
  count: number,
  rate: number,
};

export type ProductData = {
  id: number,
  category: string,
  description: string,
  image: string,
  price: number,
  rating: RatingData,
  title: string,
};

export type CartItem = {
  id: number,
  item_id: number,
  count: number,
  price: number
};

export class Products {
  constructor() {
    const dbConn = SQLite.openDatabaseSync('db.db');
    dbConn.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS checkout (
      id INTEGER PRIMARY KEY NOT NULL,
      item_id INTEGER UNIQUE NOT NULL,
      count INTEGER NOT NULL);
    `);

    this.dbConn = dbConn;
    makeAutoObservable(this);
    this.fetchCart(); // Инициализация корзины при создании экземпляра

    // Добавляем autorun для отладки
    autorun(() => {
      console.log('Cart:', this.cart);
      console.log('Products:', this.products);
    });
  }

  dbConn: SQLite.SQLiteDatabase | null;
  products = new Array<ProductData>();
  cart = new Array<CartItem>();

  dropDatabase() {
    this.dbConn?.closeSync();
    this.dbConn = null;
    SQLite.deleteDatabaseSync('db.db');
  }

  async fetchProducts() {
    try {
      const response = await fetch(apiUrl + '/products');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const productsBody = await response.json();

      runInAction(() => {
        this.products = productsBody;
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  addItemToCart(itemId: number) {
    this.dbConn?.runSync('INSERT INTO checkout (item_id, count) VALUES (?, ?) ON CONFLICT(item_id) DO UPDATE SET count=count+1', itemId, 1);
    console.log('added');

    runInAction(() => {
      this.fetchCart();
      console.log('fetched');
    });
  }

  increaseCartItemNumber(itemId: number) {
    this.dbConn?.runSync('UPDATE checkout SET count=count+1 WHERE item_id = ?', itemId);
    console.log('increased');

    runInAction(() => {
      this.fetchCart();
      console.log('fetched');
    });
  }

  takeNumberOfCatItem(itemId: number): number {
    const item = this.cart.find(el => el.item_id === itemId);
    return item ? item.count : 0;
  }

  decreaseCartItemNumber(itemId: number) {
    const item = this.cart.find(el => el.item_id === itemId);
    if (!item) return;

    if (item.count === 1) {
      this.removeItemFromCart(item.item_id);
    } else {
      this.dbConn?.runSync('UPDATE checkout SET count=count-1 WHERE item_id = ?', itemId);
    }
    console.log('decreased');
    runInAction(() => {
      this.fetchCart();
      console.log('fetched');
    });
  }

  removeItemFromCart(itemId: number) {
    this.dbConn?.runSync('DELETE FROM checkout WHERE item_id = ?', itemId);
    runInAction(() => {
      this.fetchCart();
    });
  }

  fetchCart() {
    const checkout = this.dbConn?.getAllSync<CartItem>('SELECT * FROM checkout');
    this.cart = checkout || [];
  }
}

const products = new Products();

export default createContext<Products>(products);
