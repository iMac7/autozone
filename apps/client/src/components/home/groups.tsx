import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreateGroupForm } from "../forms/create-group";
import { fetchGroups } from "@lens-protocol/client/actions";
import { client } from '@/utils/client';
import { Button } from '@/components/ui/button';
import { useCredentialStore } from '@/store/store';
import { useNavigate } from 'react-router';


export default function Groups() {
    const [showForm, setShowForm] = useState(false);
    const address = useCredentialStore(state => state.lens_address)
    const navigate = useNavigate()

    const { data, isLoading, error } = useQuery({
        queryKey: ['groups', address],
        queryFn: async () => {
            if (!address) return null;

            const result = await fetchGroups(client, {
                filter: {
                    managedBy: {
                        address: address,
                    },
                },
            });

            if (result.isErr()) {
                throw result.error;
            }

            return result.value;
        },
        enabled: !!address,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading groups</div>;

    return (
        <div>
            {!showForm ? (
                <Button
                    onClick={() => setShowForm(true)}
                >
                    Create New Group
                </Button>
            ) : (
                <CreateGroupForm onSuccess={() => setShowForm(false)} />
            )}

            <div className="mt-4 space-y-4">
                {data?.items.map((group) => (
                    group.metadata &&
                    <div
                        key={group.address}
                        className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                        onClick={() => navigate(`/group/${group.address}`)}
                    >
                        <div className="flex items-center gap-4">
                            {group.metadata?.icon && (
                                <img
                                    src={group.metadata.icon}
                                    alt={group.metadata.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                                />
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">{group.metadata?.name}</h3>
                                <p className="text-sm text-gray-600">{group.metadata?.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}