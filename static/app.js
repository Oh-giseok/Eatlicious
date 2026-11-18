const emojiByName = {
  '두부': '◻️', '대파': '🧅', '달걀': '🥚', '계란': '🥚', '양파': '🧅', '당근': '🥕', '토마토': '🍅', '방울토마토': '🍅',
  '감자': '🥔', '고구마': '🍠', '양배추': '🥬', '상추': '🥬', '시금치': '🥬', '브로콜리': '🥦', '버섯': '🍄', '표고버섯': '🍄',
  '닭고기': '🍗', '돼지고기': '🥩', '소고기': '🥩', '김치': '🥬', '우유': '🥛', '치즈': '🧀', '사과': '🍎', '바나나': '🍌', '오이': '🥒', '파프리카': '🫑', '애호박': '🥒',
};
const recipeCatalog = [
  { name: '대파 달걀 볶음밥', emoji: '🍳', minutes: 15, ingredients: ['대파', '달걀'], note: '대파를 먼저 쓰기 좋은 간단한 한 끼', amounts: [['대파', '1/2대'], ['달걀', '2개'], ['밥', '1공기'], ['식용유', '1큰술'], ['간장', '1작은술']], steps: ['대파를 송송 썰고 달걀은 풀어둡니다.', '팬에 식용유를 두르고 대파를 중불에서 향이 나도록 볶습니다.', '달걀을 넣어 크게 저으며 익힌 뒤 밥을 넣고 고루 볶습니다.', '간장을 팬 가장자리에 둘러 향을 내고 밥과 섞어 마무리합니다.'] },
  { name: '두부 달걀국', emoji: '🍲', minutes: 20, ingredients: ['두부', '달걀', '대파'], note: '부드러운 두부와 달걀로 따뜻하게', amounts: [['두부', '1/2모'], ['달걀', '1개'], ['대파', '약간'], ['물 또는 육수', '500ml'], ['국간장', '1큰술']], steps: ['두부는 한입 크기로 썰고 대파는 송송 썹니다.', '냄비에 물이나 육수를 끓이고 국간장으로 간합니다.', '두부를 넣어 4~5분 끓입니다.', '달걀물을 천천히 둘러 넣고 한소끔 끓인 뒤 대파를 올립니다.'] },
  { name: '채소 달걀말이', emoji: '🥘', minutes: 18, ingredients: ['달걀', '당근', '대파'], note: '남은 채소를 잘게 썰어 넣어보세요', amounts: [['달걀', '3개'], ['당근', '2큰술'], ['대파', '2큰술'], ['소금', '한 꼬집'], ['식용유', '약간']], steps: ['당근과 대파를 잘게 다집니다.', '달걀을 풀고 다진 채소와 소금을 섞습니다.', '약불로 달군 팬에 기름을 얇게 두르고 달걀물을 얇게 붓습니다.', '가장자리가 익으면 말아 올리고 남은 달걀물을 부어가며 도톰하게 완성합니다.'] },
  { name: '김치 두부 볶음', emoji: '🥘', minutes: 17, ingredients: ['김치', '두부', '대파'], note: '두부와 김치를 함께 활용해요', amounts: [['두부', '1모'], ['김치', '1컵'], ['대파', '1/2대'], ['참기름', '1작은술'], ['설탕', '1/2작은술']], steps: ['두부는 먹기 좋게 썰어 키친타월로 물기를 닦습니다.', '팬에 김치와 송송 썬 대파를 넣어 3~4분 볶습니다.', '두부를 넣고 부서지지 않게 뒤집으며 따뜻하게 익힙니다.', '설탕과 참기름으로 마무리합니다.'] },
  { name: '포근한 감자 수프', emoji: '🥣', minutes: 25, ingredients: ['감자', '양파', '우유'], note: '양파와 감자를 부드럽게 끓여요', amounts: [['감자', '2개'], ['양파', '1/4개'], ['우유', '300ml'], ['버터', '1큰술'], ['소금', '약간']], steps: ['감자와 양파를 얇게 썹니다.', '냄비에 버터를 녹여 양파를 투명해질 때까지 볶고 감자를 넣습니다.', '물 150ml를 더해 감자가 부드러워질 때까지 끓입니다.', '우유를 넣고 약불에서 데운 뒤 으깨거나 갈아 소금으로 간합니다.'] },
  { name: '버섯 채소 볶음', emoji: '🍄', minutes: 12, ingredients: ['버섯', '당근', '양파'], note: '냉장고 속 채소를 한 번에 쓰기 좋아요', amounts: [['버섯', '1줌'], ['당근', '1/4개'], ['양파', '1/4개'], ['간장', '1큰술'], ['식용유', '약간']], steps: ['버섯과 채소를 먹기 좋은 크기로 썹니다.', '팬을 달궈 기름을 두르고 양파와 당근을 먼저 볶습니다.', '버섯을 넣고 숨이 죽을 때까지 센 불에서 볶습니다.', '간장을 둘러 빠르게 섞고 불을 끕니다.'] },
  { name: '토마토 달걀 볶음', emoji: '🍅', minutes: 12, ingredients: ['토마토', '달걀', '대파'], note: '간단한 재료로 만드는 부드러운 볶음', amounts: [['토마토', '2개'], ['달걀', '2개'], ['대파', '약간'], ['소금', '약간'], ['식용유', '1큰술']], steps: ['토마토는 한입 크기로 썰고 달걀은 풀어 소금을 조금 넣습니다.', '팬에 기름을 두르고 달걀을 부드럽게 스크램블해 잠시 덜어둡니다.', '같은 팬에 토마토를 넣고 2~3분 볶아 즙이 나오게 합니다.', '달걀과 대파를 넣고 가볍게 섞어 마무리합니다.'] },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const ingredientList = $('#all-ingredients');
let ingredients = [];
let selectedPhotoUrl = null;
let selectedPhotoFile = null;
let recognitionController = null;
let toastTimer;
let ingredientFilter = 'all';
let editingIngredientId = null;

const ingredientAliases = { '계란': '달걀', '표고버섯': '버섯', '새송이버섯': '버섯', '느타리버섯': '버섯' };
function canonicalIngredient(name) { return ingredientAliases[name.trim()] || name.trim(); }

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysLeft(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

function freshness(item) {
  const remaining = daysLeft(item.expires_at);
  if (remaining < 0) return { text: `${Math.abs(remaining)}일 지남`, className: 'over' };
  if (remaining <= 3) return { text: remaining === 0 ? '오늘까지' : `${remaining}일 남음`, className: 'soon' };
  return { text: `${remaining}일 남음`, className: '' };
}

function emojiFor(name) { return emojiByName[name] || '🥬'; }
function formatDate(value) { return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }); }

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function matchingRecipes() {
  const names = new Set(ingredients.map((item) => canonicalIngredient(item.name)));
  return recipeCatalog.map((recipe, recipeId) => {
    const available = recipe.ingredients.filter((name) => names.has(canonicalIngredient(name)));
    return { ...recipe, recipeId, available, missing: recipe.ingredients.filter((name) => !names.has(canonicalIngredient(name))), score: available.length };
  }).filter((recipe) => recipe.score > 0).sort((a, b) => b.score - a.score || a.minutes - b.minutes);
}

function ingredientRow(item, showDelete = false) {
  const status = freshness(item);
  const name = item.name.replace(/^콜라\s*\([^)]*\)$/, '콜라');
  // Generic counts on image-detected items are guesses, so don't present them as measured quantities.
  const quantity = ['1개', '수량 확인 필요'].includes(item.quantity) ? '' : item.quantity;
  return `<article class="ingredient-card">
    <span class="food-icon">${emojiFor(item.name)}</span>
    <div class="card-main"><b>${escapeHtml(name)}${quantity ? ` <span class="quantity">${escapeHtml(quantity)}</span>` : ''}</b><small>구매 ${formatDate(item.purchased_at)} · 권장 ${formatDate(item.expires_at)}</small></div>
    <div class="card-actions"><span class="status-pill ${status.className}">${status.text}</span>${showDelete ? `<button class="delete-button" data-edit="${item.id}" aria-label="${escapeHtml(item.name)} 수정">수정</button><button class="delete-button" data-delete="${item.id}" aria-label="${escapeHtml(item.name)} 삭제">삭제</button>` : ''}</div>
  </article>`;
}

function recipeRow(recipe) {
  return `<article class="recipe-row recipe-open" data-recipe-id="${recipe.recipeId}" role="button" tabindex="0" aria-label="${escapeHtml(recipe.name)} 레시피 자세히 보기"><span class="recipe-emoji">${recipe.emoji}</span><span class="recipe-copy"><b>${escapeHtml(recipe.name)}</b><small>${recipe.available.length}개 재료 보유${recipe.missing.length ? ` · 추가 ${recipe.missing.length}개` : ' · 모두 있어요'}</small></span><span class="recipe-score">${recipe.minutes}분</span></article>`;
}

function recipeCard(recipe) {
  return `<article class="recipe-card recipe-open" data-recipe-id="${recipe.recipeId}" role="button" tabindex="0" aria-label="${escapeHtml(recipe.name)} 레시피 자세히 보기"><div class="recipe-art">${recipe.emoji}<span class="recipe-time">◷ ${recipe.minutes}분</span></div><div class="recipe-card-info"><h3>${escapeHtml(recipe.name)}</h3><p>${escapeHtml(recipe.note)}</p><div class="tag-list">${recipe.ingredients.map((name) => `<span class="ingredient-tag ${recipe.available.includes(name) ? '' : 'missing'}">${recipe.available.includes(name) ? '✓' : '+'} ${escapeHtml(name)}</span>`).join('')}</div><small class="recipe-detail-hint">눌러서 레시피 보기 →</small></div></article>`;
}

function openRecipeDialog(recipeId) {
  const recipe = matchingRecipes().find((item) => item.recipeId === Number(recipeId));
  if (!recipe) return;
  $('#recipe-detail-title').textContent = recipe.name;
  $('#recipe-detail-summary').textContent = recipe.note;
  $('#recipe-detail-emoji').textContent = recipe.emoji;
  $('#recipe-detail-time').textContent = `${recipe.minutes}분`;
  const amounts = new Map(recipe.amounts.map(([name, amount]) => [name, amount]));
  $('#recipe-detail-ingredients').innerHTML = recipe.ingredients.map((name) => {
    const owned = recipe.available.includes(name);
    return `<li class="${owned ? 'owned' : 'missing'}"><span>${owned ? '✓' : '+'}</span><b>${escapeHtml(name)}</b><small>${escapeHtml(amounts.get(name) || '적당량')}</small><em>${owned ? '보유 중' : '추가 필요'}</em></li>`;
  }).join('') + recipe.amounts.filter(([name]) => !recipe.ingredients.includes(name)).map(([name, amount]) => `<li class="pantry-item"><span>·</span><b>${escapeHtml(name)}</b><small>${escapeHtml(amount)}</small><em>기본 양념</em></li>`).join('');
  $('#recipe-detail-steps').innerHTML = recipe.steps.map((step, index) => `<li><span>${index + 1}</span><p>${escapeHtml(step)}</p></li>`).join('');
  $('#recipe-modal').hidden = false;
}

function render() {
  const sorted = [...ingredients].sort((a, b) => daysLeft(a.expires_at) - daysLeft(b.expires_at));
  const urgent = sorted.filter((item) => daysLeft(item.expires_at) <= 3);
  const suggestions = matchingRecipes();
  $('#ingredient-count').innerHTML = `${ingredients.length}<span>가지</span>`;
  $('#urgent-count').innerHTML = `${urgent.length}<span>가지</span>`;
  $('#recipe-count').innerHTML = `${suggestions.length}<span>개</span>`;
  $('#all-count').textContent = ingredients.length;
  $('#filter-urgent-count').textContent = urgent.length;
  $('#recipe-ingredient-count').textContent = `${ingredients.length}개 재료 기준`;
  $('#urgent-list').innerHTML = urgent.length ? urgent.slice(0, 4).map((item) => ingredientRow(item)).join('') : '<div class="empty-state"><b>급하게 쓸 재료가 없어요.</b>냉장고 재료를 등록해보세요.</div>';
  $('#home-recipes').innerHTML = suggestions.length ? suggestions.slice(0, 3).map(recipeRow).join('') : '<div class="empty-state"><b>재료를 등록하면 레시피를 추천해요.</b>냉장고에 있는 재료를 추가해보세요.</div>';
  const visible = ingredientFilter === 'urgent' ? sorted.filter((item) => daysLeft(item.expires_at) <= 3) : sorted;
  $$('[data-ingredient-filter]').forEach((button) => {
    const active = button.dataset.ingredientFilter === ingredientFilter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  ingredientList.innerHTML = visible.length ? visible.map((item) => ingredientRow(item, true)).join('') : ingredientFilter === 'urgent' ? '<div class="empty-state"><b>급하게 쓸 재료가 없어요.</b>소비 권장일이 3일 이내인 재료가 여기에 표시돼요.</div>' : '<div class="empty-state"><b>아직 등록된 재료가 없어요.</b>사진을 고르거나 재료를 직접 추가해보세요.</div>';
  $('#all-recipes').innerHTML = suggestions.length ? suggestions.map(recipeCard).join('') : '<div class="empty-state"><b>재료를 등록하면 레시피를 추천해요.</b>냉장고에 있는 재료를 먼저 담아보세요.</div>';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
}

async function loadIngredients() {
  try {
    const response = await fetch('/api/ingredients');
    if (!response.ok) throw new Error('식재료 목록을 불러오지 못했어요.');
    ingredients = await response.json();
    render();
  } catch (error) {
    showToast(error.message || '서버에 연결할 수 없어요.');
  }
}

async function saveIngredient(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const response = await fetch(editingIngredientId ? `/api/ingredients/${editingIngredientId}` : '/api/ingredients', {
    method: editingIngredientId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || '재료를 등록하지 못했어요.');
  if (editingIngredientId) ingredients = ingredients.map((item) => item.id === result.id ? result : item);
  else ingredients.push(result);
  render();
  return result;
}

async function deleteIngredient(id) {
  const response = await fetch(`/api/ingredients?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('재료를 삭제하지 못했어요.');
  ingredients = ingredients.filter((item) => item.id !== Number(id));
  render();
}

function setActiveView(view) {
  $$('.view').forEach((section) => section.classList.toggle('active-view', section.id === `${view}-view`));
  $$('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
  $('#crumb-current').textContent = ({ home: '오늘의 냉장고', fridge: '내 식재료', recipes: '레시피 찾기' })[view];
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetPhotoDialog() {
  recognitionController?.abort();
  recognitionController = null;
  if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
  selectedPhotoUrl = null;
  selectedPhotoFile = null;
  $('#photo-input').value = '';
  $('#photo-preview').removeAttribute('src');
  $('#photo-preview').hidden = true;
  $('#recognition-status').hidden = true;
  $('#recognition-status').textContent = '';
  $('#recognition-results').hidden = true;
  $('#recognized-list').replaceChildren();
  $('#recognized-purchased').value = '';
  $('#recognized-expires').value = '';
  $('#recognize-photo').disabled = false;
  delete $('#recognize-photo').dataset.loading;
  $('#recognize-photo').innerHTML = '사진에서 재료 찾기 <span>✦</span>';
  $('#add-recognized').disabled = true;
}

function openPhotoDialog() {
  resetPhotoDialog();
  $('#photo-modal').hidden = false;
}
function openIngredientDialog(item = null) {
  const form = $('#ingredient-form');
  editingIngredientId = item?.id ?? null;
  $('#modal-title').textContent = item ? '재료를 수정해요' : '재료를 등록해요';
  $('#ingredient-submit').innerHTML = item ? '변경 내용 저장 <span>→</span>' : '냉장고에 담기 <span>→</span>';
  form.elements.name.value = item?.name || '';
  form.elements.quantity.value = item?.quantity || '';
  form.elements.purchased_at.value = item?.purchased_at || localDate();
  if (item) form.elements.expires_at.value = item.expires_at;
  else { const suggestion = new Date(); suggestion.setDate(suggestion.getDate() + 7); form.elements.expires_at.value = localDate(suggestion); }
  $('#ingredient-modal').hidden = false;
  setTimeout(() => form.elements.name.focus(), 50);
}

function updateDateLabels() {
  const now = new Date();
  $('#today-date').textContent = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  $('#welcome-date').textContent = now.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

$$('.nav-item').forEach((button) => button.addEventListener('click', () => setActiveView(button.dataset.view)));
$$('[data-go]').forEach((button) => button.addEventListener('click', () => setActiveView(button.dataset.go)));
$('#photo-open').addEventListener('click', openPhotoDialog);
$('#photo-open-2').addEventListener('click', openPhotoDialog);
$('#add-open').addEventListener('click', openIngredientDialog);
$('#modal-close').addEventListener('click', () => { $('#ingredient-modal').hidden = true; editingIngredientId = null; });
$$('[data-ingredient-filter]').forEach((button) => button.addEventListener('click', () => { ingredientFilter = button.dataset.ingredientFilter; render(); }));
$('#photo-close').addEventListener('click', () => { resetPhotoDialog(); $('#photo-modal').hidden = true; });
$('#choose-photo').addEventListener('click', () => $('#photo-input').click());
$('#photo-input').addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    showToast('JPG, PNG, WEBP, GIF 사진만 선택할 수 있어요.');
    event.target.value = '';
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    showToast('사진은 8MB 이하로 선택해 주세요.');
    event.target.value = '';
    return;
  }
  if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
  selectedPhotoFile = file;
  selectedPhotoUrl = URL.createObjectURL(file);
  $('#photo-preview').src = selectedPhotoUrl;
  $('#photo-preview').hidden = false;
  $('#recognize-photo').disabled = false;
  $('#recognition-results').hidden = true;
  $('#recognition-status').hidden = true;
  showToast('사진을 선택했어요. 이제 재료를 찾아볼게요.');
});
$('#recognize-photo').addEventListener('click', async () => {
  const button = $('#recognize-photo');
  const status = $('#recognition-status');
  if (!selectedPhotoFile) {
    button.disabled = true;
    button.dataset.loading = 'true';
    button.textContent = '사진을 확인하는 중…';
    status.hidden = false;
    status.textContent = '먼저 냉장고 사진을 등록해 주세요.';
    await new Promise((resolve) => setTimeout(resolve, 650));
    button.disabled = false;
    delete button.dataset.loading;
    button.innerHTML = '사진에서 재료 찾기 <span>✦</span>';
    return;
  }
  button.disabled = true;
  button.dataset.loading = 'true';
  button.textContent = '사진을 살펴보는 중…';
  status.hidden = false;
  status.textContent = '사진에서 식재료를 찾고 있어요. 잠시만 기다려 주세요.';
  $('#recognition-results').hidden = true;
  const controller = new AbortController();
  recognitionController = controller;
  try {
    const body = new FormData();
    body.append('image', selectedPhotoFile);
    const response = await fetch('/api/recognize-ingredients', { method: 'POST', body, signal: controller.signal });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '사진을 인식하지 못했어요.');
    if (!result.ingredients.length) {
      status.textContent = '식재료를 찾지 못했어요. 더 밝고 가까운 사진으로 다시 시도해 주세요.';
      return;
    }
    const purchased = $('#recognized-purchased');
    const expires = $('#recognized-expires');
    purchased.value = localDate();
    const suggestedExpiry = new Date();
    suggestedExpiry.setDate(suggestedExpiry.getDate() + 7);
    expires.value = localDate(suggestedExpiry);
    $('#recognized-list').innerHTML = result.ingredients.map((name, index) => `<label class="recognized-item"><input type="checkbox" checked /><input class="recognized-name" value="${escapeHtml(name)}" maxlength="40" aria-label="재료 이름 ${index + 1}" /></label>`).join('');
    status.hidden = true;
    $('#recognition-results').hidden = false;
    updateRecognizedCount();
  } catch (error) {
    if (error.name === 'AbortError') return;
    status.textContent = error.message || '사진을 인식하지 못했어요.';
  } finally {
    if (recognitionController === controller) {
      recognitionController = null;
      button.disabled = false;
      delete button.dataset.loading;
      button.innerHTML = '사진에서 재료 찾기 <span>✦</span>';
    }
  }
});
function updateRecognizedCount() {
  const selected = $$('.recognized-item input[type="checkbox"]:checked').length;
  $('#add-recognized').disabled = selected === 0;
  $('#add-recognized').innerHTML = `선택한 재료 ${selected}개 등록 <span>→</span>`;
}
$('#recognized-list').addEventListener('change', updateRecognizedCount);
$('#add-recognized').addEventListener('click', async () => {
  const button = $('#add-recognized');
  const selectedNames = $$('.recognized-item').filter((row) => row.querySelector('input[type="checkbox"]').checked)
    .map((row) => row.querySelector('.recognized-name').value.trim()).filter(Boolean);
  const names = [...new Map(selectedNames.map((name) => [canonicalIngredient(name).toLocaleLowerCase(), name])).values()];
  if (!names.length) return;
  button.disabled = true;
  button.textContent = '재료를 등록하는 중…';
  try {
    const purchased_at = $('#recognized-purchased').value;
    const expires_at = $('#recognized-expires').value;
    if (!purchased_at || !expires_at || expires_at < purchased_at) throw new Error('구매일과 소비 권장일을 확인해 주세요.');
    const response = await fetch('/api/ingredients/bulk', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: names.map((name) => ({ name, purchased_at, expires_at })) }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '재료 등록에 실패했어요.');
    ingredients.push(...result);
    render();
    resetPhotoDialog();
    $('#photo-modal').hidden = true;
    showToast(`${names.length}개 재료를 냉장고에 등록했어요.`);
  } catch (error) {
    showToast(error.message || '재료 등록에 실패했어요.');
    updateRecognizedCount();
  }
});
$('#ingredient-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  try {
    const wasEditing = Boolean(editingIngredientId);
    await saveIngredient(form);
    form.reset();
    $('#ingredient-modal').hidden = true;
    editingIngredientId = null;
    showToast(wasEditing ? '식재료 정보를 수정했어요.' : '식재료를 냉장고에 담았어요.');
  } catch (error) { showToast(error.message || '재료를 등록하지 못했어요.'); }
});
ingredientList.addEventListener('click', async (event) => {
  const editButton = event.target.closest('[data-edit]');
  if (editButton) {
    const item = ingredients.find((entry) => entry.id === Number(editButton.dataset.edit));
    if (item) openIngredientDialog(item);
    return;
  }
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  try { await deleteIngredient(button.dataset.delete); showToast('식재료를 삭제했어요.'); }
  catch (error) { showToast(error.message || '삭제하지 못했어요.'); }
});
document.addEventListener('click', (event) => {
  const recipe = event.target.closest('[data-recipe-id]');
  if (recipe) openRecipeDialog(recipe.dataset.recipeId);
});
$('#ingredient-modal').addEventListener('click', (event) => { if (event.target === event.currentTarget) event.currentTarget.hidden = true; });
$('#recipe-close').addEventListener('click', () => { $('#recipe-modal').hidden = true; });
$('#recipe-modal').addEventListener('click', (event) => { if (event.target === event.currentTarget) event.currentTarget.hidden = true; });
$('#photo-modal').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) {
    resetPhotoDialog();
    event.currentTarget.hidden = true;
  }
});
document.addEventListener('keydown', (event) => {
  const recipeTrigger = event.target.closest?.('[data-recipe-id]');
  if (recipeTrigger && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    openRecipeDialog(recipeTrigger.dataset.recipeId);
  }
  if (event.key === 'Escape') {
    $('#ingredient-modal').hidden = true;
    $('#recipe-modal').hidden = true;
    if (!$('#photo-modal').hidden) resetPhotoDialog();
    $('#photo-modal').hidden = true;
  }
});
updateDateLabels();
loadIngredients();
