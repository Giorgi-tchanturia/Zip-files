import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useLocalStorage('game_store_library', []);

  // თამაშის დამატება (კალათაში ჯერ ხვდება, owned: false)
  const addToLibrary = (game) => {
    const exists = library.some((item) => item.dealID === game.dealID);
    if (!exists) {
      setLibrary([...library, { ...game, owned: false }]);
    }
  };


  const removeFromLibrary = (dealID) => {
    setLibrary(library.filter((item) => item.dealID !== dealID));
  };


  const isInLibrary = (dealID) => {
    return library.some((item) => item.dealID === dealID);
  };

  const clearLibrary = () => {
    setLibrary([]); 
  };

  // კალათაში მყოფი (ჯერ არ არის შეძენილი) თამაშები
  const cartItems = library.filter((item) => !item.owned);

  // უკვე შეძენილი (checkout-ის გავლილი) თამაშები
  const ownedItems = library.filter((item) => item.owned);

  // კალათის ჯამური ფასის დათვლა
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.salePrice) || 0;
    return sum + price;
  }, 0);

  // checkout - კალათაში მყოფ ყველა თამაშს ვნიშნავთ როგორც შეძენილს
  const checkoutCart = () => {
    setLibrary((prev) => prev.map((item) => (item.owned ? item : { ...item, owned: true })));
  };

  return (
    
    <LibraryContext.Provider
      value={{
        library,
        addToLibrary,
        removeFromLibrary,
        isInLibrary,
        clearLibrary,
        cartItems,
        ownedItems,
        cartTotal,
        checkoutCart,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLibrary = () => useContext(LibraryContext);