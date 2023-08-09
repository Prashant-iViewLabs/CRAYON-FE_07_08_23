import { useState } from "react";
import MyJobCardFront from "./MyJobCardFront";
import MyJobCardBack from "./MyJobCardBack";

import ReactCardFlip from "react-card-flip";

export default function JobCard({ index, job, getJobs }) {
  const [isHorizontalFlipped, setisHorizontalFlipped] = useState(false);

  return (
    <ReactCardFlip
      isFlipped={isHorizontalFlipped}
      flipDirection={"horizontal"}
      flipSpeedBackToFront="0.5"
      flipSpeedFrontToBack="0.5"
    >
      <MyJobCardFront
        index={index}
        job={job}
        getJobs={getJobs}
        setisFlipped={setisHorizontalFlipped}
      />
      <MyJobCardBack
        index={index}
        job={job}
        getJobs={getJobs}
        setisFlipped={setisHorizontalFlipped}
      />
    </ReactCardFlip>
  );
}
