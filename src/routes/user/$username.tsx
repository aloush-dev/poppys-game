import { createFileRoute } from "@tanstack/react-router";
import {
    getPublishedLevelsByUserId,
    getUserByUsername,
} from "../../firebase/firestore";

export const Route = createFileRoute("/user/$username")({
    loader: async ({ params }) => {
        const publishedLevels = await getPublishedLevelsByUserId(
            params.username,
        );
        if (!publishedLevels) {
            throw new Error("Failed to load levels");
        }

        const user = await getUserByUsername(params.username);

        return {
            user,
            publishedLevels,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { publishedLevels, user } = Route.useLoaderData();

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center mb-6">
                        <img
                            src={user.avatarUrl || "/placeholder.svg"}
                            alt={user.username}
                            className="w-20 h-20 rounded-full mr-4"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">
                                {user.username}
                            </h1>
                            <p className="text-gray-600">{user.bio}</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4">
                        Published Levels
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {publishedLevels?.map((level) => (
                            <div
                                key={level.id}
                                className="bg-gray-100 p-4 rounded-lg"
                            >
                                <h3 className="font-semibold">{level.name}</h3>
                                {/* <p className="text-sm text-gray-600 mb-2">
                                    {level.description}
                                </p> */}
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Plays: {level.plays}</span>
                                    <span>Likes: {level.likes}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

