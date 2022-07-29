import React from "react";
import { TwitterPicker } from "react-color";

const getSelectedImage = (canvas, begin, end) => {
  const ctx = canvas.getContext("2d");
  const newCanvas = document.createElement("canvas");

  const width = Math.abs(end.x - begin.x);
  const height = Math.abs(end.y - begin.y);
  newCanvas.style.setProperty("border", "1px solid red");
  newCanvas.width = width;
  newCanvas.height = height;

  const newContext = newCanvas.getContext("2d");
  const pixels = ctx.getImageData(
    Math.min(begin.x, end.x),
    Math.min(begin.y, end.y),
    canvas.width,
    canvas.height
  );
  newContext.putImageData(pixels, 0, 0, 0, 0, width, height);
  return newCanvas.toDataURL();
};

const fillWithColor = (canvas, color, begin, end) => {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.save();
  ctx.beginPath();

  const points = [
    { x: begin.x, y: begin.y },
    { x: end.x, y: begin.y },
    { x: end.x, y: end.y },
    { x: begin.x, y: end.y },
  ];

  points.forEach((element) => {
    ctx.lineTo(element.x, element.y);
  });

  ctx.closePath();
  ctx.clip();
  ctx.fill();
  ctx.restore();
};

const addImageToCanvas = (canvas, imageSrc, begin, end) => {
  const ctx = canvas.getContext("2d");
  const imageElement = document.createElement("img");
  imageElement.src = imageSrc;

  const width = Math.abs(end.x - begin.x);
  const height = Math.abs(end.y - begin.y);

  console.log("begin, end", begin, end);
  ctx.drawImage(
    imageElement,
    Math.min(begin.x, end.x),
    Math.min(begin.x, end.x),
    width,
    height
  );
};

export const SelectController = ({ width, height, imageElement, onChange }) => {
  const previewCanvasRef = React.useRef();
  const [begin, setBegin1] = React.useState();
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [end, setEnd] = React.useState();
  const [selectedImage, setSelectedImage] = React.useState("");

  const setBegin = (beg) => {
    console.trace(beg);
    setBegin1(beg);
  };
  const getMousePosition = (event) => {
    const rect = previewCanvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const onMouseDown = (event) => {
    if (selectedImage) {
      console.log("begin", begin);
      addImageToCanvas(previewCanvasRef.current, selectedImage, begin, end);
      setSelectedImage(undefined);
    }
    setBegin(getMousePosition(event));
    setEnd();
  };
  const onMouseMove = (event) => {
    setMousePosition(getMousePosition(event));
  };
  const onMouseUp = (event) => {
    setEnd(getMousePosition(event));
  };
  React.useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }
  }, [width, height]);

  React.useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (imageElement) {
        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [imageElement]);

  // DRAG PART
  const [dragPosition, setDragPosition] = React.useState();
  const onDragStart = (event) => {
    event.preventDefault();
    setDragPosition(getMousePosition(event));
    if (!selectedImage) {
      setSelectedImage(getSelectedImage(previewCanvasRef.current, begin, end));
      fillWithColor(previewCanvasRef.current, "#FFF", begin, end);
    }
  };

  const onDragMove = (event) => {
    event.preventDefault();
    if (dragPosition) {
      const point = getMousePosition(event);
      const shift = {
        x: point.x - dragPosition.x,
        y: point.y - dragPosition.y,
      };

      console.log(shift);
      setBegin({ x: begin.x + shift.x, y: begin.y + shift.y });
      setEnd({ x: end.x + shift.x, y: end.y + shift.y });
      setDragPosition(point);
    }
  };

  const onDragEnd = (event) => {
    event.preventDefault();
    setDragPosition(undefined);
  };

  const onColorChange = ({ hex }) => {
    if (begin && end) {
      fillWithColor(previewCanvasRef.current, hex, begin, end);
      setSelectedImage(undefined);
    }
  };

  return (
    <>
      <div className="selectControl_root">
        <div
          className="selectControl_area"
          style={
            end
              ? {
                  top: Math.min(begin.y, end.y),
                  left: Math.min(begin.x, end.x),
                  width: Math.max(begin.x, end.x) - Math.min(begin.x, end.x),
                  height: Math.max(begin.y, end.y) - Math.min(begin.y, end.y),
                  backgroundImage: `url(${selectedImage})`,
                }
              : begin
              ? {
                  top: Math.min(begin?.y, mousePosition.y),
                  left: Math.min(begin?.x, mousePosition.x),
                  width:
                    Math.max(begin?.x, mousePosition.x) -
                    Math.min(begin?.x, mousePosition.x),
                  height:
                    Math.max(begin?.y, mousePosition.y) -
                    Math.min(begin?.y, mousePosition.y),
                  pointerEvents: "none",
                }
              : {
                  pointerEvents: "none",
                }
          }
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
        ></div>
        <canvas
          ref={previewCanvasRef}
          style={{
            border: "1px solid black",
            objectFit: "contain",
            width: width,
            height: height,
          }}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />

      </div>
      <TwitterPicker onChange={onColorChange} />
    </>
  );
};
