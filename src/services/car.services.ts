import { UserType } from "@/types/User";
import { db, storage } from "./firebaseconnection";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ImageType } from "@/types/Image";
import { v4 as uuidv4 } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { toast } from "react-toastify";
import { CarType } from "@/types/Car";
import { CarTypeCreate } from "@/types/CarCreate";
import { formatNumber } from "@/utils/utils";

interface FilterType {
  brand: string | null;
  armored: boolean | null;
  state: string | null;
  city: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export const getCars_Service = async (filter: FilterType) => {
  const conditions = [];
  try {
    const carRef = collection(db, "cars");
    conditions.push(where("sold", "==", false));
    conditions.push(where("isPaused", "==", false));

    if (filter.brand) {
      console.log(filter.brand);
      conditions.push(where("brand", "==", filter.brand.toUpperCase()));
    }
    if (filter.armored) {
      console.log(filter.armored);
      conditions.push(where("armored", "==", filter.armored));
    }
    if (filter.state) {
      console.log(filter.state);
      conditions.push(where("state", "==", filter.state.toUpperCase()));
    }
    if (filter.city) {
      console.log(filter.city);
      conditions.push(where("city", "==", filter.city));
    }
    if (filter.minPrice) {
      console.log(filter.minPrice);
      conditions.push(where("price", ">=", filter.minPrice));
    }
    if (filter.maxPrice) {
      console.log(filter.maxPrice);
      conditions.push(where("price", "<=", filter.maxPrice));
    }

    const queryRef = query(carRef, ...conditions, orderBy("created", "desc"));

    const snapshot = await getDocs(queryRef);
    const carList: CarType[] = [];

    snapshot.docs.forEach((doc) => {
      carList.push({
        id: doc.id,
        uid: doc.data().uid,
        city: doc.data().city,
        km: doc.data().km,
        model: doc.data().model,
        modelYear: doc.data().modelYear,
        name: doc.data().name,
        price: formatNumber(doc.data().price.toString()),
        images: doc.data().images,
        state: doc.data().state,
        armored: doc.data().armored,
        brand: doc.data().brand,
        color: doc.data().color,
        optional: doc.data().optional,
        sold: doc.data().sold,
        created: doc.data().created,
        owner: doc.data().owner,
        phone: doc.data().phone,
        isPaused: doc.data().isPaused || false,
      });
    });
    return carList;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const handleUpload = async (images: File[], currentUid: string) => {
  const uploadedImageUrls: ImageType[] = [];
  for (const image of images) {
    const uidImage = uuidv4();
    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);
    await uploadBytes(uploadRef, image).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const urlImage = {
          name: uidImage,
          uid: currentUid,
          url: downloadUrl,
        };

        uploadedImageUrls.push(urlImage);
      });
    });
  }
  return uploadedImageUrls;
};

export const create_new_offer = async (
  newCar: CarTypeCreate,
  imagesFile: File[],
  user: UserType
) => {
  try {
    // console.log(typeof newCar.price);
    // console.log(newCar.price);
    // const num = Number(newCar.price.toString().replace(/\./g, ""));
    // console.log(num);
    // console.log(typeof num);
    const uploadedPhotoUrls = await handleUpload(imagesFile, newCar.uid);
    await addDoc(collection(db, "cars"), {
      model: newCar.model.toUpperCase(),
      brand: newCar.brand.toUpperCase(),
      // price: newCar.price,
      price: Number(newCar.price.toString().replace(/\./g, "")),
      modelYear: newCar.modelYear.toUpperCase(),
      color: newCar.color,
      km: newCar.km,
      armored: newCar.armored,
      description: newCar.description,
      created: new Date(),
      owner: newCar.owner,
      uid: newCar.uid,
      images: uploadedPhotoUrls,
      optional: newCar.optional,
      phone: user.phone,
      state: user.state,
      city: user.city,
      sold: false,
      isPaused: false,
    });

    toast.success("Veículo cadastrado com sucesso!!");
  } catch (error) {
    toast.error("Houve um erro, tente novamente mais tarde.");
    console.error("Ocorreu um erro ao inserir os dados do veículo:", error);
  }
};
export const fetchMyCarsService = async (userId: string) => {
  try {
    const carRef = collection(db, "cars");
    const queryRef = query(carRef, where("uid", "==", userId));
    const snapshot = await getDocs(queryRef);
    const carList: CarType[] = [];
    snapshot.docs.forEach((doc) =>
      carList.push({
        id: doc.id,
        uid: doc.data().uid,
        city: doc.data().city,
        km: doc.data().km,
        model: doc.data().model,
        modelYear: doc.data().modelYear,
        name: doc.data().name,
        price: doc.data().price,
        images: doc.data().images,
        state: doc.data().state,
        armored: doc.data().armored,
        brand: doc.data().brand,
        sold: doc.data().sold,
        color: doc.data().color,
        description: doc.data().description,
        optional: doc.data().optional,
        created: doc.data().created,
        owner: doc.data().owner,
        phone: doc.data().userPhone,
        isPaused: doc.data().isPaused || false,
      })
    );

    return carList;
  } catch (error) {
    return [];
  }
};

export const getCarOverviewService = async (id: string) => {
  if (!id) {
    return;
  }
  try {
    const docRef = doc(db, "cars", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.data()) {
      return null;
    }

    const CarOverview: CarType = {
      id: docSnap.id,
      uid: docSnap.data()?.uid,
      model: docSnap.data()?.model,
      brand: docSnap.data()?.brand,
      price: formatNumber(docSnap.data()?.price.toString()),
      modelYear: docSnap.data()?.modelYear,
      color: docSnap.data()?.color,
      km: docSnap.data()?.km,
      armored: docSnap.data()?.armored,
      description: docSnap.data()?.description,
      owner: docSnap.data()?.owner,
      images: docSnap.data()?.images,
      optional: docSnap.data()?.optional,
      phone: docSnap.data()?.phone,
      state: docSnap.data()?.state,
      city: docSnap.data()?.city,
      sold: docSnap.data()?.sold,
      created: docSnap.data()?.created,
      isPaused: docSnap.data()?.isPaused,
    };
    return CarOverview;
    /* const { months, days } = calculateDifference(targetDate); */
  } catch (error) {
    console.log(error);
  }
};

export const updateCarSellingService = async (CarId: string) => {
  if (!CarId) {
    return;
  }
  try {
    const carRef = doc(db, "cars", CarId);

    const carSold = await updateDoc(carRef, {
      sold: true,
    });

    return carSold;
  } catch (error) {
    return null;
  }
};

export const updatePausedOrReactivateAdService = async (car: CarType) => {
  if (!car) {
    return;
  }
  try {
    const carRef = doc(db, "cars", car.id);
    const carSold = await updateDoc(carRef, {
      isPaused: !car.isPaused,
    });
    return carSold;
  } catch (error) {
    return null;
  }
};

export const deleteCarService = async (car: CarType) => {
  if (!car) {
    return;
  }
  try {
    const docRef = doc(db, "cars", car.id);
    await deleteDoc(docRef);

    car.images!.map(async (image) => {
      const imagePath = `images/${car.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    });
    return true;
  } catch (error) {
    return null;
  }
};
