import { Tutorial } from "../tutorial.types";
import TutorialCard from "./TutorialCard";

export default function TutorialList({ tutorials }: { tutorials: Tutorial[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tutorials.map((t) => (
        <TutorialCard key={t.id} tutorial={t} />
      ))}
    </div>
  );
}