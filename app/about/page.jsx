import AudioPlayer from "../components/AudioPlayer";
import CDcover from "@/public/cover.jpg";

function AboutPage() {
  return (
    <main className="w-full bg-black">
      <AudioPlayer
        textsPrimary={[
          "For the love of good old days",
          "We'll take you on a journey to the past",
        ]}
        textSecondary="Put your headphones on"
        coverImage={CDcover}
      />
    </main>
  );
}

export default AboutPage;
