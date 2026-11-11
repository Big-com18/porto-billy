import Loader from "@/components/Loader";
import Progress from "@/components/Progress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Frameworks from "@/components/sections/Frameworks";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Repos from "@/components/sections/Repos";
import Journey from "@/components/sections/Journey";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Loader />
      <Progress />
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Frameworks />
      <Skills />
      <Projects />
      <Repos />
      <Journey />
      <Contact />
    </main>
  );
}
