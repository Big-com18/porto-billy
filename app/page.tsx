import Loader from "@/components/Loader";
import Progress from "@/components/Progress";
import Navbar from "@/components/Navbar";
import Clock from "@/components/Clock";
import Transitions from "@/components/Transitions";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Frameworks from "@/components/sections/Frameworks";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Journey from "@/components/sections/Journey";
import Repos from "@/components/sections/Repos";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Loader />
      <Progress />
      <Navbar />
      <Clock />
      <Hero />
      <Marquee />
      <About />
      <Frameworks />
      <Skills />
      <div className="stackwrap" data-stack><Projects /></div>
      <Journey />
      <Repos />
      <Contact />
      <Transitions />
    </main>
  );
}
