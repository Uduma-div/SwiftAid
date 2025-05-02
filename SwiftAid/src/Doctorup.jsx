import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import doctorsData from './doctors.json'; 

const uploadDoctorsToFirestore = async () => {
  try {
    const doctorsCollection = collection(db, "doctors");
    
    doctorsData.forEach(async (doctor) => {
      await addDoc(doctorsCollection, doctor);
    });

    console.log("Doctors added to Firestore successfully.");
  } catch (error) {
    console.error("Error uploading doctors to Firestore:", error);
  }
};

uploadDoctorsToFirestore();