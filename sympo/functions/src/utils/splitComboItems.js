const splitComboItems = (items) => {

    const splitCombo ={
            combo1 : [
            {id : 'pass-global' , quantity : 1 },
            {id : '10' , quantity : 1}
            ],
            combo2 : [
            {id : 'pass-global' , quantity : 1 },
            {id : '12' , quantity : 1}
            ],
            combo3 : [
            {id : 'pass-global' , quantity : 1 },
            {id : '14' , quantity : 1}
            ],
            
        }

  return items.flatMap(item => {
    const comboEntry = Object.values(splitCombo).find(combo =>
      combo.some(c => c.id === item.id)
    );

    if (comboEntry) {
      return comboEntry.map(c => ({
        eventId: c.id,
        quantity: c.quantity * (item.quantity || 1),
        originalItemId: item.id, 
      }));
    }

    return {
      eventId: String(item.id),
      quantity: item.quantity || 1,
    };
  });
};

export default splitComboItems;
