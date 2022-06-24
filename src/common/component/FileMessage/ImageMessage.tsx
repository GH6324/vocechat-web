import { useState, useEffect, FC } from "react";
import styled from "styled-components";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getDefaultSize } from "../../utils";

const Styled = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
  > img {
    max-width: 480px;
    cursor: zoom-in;
    object-fit: cover;
  }
  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    .progress {
      width: 15px;
      height: 15px;
      .CircularProgressbar-path {
        stroke: #444;
      }
    }
  }
`;

interface Props {
  uploading: boolean;
  progress: number;
  thumbnail: string;
  download: string;
  content: string;
  properties: { width: number; height: number };
}

const ImageMessage: FC<Props> = ({
  uploading,
  progress,
  thumbnail,
  download,
  content,
  properties
}) => {
  const [url, setUrl] = useState(thumbnail);
  const { width = 0, height = 0 } = getDefaultSize(properties);
  useEffect(() => {
    const newUrl = thumbnail;
    const img = new Image();
    img.onload = () => {
      setUrl(newUrl);
    };
    img.onerror = () => {
      setUrl("");
    };
    img.src = newUrl;
  }, [thumbnail]);

  return (
    <Styled>
      {uploading && (
        <div className="overlay">
          <div className="progress">
            <CircularProgressbar
              value={progress}
              strokeWidth={50}
              styles={buildStyles({ strokeLinecap: "butt" })}
            />
          </div>
        </div>
      )}
      <img
        className="img preview"
        style={{
          width: width ? `${width}px` : "",
          height: height ? `${height}px` : ""
        }}
        data-meta={JSON.stringify(properties)}
        data-origin={content}
        data-download={download}
        src={url}
      />
    </Styled>
  );
};

export default ImageMessage;
