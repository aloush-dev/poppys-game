import { createFileRoute } from "@tanstack/react-router";
import { LevelCard } from "../app/components/LevelCards";
import { useState } from "react";
import { getAllLevels } from "@/firebase/firestore";

export const Route = createFileRoute("/explore")({
    component: RouteComponent,
    loader: async () => {
        return await getAllLevels();
    },
});

function RouteComponent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const levels = Route.useLoaderData();

    const filteredAndSortedLevels = levels
        .filter((level) =>
            level.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "most-played":
                    return b.plays - a.plays;
                case "most-liked":
                    return b.likes - a.likes;
                case "newest":
                    return b.createdAt - a.createdAt;
                default:
                    return 0;
            }
        });

    return (
        <div className="max-w-6xl m-10">
            <div className="flex flex-col md:flex-row mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search levels..."
                    className="flex-grow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full md:w-48"
                >
                    <option value="newest">Newest</option>
                    <option value="most-played">Most Played</option>
                    <option value="most-liked">Most Liked</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedLevels.map((level) => (
                    <LevelCard key={level.id} level={level} />
                ))}
            </div>
            {filteredAndSortedLevels.length === 0 && (
                <p className="text-center text-gray-500 mt-8">
                    No levels found matching your criteria.
                </p>
            )}
        </div>
    );
}

