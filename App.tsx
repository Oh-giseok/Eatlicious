import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Ingredient = {
  id: string;
  name: string;
  emoji: string;
  purchasedAt: string;
  expiresAt: string;
  amount: string;
};

type Recipe = {
  id: string;
  name: string;
  emoji: string;
  time: string;
  ingredients: string[];
  description: string;
};

const today = new Date();
const dateAfter = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const initialIngredients: Ingredient[] = [
  { id: '1', name: '달걀', emoji: '🥚', purchasedAt: dateAfter(-2), expiresAt: dateAfter(12), amount: '6개' },
  { id: '2', name: '대파', emoji: '🧅', purchasedAt: dateAfter(-5), expiresAt: dateAfter(1), amount: '1단' },
  { id: '3', name: '두부', emoji: '◻️', purchasedAt: dateAfter(-1), expiresAt: dateAfter(2), amount: '1모' },
  { id: '4', name: '양파', emoji: '🧅', purchasedAt: dateAfter(-7), expiresAt: dateAfter(6), amount: '2개' },
  { id: '5', name: '당근', emoji: '🥕', purchasedAt: dateAfter(-4), expiresAt: dateAfter(8), amount: '1개' },
];

const recipes: Recipe[] = [
  { id: 'r1', name: '대파 달걀 볶음밥', emoji: '🍳', time: '15분', ingredients: ['달걀', '대파'], description: '냉장고 재료 2개 사용 · 대파 먼저 쓰기 좋아요' },
  { id: 'r2', name: '두부 달걀국', emoji: '🍲', time: '20분', ingredients: ['달걀', '대파', '두부'], description: '냉장고 재료 3개 사용 · 두부 소비 추천' },
  { id: 'r3', name: '채소 달걀말이', emoji: '🥘', time: '18분', ingredients: ['달걀', '당근', '대파'], description: '냉장고 재료 3개 사용 · 간단한 반찬' },
];

const colors = { ink: '#202820', muted: '#7C847B', green: '#416B4B', pale: '#EAF0E6', cream: '#F7F7F2', line: '#E9EAE3', orange: '#C37838', red: '#B64D3F', white: '#FFFFFF' };

function daysUntil(dateString: string) {
  const due = new Date(`${dateString}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / 86400000);
}

function statusFor(item: Ingredient) {
  const days = daysUntil(item.expiresAt);
  if (days < 0) return { label: `${Math.abs(days)}일 지남`, color: colors.red, background: '#F9E8E5' };
  if (days <= 3) return { label: days === 0 ? '오늘까지' : `${days}일 남음`, color: colors.orange, background: '#FBF0E3' };
  return { label: `${days}일 남음`, color: colors.green, background: colors.pale };
}

export default function App() {
  const [tab, setTab] = useState<'home' | 'fridge' | 'recipes'>('home');
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [purchaseInput, setPurchaseInput] = useState(dateAfter(0));
  const [expiryInput, setExpiryInput] = useState(dateAfter(7));
  const [showForm, setShowForm] = useState(false);

  const urgentItems = useMemo(
    () => [...ingredients].sort((a, b) => daysUntil(a.expiresAt) - daysUntil(b.expiresAt)).slice(0, 3),
    [ingredients],
  );

  const matchedRecipes = useMemo(() => recipes
    .map((recipe) => ({ recipe, count: recipe.ingredients.filter((name) => ingredients.some((item) => item.name === name)).length }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count)
    .map(({ recipe }) => recipe), [ingredients]);

  async function pickFridgePhoto(useCamera: boolean) {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한이 필요해요', '사진을 등록하려면 카메라 또는 사진 접근을 허용해 주세요.');
      return;
    }
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      Alert.alert('사진을 등록했어요', '사진 속 식재료 인식은 다음 단계에서 연결할 기능이에요. 지금은 아래에서 식재료를 직접 추가해 볼 수 있어요.');
      setShowForm(true);
    }
  }

  function addIngredient() {
    const name = nameInput.trim();
    if (!name) {
      Alert.alert('식재료 이름을 입력해 주세요');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(purchaseInput) || !/^\d{4}-\d{2}-\d{2}$/.test(expiryInput)) {
      Alert.alert('날짜 형식을 확인해 주세요', '날짜는 YYYY-MM-DD 형식으로 입력해 주세요.');
      return;
    }
    setIngredients((current) => [{ id: `${Date.now()}`, name, emoji: '🥬', purchasedAt: purchaseInput, expiresAt: expiryInput, amount: '1개' }, ...current]);
    setNameInput('');
    setShowForm(false);
  }

  const openAdd = () => {
    Alert.alert('식재료 등록', '등록 방법을 골라 주세요.', [
      { text: '사진 촬영', onPress: () => { void pickFridgePhoto(true); } },
      { text: '사진 선택', onPress: () => { void pickFridgePhoto(false); } },
      { text: '직접 입력', onPress: () => setShowForm(true) },
      { text: '취소', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />
      <View style={styles.topbar}>
        <View><Text style={styles.brand}>오늘의 냉장고</Text><Text style={styles.topDate}>내 재료로 차리는 한 끼</Text></View>
        <Pressable style={styles.avatar} onPress={() => Alert.alert('냉장고 한 끼', '포트폴리오용 앱 프로토타입입니다.')}><Text style={styles.avatarText}>🥣</Text></Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'home' && <>
          <View style={styles.hero}>
            <View style={styles.heroCopy}><Text style={styles.eyebrow}>FRIDGE CHECK  ·  {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</Text><Text style={styles.heroTitle}>냉장고 속 재료,{ '\n' }오늘 맛있게 비워봐요.</Text><Text style={styles.heroBody}>기한이 가까운 재료부터 챙겨드릴게요.</Text></View>
            <View style={styles.heroArt}><Text style={styles.heroEmoji}>🥬</Text><Text style={[styles.heroEmoji, styles.heroEgg]}>🥚</Text><Text style={[styles.heroEmoji, styles.heroCarrot]}>🥕</Text></View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}><Text style={styles.summaryNumber}>{ingredients.length}</Text><Text style={styles.summaryLabel}>냉장고 재료</Text></View>
            <View style={[styles.summaryCard, styles.summaryAlert]}><Text style={[styles.summaryNumber, { color: colors.orange }]}>{ingredients.filter((item) => daysUntil(item.expiresAt) <= 3).length}</Text><Text style={styles.summaryLabel}>먼저 먹을 재료</Text></View>
          </View>
          <SectionHeading title="먼저 먹으면 좋아요" action="전체 보기" onPress={() => setTab('fridge')} />
          <View style={styles.card}>{urgentItems.map((item, index) => <IngredientRow key={item.id} item={item} last={index === urgentItems.length - 1} />)}</View>
          <SectionHeading title="이 재료로 만들 수 있어요" action="레시피 더 보기" onPress={() => setTab('recipes')} />
          {matchedRecipes.slice(0, 2).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} fridge={ingredients} />)}
          <Pressable style={styles.cameraCard} onPress={openAdd}><View style={styles.cameraIcon}><Text style={{ fontSize: 22 }}>📷</Text></View><View style={{ flex: 1 }}><Text style={styles.cameraTitle}>냉장고 사진으로 재료 등록</Text><Text style={styles.cameraDesc}>사진을 찍거나 앨범에서 골라보세요</Text></View><Text style={styles.chevron}>›</Text></Pressable>
        </>}

        {tab === 'fridge' && <>
          <View style={styles.pageHeading}><Text style={styles.pageTitle}>내 냉장고</Text><Text style={styles.pageSubtitle}>식재료 {ingredients.length}개를 보관 중이에요</Text></View>
          {photoUri && <Image source={{ uri: photoUri }} style={styles.previewImage} />}
          <Pressable style={styles.addPhoto} onPress={openAdd}><Text style={styles.addPhotoIcon}>＋</Text><Text style={styles.addPhotoText}>사진으로 재료 추가</Text><Text style={styles.addPhotoArrow}>›</Text></Pressable>
          <SectionHeading title="보관 중인 재료" action="＋ 직접 추가" onPress={() => setShowForm((v) => !v)} />
          {showForm && <View style={styles.formCard}>
            <Text style={styles.formTitle}>새 식재료 등록</Text>
            <TextInput value={nameInput} onChangeText={setNameInput} placeholder="재료 이름 (예: 토마토)" placeholderTextColor="#9AA197" style={styles.input} />
            <Text style={styles.inputLabel}>산 날짜</Text><TextInput value={purchaseInput} onChangeText={setPurchaseInput} placeholder="YYYY-MM-DD" style={styles.input} />
            <Text style={styles.inputLabel}>소비 권장일 / 유통기한</Text><TextInput value={expiryInput} onChangeText={setExpiryInput} placeholder="YYYY-MM-DD" style={styles.input} />
            <Text style={styles.formHint}>입력한 날짜를 기준으로 보관 상태를 안내해요.</Text>
            <Pressable onPress={addIngredient} style={styles.primaryButton}><Text style={styles.primaryButtonText}>냉장고에 담기</Text></Pressable>
          </View>}
          <View style={styles.card}>{[...ingredients].sort((a, b) => daysUntil(a.expiresAt) - daysUntil(b.expiresAt)).map((item, index, arr) => <IngredientRow key={item.id} item={item} last={index === arr.length - 1} showDates />)}</View>
          <Text style={styles.disclaimer}>상태 표시는 입력한 날짜 기준 안내이며, 실제 식품의 신선도나 부패 여부를 판정하지 않아요.</Text>
        </>}

        {tab === 'recipes' && <>
          <View style={styles.pageHeading}><Text style={styles.pageTitle}>오늘의 레시피</Text><Text style={styles.pageSubtitle}>내 재료와 먼저 먹을 재료를 고려했어요</Text></View>
          <View style={styles.filterPill}><Text style={styles.filterDot}>●</Text><Text style={styles.filterText}>내 냉장고 재료 {ingredients.length}개로 추천</Text></View>
          {matchedRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} fridge={ingredients} large />)}
          {matchedRecipes.length === 0 && <View style={styles.empty}><Text style={{ fontSize: 34 }}>🥣</Text><Text style={styles.emptyTitle}>재료를 등록하면 레시피를 추천해요</Text><Pressable onPress={() => setTab('fridge')}><Text style={styles.linkText}>내 냉장고에 재료 담기 →</Text></Pressable></View>}
          <Text style={styles.disclaimer}>레시피 추천은 등록된 재료와 예시 레시피 데이터를 사용해요.</Text>
        </>}
        <View style={{ height: 30 }} />
      </ScrollView>

      <View style={styles.tabbar}>
        <TabButton icon="⌂" label="홈" active={tab === 'home'} onPress={() => setTab('home')} />
        <TabButton icon="▤" label="내 냉장고" active={tab === 'fridge'} onPress={() => setTab('fridge')} />
        <TabButton icon="♨" label="레시피" active={tab === 'recipes'} onPress={() => setTab('recipes')} />
      </View>
    </SafeAreaView>
  );
}

function SectionHeading({ title, action, onPress }: { title: string; action: string; onPress: () => void }) {
  return <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>{title}</Text><Pressable onPress={onPress}><Text style={styles.sectionAction}>{action} ›</Text></Pressable></View>;
}

function IngredientRow({ item, last, showDates = false }: { item: Ingredient; last: boolean; showDates?: boolean }) {
  const status = statusFor(item);
  return <View style={[styles.ingredientRow, !last && styles.rowBorder]}>
    <View style={styles.ingredientEmoji}><Text style={{ fontSize: 22 }}>{item.emoji}</Text></View>
    <View style={{ flex: 1 }}><Text style={styles.ingredientName}>{item.name}<Text style={styles.amount}>  {item.amount}</Text></Text>{showDates && <Text style={styles.dateText}>구매 {item.purchasedAt}  ·  권장 {item.expiresAt}</Text>}</View>
    <View style={[styles.statusPill, { backgroundColor: status.background }]}><Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text></View>
  </View>;
}

function RecipeCard({ recipe, fridge, large = false }: { recipe: Recipe; fridge: Ingredient[]; large?: boolean }) {
  const available = recipe.ingredients.filter((name) => fridge.some((item) => item.name === name));
  const missing = recipe.ingredients.filter((name) => !fridge.some((item) => item.name === name));
  return <View style={[styles.recipeCard, large && styles.recipeLarge]}>
    <View style={styles.recipeArt}><Text style={{ fontSize: 38 }}>{recipe.emoji}</Text><View style={styles.timeBadge}><Text style={styles.timeText}>◷ {recipe.time}</Text></View></View>
    <View style={styles.recipeInfo}><View style={styles.recipeTitleRow}><Text style={styles.recipeTitle}>{recipe.name}</Text><Text style={styles.bookmark}>♡</Text></View><Text style={styles.recipeDesc}>{recipe.description}</Text>
      <View style={styles.tagRow}>{available.map((name) => <Text key={name} style={styles.haveTag}>✓ {name}</Text>)}{missing.map((name) => <Text key={name} style={styles.missingTag}>+ {name}</Text>)}</View>
    </View>
  </View>;
}

function TabButton({ icon, label, active, onPress }: { icon: string; label: string; active: boolean; onPress: () => void }) {
  return <Pressable style={styles.tabItem} onPress={onPress}><Text style={[styles.tabIcon, active && styles.tabActive]}>{icon}</Text><Text style={[styles.tabLabel, active && styles.tabActive]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  topbar: { height: 66, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: colors.ink, fontSize: 18, fontWeight: '800', letterSpacing: -0.5 }, topDate: { color: colors.muted, fontSize: 11, marginTop: 3 },
  avatar: { height: 40, width: 40, borderRadius: 20, backgroundColor: '#E8EDE4', alignItems: 'center', justifyContent: 'center' }, avatarText: { fontSize: 20 },
  content: { paddingHorizontal: 20, paddingTop: 12 },
  hero: { backgroundColor: '#E8EEE2', borderRadius: 22, minHeight: 190, padding: 20, flexDirection: 'row', overflow: 'hidden', alignItems: 'center' },
  heroCopy: { flex: 1, zIndex: 1 }, eyebrow: { color: colors.green, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 }, heroTitle: { color: colors.ink, fontSize: 23, lineHeight: 31, fontWeight: '800', marginTop: 13, letterSpacing: -0.8 }, heroBody: { color: '#697567', fontSize: 11, marginTop: 10 },
  heroArt: { width: 78, height: 125, justifyContent: 'center', alignItems: 'center', marginLeft: -3 }, heroEmoji: { fontSize: 49, transform: [{ rotate: '-10deg' }] }, heroEgg: { fontSize: 35, marginTop: -28, marginLeft: 38, transform: [{ rotate: '10deg' }] }, heroCarrot: { fontSize: 30, marginTop: -10, marginLeft: 37, transform: [{ rotate: '14deg' }] },
  summaryRow: { flexDirection: 'row', gap: 10, marginTop: 13 }, summaryCard: { flex: 1, borderRadius: 16, padding: 15, backgroundColor: colors.white }, summaryAlert: { backgroundColor: '#FCF5EC' }, summaryNumber: { color: colors.green, fontSize: 22, fontWeight: '800' }, summaryLabel: { color: colors.muted, fontSize: 11, marginTop: 3 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 27, marginBottom: 12 }, sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 }, sectionAction: { color: colors.muted, fontSize: 10 },
  card: { paddingHorizontal: 14, borderRadius: 18, backgroundColor: colors.white }, ingredientRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 11 }, rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F1EB' }, ingredientEmoji: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#F5F5EF', alignItems: 'center', justifyContent: 'center' }, ingredientName: { color: colors.ink, fontSize: 13, fontWeight: '700' }, amount: { color: colors.muted, fontSize: 10, fontWeight: '400' }, dateText: { color: colors.muted, fontSize: 9, marginTop: 4 }, statusPill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20 }, statusText: { fontSize: 9, fontWeight: '700' },
  recipeCard: { backgroundColor: colors.white, borderRadius: 18, overflow: 'hidden', marginBottom: 11 }, recipeArt: { height: 106, backgroundColor: '#EEF0E7', justifyContent: 'center', alignItems: 'center' }, recipeInfo: { padding: 14 }, recipeTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, recipeTitle: { color: colors.ink, fontSize: 14, fontWeight: '800' }, bookmark: { color: colors.green, fontSize: 22 }, recipeDesc: { color: colors.muted, fontSize: 10, marginTop: 4 }, tagRow: { flexDirection: 'row', gap: 5, marginTop: 11, flexWrap: 'wrap' }, haveTag: { color: colors.green, backgroundColor: colors.pale, borderRadius: 9, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 5, fontSize: 9 }, missingTag: { color: '#8A8E85', backgroundColor: '#F2F2EE', borderRadius: 9, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 5, fontSize: 9 }, timeBadge: { position: 'absolute', right: 12, bottom: 10, backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 5 }, timeText: { color: colors.ink, fontSize: 9, fontWeight: '700' },
  cameraCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, marginTop: 15, borderRadius: 18, backgroundColor: '#E9EFE6' }, cameraIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }, cameraTitle: { color: colors.ink, fontSize: 12, fontWeight: '800' }, cameraDesc: { color: colors.muted, fontSize: 10, marginTop: 4 }, chevron: { color: colors.green, fontSize: 25 },
  tabbar: { height: 68, flexDirection: 'row', backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, justifyContent: 'space-around', alignItems: 'center', paddingBottom: 5 }, tabItem: { flex: 1, height: 60, alignItems: 'center', justifyContent: 'center', gap: 3 }, tabIcon: { color: '#A5AAA2', fontSize: 21 }, tabLabel: { color: '#A5AAA2', fontSize: 9, fontWeight: '600' }, tabActive: { color: colors.green, fontWeight: '800' },
  pageHeading: { marginTop: 12, marginBottom: 20 }, pageTitle: { color: colors.ink, fontSize: 26, fontWeight: '800', letterSpacing: -0.8 }, pageSubtitle: { color: colors.muted, fontSize: 12, marginTop: 6 }, addPhoto: { height: 58, borderWidth: 1, borderStyle: 'dashed', borderColor: '#B9C6B5', borderRadius: 15, backgroundColor: '#EFF3EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10, marginBottom: 8 }, addPhotoIcon: { color: colors.green, fontSize: 23 }, addPhotoText: { color: colors.green, fontSize: 12, fontWeight: '700', flex: 1 }, addPhotoArrow: { color: colors.green, fontSize: 22 }, previewImage: { width: '100%', height: 160, borderRadius: 16, marginBottom: 12 }, formCard: { backgroundColor: colors.white, borderRadius: 18, padding: 16, marginBottom: 14 }, formTitle: { color: colors.ink, fontWeight: '800', fontSize: 14, marginBottom: 12 }, inputLabel: { fontSize: 10, color: colors.muted, marginBottom: 5, marginTop: 9 }, input: { height: 43, borderWidth: 1, borderColor: colors.line, borderRadius: 11, paddingHorizontal: 12, color: colors.ink, fontSize: 12 }, formHint: { color: colors.muted, fontSize: 9, marginTop: 9 }, primaryButton: { height: 44, borderRadius: 12, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', marginTop: 14 }, primaryButtonText: { color: colors.white, fontSize: 12, fontWeight: '800' }, disclaimer: { color: '#92978E', fontSize: 9, lineHeight: 15, marginTop: 12, paddingHorizontal: 2 },
  filterPill: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.pale, alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 20, marginBottom: 14 }, filterDot: { color: colors.green, fontSize: 8 }, filterText: { color: colors.green, fontSize: 10, fontWeight: '700' }, recipeLarge: { marginBottom: 13 }, empty: { minHeight: 190, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.white, borderRadius: 18 }, emptyTitle: { color: colors.muted, fontSize: 12 }, linkText: { color: colors.green, fontSize: 11, fontWeight: '700' },
});
