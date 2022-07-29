import React from "react";

export const FileInput = ({ onImageChange }) => {
  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener("load", () => {
        const img = document.createElement("img");
        img.style.setProperty("position", "fixed");
        img.style.setProperty("left", "-100%");
        img.style.setProperty("top", "-100%");
        img.onload = function () {
          onImageChange({
            src: reader.result,
            width: img.clientWidth,
            height: img.clientHeight,
            imageElement: img,
          });
        };
        document.body.append(img);
        img.setAttribute("src", reader.result);
      });
    }
  };

  return <input type="file" accept="image/*" onChange={onSelectFile} className="file" />;
};
