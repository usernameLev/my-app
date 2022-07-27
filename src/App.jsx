import React from "react";
import "./App.css";
import { FileInput } from "./components/FileInput";
import { SelectController } from "./components/SelectController";

function App() {
  const [image, setImage] = React.useState({
    src: "",
    width: 500,
    height: 500,
  });

  return (
    <div className="App">
      <FileInput onImageChange={setImage} />
      <div>
        <SelectController
          width={image.width}
          height={image.height}
          imageElement={image.imageElement}
        />
      </div>
    </div>
  );
}

export default App;
