import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import StateContext from '../../utils/StateContext';
import { getError } from '../../utils/error/frontend/error';
import { IFProduct } from '../../db/rdbms_tbl_cols';

const useAddToCartHandler = (): {
  loadingAddToCart: boolean;
  alertAddToCart: {
    open: boolean;
    message: string;
    backgroundColor: string;
  };
  setAlertAddToCart: (alert: { open: boolean; message: string; backgroundColor: string }) => void;
  addToCartHandler: (product: IFProduct) => Promise<void>;
} => {
  const router = useRouter();
  const { state, dispatch } = useContext(StateContext);

  const [alertAddToCart, setAlertAddToCart] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [loadingAddToCart, setLoadingAddToCart] = useState(false);

  const addToCartHandler = async (product: IFProduct): Promise<void> => {
    try {
      setLoadingAddToCart(true);
      const res = await axios.get<IFProduct>(`/api/products/${product._id}`);
      const { data } = res;
      const existCartItem = state.cart.cartItems.find((item) => item._id === product._id);
      if (existCartItem) {
        const quantity = existCartItem.quantity + 1;
        if (data.countInStock < quantity) {
          setLoadingAddToCart(false);
          setAlertAddToCart({
            open: true,
            message: 'Sorry. Product is out of stock',
            backgroundColor: '#FF3232',
          });
          return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...existCartItem, quantity } });
        router.push('/cart');
        return;
      }
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
      router.push('/cart');
    } catch (err: unknown) {
      setLoadingAddToCart(false);
      setAlertAddToCart({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  return { loadingAddToCart, alertAddToCart, setAlertAddToCart, addToCartHandler };
};

export default useAddToCartHandler;
