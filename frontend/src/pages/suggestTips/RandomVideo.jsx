// import React from 'react';

// const RandomVideo = ({ title, videoList, subTitle }) => {
//   // Kiểm tra videoList không rỗng và lấy video ngẫu nhiên
//   const randomIndex = videoList && videoList.length > 0 ? Math.floor(Math.random() * videoList.length) : -1;
//   const selectedVideo = randomIndex !== -1 ? videoList[randomIndex] : null;

//   // Nếu không có video nào được chọn, hiển thị thông báo lỗi
//   if (!selectedVideo) {
//     return (
//       <section className="random-video">
//         <h2>{title}</h2>
//         <h3>{subTitle} <strong>No video available</strong></h3>
//       </section>
//     );
//   }

//   return (
//     <section className="random-video">
//       <h3>{subTitle} <strong>{selectedVideo.title}</strong></h3>
//       <div>
//         <iframe
//           width="560"
//           height="315"
//           src={`https://www.youtube.com/embed/${selectedVideo.id}`}

//           title={selectedVideo.title}
//           frameBorder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//         ></iframe>

//       </div>
//     </section>
//   );
// }

// export default RandomVideo;
import React from "react";

const RandomVideo = ({ title, videoList, subTitle, usedIndexes }) => {
  // Find a unique random index
  let randomIndex = -1;
  do {
    randomIndex =
      videoList && videoList.length > 0
        ? Math.floor(Math.random() * videoList.length)
        : -1;
  } while (usedIndexes.includes(randomIndex) && usedIndexes.length < videoList.length);

  // Add the selected index to the usedIndexes array
  if (randomIndex !== -1) {
    usedIndexes.push(randomIndex);
  }

  const selectedVideo =
    randomIndex !== -1 ? videoList[randomIndex] : null;

  // If no video is selected, display an error message
  if (!selectedVideo) {
    return (
      <section className="random-video">
        <h2>{title}</h2>
        <h3>
          {subTitle} <strong>No video available</strong>
        </h3>
      </section>
    );
  }

  return (
    <section className="random-video">
      <h3>
        {subTitle} <strong>{selectedVideo.title}</strong>
      </h3>
      <div>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${selectedVideo.id}`}
          title={selectedVideo.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

export default RandomVideo;
