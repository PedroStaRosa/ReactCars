import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseconnection";
import { UserType } from "@/types/User";
import { toast } from "react-toastify";
import { UserCredentialsType } from "@/types/UserCredentials";

export const fecthUserService = async (user: User) => {
  try {
    const docRef = doc(db, "users", user?.uid);
    const docSnap = await getDoc(docRef);

    const userProfile: UserType = {
      uid: user.uid,
      name: user.displayName!,
      email: user.email!,
      phone: docSnap.data()?.phone || "",
      state: docSnap.data()?.state || "",
      city: docSnap.data()?.city || "",
    };

    return userProfile;
  } catch (error) {
    //   console.log(error);
    toast("Houve um erro, tente novamente mais tarde.");
    return null;
  }
};

export const LoginUserService = async (
  userData: UserCredentialsType
): Promise<string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    return `Bem-vindo, ${userCredential.user.displayName}`;
  } catch (error) {
    const errorCode = (error as { code?: string }).code;
    const errorMessage = (error as { message?: string }).message;

    console.log(`${errorCode} : ${errorMessage}`);

    if (errorCode === "auth/invalid-credential") {
      return "auth/invalid-credential";
    } else {
      return "Houve um erro, tente novamente mais tarde!";
    }
  }
};

export const createUserService = async (
  userData: UserCredentialsType
): Promise<string> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;
    const userRef = doc(db, "users", user.uid);

    const newUser = {
      name: userData.name,
      phone: "",
      city: "",
      state: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(userRef, newUser);

    await updateProfile(user, {
      displayName: userData.name,
    });

    // MOSTRAR EM UM TOASTER
    await signOut(auth);
    return "Usuário cadastrado com sucesso!";
  } catch (error) {
    // FILTRAR E MOSTRAR ERRO GENERICO EM TOASTER
    const errorCode = (error as { code?: string }).code;
    if (errorCode === "auth/email-already-in-use") {
      return "auth/email-already-in-use";
    } else {
      return "Houve um erro, tente novamente mais tarde!";
    }
  }
};

export const updateUserService = async (user: UserType) => {
  try {
    const userRef = doc(db, "users", user.uid);
    /* ANTES DE ENVIAR TRATAR PARA RETIRAR OS () DO PHONE */
    await updateDoc(userRef, {
      city: user.city,
      phone: user.phone.replace(/[^\d]/g, ""),
      state: user.state,
    });

    return user;
  } catch (error) {
    return null;
  }
};
