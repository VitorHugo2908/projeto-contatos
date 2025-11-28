import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface Contact {
  id?: string;
  name: string;
  email: string;
}

const contactsCollection = collection(db, "contacts");

export const contactService = {
  // Buscar todos os contatos
  async getAll(): Promise<Contact[]> {
    const snapshot = await getDocs(contactsCollection);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Contact)
    );
  },

  // Adicionar contato
  async add(contact: Omit<Contact, "id">): Promise<string> {
    const docRef = await addDoc(contactsCollection, contact);
    return docRef.id;
  },

  // Atualizar contato
  async update(id: string, contact: Omit<Contact, "id">): Promise<void> {
    const contactDoc = doc(db, "contacts", id);
    await updateDoc(contactDoc, contact);
  },

  // Deletar contato
  async delete(id: string): Promise<void> {
    const contactDoc = doc(db, "contacts", id);
    await deleteDoc(contactDoc);
  },
};
