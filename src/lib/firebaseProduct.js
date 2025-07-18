import { db, storage, auth } from "./firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, Timestamp, getCountFromServer } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function checkAuthOrRedirect() {
  if (!auth.currentUser) {
    if (typeof window !== "undefined") {
      window.alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      window.location.href = "/dashboard-hwd/login";
    }
    throw new Error("로그인 필요");
  }
}

// 사진 파일을 Storage에 업로드하고 URL 반환
export async function uploadProductImage(file, productId, idx) {
  checkAuthOrRedirect();
  const storageRef = ref(storage, `products/${productId}/${Date.now()}_${idx}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// 상품 생성
export async function createProduct(product) {
  checkAuthOrRedirect();
  const docRef = await addDoc(collection(db, "products"), { temp: true });
  const productId = docRef.id;

  const photosWithUrls = await Promise.all(
    product.photos.map(async (p, idx) => {
      if (p.file) {
        const url = await uploadProductImage(p.file, productId, idx);
        return {
          colorName: p.colorName,
          colorValue: p.colorValue,
          fileUrl: url,
          isThumbnail: !!p.isThumbnail,
        };
      } else {
        return {
          colorName: p.colorName,
          colorValue: p.colorValue,
          fileUrl: p.fileUrl,
          isThumbnail: !!p.isThumbnail,
        };
      }
    })
  );

  // 쇼핑몰 상세페이지 이미지 업로드
  const detailImagesWithUrls = await Promise.all(
    (product.detailImages || []).map(async (img, idx) => {
      if (img.file) {
        const url = await uploadProductImage(img.file, productId, `detail_${idx}`);
        return { url };
      } else {
        return { url: img.url };
      }
    })
  );

  const now = Timestamp.now();
  const cleanData = {
    name: product.name,
    price: Number(product.price),
    sizes: product.sizes,
    description: product.description,
    idusUrl: product.idusUrl,
    photos: photosWithUrls,
    detailImages: detailImagesWithUrls.map(img => img.url),
    createdAt: now,
    updatedAt: now,
  };
  await updateDoc(docRef, cleanData);
  return productId;
}

// 상품 목록 조회 (페이지네이션)
export async function fetchProducts({ pageSize = 10, lastDoc = null }) {
  let q = query(collection(db, "products"), orderBy("updatedAt", "desc"), limit(pageSize));
  if (lastDoc) q = query(q, startAfter(lastDoc));
  const snap = await getDocs(q);
  const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return { products, lastDoc: snap.docs[snap.docs.length - 1] };
}

// 상품 상세 조회
export async function fetchProductById(id) {
  const docRef = doc(db, "products", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id, ...snap.data() };
}

// 상품 수정
export async function updateProduct(id, product) {
  checkAuthOrRedirect();
  const docRef = doc(db, "products", id);
  const photosWithUrls = await Promise.all(
    product.photos.map(async (p, idx) => {
      if (p.file) {
        const url = await uploadProductImage(p.file, id, idx);
        return {
          colorName: p.colorName,
          colorValue: p.colorValue,
          fileUrl: url,
          isThumbnail: !!p.isThumbnail,
        };
      } else {
        return {
          colorName: p.colorName,
          colorValue: p.colorValue,
          fileUrl: p.fileUrl,
          isThumbnail: !!p.isThumbnail,
        };
      }
    })
  );

  // 쇼핑몰 상세페이지 이미지 업로드
  const detailImagesWithUrls = await Promise.all(
    (product.detailImages || []).map(async (img, idx) => {
      if (img.file) {
        const url = await uploadProductImage(img.file, id, `detail_${idx}`);
        return { url };
      } else {
        return { url: img.url };
      }
    })
  );

  const cleanData = {
    name: product.name,
    price: Number(product.price),
    sizes: product.sizes,
    description: product.description,
    idusUrl: product.idusUrl,
    photos: photosWithUrls,
    detailImages: detailImagesWithUrls.map(img => img.url),
    updatedAt: Timestamp.now(),
  };
  await updateDoc(docRef, cleanData);
}

// 상품 삭제
export async function deleteProduct(id) {
  checkAuthOrRedirect();
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
}

// 상품 총 개수 조회
export async function fetchProductsCount() {
  const q = query(collection(db, "products"));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
} 