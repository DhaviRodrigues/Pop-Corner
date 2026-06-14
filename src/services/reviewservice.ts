import { db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { creditarPipokasService } from "./pipokaService";

interface ReviewInput {
  collectionName: 'filmes' | 'cinemas';
  itemId: string;
  currentUserUid: string;
  userName: string;
  userPic: string;
  userRating: number;
  myReview: string;
  currentComments: any[];
  hasReviewed: boolean;
  pipokaAmount: number;
  itemTitle: string;
}

export const submitReviewService = async ({
  collectionName,
  itemId,
  currentUserUid,
  userName,
  userPic,
  userRating,
  myReview,
  currentComments = [],
  hasReviewed,
  pipokaAmount,
  itemTitle
}: ReviewInput) => {
  let updatedComments = [];
  let pipokaMessage = "";

  if (hasReviewed) {
    updatedComments = currentComments.map((c: any) =>
      c.uid === currentUserUid
        ? { ...c, rating: userRating, comment: myReview.trim(), updatedAt: new Date().toISOString() }
        : c
    );
    pipokaMessage = "Sua avaliação foi atualizada com sucesso!";
  } else {

    const resultadoPipoka = await creditarPipokasService(
      currentUserUid,
      pipokaAmount,
      `Avaliação do ${collectionName === 'filmes' ? 'filme' : 'cinema'} ${itemTitle}`,
      itemId
    );

    if (!resultadoPipoka.valid) {
      pipokaMessage = `Avaliação enviada! (Você já havia recebido Pipokas por este ${collectionName === 'filmes' ? 'item' : 'cinema'} antes).`;
    } else {
      pipokaMessage = `Sua avaliação foi enviada e você ganhou ${pipokaAmount} Pipokas!`;
    }

    const newComment = {
      id: Date.now().toString(),
      uid: currentUserUid,
      user: userName,
      profilePic: userPic,
      rating: userRating,
      comment: myReview.trim(),
      createdAt: new Date().toISOString()
    };

    updatedComments = [newComment, ...currentComments];
  }

  const totalRating = updatedComments.reduce((acc: number, curr: any) => acc + curr.rating, 0);
  const newAverage = updatedComments.length > 0 ? totalRating / updatedComments.length : 0;

  const updateData: any = { comentarios: updatedComments };
  if (collectionName === 'filmes') {
    updateData.rating = newAverage;
    updateData.ratingCount = updatedComments.length;
  } else {
    updateData.avaliacao = newAverage;
  }

  const docRef = doc(db, collectionName, itemId);
  await updateDoc(docRef, updateData);

  return {
    updatedComments,
    newAverage,
    pipokaMessage
  };
};

export const deleteReviewService = async (
  collectionName: 'filmes' | 'cinemas',
  itemId: string,
  currentUserUid: string,
  currentComments: any[]
) => {
  const updatedComments = currentComments.filter((c: any) => c.uid !== currentUserUid);

  const totalRating = updatedComments.reduce((acc: number, curr: any) => acc + curr.rating, 0);
  const newAverage = updatedComments.length > 0 ? totalRating / updatedComments.length : 0;

  const updateData: any = { comentarios: updatedComments };
  if (collectionName === 'filmes') {
    updateData.rating = newAverage;
    updateData.ratingCount = updatedComments.length;
  } else {
    updateData.avaliacao = newAverage;
  }

  const docRef = doc(db, collectionName, itemId);
  await updateDoc(docRef, updateData);

  return {
    updatedComments,
    newAverage
  };
};