import React, { useState, createContext, useContext } from 'react';

interface SearchContextType {
  searchText: string;
  setSearchText: (text: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchText: '',
  setSearchText: () => {},
  isSearchOpen: false,
  setIsSearchOpen: () => {}
});

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchText, setSearchText] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <SearchContext.Provider value={{ searchText, setSearchText, isSearchOpen, setIsSearchOpen }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => useContext(SearchContext);