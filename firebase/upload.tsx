import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase/config"; // Ensure that storage is correctly initialized from your Firebase config

export default function uploadFile(file: any) {
  const date = new Date();
  const storageRef = ref(storage, `images/${date.getTime()}_${file.name}`); // Added underscore for better filename readability
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // You can add progress handling here if needed
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle any errors
        reject(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            reject(error); // Catch any errors in fetching the download URL
          });
      }
    );
  });
}
