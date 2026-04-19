import { Tutorial } from "../tutorial.types";
import Link from "next/link";

export default function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  return (
    <Link href={`/tutorials/${tutorial.id}`}>
      <div className="p-5 bg-white rounded-xl shadow hover:shadow-lg border">
        <h2 className="font-semibold text-lg mb-2">
          {tutorial.title}
        </h2>

        <p className="text-sm text-gray-600">
          {tutorial.description}
        </p>
      </div>
    </Link>
  );
}