const list=document.getElementById('beanList');
const dialog=document.getElementById('dialog');
const form=document.getElementById('beanForm');
const addBtn=document.getElementById('addBtn');
const search=document.getElementById('search');

let beans=JSON.parse(localStorage.getItem('beans')||'[]');

function save(){
 localStorage.setItem('beans',JSON.stringify(beans));
}

function render(){
 const q=search.value.toLowerCase();
 list.innerHTML='';
 const filtered=beans.filter(b=>
   [b.name,b.country,b.region,b.process].join(' ').toLowerCase().includes(q)
 );
 if(!filtered.length){
   list.innerHTML='<div class="card"><h3>ようこそ Bean Archiveへ</h3><p>「＋ New Bean」から最初の豆を登録しましょう。</p></div>';
   return;
 }
 filtered.forEach((b,i)=>{
   const card=document.createElement('div');
   card.className='card';
   card.innerHTML=`<h3>${b.name}</h3>
   <p>🌍 ${b.country}</p>
   <p>📍 ${b.region}</p>
   <p>💧 ${b.process}</p>
   <button data-i="${i}">削除</button>`;
   card.querySelector('button').onclick=()=>{
      beans.splice(i,1); save(); render();
   };
   list.appendChild(card);
 });
}

addBtn.onclick=()=>dialog.showModal();

form.onsubmit=(e)=>{
 e.preventDefault();
 beans.push({
   name:name.value,
   country:country.value,
   region:region.value,
   process:process.value
 });
 save();
 dialog.close();
 form.reset();
 render();
};

search.oninput=render;
render();
