import React, { createContext, useState, useEffect } from 'react';
import * as api from '../services/api';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  // Current active event ID (default 1 for development/demo)
  const [currentEventId] = useState(1);

  // Selected Theme state (persisted in localStorage)
  const [selectedTheme, setSelectedTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('selected_theme');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Selected decorations for the event
  const [selectedItems, setSelectedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('selected_decorations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      if (selectedTheme) {
        localStorage.setItem('selected_theme', JSON.stringify(selectedTheme));
      } else {
        localStorage.removeItem('selected_theme');
      }
    } catch (e) {
      console.error('Failed to save theme in localStorage', e);
    }
  }, [selectedTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('selected_decorations', JSON.stringify(selectedItems));
    } catch (e) {
      console.error('Failed to save selected decorations in localStorage', e);
    }
  }, [selectedItems]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Select a theme
  const selectTheme = (theme) => {
    setSelectedTheme(theme);
    showToast(`"${theme.themeName}" selected as event theme!`, 'success');
  };

  // Add item to event
  const addItemToEvent = async (item, quantity = 1) => {
    const qty = parseInt(quantity, 10) || 1;
    const unitPrice = item.price || 0;

    // Check if item already exists in local list
    const existingIndex = selectedItems.findIndex(
      (entry) =>
        (entry.decorationItem?.itemId || entry.itemId) === (item.itemId || item.id)
    );

    let updatedList;
    if (existingIndex > -1) {
      const existing = selectedItems[existingIndex];
      const newQty = (existing.quantity || 1) + qty;
      const updatedEntry = {
        ...existing,
        quantity: newQty,
        unitPrice: unitPrice,
        subtotal: (newQty * unitPrice).toFixed(2),
      };
      updatedList = [...selectedItems];
      updatedList[existingIndex] = updatedEntry;
    } else {
      const newEntry = {
        eventDecorationId: Date.now(), // Fallback local ID until saved to DB
        decorationItem: item,
        itemId: item.itemId,
        itemName: item.itemName,
        category: item.category,
        imageUrl: item.imageUrl,
        quantity: qty,
        unitPrice: unitPrice,
        subtotal: (qty * unitPrice).toFixed(2),
      };
      updatedList = [...selectedItems, newEntry];
    }

    setSelectedItems(updatedList);
    showToast(`Added ${qty}x "${item.itemName}" to your event!`, 'success');

    // Attempt backend sync
    try {
      await api.addEventDecoration({
        eventId: currentEventId,
        itemId: item.itemId,
        quantity: qty,
        unitPrice: item.price,
      });
    } catch (err) {
      // Backend not yet running or endpoint pending: keep local state & log info
      console.info('Backend sync pending for addEventDecoration:', err.message);
    }
  };

  // Update item quantity
  const updateItemQuantity = async (eventDecorationId, newQuantity) => {
    if (newQuantity < 1) {
      removeItemFromEvent(eventDecorationId);
      return;
    }

    const updatedList = selectedItems.map((entry) => {
      const id = entry.eventDecorationId || entry.id;
      if (id === eventDecorationId) {
        const unitPrice = parseFloat(entry.unitPrice || entry.decorationItem?.price || 0);
        return {
          ...entry,
          quantity: newQuantity,
          subtotal: (newQuantity * unitPrice).toFixed(2),
        };
      }
      return entry;
    });

    setSelectedItems(updatedList);

    try {
      await api.updateEventDecoration(eventDecorationId, { quantity: newQuantity });
    } catch (err) {
      console.info('Backend sync pending for updateEventDecoration:', err.message);
    }
  };

  // Remove item
  const removeItemFromEvent = async (eventDecorationId) => {
    const itemToRemove = selectedItems.find(
      (e) => (e.eventDecorationId || e.id) === eventDecorationId
    );
    const updatedList = selectedItems.filter(
      (e) => (e.eventDecorationId || e.id) !== eventDecorationId
    );
    setSelectedItems(updatedList);

    const name = itemToRemove?.itemName || itemToRemove?.decorationItem?.itemName || 'Item';
    showToast(`Removed "${name}" from your event.`, 'info');

    try {
      await api.deleteEventDecoration(eventDecorationId);
    } catch (err) {
      console.info('Backend sync pending for deleteEventDecoration:', err.message);
    }
  };

  // Clear all selections
  const clearAllDecorations = () => {
    setSelectedItems([]);
    showToast('All selected decorations cleared.', 'info');
  };

  // Total calculation
  const totalDecorationsCost = selectedItems.reduce((sum, item) => {
    const subtotal = parseFloat(item.subtotal) || 0;
    return sum + subtotal;
  }, 0);

  const themeBasePrice = parseFloat(selectedTheme?.basePrice || 0);
  const grandTotal = themeBasePrice + totalDecorationsCost;

  return (
    <EventContext.Provider
      value={{
        currentEventId,
        selectedTheme,
        selectedItems,
        selectTheme,
        addItemToEvent,
        updateItemQuantity,
        removeItemFromEvent,
        clearAllDecorations,
        totalDecorationsCost,
        themeBasePrice,
        grandTotal,
        toast,
        showToast,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export { useEvent } from './useEvent';
