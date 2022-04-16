import Room, { roomConverter } from "@/models/room";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";

const firestore = getFirestore();

export const getAllRooms = async (): Promise<Room[]> => {
  const rooms = await getDocs(
    collection(firestore, "rooms").withConverter(roomConverter)
  );

  const roomsArr = rooms.docs.map((room) => room.data());

  return roomsArr;
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
  const room = await getDoc(
    doc(firestore, "rooms", id).withConverter(roomConverter)
  );

  return room.data();
};
