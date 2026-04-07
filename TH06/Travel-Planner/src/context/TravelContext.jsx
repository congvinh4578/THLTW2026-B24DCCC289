import { createContext, useContext, useState } from 'react';
import { destinations } from '../data/destinations';

const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [budget, setBudget] = useState({
    total: 15000000,
    spent: {
      anUong: 4000000,
      diChuyen: 3000000,
      luuTru: 5000000,
      khac: 2000000,
    },
  });

  const addToItinerary = (dest) => {
    setSelectedDestinations((prev) => [...prev, dest]);
  };

  const removeFromItinerary = (id) => {
    setSelectedDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  const reorderItinerary = (newOrder) => {
    setSelectedDestinations(newOrder);
  };

  const calculateTravelTime = (fromId, toId) => {
    return Math.floor(Math.random() * 4) + 1;
  };

  return (
    <TravelContext.Provider
      value={{
        destinations,
        selectedDestinations,
        itinerary,
        setItinerary,
        budget,
        setBudget,
        addToItinerary,
        removeFromItinerary,
        reorderItinerary,
        calculateTravelTime,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => useContext(TravelContext);
