import { createFileRoute } from "@tanstack/react-router";
import { LevelCard } from "../app/components/LevelCards";
import { useState } from "react";

export const Route = createFileRoute("/explore")({
    component: RouteComponent,
});

const testLevelData = [
    {
        id: 1,
        title: "Level 1",
        username: "user1",
        rating: 4.5,
        plays: 100,
    },
    {
        id: 2,
        title: "Level 2",
        username: "user2",
        rating: 3.5,
        plays: 200,
    },
    {
        id: 3,
        title: "Level 3",
        username: "user3",
        rating: 2.5,
        plays: 300,
    },
];

function RouteComponent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const filteredAndSortedLevels = testLevelData
        .filter((level) =>
            level.title.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "most-played":
                    return b.plays - a.plays;
                case "highest-rated":
                    return b.rating - a.rating;
                case "newest":
                default:
                    return b.id - a.id;
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
                    <option value="highest-rated">Highest Rated</option>
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

