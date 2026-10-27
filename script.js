const productsRoot = document.getElementById('products');
const filters = document.querySelectorAll('.filter');
const form = document.getElementById('orderForm');
const formMessage = document.getElementById('formMessage');
document.getElementById('year').textContent = new Date().getFullYear();

function renderProducts(category = 'all') {
  const items = window.CASE_PRODUCTS.filter(p => category === 'all' || p.category === category);
  productsRoot.innerHTML = items.map(p => `
    <article class="product-card">
      <div class="product-visual" style="background:${p.bg}">
        <div class="mini-phone" style="background:${p.bg}">
          <span class="mini-camera"></span>
          <div class="mini-design" style="color:${p.color}"><span>${p.emoji}</span>${p.design.replace(/\\n/g,'<br>')}</div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-type">${p.label}</div><h3>${p.name}</h3>
        <div class="product-bottom"><span class="price">${p.price} ${window.STORE_CONFIG.currency}</span>
        <button class="add-btn" data-product="${p.id}">اطلبه ←</button></div>
      </div>
    </article>`).join('');
  productsRoot.querySelectorAll('[data-product]').forEach(btn => btn.addEventListener('click', () => {
    const p = window.CASE_PRODUCTS.find(item => item.id === Number(btn.dataset.product));
    document.getElementById('designSelect').value = p.category === 'anime' ? 'أنمي' : p.category === 'gaming' ? 'جيمينج' : p.category === 'cute' ? 'كيوت' : 'مينيمال';
    document.querySelector('[name="details"]').value = `عايز تصميم ${p.name} — ${p.design.replace(/\\n/g,' ')}.`;
    document.getElementById('custom').scrollIntoView({behavior:'smooth'});
  }));
}
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  renderProducts(button.dataset.filter);
}));
renderProducts();

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const phone = String(data.get('phone')).trim();
  if (!/^[0-9+\s()-]{8,20}$/.test(phone)) {
    formMessage.textContent = 'من فضلك اكتب رقم موبايل صحيح.';
    return;
  }
  const message = [
    `طلب جديد من ${window.STORE_CONFIG.storeName}`,
    '--------------------',
    `الاسم: ${data.get('customerName')}`,
    `رقم الموبايل: ${phone}`,
    `موديل الموبايل: ${data.get('phoneModel')}`,
    `التصميم: ${data.get('design')}`,
    `اللون: ${data.get('color') || 'غير محدد'}`,
    `تفاصيل التصميم: ${data.get('details')}`,
    `العنوان: ${data.get('address')}`,
    `طريقة التواصل المفضلة: ${data.get('contact')}`
  ].join('\n');
  const wa = window.STORE_CONFIG.whatsappNumber.replace(/\D/g,'');
  if (!wa || wa.includes('XXXXXXXX')) {
    formMessage.textContent = 'المتجر لسه محتاج يضيف رقم واتساب الحقيقي في ملف config.js. بعد إضافته هيشتغل إرسال الطلب.';
    return;
  }
  formMessage.textContent = 'بنفتح واتساب برسالة الطلب…';
  window.open(`https://wa.me/${wa}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});