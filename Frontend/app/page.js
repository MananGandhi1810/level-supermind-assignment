import Image from "next/image";
import FUITestimonialWithGrid from "./components/testimonial";
import clsx from "clsx";
export function BentoCard({
  className = "",
  eyebrow,
  title,
  description,
  graphic,
  fade = [],
}) {
  return (
    <div
      className={clsx(
        className,
        "group relative flex flex-col overflow-hidden rounded-lg",
        "bg-transparent transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]   shadow-sm ring-1 ring-black/5",
        "data-[dark]:bg-gray-800 data-[dark]:ring-white/15"
      )}
    >
      <div className="relative h-[14rem] shrink-0">
        {graphic}
        {fade.includes("top") && (
          <div className="absolute inset-0 bg-gradient-to-b from-white to-50%  opacity-25" />
        )}
        {fade.includes("bottom") && (
          <div className="absolute inset-0 bg-gradient-to-t from-white to-50% opacity-25" />
        )}
      </div>
      <div className="relative p-10  z-20 isolate mt-[-110px] h-[14rem] backdrop-blur-xl group-hover:backdrop-blur-lg transition-all duration-300">
        <h1>{eyebrow}</h1>
        <p className="mt-1 text-2xl/8 font-medium tracking-tight text-gray-100 group-data-[dark]:text-white group-hover:underline transition-all duration-300">
          {title}
        </p>
        <p className="mt-2 max-w-[600px] text-sm/6 text-gray-300 group-data-[dark]:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-screen-xl z-10 mx-auto px-4 py-28 gap-12 text-gray-600 md:px-8">
      <div className="space-y-10 max-w-4xl leading-0  lg:leading-5 mx-auto text-center">
        <h2 className="text-4xl tracking-tighter  bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] text-transparent   mx-auto md:text-7xl">
          We'll help you analyze your Instagram Feed{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-orange-200">
            and help you grow your brand!
          </span>
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          We have analytics to show which type of post will get you the most
          engagement in general and for your account aswell!
        </p>
        <div className="items-center  justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
          <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950  text-xs font-medium text-gray-50 backdrop-blur-3xl">
              <a
                href="javascript:void(0)"
                className="inline-flex rounded-full text-center group items-center w-full justify-center   bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent    text-white border-input border-[1px] hover:bg-transparent/90 transition-colors sm:w-auto py-4 px-10"
              >
                See the results!
              </a>
            </div>
          </span>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2">
        <BentoCard
          eyebrow="Insight"
          title="Get perfect clarity"
          description="See which type of post will get you the most engagement on instagram along with a personalized chat bot to help you deeper analyze instagram algorithm."
          graphic={
            <div className="absolute inset-0 bg-[url(https://framerusercontent.com/images/ghyfFEStl6BNusZl0ZQd5r7JpM.png)] object-fill" />
          }
          className="max-lg:rounded-t-4xl lg:rounded-tl-4xl"
        />
        <BentoCard
          eyebrow="Deeper Analysis"
          title="Undercut your competitors"
          description="We will analyze your Instagram feed and provide you with the insights you need to grow your brand!"
          graphic={
            <div className="absolute inset-0 bg-[url(https://framerusercontent.com/images/7CJtT0Pu3w1vNADktNltoMFC9J4.png)] object-fill" />
          }
          className="lg:rounded-tr-4xl"
        />
      </div>
    </div>
  );
}
