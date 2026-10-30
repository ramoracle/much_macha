'use strict';
const menu=[
 {id:'south-meals',name:'South Indian home meals',tag:'Home meals · vegetarian',category:'meals',emoji:'🍛',color:'',description:'Rice, sambar, rasam, vegetable curry and seasonal sides. Discuss your combination.'},
 {id:'sunday-meals',name:'Sunday non-veg meals',tag:'Home meals · non-veg',category:'meals',image:'indian-spread.jpg',description:'Rice with your preferred non-veg curry and sides. Menu and portions confirmed in advance.'},
 {id:'chicken-curry',name:'Home-style chicken curry',tag:'Main course · non-veg',category:'meals',image:'chicken-curry.jpg',description:'Request a home-style chicken curry with rice or a custom meal combination.'},
 {id:'biryani',name:'Biryani for your gang',tag:'Party meals · veg / non-veg enquiry',category:'meals',image:'biryani-spread.jpg',description:'Tell us your preferred veg or chicken biryani and guest count. Sides quoted separately.'},
 {id:'veg-starters',name:'Veg party starters',tag:'Party bites · vegetarian',category:'bites',emoji:'🥦',color:'yellow',description:'Paneer bites, vegetable starters or a favourite you have in mind.'},
 {id:'chicken-starters',name:'Tandoori-style chicken',tag:'Party bites · non-veg',category:'bites',image:'tandoori-chicken.jpg',description:'Enquire about tandoori-style chicken bites and your preferred spice level.'},
 {id:'pani-puri',name:'Pani puri & chaat',tag:'Party snacks · vegetarian',category:'bites',image:'pani-puri.jpg',description:'A chaat-style party spread. Discuss fillings, serving arrangements and portions.'},
 {id:'pakoras',name:'Crispy pakoras & bajji',tag:'Tea-time bites · vegetarian',category:'bites',image:'pakoras.jpg',description:'Onion pakoras, vegetable bajji and tea-time favourites, subject to availability.'},
 {id:'chinese',name:'Indian-Chinese favourites',tag:'Party bites · customisable',category:'bites',image:'noodles.jpg',description:'Fried rice, noodles and starters. Ask about veg and non-veg options.'},
 {id:'tea',name:'Tea-time & snack spread',tag:'Office breaks · gatherings',category:'bites',image:'tea-party.jpg',description:'Tea, coffee and snacks for a catch-up. Tell us your group’s favourites.'},
 {id:'juice',name:'Fresh fruit juices',tag:'Drinks · made to order',category:'drinks',image:'fresh-juice.jpg',description:'Seasonal fruit options, prepared to order. Ask about sugar preferences.'},
 {id:'soft-drinks',name:'Packaged soft drinks',tag:'Drinks · purchased on request',category:'drinks',emoji:'🥤',color:'yellow',description:'Share your preferred brand, bottle size and quantity. Purchase and delivery costs quoted first.'},
 {id:'shop',name:'Your favourite-shop pickup',tag:'Pickup · food & packaged drinks',category:'pickup',emoji:'🛍️',color:'',description:'Snacks, soft drinks or your shopping list. Share the shop and items.'}
];
const selected=new Set();
const grid=document.querySelector('#menu-grid');
function renderMenu(filter='all'){
 grid.replaceChildren();
 menu.filter(item=>filter==='all'||item.category===filter).forEach(item=>{
  const card=document.createElement('article');card.className='menu-card';
  const art=document.createElement('div');art.className='food-art '+(item.color||'');
  if(item.image){art.classList.add('with-photo');const photo=document.createElement('img');photo.src='assets/'+item.image;photo.alt='Representative image for '+item.name;photo.loading='lazy';photo.width=360;photo.height=240;art.append(photo);}else{art.setAttribute('aria-hidden','true');const symbol=document.createElement('span');symbol.textContent=item.emoji;art.append(symbol);}
  const content=document.createElement('div');content.className='menu-content';
  const tag=document.createElement('span');tag.className='menu-tag';tag.textContent=item.tag;
  const title=document.createElement('h3');title.textContent=item.name;
  const desc=document.createElement('p');desc.textContent=item.description;
  const button=document.createElement('button');button.type='button';button.className='add-item';button.setAttribute('aria-pressed',String(selected.has(item.id)));button.textContent=selected.has(item.id)?'✓ Added to your table':'＋ Add to your table';button.setAttribute('aria-label',(selected.has(item.id)?'Remove ':'Add ')+item.name);
  button.addEventListener('click',()=>{if(selected.has(item.id))selected.delete(item.id);else selected.add(item.id);renderMenu(filter);renderShortlist();});
  content.append(tag,title,desc,button);card.append(art,content);grid.append(card);
 });
}
function chosen(){return menu.filter(item=>selected.has(item.id)).map(item=>item.name);}
function renderShortlist(){const list=document.querySelector('#shortlist-items');list.replaceChildren();const names=chosen();(names.length?names:['No favourites yet. Add from the menu, or describe your own below.']).forEach(name=>{const li=document.createElement('li');li.textContent=name;list.append(li);});document.querySelector('#shortlist-link').textContent=`Your shortlist: ${names.length} ${names.length===1?'item':'items'} →`;}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(other=>{other.classList.toggle('active',other===button);other.setAttribute('aria-pressed',String(other===button));});renderMenu(button.dataset.filter);}));
document.querySelector('#clear-list').addEventListener('click',()=>{selected.clear();renderShortlist();renderMenu(document.querySelector('[data-filter].active').dataset.filter);});
document.querySelector('#sunday-enquiry').addEventListener('click',()=>{document.querySelector('#occasion').value='Sunday non-veg lunch';document.querySelector('#preference').value='Non-vegetarian';selected.add('sunday-meals');renderShortlist();renderMenu(document.querySelector('[data-filter].active').dataset.filter);});
const form=document.querySelector('#enquiry-form'),status=document.querySelector('#form-status'),preview=document.querySelector('#message-preview');
document.querySelector('#date').min=GatherOrder.earliestDate();
const config=window.GATHER_CONFIG||{};const number=String(config.whatsappNumber||'');const configured=/^[1-9]\d{7,14}$/.test(number);
document.querySelector('#whatsapp-submit').disabled=!configured;
document.querySelector('#contact-status').textContent=configured?'Review and send your enquiry in WhatsApp. Nothing is sent automatically.':'Preview mode: business WhatsApp number is awaiting confirmation. You can copy your enquiry below; it will not be sent.';
function prepare(){document.querySelector('#date').min=GatherOrder.earliestDate();if(!form.reportValidity())return null;const order=Object.fromEntries(new FormData(form));GatherOrder.validateOrder(order);return GatherOrder.message(order,chosen());}
form.addEventListener('submit',event=>{event.preventDefault();try{if(!configured)throw new Error('WhatsApp is not configured yet. Use Copy enquiry instead.');const text=prepare();if(!text)return;window.open(GatherOrder.whatsapp(number,text),'_blank','noopener,noreferrer');status.textContent='WhatsApp was requested. Review the message and press Send there; your order is not confirmed yet.';}catch(error){status.textContent=error.message;}});
document.querySelector('#copy-enquiry').addEventListener('click',async()=>{try{const text=prepare();if(!text)return;preview.hidden=false;preview.value=text;try{if(!navigator.clipboard)throw new Error('unavailable');await navigator.clipboard.writeText(text);status.textContent='Enquiry copied. This has not been sent or booked.';}catch{preview.focus();preview.select();status.textContent='Your enquiry is below. Select and copy it manually; nothing has been sent.';}}catch(error){status.textContent=error.message;}});
renderMenu();renderShortlist();
