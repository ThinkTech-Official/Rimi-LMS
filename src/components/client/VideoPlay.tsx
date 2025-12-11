import { useParams } from "react-router-dom";
import { useFetchCourseClient } from "../../hooks/useFetchCourseClient";
import Spinner from "../loaders/Spinner";
import { API_BASE } from "../../utils/ulrs";
import { useTranslation } from "react-i18next";

import { useRef, useState, useEffect } from "react";
import { MdFullscreen } from "react-icons/md";
import { BiExitFullscreen } from "react-icons/bi";

const VideoPlay = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { course, loading, error } = useFetchCourseClient(id!);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle fullscreen toggle state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle fullscreen on 'f' key
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (loading)
    return (
      <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center bg-black text-white">
        <Spinner className="w-10 h-10 border-white" />
        <p>{t("Loading Video...")}</p>
      </div>
    );

  if (error)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <p>Error: {error}</p>
      </div>
    );

  if (!course) return null;

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center overflow-hidden">
      <div className="bg-black overflow-hidden relative max-w-[1100px] 2xl:max-w-[1200px] w-full shadow-2xl">
        <div
          className="relative w-full aspect-video overflow-hidden group"
          ref={containerRef}
        >
          <video
            controls
            autoPlay
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            src={`${API_BASE}/files/public/video/course/${course.id}`}
            poster={
              course.thumbnail
                ? `${API_BASE}/files/thumbnail/course/${course.id}`
                : undefined
            }
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>

          {/* Custom Fullscreen Button Overlay */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-opacity duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <BiExitFullscreen className="w-6 h-6" />
            ) : (
              <MdFullscreen className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlay;
