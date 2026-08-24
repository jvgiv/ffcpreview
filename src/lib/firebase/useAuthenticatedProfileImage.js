"use client";

import { useEffect, useState } from "react";

export function useAuthenticatedProfileImage(authUser, profile) {
  const [imageUrl, setImageUrl] = useState("");
  const hasProfileImage = profile?.hasProfileImage === true;
  const profileImageVersion = profile?.profileImageVersion || "";

  useEffect(() => {
    let isActive = true;
    let objectUrl = "";

    setImageUrl("");

    if (!authUser || !hasProfileImage) {
      return () => {
        isActive = false;
      };
    }

    async function loadProfileImage() {
      try {
        const idToken = await authUser.getIdToken();
        const response = await fetch("/api/account", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Profile image request failed with status ${response.status}.`);
        }

        const imageBlob = await response.blob();

        if (!imageBlob.type.startsWith("image/")) {
          throw new Error("Profile image response was not an image.");
        }

        objectUrl = URL.createObjectURL(imageBlob);

        if (isActive) {
          setImageUrl(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
          objectUrl = "";
        }
      } catch (error) {
        if (isActive) {
          console.error("Unable to load the authenticated profile image", error);
        }
      }
    }

    loadProfileImage();

    return () => {
      isActive = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [authUser, hasProfileImage, profileImageVersion]);

  return imageUrl;
}
