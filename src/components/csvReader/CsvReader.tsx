import _, { chunk } from "lodash";
import { useCSVReader, formatFileSize } from "react-papaparse";

import { subtractArrays } from "../../commons/libraries/array";
import * as S from "../units/fft/Fft.styles";
import { useState } from "react";

export default function CsvReader({ handleResults }) {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    S.DEFAULT_REMOVE_HOVER_COLOR
  );

  return (
    <>
      <CSVReader
        config={{
          header: false,
          newline: "\n",
          fastMode: true,
          dynamicTyping: true,
          delimitersToGuess: [", ", ",", "	", "|", ";"],
          // prettier-ignore
          columns: ["TimeStamp(ms)", "index", "UPS", "TimeStamp(ms)", "index", "DNS"],
        }}
        onUploadAccepted={(results: any) => {
          console.time("==== onUploadAccepted ====");
          handleResults(results.data);

          setZoneHover(false);
          console.timeEnd("==== onUploadAccepted ====");
        }}
        onDragOver={(event: any) => {
          event.preventDefault();
          setZoneHover(true);
        }}
        onDragLeave={(event: any) => {
          event.preventDefault();
          setZoneHover(false);
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
          Remove,
        }: any) => (
          <>
            <div
              {...getRootProps()}
              style={Object.assign(
                {},
                S.styles.zone,
                zoneHover && S.styles.zoneHover
              )}
            >
              {acceptedFile ? (
                <>
                  {/* <div style={styles.file}>
                      <div style={styles.info}> */}
                  <div>
                    <div>
                      <span style={S.styles.size}>
                        {formatFileSize(acceptedFile.size)}
                      </span>
                      <span style={S.styles.name}>{acceptedFile.name}</span>
                    </div>
                    {/* <div style={styles.progressBar}> */}
                    <div>
                      <ProgressBar />
                    </div>
                    <div
                      {...getRemoveFileProps()}
                      style={S.styles.remove}
                      onMouseOver={(event) => {
                        event.preventDefault();
                        setRemoveHoverColor(S.REMOVE_HOVER_COLOR_LIGHT);
                      }}
                      onMouseOut={(event) => {
                        event.preventDefault();
                        setRemoveHoverColor(S.DEFAULT_REMOVE_HOVER_COLOR);
                      }}
                    >
                      <Remove color={removeHoverColor} />
                    </div>
                  </div>
                </>
              ) : (
                "Drop CSV file here or click to upload"
              )}
            </div>
          </>
        )}
      </CSVReader>
    </>
  );
}
