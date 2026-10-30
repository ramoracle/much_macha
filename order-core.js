/* Pure helpers used by the browser and Node tests. */
(function(root){
  function localDate(date){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
  function earliestDate(now=new Date()){const date=new Date(now);date.setDate(date.getDate()+1);return localDate(date);}
  function validateOrder(order,now=new Date()){
    if(!order.customer.trim()||!order.area.trim())throw new Error('Please add your name and Bengaluru delivery area.');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(order.date)||order.date<earliestDate(now))throw new Error('Please choose tomorrow or a later date.');
    const parsed=new Date(order.date+'T12:00:00');
    if(Number.isNaN(parsed.getTime())||localDate(parsed)!==order.date)throw new Error('Please choose a valid date.');
    const count=Number(order.guests);if(!Number.isInteger(count)||count<1||count>500)throw new Error('Please enter a guest count between 1 and 500.');
    return order;
  }
  function message(order,items){return ['Hello! I’d like to enquire with Munch Macha.','',`Name: ${order.customer.trim()}`,`Occasion: ${order.occasion}`,`Date: ${order.date}`,`Guests: ${order.guests}`,`Bengaluru area: ${order.area.trim()}`,`Preference: ${order.preference}`,'',`Shortlist: ${items.length?items.join(', '):'Please help me plan a menu.'}`,`Requests / shop list: ${order.details.trim()||'None added.'}`,'','Please confirm availability, portions, total price, delivery charges and payment/cancellation terms. This is an enquiry, not a confirmed order.'].join('\n');}
  function whatsapp(number,text){if(!/^[1-9]\d{7,14}$/.test(number))throw new Error('Business WhatsApp number is not configured.');return 'https://wa.me/'+number+'?text='+encodeURIComponent(text);}
  const api={earliestDate,validateOrder,message,whatsapp};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GatherOrder=api;
})(typeof window!=='undefined'?window:globalThis);
