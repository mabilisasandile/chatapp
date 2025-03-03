import React, { useState, useEffect } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import uploadImageToCloudinary from "../../lib/upload";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const ProfileUpdate = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uid, setUid] = useState("");
  const [prevImageUrl, setPrevImageUrl] = useState("");
  const navigate = useNavigate();


  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image first!");
      return;
    }

    try {
      const cloudName = "dccsxcslg"; // Cloudinary cloud name
      const uploadPreset = "my_upload_preset"; // Cloudinary upload preset

      // Call the upload function
      const url = await uploadImageToCloudinary(image, cloudName, uploadPreset);

      // Set the image URL returned by Cloudinary
      setImageUrl(url);
      return url; // Return the URL
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
      throw error; // Re-throw the error to handle it in profileUpdate
    }
  };


  const profileUpdate = async (e) => {
    e.preventDefault();

    try {
      if (!prevImageUrl && !image) {
        toast.error("Upload profile image first");
        return; // Add return to stop further execution
      }

      const docRef = doc(db, "users", uid);
      let updatedImageUrl = prevImageUrl;

      if (image) {
        updatedImageUrl = await handleUpload(); // Wait for handleUpload to complete
      }

      await updateDoc(docRef, {
        avatar: updatedImageUrl,
        name: name,
        bio: bio,
      });

      toast.success("Profile updated successfully!");
      navigate('/chat')
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile.");
    }
  };


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef).then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setName(data.name);
            setBio(data.bio);
            setPrevImageUrl(data.avatar);
          }
        });
      } else {
        navigate("/");
      }
    });
  }, [navigate]);


  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avator">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avator"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avator_icon}
              alt=""
            />
            Upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className="profile-pic"
          src={image ? URL.createObjectURL(image) : prevImageUrl ? prevImageUrl : assets.logo}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;